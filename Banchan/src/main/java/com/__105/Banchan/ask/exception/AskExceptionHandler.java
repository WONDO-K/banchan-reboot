package com.__105.Banchan.ask.exception;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

@ControllerAdvice
public class AskExceptionHandler extends ResponseEntityExceptionHandler {

    @ExceptionHandler(AskException.class)
    protected ResponseEntity<AskErrorResponse> handleAskException(AskException ex) {
        AskErrorCode errorCode = ex.getErrorCode();
        AskErrorResponse errorResponse = new AskErrorResponse(errorCode);
        return new ResponseEntity<>(errorResponse, errorCode.getStatus());
    }
}
