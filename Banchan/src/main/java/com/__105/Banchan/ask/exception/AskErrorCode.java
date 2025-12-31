package com.__105.Banchan.ask.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
@AllArgsConstructor
public enum AskErrorCode {

    USER_NOT_FOUND(HttpStatus.NOT_FOUND, "User not found"),
    ASK_NOT_FOUND(HttpStatus.NOT_FOUND, "Not found Notice"),
    FILE_STORAGE_FAILED(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to store file"),
    UNAUTHORIZED_ACTION(HttpStatus.UNAUTHORIZED, "Unable to delete because you are not the author or administrator"),
    APARTMENT_NOT_FOUND(HttpStatus.NOT_FOUND, "User has no Apartment"),
    COMMENT_NOT_FOUND(HttpStatus.NOT_FOUND, "Not found Notice"),
    FILE_NOT_FOUND(HttpStatus.NOT_FOUND, "File not found");

    private final HttpStatus status;
    private final String message;
}
