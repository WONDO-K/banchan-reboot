package com.__105.Banchan.common.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum ErrorCode {

    // 유저 관련
    USER_NOT_FOUND(404, "U001", "회원정보를 찾을 수 없습니다."),
    DUPLICATE_EMAIL(400, "U002", "이미 존재하는 이메일 입니다."),
    DUPLICATE_NICKNAME(400, "U003", "이미 존재하는 별명입니다."),
    DUPLICATE_ID(400, "U004", "이미 존재하는 아이디입니다."),
    INVALID_PARAMETER(400, "U005", "잘못된 요청입니다."),
    POST_NOT_FOUND(404, "U006", "게시글이 존재하지 않습니다."),
    PHONE_DUPLICATION(400, "U007", "이미 존재하는 전화번호입니다."),

    // 카카오 로그인 관련 에러 코드
    KAKAO_TOKEN_PARSING_FAILED(500, "K001", "카카오 액세스 토큰 또는 사용자 정보 파싱 실패"),
    KAKAO_TOKEN_REQUEST_FAILED(500, "K002", "카카오 액세스 토큰 요청 실패"),
    KAKAO_USER_INFO_REQUEST_FAILED(500, "K003", "카카오 사용자 정보 요청 실패"),
    KAKAO_USER_INFO_NOT_FOUND(400, "K004", "카카오 사용자 정보를 가져오는 데 실패했습니다."),
    KAKAO_USER_INFO_PARSING_FAILED(500, "K005", "카카오 사용자 정보 파싱 실패"),
    LOGIN_OR_REGISTER_FAILED(500, "K006", "회원가입 또는 로그인 처리 중 오류 발생"),

    // 리프레시 토큰 관련 에러 코드
    REDIS_REFRESH_TOKEN_NOT_FOUND(404, "R001", "해당 액세스 토큰에 대한 리프레시 토큰을 찾을 수 없습니다."),
    REDIS_TOKEN_CREATE_FAILED(500, "R002", "Redis에 토큰 생성 중 오류 발생"),
    REFRESH_TOKEN_EXPIRED(401, "R003", "리프레시 토큰이 만료되었습니다."),
    INVALID_REFRESH_TOKEN(400, "R004", "잘못된 리프레시 토큰입니다."),

    // 인증 권한 관련 에러 코드
    USER_NOT_AUTHORIZED(403, "A001", "사용자가 권한이 없습니다."),
    ACCESS_TOKEN_REQUIRED(400, "A002", "액세스 토큰이 필요합니다."),
    REFRESH_TOKEN_REQUIRED(400, "A003", "리프레시 토큰이 필요합니다."),
    INVALID_JWT(401, "A004", "JWT 토큰이 유효하지 않습니다."),

    // 아파트 관련 에러코드
    USER_APARTMENT_NOT_FOUND(404, "AP001", "유저의 아파트 정보를 찾을 수 없습니다."),
    APARTMENT_NOT_FOUND(404, "AP002", "아파트 정보를 찾을 수 없습니다."),
    INVALID_APT_CODE(400, "AP003", "잘못된 아파트 코드입니다."),
    INVALID_BUILDING_NUMBER(400, "AP004", "잘못된 건물 번호입니다."),
    INVALID_UNIT_NUMBER(400, "AP005", "잘못된 유닛 번호입니다. 문자를 입력이 발생했는지 확인이 필요합니다."),

    // SMS 인증 관련 에러 코드
    OTP_GENERATION_FAILED(500, "OTP001", "OTP 생성 중 오류가 발생했습니다."),
    INVALID_OTP(400, "OTP002", "잘못된 OTP입니다."),
    OTP_EXPIRED(400, "OTP003", "OTP가 만료되었습니다."),
    OTP_VALIDATION_FAILED(500, "OTP004", "OTP 검증 중 오류가 발생했습니다."),
    MAX_OTP_ATTEMPTS_EXCEEDED(403, "OTP005", "최대 OTP 시도 횟수를 초과했습니다."),
    OTP_NOT_FOUND(404, "OTP006", "해당 전화번호에 대한 OTP를 찾을 수 없습니다."),
    OTP_ALREADY_USED(400, "OTP007", "이미 사용된 OTP입니다."),
    PHONE_NUMBER_REQUIRED(400, "OTP008", "전화번호가 필요합니다."),
    OTP_REQUIRED(400, "OTP009", "OTP가 필요합니다."),

    // 일반적인 에러 코드
    INTERNAL_SERVER_ERROR(500, "S001", "서버 내부 오류가 발생했습니다."),
    BAD_REQUEST(400, "S002", "잘못된 요청입니다."),
    FORBIDDEN(403, "S003", "액세스가 거부되었습니다."),
    NOT_FOUND(404, "S004", "리소스를 찾을 수 없습니다."),

    // 로그아웃 관련 에러 코드
    LOGOUT_FAILED(500, "L001", "로그아웃 실패");

    private final int status;
    private final String code;
    private final String message;
}
