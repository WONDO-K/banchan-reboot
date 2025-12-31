package com.__105.Banchan.auth.jwt;

import com.__105.Banchan.auth.dto.security.SecurityUserDto;
import com.__105.Banchan.auth.exception.JwtException;
import com.__105.Banchan.redis.service.TokenBlacklistService;
import com.__105.Banchan.user.entity.User;
import com.__105.Banchan.user.repository.UserRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@RequiredArgsConstructor
@Component
public class JwtAuthFilter extends OncePerRequestFilter {

    private final Logger log = LoggerFactory.getLogger(getClass());
    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;
    private final TokenBlacklistService tokenBlacklistService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        // request Header에서 AccessToken을 가져온다.
        String accessToken = resolveToken(request);
        log.info("Access Token: " + accessToken);

        // 토큰 검사 생략(모두 허용 URL의 경우 토큰 검사 통과)
        if (!StringUtils.hasText(accessToken)){
            log.info("Access Token이 없습니다.");
            filterChain.doFilter(request,response);
            return;
        }

        // 블랙리스트에 있는 토큰인지 확인
        if (tokenBlacklistService.isTokenBlacklisted(accessToken)) {
            log.warn("블랙리스트에 있는 Access Token입니다: {}", accessToken);
            throw new JwtException("블랙리스트에 등록된 Access Token입니다.");
        }

        // AccessToken을 검증하고, 만료되었을 경우 예외 발생
        if (!jwtUtil.verifyToken(accessToken)){
            log.info("Access Token이 만료되었습니다.");
            throw new JwtException("Access Token 만료!");
        }

        // AccessToken의 값이 있고, 유효한 경우 진행
        if (jwtUtil.verifyToken(accessToken)) {
            log.info("Access Token이 유효합니다.");

            // AccessToken 내부의 payload에 있는 email로 user를 조회한다. 없다면 예외 발생
            User findUser = userRepository.findByEmail(jwtUtil.getUid(accessToken))
                    .orElseThrow(() -> new JwtException("Invalid JWT token"));
            log.info("User: " + findUser.getEmail());

            // SecurityUserDto를 생성하여 UserDetails로 등록
            SecurityUserDto userDto = SecurityUserDto.builder()
                    .id(findUser.getId())
                    .email(findUser.getEmail())
                    .username(findUser.getUsername())
                    .role(findUser.getRole())
                    .build();

            // UserDetails로 Authentication 객체 생성 및 SecurityContext에 설정
            Authentication auth = new UsernamePasswordAuthenticationToken(userDto, null, userDto.getAuthorities());
            SecurityContextHolder.getContext().setAuthentication(auth);
            log.info("SecurityContext에 인증 객체 등록 완료");
        }

        filterChain.doFilter(request, response);
    }



    private String resolveToken(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }

    private Authentication getAuthentication(SecurityUserDto user) {
        return new UsernamePasswordAuthenticationToken(user, "",
                List.of(new SimpleGrantedAuthority("ROLE_" + user.getRole().name())));
    }

    public static SecurityUserDto getUser() {
        return (SecurityUserDto) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) throws ServletException {
        return request.getRequestURI().contains("token/");
    }
}
