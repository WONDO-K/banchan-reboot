# Auth OTP 검증 로직 서비스로 이동

## 변경 배경
- /otp/validate 컨트롤러에 입력 검증과 오류 응답 매핑이 포함되어 있어 책임이 과도함.
- 컨트롤러는 요청 매핑만 담당하도록 리팩토링.

## 변경 내용
- OtpService에 /otp/validate 전용 메서드 추가(ResponseEntity 반환).
- OtpServiceImpl에서 입력값 검증 및 ErrorCode 기반 응답 매핑 처리.
- 컨트롤러는 otpService.validateOtp(requestDto)만 호출.

## 영향 범위
- OTP 검증 실패/성공 응답 상태 코드는 서비스에서 일관 처리.
- 컨트롤러 로직 단순화.

## 관련 파일
- Banchan/src/main/java/com/__105/Banchan/auth/controller/AuthController.java
- Banchan/src/main/java/com/__105/Banchan/redis/service/OtpService.java
- Banchan/src/main/java/com/__105/Banchan/redis/service/impl/OtpServiceImpl.java
