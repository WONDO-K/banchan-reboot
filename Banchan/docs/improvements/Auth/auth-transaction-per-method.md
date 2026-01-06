# 개선 대상
- 서비스명: AuthServiceImpl
- 파일명: Banchan/src/main/java/com/__105/Banchan/auth/service/impl/AuthServiceImpl.java

# 개선 배경
- 클래스 레벨 트랜잭션 대신 메서드별 적용으로 트랜잭션 범위를 명확히 하고 불필요한 잠금을 줄일 필요가 있었다.
- 읽기/쓰기 분리를 통해 성능 개선 여지를 만들고자 했다.

# 접근 및 판단
- 대안 1: 클래스 레벨 @Transactional 유지 -> 범위가 과도해 읽기 메서드에도 쓰기 트랜잭션이 적용됨.
- 대안 2: 메서드별 @Transactional 적용 -> 트랜잭션 경계를 명확히 하고 읽기 전용 적용 가능.
- 선택: 대안 2를 선택해 메서드별로 읽기/쓰기를 분리했다.
- Cursor(AI) 활용: AuthServiceImpl 메서드 성격(읽기/쓰기/외부연동) 분류와 어노테이션 적용 위치 제안에 활용했다.

# 주요 변경 내용
- 쓰기 성격 메서드에 @Transactional 적용: logout, refresh, kakaoRegisterOrLoginUser, handleKakaoLoginSuccess
- 읽기 성격 메서드에 @Transactional(readOnly = true) 적용: originLogin
- 외부 API 호출 메서드는 트랜잭션을 적용하지 않음

# 트러블 슈팅
- 문제: 없음
- 원인 분석: 없음
- 해결 과정: 없음

# 결과 및 정리
- 개선 효과: 읽기/쓰기 트랜잭션 분리로 불필요한 잠금을 줄일 수 있는 기반 마련
- 한계점 또는 추가 개선 여지: 내부 메서드 호출 시 프록시 한계 여부를 점검하고 필요 시 구조 개선 검토
