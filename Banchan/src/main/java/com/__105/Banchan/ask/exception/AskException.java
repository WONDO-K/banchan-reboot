package com.__105.Banchan.ask.exception;

import lombok.Getter;

@Getter
public class AskException extends RuntimeException {

    private final AskErrorCode errorCode;

    public AskException(AskErrorCode errorCode) {
        super(errorCode.getMessage());
        this.errorCode = errorCode;
    }
}
