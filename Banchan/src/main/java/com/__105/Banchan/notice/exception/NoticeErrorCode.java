package com.__105.Banchan.notice.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
@AllArgsConstructor
public enum NoticeErrorCode {

    USER_NOT_FOUND(HttpStatus.NOT_FOUND, "User not found"),
    NOTICE_NOT_FOUND(HttpStatus.NOT_FOUND, "Not found Notice"),
    FILE_STORAGE_FAILED(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to store file"),
    UNAUTHORIZED_ACTION(HttpStatus.UNAUTHORIZED, "Unauthorized action"),
    APARTMENT_NOT_FOUND(HttpStatus.NOT_FOUND, "User has no Apartment"),
    COMMENT_NOT_FOUND(HttpStatus.NOT_FOUND, "Not found Notice"),
    FILE_NOT_FOUND(HttpStatus.NOT_FOUND, "File not found");

    private final HttpStatus status;
    private final String message;
}
