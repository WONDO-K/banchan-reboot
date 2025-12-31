package com.__105.Banchan.vote.exception;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

@ControllerAdvice
public class VoteExceptionHandler extends ResponseEntityExceptionHandler {

    @ExceptionHandler(VoteException.class)
    public ResponseEntity<VoteErrorResponse> handleVoteException(VoteException e) {
        VoteErrorCode errorCode = e.getErrorCode();
        VoteErrorResponse errorResponse = new VoteErrorResponse(errorCode);
        return new ResponseEntity<>(errorResponse, errorCode.getStatus());
    }
}
