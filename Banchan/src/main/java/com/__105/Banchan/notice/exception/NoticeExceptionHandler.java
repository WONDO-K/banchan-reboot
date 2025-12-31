package com.__105.Banchan.notice.exception;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

@ControllerAdvice
public class NoticeExceptionHandler extends ResponseEntityExceptionHandler {

    @ExceptionHandler(NoticeException.class)
    protected ResponseEntity<NoticeErrorResponse> handleCustomException(NoticeException ex) {
        NoticeErrorCode errorCode = ex.getErrorCode();
        NoticeErrorResponse response = new NoticeErrorResponse(errorCode);
        return new ResponseEntity<>(response, errorCode.getStatus());
    }
}
