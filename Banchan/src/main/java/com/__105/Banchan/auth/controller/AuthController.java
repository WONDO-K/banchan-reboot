package com.__105.Banchan.auth.controller;


import com.__105.Banchan.auth.dto.kakao.KakaoUserInfoDto;
import com.__105.Banchan.auth.dto.StatusResponseDto;
import com.__105.Banchan.auth.dto.login.TokenResponseStatus;

import com.__105.Banchan.auth.dto.login.OriginLoginRequestDto;
import com.__105.Banchan.auth.dto.otp.OtpCreateResponseDto;
import com.__105.Banchan.auth.dto.otp.OtpRequestDto;
import com.__105.Banchan.auth.dto.otp.OtpResponseDto;
import com.__105.Banchan.auth.dto.otp.OtpValidateRequestDto;
import com.__105.Banchan.auth.jwt.GeneratedToken;
import com.__105.Banchan.auth.service.AuthService;

import com.__105.Banchan.redis.service.OtpService;
import com.__105.Banchan.user.repository.UserRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;


import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

//@CrossOrigin(origins = "*")
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/auth")
@Tag(name = "AuthController", description = "인증 관련 API")
public class AuthController {

    private final AuthService authService;
    private final OtpService otpService;
    private final Logger log = LoggerFactory.getLogger(getClass());
    private final UserRepository userRepository;

    @PostMapping("/origin/login")
    @Operation(summary = "자체 로그인", description = "이메일, 비밀번호로 로그인")
    public ResponseEntity<Map<String, String>> originLogin(@RequestBody OriginLoginRequestDto loginRequestDto, HttpServletResponse response) {
        return authService.originLogin(loginRequestDto, response);
    }

    @PostMapping("/token/logout")
    @Operation(summary = "로그아웃", description = "로그아웃 처리 및 토큰 삭제")
    public ResponseEntity<StatusResponseDto> logout(HttpServletRequest request) {
        return authService.logout(request);
    }


    @PostMapping("/token/refresh")
    @Operation(summary = "토큰 갱신", description = "액세스 토큰을 갱신")
    public ResponseEntity<TokenResponseStatus> refresh(HttpServletRequest request) {
        return authService.refresh(request);
    }

    @GetMapping("/kakao/login")
    @Operation(summary = "카카오 로그인", description = "카카오 인가 코드를 받아 로그인 처리")
    public ResponseEntity<Map<String,String>> kakaoLogin(@RequestParam String code, HttpServletResponse response) {

        try {
            KakaoUserInfoDto kakaoUserInfoDto = authService.requestAccessTokenAndUserInfo(code);

            if (kakaoUserInfoDto == null || kakaoUserInfoDto.getKakaoAccount().getEmail() == null) {
                log.error("카카오 사용자 정보를 가져오는 데 실패했습니다.");
                return ResponseEntity.status(400).body(Map.of("error", "카카오 사용자 정보를 가져오는 데 실패했습니다."));
            }

            // 사용자 등록 또는 로그인 처리
            GeneratedToken token = authService.handleKakaoLoginSuccess(kakaoUserInfoDto.getKakaoAccount().getEmail(), response);
            // 액세스 토큰을 응답으로 반환
            Map<String, String> responseBody = new HashMap<>();
            responseBody.put("accessToken", token.getAccessToken());
            return ResponseEntity.ok(responseBody);

        } catch (Exception e) {
            log.error("카카오 로그인 처리 중 오류 발생", e);
            return ResponseEntity.status(500).body(Map.of("error", "카카오 로그인 처리 중 오류 발생"));
        }
    }

    @PostMapping("/otp/generate")
    @Operation(summary = "OTP 생성", description = "SMS 인증을 위한 OTP 생성")
    public ResponseEntity<OtpCreateResponseDto> generateOtp(@RequestBody OtpRequestDto requestDto) {
        OtpCreateResponseDto responseDto = otpService.generateOtp(requestDto);
        return ResponseEntity.ok(responseDto);
    }

    @PostMapping("/otp/validate")
    @Operation(summary = "OTP 검증", description = "사용자가 입력한 OTP를 검증")
    public ResponseEntity<OtpResponseDto> validateOtp(@RequestBody OtpValidateRequestDto requestDto) {
        return otpService.validateOtp(requestDto);
    }
}
