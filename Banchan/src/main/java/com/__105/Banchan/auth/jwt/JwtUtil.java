package com.__105.Banchan.auth.jwt;

import com.__105.Banchan.redis.service.RefreshTokenService;
import com.__105.Banchan.user.enums.Role;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.Date;

@Service
@RequiredArgsConstructor
public class JwtUtil {

    private final Logger log = LoggerFactory.getLogger(getClass());

    private final JwtProperties jwtProperties;
    private final RefreshTokenService refreshTokenService;
    private byte[] secretKey;

    @PostConstruct
    protected void init() {
        secretKey = Base64.getDecoder().decode(jwtProperties.getSecret().getBytes(StandardCharsets.UTF_8));
    }

    public GeneratedToken generateToken(String email, Role role) {
        String refreshToken = generateRefreshToken(email, role);
        String accessToken = generateAccessToken(email, role);
        refreshTokenService.saveTokenInfo(email, refreshToken, accessToken) ;

        // 토큰 생성 후 로그 출력
        log.info("Generated Access Token: {}", accessToken);
        log.info("Generated Refresh Token: {}", refreshToken);

        return new GeneratedToken(accessToken, refreshToken);
    }

    public String generateRefreshToken(String email, Role role) {
        long refreshPeriod = 1000L * 60L * 60L * 24L * 7; // 1주일
        Claims claims = Jwts.claims().setSubject(email);
        claims.put("role", role);
        Date now = new Date();
        return Jwts.builder()
                .setClaims(claims)
                .setIssuedAt(now)
                .setExpiration(new Date(now.getTime() + refreshPeriod))
                .signWith(SignatureAlgorithm.HS512, secretKey)
                .compact();
    }

    public String generateAccessToken(String email, Role role) {
        long tokenPeriod = 1000L * 60L * 30L;
        Claims claims = Jwts.claims().setSubject(email);
        claims.put("role", role);
        Date now = new Date();
        return Jwts.builder()
                .setClaims(claims)
                .setIssuedAt(now)
                .setExpiration(new Date(now.getTime() + tokenPeriod))
                .signWith(SignatureAlgorithm.HS512, secretKey)
                .compact();
    }

    // 새롭게 추가된 메서드
    public String generateTokenForSignup(String email, String provider) {
        long signupTokenPeriod = 1000L * 60L * 15L;
        Claims claims = Jwts.claims().setSubject(email);
        claims.put("provider", provider);
        Date now = new Date();
        return Jwts.builder()
                .setClaims(claims)
                .setIssuedAt(now)
                .setExpiration(new Date(now.getTime() + signupTokenPeriod))
                .signWith(SignatureAlgorithm.HS512, secretKey)
                .compact();
    }

    public boolean verifyToken(String token) {
        try {
            Jws<Claims> claims = Jwts.parserBuilder()
                    .setSigningKey(secretKey)
                    .build()
                    .parseClaimsJws(token);
            return claims.getBody().getExpiration().after(new Date()); // 토큰 만료 여부 확인
        } catch (Exception e) {
            return false;
        }
    }

    public String getUid(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(secretKey)
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }

    public Role getRole(String token) {
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(secretKey)
                .build()
                .parseClaimsJws(token)
                .getBody();
        return Role.valueOf(claims.get("role").toString());
    }

    // 중복된 메서드 제거하고 추가된 메서드
    public String getProviderFromToken(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(secretKey)
                .build()
                .parseClaimsJws(token)
                .getBody()
                .get("provider", String.class);
    }
}
