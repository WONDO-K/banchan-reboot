package com.__105.Banchan.auth.service.impl;

import com.__105.Banchan.auth.dto.kakao.KakaoTokenDto;
import com.__105.Banchan.auth.dto.kakao.KakaoUserInfoDto;
import com.__105.Banchan.auth.dto.StatusResponseDto;
import com.__105.Banchan.auth.dto.login.TokenResponseStatus;
import com.__105.Banchan.auth.dto.login.OriginLoginRequestDto;
import com.__105.Banchan.auth.jwt.GeneratedToken;
import com.__105.Banchan.auth.jwt.JwtUtil;
import com.__105.Banchan.auth.service.AuthService;
import com.__105.Banchan.redis.service.TokenBlacklistService;
import com.__105.Banchan.common.exception.CustomException;
import com.__105.Banchan.common.exception.ErrorCode;
import com.__105.Banchan.redis.domain.RefreshToken;
import com.__105.Banchan.redis.repository.RefreshTokenRepository;
import com.__105.Banchan.redis.service.RefreshTokenService;
import com.__105.Banchan.user.entity.User;
import com.__105.Banchan.user.enums.Role;
import com.__105.Banchan.user.repository.UserRepository;
import com.__105.Banchan.util.GenerateRandomPassword;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final RefreshTokenRepository tokenRepository;
    private final RefreshTokenService tokenService;
    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;
    private final UserDetailsService userDetailsService;
    private final PasswordEncoder passwordEncoder;
    private final Logger log = LoggerFactory.getLogger(getClass());
    private final RestTemplate restTemplate = new RestTemplate(); // RestTemplate 빈 초기화
    private final ObjectMapper objectMapper;
    private final TokenBlacklistService tokenBlacklistService;

    @Value("${kakao.client-id}")
    private String clientId;

    @Value("${kakao.redirect-uri}")
    private String redirectUri;

    @Value("${kakao.token-uri}")
    private String tokenUri;

    @Value("${kakao.user-info-uri}")
    private String userInfoUri;

    @Value("${kakao.client-secret}")
    private String clientSecret;

    @Override
    @Transactional
    public ResponseEntity<StatusResponseDto> logout(HttpServletRequest request) {
        String accessToken = resolveAccessToken(request);
        if (accessToken == null) {
            log.error("로그아웃 요청에 유효한 액세스 토큰이 없습니다.");
            throw new CustomException(ErrorCode.ACCESS_TOKEN_REQUIRED);
        }

        return logout(accessToken);
    }

    @Override
    @Transactional
    public ResponseEntity<StatusResponseDto> logout(String accessToken) {
        try {
            // 액세스 토큰을 블랙리스트에 추가
            tokenBlacklistService.blacklistToken(accessToken);

            // 액세스 토큰과 연관된 리프레시 토큰 삭제
            tokenRepository.deleteByAccessToken(accessToken);

            log.info("로그아웃 완료. 엑세스 토큰을 블랙리스트에 추가하고 리프레시 토큰 삭제 완료. 액세스 토큰: {}", accessToken);
            return ResponseEntity.ok(StatusResponseDto.addStatus(HttpStatus.OK.value(), "로그아웃이 성공적으로 처리되었습니다."));

        } catch (CustomException e) {
            log.error("로그아웃 실패. 액세스 토큰: {}, 오류: {}", accessToken, e.getMessage());
            throw e;
        } catch (Exception e) {
            log.error("로그아웃 처리 중 예상치 못한 오류 발생. 액세스 토큰: {}, 오류: {}", accessToken, e.getMessage());
            throw new CustomException(ErrorCode.LOGOUT_FAILED);
        }
    }

    @Override
    @Transactional
    public ResponseEntity<TokenResponseStatus> refresh(HttpServletRequest request) {
        String accessToken = resolveAccessToken(request);
        String refreshToken = resolveRefreshToken(request);

        log.info("전달 받은 accessToken: " + accessToken);
        log.info("전달 받은 refreshToken: " + refreshToken);

        if (accessToken == null || accessToken.trim().isEmpty()) {
            log.error("Access Token is missing");
            throw new CustomException(ErrorCode.ACCESS_TOKEN_REQUIRED);
        }

        if (refreshToken == null || refreshToken.trim().isEmpty()) {
            log.error("Refresh Token is missing");
            throw new CustomException(ErrorCode.REFRESH_TOKEN_REQUIRED);
        }

        return refresh(accessToken, refreshToken);
    }

    @Override
    @Transactional
    public ResponseEntity<TokenResponseStatus> refresh(String accessToken, String refreshToken) { 
        try {
//            // 액세스 토큰의 유효성 검사
//            if (!jwtUtil.verifyToken(accessToken)) {
//                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
//                        .body(new TokenResponseStatus(ErrorCode.INVALID_PARAMETER.getStatus(), null));
//            }

            // 리프레시 토큰 유효성 검사
            if (!jwtUtil.verifyToken(refreshToken)) {
                // 리프레시 토큰이 만료된 경우, 새로운 액세스 및 리프레시 토큰 발급을 위해 재로그인 유도
                log.warn("리프레시 토큰이 만료되었습니다. 액세스 토큰: {}, 리프레시 토큰: {}", accessToken, refreshToken);
                throw new CustomException(ErrorCode.INVALID_REFRESH_TOKEN);
            }

            // 리프레시 토큰 정보 조회
            Optional<RefreshToken> storedRefreshToken = tokenRepository.findByAccessToken(accessToken);

            // 리프레시 토큰이 존재하고, 검증이 성공하면 새로운 액세스 토큰 발급
            if (storedRefreshToken.isPresent()) {
                RefreshToken resultToken = storedRefreshToken.get(); // 리프레시 토큰 정보
                String newAccessToken = jwtUtil.generateAccessToken(resultToken.getId(), jwtUtil.getRole(refreshToken)); // 새로운 액세스 토큰 발급
                resultToken.updateAccessToken(newAccessToken); // 리프레시 토큰 정보 업데이트
                tokenRepository.save(resultToken);
                log.info("새로운 액세스 토큰 발급 완료. 사용자 ID: {}, 새로운 액세스 토큰: {}", resultToken.getId(), newAccessToken);
                return ResponseEntity.ok(new TokenResponseStatus(HttpStatus.OK.value(), newAccessToken));
            }

            // 리프레시 토큰 정보가 없는 경우
            log.info("리프레시 토큰 정보를 찾을 수 없습니다.");
            throw new CustomException(ErrorCode.REDIS_REFRESH_TOKEN_NOT_FOUND);
        } catch (CustomException e) {
            log.info("액세스 토큰 갱신 실패. 액세스 토큰: {}, 리프레시 토큰: {}, 오류: {}", accessToken, refreshToken, e.getMessage());
            throw e;
        } catch (Exception e) {
            log.info("액세스 토큰 갱신 실패. 액세스 토큰: {}, 리프레시 토큰: {}, 오류: {}", accessToken, refreshToken, e.getMessage());
            throw new CustomException(ErrorCode.INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    @Transactional(readOnly = true)
    public ResponseEntity<Map<String, String>> originLogin(OriginLoginRequestDto loginRequestDto,HttpServletResponse response) {
        Optional<User> user = userRepository.findByEmail(loginRequestDto.getUserId());

        if (user.isEmpty()) {
            throw new CustomException(ErrorCode.USER_NOT_FOUND);
        }

        if (!loginRequestDto.getPasswordHash().equals(user.get().getPasswordHash())) {
            log.error("비밀번호가 올바르지 않습니다.");
            throw new BadCredentialsException("비밀번호가 올바르지 않습니다.");
        }

        UserDetails userDetails = userDetailsService.loadUserByUsername(loginRequestDto.getUserId());
        UsernamePasswordAuthenticationToken authenticationToken =
                new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
        SecurityContextHolder.getContext().setAuthentication(authenticationToken);

        log.info("Authentication successful: {}", authenticationToken);

        GeneratedToken token = jwtUtil.generateToken(loginRequestDto.getUserId(), user.get().getRole());
        log.info("Generated Token: {}", token);

        // 리프레시 토큰을 쿠키에 저장 (1시간 동안 유효)
        Cookie refreshTokenCookie = new Cookie("refreshToken", token.getRefreshToken());
        refreshTokenCookie.setHttpOnly(true);
        refreshTokenCookie.setPath("/");
        refreshTokenCookie.setMaxAge(24 * 60 * 60); // 24시간
        response.addCookie(refreshTokenCookie);

        Map<String, String> responseMap = new HashMap<>();
        responseMap.put("message", "Login successful! Here is your access token.");
        responseMap.put("accessToken", token.getAccessToken());

        return ResponseEntity.ok(responseMap);
    }

    @Override
    public KakaoUserInfoDto requestAccessTokenAndUserInfo(String code) {
        // 카카오 액세스 토큰 요청을 위한 헤더 설정
        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-type", "application/x-www-form-urlencoded;charset=utf-8");

        // 카카오 액세스 토큰 요청을 위한 바디 설정
        MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
        body.add("grant_type", "authorization_code");
        body.add("client_id", clientId);
        body.add("client_secret", clientSecret);
        body.add("redirect_uri", redirectUri);
        body.add("code", code);

        // 카카오 액세스 토큰 요청
        HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(body, headers);
        ResponseEntity<String> response;
        try {
            response = restTemplate.postForEntity(tokenUri, request, String.class);
        } catch (Exception e) {
            log.error("카카오 액세스 토큰 요청 실패", e);
            throw new CustomException(ErrorCode.KAKAO_TOKEN_REQUEST_FAILED);
        }

        log.info("카카오 액세스 토큰 요청: {}", request);

        // Json으로 파싱
        // ObjectMapper objectMapper = new ObjectMapper();
        KakaoTokenDto kakaoTokenDto;
        try {
            kakaoTokenDto = objectMapper.readValue(response.getBody(), KakaoTokenDto.class);
        } catch (JsonProcessingException e) {
            log.error("카카오 액세스 토큰 파싱 실패", e);
            throw new CustomException(ErrorCode.KAKAO_TOKEN_PARSING_FAILED);
        }

        // 액세스 토큰을 통해 사용자 정보 요청
        if (kakaoTokenDto != null) {
            return requestUserInfo(kakaoTokenDto.getAccessToken());
        } else {
            log.error("카카오 사용자 정보를 가져오는 데 실패했습니다.");
            throw new CustomException(ErrorCode.KAKAO_USER_INFO_NOT_FOUND);
        }
    }

    @Override
    // /kakao/login 요청: 카카오 로그인 처리 및 액세스 토큰 반환
    public ResponseEntity<Map<String, String>> kakaoLogin(String code, HttpServletResponse response) {
        KakaoUserInfoDto kakaoUserInfoDto = requestAccessTokenAndUserInfo(code);

        if (kakaoUserInfoDto == null || kakaoUserInfoDto.getKakaoAccount() == null
                || kakaoUserInfoDto.getKakaoAccount().getEmail() == null) {
            log.error("카카오 사용자 정보를 가져오는 데 실패했습니다.");
            throw new CustomException(ErrorCode.KAKAO_USER_INFO_NOT_FOUND);
        }

        GeneratedToken token = handleKakaoLoginSuccess(
                kakaoUserInfoDto.getKakaoAccount().getEmail(),
                response
        );

        Map<String, String> responseBody = new HashMap<>();
        responseBody.put("accessToken", token.getAccessToken());
        return ResponseEntity.ok(responseBody);
    }

    @Override
    @Transactional
    public User kakaoRegisterOrLoginUser(String userEmail) {
        try {
            Optional<User> userOptional = userRepository.findByEmail(userEmail);

            User user;
            if (userOptional.isPresent()) {
                // 로그인 처리
                user = userOptional.get();
                log.info("로그인 처리: {}", user);
            } else {
                // 회원가입 처리
                user = User.builder()
                        .email(userEmail)
                        .username(userEmail)
                        .passwordHash(passwordEncoder.encode(GenerateRandomPassword.createRandomPassword())) // 소셜 로그인에서는 사용하지 않는 값 -> 랜덤 값 삽입
                        .role(Role.USER)
                        .socialType("kakao")
                        .attributeKey("")
                        .createdAt(LocalDateTime.now())
                        .build();
                userRepository.save(user);
                log.info("회원가입 처리: {}", user);
            }

            // 토큰 생성 (액세스, 리프레쉬)
            return user;
        } catch (Exception e) {
            log.error("회원가입 또는 로그인 처리 중 오류 발생", e);
            throw new CustomException(ErrorCode.LOGIN_OR_REGISTER_FAILED);
        }
    }
    // 쿠키에 리프레시 토큰 저장
    @Override
    @Transactional
    public GeneratedToken handleKakaoLoginSuccess(String email, HttpServletResponse response) {
        User user = kakaoRegisterOrLoginUser(email);
        GeneratedToken token = jwtUtil.generateToken(user.getEmail(), user.getRole());

        // 리프레시 토큰을 쿠키에 저장 (1시간 동안 유효)
        Cookie refreshTokenCookie = new Cookie("refreshToken", token.getRefreshToken());
        refreshTokenCookie.setHttpOnly(true);
        refreshTokenCookie.setPath("/");
        refreshTokenCookie.setMaxAge(24 * 60 * 60); // 24시간
        response.addCookie(refreshTokenCookie);

        return token;
    }



    // 액세스 토큰으로 유저 정보 요청
    private KakaoUserInfoDto requestUserInfo(String accessToken) {
        try {
            // 카카오 유저 정보 요청을 위한 헤더 설정
            HttpHeaders headers = new HttpHeaders();
            headers.add("Authorization", "Bearer " + accessToken);
            headers.add("Content-type", "application/x-www-form-urlencoded;charset=utf-8");

            // 사용자 정보 요청
            HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(headers);
            ResponseEntity<String> response = restTemplate.exchange(
                    userInfoUri,
                    HttpMethod.GET,
                    request,
                    String.class
            );
            log.info("카카오로부터 받은 사용자 정보: {}", response.getBody());

            // Json으로 파싱
//            ObjectMapper objectMapper = new ObjectMapper();

            // 카카오로부터 받은 사용자 정보를 KakaoUserInfoDto로 변환
            return objectMapper.readValue(response.getBody(), KakaoUserInfoDto.class);

        } catch (JsonProcessingException e) {
            log.error("카카오 사용자 정보 파싱 실패", e);
            throw new CustomException(ErrorCode.KAKAO_USER_INFO_PARSING_FAILED);
        } catch (Exception e) {
            log.error("카카오 사용자 정보 요청 실패", e);
            throw new CustomException(ErrorCode.KAKAO_USER_INFO_REQUEST_FAILED);
        }
    }

    private String resolveAccessToken(HttpServletRequest request) {
        String accessTokenHeader = request.getHeader("Authorization");
        if (accessTokenHeader != null && accessTokenHeader.startsWith("Bearer ")) {
            return accessTokenHeader.substring(7);
        }
        return null;
    }

    private String resolveRefreshToken(HttpServletRequest request) {
        if (request.getCookies() == null) {
            return null;
        }

        for (var cookie : request.getCookies()) {
            if ("refreshToken".equals(cookie.getName())) {
                return cookie.getValue();
            }
        }
        return null;
    }

}
