package com.__105.Banchan.vote.exception;

import lombok.Getter;

@Getter
public class VoteException extends RuntimeException {

    private final VoteErrorCode errorCode;

    public VoteException(VoteErrorCode errorCode) {
        super(errorCode.toString());
        this.errorCode = errorCode;
    }
}
