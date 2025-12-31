package com.__105.Banchan.notice.exception;

import lombok.Getter;

@Getter
public class NoticeErrorResponse {
    private final String code;
    private final String message;

    public NoticeErrorResponse(NoticeErrorCode errorCode) {
        this.code = errorCode.name();
        this.message = errorCode.getMessage();
    }
}

