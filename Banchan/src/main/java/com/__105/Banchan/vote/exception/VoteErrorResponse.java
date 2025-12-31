package com.__105.Banchan.vote.exception;

import lombok.Getter;

@Getter
public class VoteErrorResponse {
    private String code;
    private String message;

    public VoteErrorResponse(VoteErrorCode errorCode) {
        this.code = errorCode.name();
        this.message = errorCode.getMessage();
    }
}
