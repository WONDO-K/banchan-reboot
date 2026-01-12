package com.__105.Banchan.redis.service.impl;

import com.__105.Banchan.auth.dto.otp.OtpCreateResponseDto;
import com.__105.Banchan.auth.dto.otp.OtpRequestDto;
import com.__105.Banchan.auth.dto.otp.OtpResponseDto;
import com.__105.Banchan.auth.dto.otp.OtpValidateRequestDto;
import com.__105.Banchan.common.exception.ErrorCode;
import com.__105.Banchan.redis.repository.OtpRepository;
import com.__105.Banchan.redis.service.OtpService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.Random;

@Service
public class OtpServiceImpl implements OtpService {

    private static final int OTP_LENGTH = 6; // 인증번호 길이
    private static final int OTP_EXPIRATION_MINUTES = 2; // 인증번호 만료 시간 (2분)
    private static final int MAX_ATTEMPTS = 5; // 최대 시도 횟수
    private static final int LOCK_TIME_MINUTES = 10; // 재시도 잠금 시간 (10분)
    private final Logger log = LoggerFactory.getLogger(getClass());

    @Autowired
    private OtpRepository otpRepository;

    @Override
    // /otp/validate 요청을 처리하며 입력값 검증과 오류 응답 매핑을 포함
    public ResponseEntity<OtpResponseDto> validateOtp(OtpValidateRequestDto requestDto) {
        String phoneNumber = requestDto.getPhoneNumber();
        String otp = requestDto.getOtp();

        log.info("OTP 검증 요청 수신: 전화번호 {}", phoneNumber);

        if (phoneNumber == null || phoneNumber.trim().isEmpty()) {
            log.warn("OTP 검증 실패: 전화번호가 제공되지 않음");
            return ResponseEntity.badRequest()
                    .body(new OtpResponseDto(false, ErrorCode.PHONE_NUMBER_REQUIRED.getMessage()));
        }

        if (otp == null || otp.trim().isEmpty()) {
            log.warn("OTP 검증 실패: OTP가 제공되지 않음");
            return ResponseEntity.badRequest()
                    .body(new OtpResponseDto(false, ErrorCode.OTP_REQUIRED.getMessage()));
        }

        OtpResponseDto responseDto = validateOtpInternal(requestDto, otp);

        if (!responseDto.isSuccess()) {
            if (responseDto.getMessage().equals(ErrorCode.OTP_EXPIRED.getMessage())) {
                log.info("OTP 검증 실패: 전화번호 {}의 OTP가 만료됨", phoneNumber);
                return ResponseEntity.status(ErrorCode.OTP_EXPIRED.getStatus())
                        .body(responseDto);
            } else if (responseDto.getMessage().equals(ErrorCode.MAX_OTP_ATTEMPTS_EXCEEDED.getMessage())) {
                log.info("OTP 검증 실패: 전화번호 {}의 시도 횟수 초과", phoneNumber);
                return ResponseEntity.status(ErrorCode.MAX_OTP_ATTEMPTS_EXCEEDED.getStatus())
                        .body(responseDto);
            } else if (responseDto.getMessage().equals(ErrorCode.INVALID_OTP.getMessage())) {
                log.info("OTP 검증 실패: 전화번호 {}에 대한 잘못된 OTP", phoneNumber);
                return ResponseEntity.status(ErrorCode.INVALID_OTP.getStatus())
                        .body(responseDto);
            } else {
                log.error("OTP 검증 중 알 수 없는 오류 발생: 전화번호 {}", phoneNumber);
                return ResponseEntity.status(ErrorCode.INTERNAL_SERVER_ERROR.getStatus())
                        .body(new OtpResponseDto(false, ErrorCode.INTERNAL_SERVER_ERROR.getMessage()));
            }
        }

        log.info("OTP 검증 성공: 전화번호 {}", phoneNumber);
        return ResponseEntity.ok(responseDto);
    }

    @Override
    public OtpCreateResponseDto generateOtp(OtpRequestDto requestDto) {
        String phoneNumber = requestDto.getPhoneNumber();
        String otp = generateRandomOtp();

        log.info("전화번호 {}에 대한 OTP 생성 중", phoneNumber);

        otpRepository.saveOtp(phoneNumber, otp, OTP_EXPIRATION_MINUTES);
        otpRepository.deleteAttemptsByPhoneNumber(phoneNumber); // 인증번호 생성 시 시도 횟수 초기화
        otpRepository.deleteLockByPhoneNumber(phoneNumber); // 인증번호 생성 시 잠금 해제

        log.info("전화번호 {}에 OTP가 성공적으로 생성되었습니다.", phoneNumber);

        return new OtpCreateResponseDto(true, "OTP generated successfully.",otp);
    }

    private OtpResponseDto validateOtpInternal(OtpValidateRequestDto requestDto, String otp) {
        String phoneNumber = requestDto.getPhoneNumber();

        log.info("전화번호 {}에 대한 OTP 검증 요청 수신", phoneNumber);

        // 시도 횟수 초과로 계정이 잠긴 경우
        if (otpRepository.existsLockByPhoneNumber(phoneNumber)) {
            log.info("전화번호 {}에 대한 OTP 시도 횟수 초과로 계정이 잠금되었습니다.", phoneNumber);
            return new OtpResponseDto(false, ErrorCode.MAX_OTP_ATTEMPTS_EXCEEDED.getMessage());
        }

        // OTP가 존재하지 않거나 만료된 경우
        Optional<String> storedOtp = otpRepository.findOtpByPhoneNumber(phoneNumber);
        if (storedOtp.isEmpty()) {
            log.info("전화번호 {}에 대한 OTP가 만료되었거나 존재하지 않습니다.", phoneNumber);
            return new OtpResponseDto(false, ErrorCode.OTP_EXPIRED.getMessage());
        }

        // 시도 횟수를 가져오고, 최대 시도 횟수 초과 시 계정 잠금 처리
        int attempts = otpRepository.findAttemptsByPhoneNumber(phoneNumber).orElse(0);
        if (attempts >= MAX_ATTEMPTS) {
            otpRepository.lockUser(phoneNumber, LOCK_TIME_MINUTES); // 최대 시도 횟수 초과 시 사용자 잠금
            log.info("전화번호 {}에 대해 최대 시도 횟수를 초과하여 계정이 잠금되었습니다.", phoneNumber);
            return new OtpResponseDto(false, ErrorCode.MAX_OTP_ATTEMPTS_EXCEEDED.getMessage());
        }

        // OTP가 일치하는 경우
        if (otp.equals(storedOtp.get())) {
            otpRepository.deleteOtpByPhoneNumber(phoneNumber); // 인증 성공 시 OTP 삭제
            otpRepository.deleteAttemptsByPhoneNumber(phoneNumber); // 시도 횟수 초기화
            log.info("전화번호 {}에 대한 OTP가 성공적으로 검증되었습니다.", phoneNumber);
            return new OtpResponseDto(true, "OTP validated successfully.");
        } else {
            // OTP가 일치하지 않는 경우 시도 횟수 증가
            otpRepository.saveAttempt(phoneNumber, OTP_EXPIRATION_MINUTES);
            log.info("전화번호 {}에 대한 OTP가 일치하지 않습니다.", phoneNumber);
            return new OtpResponseDto(false, ErrorCode.INVALID_OTP.getMessage());
        }
    }

    private String generateRandomOtp() {
        Random random = new Random();
        StringBuilder otp = new StringBuilder();

        for (int i = 0; i < OTP_LENGTH; i++) {
            otp.append(random.nextInt(10)); // 0~9 사이의 숫자 추가
        }

        log.info("랜덤 OTP가 생성되었습니다: {}", otp.toString());

        return otp.toString();
    }
}
