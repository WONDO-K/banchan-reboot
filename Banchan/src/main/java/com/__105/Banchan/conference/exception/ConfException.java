package com.__105.Banchan.conference.exception;

import lombok.Getter;

@Getter
public class ConfException extends RuntimeException {

    private final ConfErrorCode errorCode;

    public ConfException(ConfErrorCode errorCode) {
        super(errorCode.getMessage());
        this.errorCode = errorCode;
    }
}
