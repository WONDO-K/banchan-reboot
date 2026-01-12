# Auth 전역 예외 처리 적용(점진)

## 변경 배경
- 컨트롤러/서비스 try/catch를 줄이고 예외 처리를 전역으로 통일.
- auth 영역에 한정해 영향 범위를 최소화.

## 변경 내용
- GlobalExceptionHandler 추가 및 적용 범위를 auth 패키지로 제한.
- CustomException 처리 시 ErrorResponse(status/code/message) 반환.
- 처리되지 않은 예외는 INTERNAL_SERVER_ERROR로 통일.

## 구체 변경 사항
- /kakao/login
  - 컨트롤러의 try/catch 제거, 서비스에서 CustomException으로 전환.
  - 사용자 정보 검증 실패 시 KAKAO_USER_INFO_NOT_FOUND 사용.
- /token/logout
  - access token 누락 시 ACCESS_TOKEN_REQUIRED로 통일.
  - 실패 시 LOGOUT_FAILED로 전환.
- /token/refresh
  - access/refresh token 누락 시 ACCESS_TOKEN_REQUIRED, REFRESH_TOKEN_REQUIRED 적용.
  - refresh token 검증 실패 시 INVALID_REFRESH_TOKEN 적용.
  - refresh token 저장 정보 없음 시 REDIS_REFRESH_TOKEN_NOT_FOUND 적용.
  - 알 수 없는 오류는 INTERNAL_SERVER_ERROR로 통일.
- JwtExceptionFilter
  - 하드코딩 메시지를 INVALID_JWT로 교체.
- ErrorCode 신규 추가
  - ACCESS_TOKEN_REQUIRED, REFRESH_TOKEN_REQUIRED, INVALID_JWT.

## 영향 범위
- auth 패키지에서 발생한 CustomException은 ErrorResponse 포맷으로 응답.
- 기존 StatusResponseDto/TokenResponseStatus 기반의 오류 응답은 점진적으로 감소.

## 관련 파일
- Banchan/src/main/java/com/__105/Banchan/common/exception/GlobalExceptionHandler.java
- Banchan/src/main/java/com/__105/Banchan/common/exception/ErrorCode.java
- Banchan/src/main/java/com/__105/Banchan/auth/service/impl/AuthServiceImpl.java
- Banchan/src/main/java/com/__105/Banchan/auth/jwt/JwtExceptionFilter.java
- Banchan/src/main/java/com/__105/Banchan/auth/controller/AuthController.java
- Banchan/src/main/java/com/__105/Banchan/auth/service/AuthService.java
