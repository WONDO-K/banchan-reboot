package com.__105.Banchan.notice.exception;

import lombok.Getter;

@Getter
public class NoticeException extends RuntimeException {

    private final NoticeErrorCode errorCode;

    public NoticeException(NoticeErrorCode errorCode) {
        super(errorCode.getMessage());
        this.errorCode = errorCode;
    }
}
