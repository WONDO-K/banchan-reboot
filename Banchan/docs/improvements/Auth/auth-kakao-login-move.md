# Auth 카카오 로그인 로직 서비스로 이동

## 변경 배경
- /kakao/login 컨트롤러에 예외 처리 및 사용자 정보 검증 로직이 포함됨.
- 컨트롤러는 요청 매핑만 남기고, 검증/응답 결정은 서비스로 이동.

## 변경 내용
- AuthService에 /kakao/login 전용 메서드 추가.
- AuthServiceImpl에서 카카오 사용자 정보 검증과 예외 처리, 응답 매핑 수행.
- 컨트롤러는 authService.kakaoLogin 호출만 수행.

## 영향 범위
- 카카오 로그인 실패/예외 응답 처리가 서비스로 통일.
- 컨트롤러가 단일 호출로 단순화.

## 관련 파일
- Banchan/src/main/java/com/__105/Banchan/auth/controller/AuthController.java
- Banchan/src/main/java/com/__105/Banchan/auth/service/AuthService.java
- Banchan/src/main/java/com/__105/Banchan/auth/service/impl/AuthServiceImpl.java
