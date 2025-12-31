package com.__105.Banchan.conference.exception;

import lombok.Getter;

@Getter
public class ConfErrorResponse {
    private final String code;
    private final String message;

    public ConfErrorResponse(ConfErrorCode errorCode) {
        this.code = errorCode.name();
        this.message = errorCode.getMessage();
    }
}
