package com.__105.Banchan.redis.service;

import com.__105.Banchan.auth.dto.otp.OtpCreateResponseDto;
import com.__105.Banchan.auth.dto.otp.OtpRequestDto;
import com.__105.Banchan.auth.dto.otp.OtpResponseDto;
import com.__105.Banchan.auth.dto.otp.OtpValidateRequestDto;
import org.springframework.http.ResponseEntity;

public interface OtpService {
    OtpCreateResponseDto generateOtp(OtpRequestDto requestDto);
    // /otp/validate 요청: SMS 인증용 OTP 검증 처리
    ResponseEntity<OtpResponseDto> validateOtp(OtpValidateRequestDto requestDto);
}
