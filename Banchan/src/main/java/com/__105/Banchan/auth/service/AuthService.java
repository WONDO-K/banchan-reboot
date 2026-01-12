package com.__105.Banchan.auth.service;

import com.__105.Banchan.auth.dto.kakao.KakaoUserInfoDto;
import com.__105.Banchan.auth.dto.StatusResponseDto;
import com.__105.Banchan.auth.dto.login.TokenResponseStatus;

import com.__105.Banchan.auth.dto.login.OriginLoginRequestDto;
import com.__105.Banchan.auth.jwt.GeneratedToken;
import com.__105.Banchan.user.entity.User;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.ResponseEntity;

import java.util.Map;

public interface AuthService {

    // /token/logout 요청: 헤더에서 액세스 토큰을 추출해 로그아웃 처리
    ResponseEntity<StatusResponseDto> logout(HttpServletRequest request);
    // 내부 호출용: 액세스 토큰이 이미 추출된 경우 사용
    ResponseEntity<StatusResponseDto> logout(String accessToken);
    // /token/refresh 요청: 헤더/쿠키에서 토큰을 추출해 갱신 처리
    ResponseEntity<TokenResponseStatus> refresh(HttpServletRequest request);
    // 내부 호출용: 액세스/리프레시 토큰이 이미 추출된 경우 사용
    ResponseEntity<TokenResponseStatus> refresh(String accessToken, String refreshToken);
    ResponseEntity<Map<String, String>> originLogin(OriginLoginRequestDto loginRequestDto,HttpServletResponse response);
    KakaoUserInfoDto requestAccessTokenAndUserInfo(String code);
    GeneratedToken handleKakaoLoginSuccess(String email, HttpServletResponse response);
    User kakaoRegisterOrLoginUser(String userEmail);

}
