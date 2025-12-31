package com.__105.Banchan.ask.exception;

import lombok.Getter;

@Getter
public class AskErrorResponse {

    private final String code;
    private final String message;

    public AskErrorResponse(AskErrorCode errorCode) {
        this.code = errorCode.name();
        this.message = errorCode.getMessage();
    }
}
