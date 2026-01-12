# Auth 토큰 추출 로직 서비스로 이동

## 변경 배경
- 컨트롤러에 토큰 추출/검증 로직이 있어 중복과 유지보수 비용이 큼.
- 컨트롤러는 매핑 역할만 남기고, 토큰 파싱 책임을 서비스로 이동.

## 변경 내용
- /token/logout, /token/refresh 요청 처리에서 토큰 추출/검증 로직을 서비스로 이동.
- AuthService에 request 기반 메서드 추가하고, 내부 호출용 오버로딩 메서드는 주석으로 용도 명시.
- AuthServiceImpl에서 공통 토큰 추출 메서드(resolveAccessToken/resolveRefreshToken)로 통일.

## 영향 범위
- 컨트롤러는 request만 전달하도록 단순화.
- 토큰 누락/형식 오류 응답은 서비스에서 처리.

## 관련 파일
- Banchan/src/main/java/com/__105/Banchan/auth/controller/AuthController.java
- Banchan/src/main/java/com/__105/Banchan/auth/service/AuthService.java
- Banchan/src/main/java/com/__105/Banchan/auth/service/impl/AuthServiceImpl.java
