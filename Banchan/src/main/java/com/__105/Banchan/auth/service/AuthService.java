package com.__105.Banchan.auth.service;

import com.__105.Banchan.auth.dto.kakao.KakaoUserInfoDto;
import com.__105.Banchan.auth.dto.StatusResponseDto;
import com.__105.Banchan.auth.dto.login.TokenResponseStatus;

import com.__105.Banchan.auth.dto.login.OriginLoginRequestDto;
import com.__105.Banchan.auth.jwt.GeneratedToken;
import com.__105.Banchan.user.entity.User;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.ResponseEntity;

import java.util.Map;

public interface AuthService {

    ResponseEntity<StatusResponseDto> logout(String accessToken);
    ResponseEntity<TokenResponseStatus> refresh(String accessToken, String refreshToken);
    ResponseEntity<Map<String, String>> originLogin(OriginLoginRequestDto loginRequestDto,HttpServletResponse response);
    KakaoUserInfoDto requestAccessTokenAndUserInfo(String code);
    GeneratedToken handleKakaoLoginSuccess(String email, HttpServletResponse response);
    User kakaoRegisterOrLoginUser(String userEmail);

}
