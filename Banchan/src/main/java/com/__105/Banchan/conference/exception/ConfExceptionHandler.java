package com.__105.Banchan.conference.exception;

import com.__105.Banchan.common.exception.ErrorCode;
import io.openvidu.java.client.OpenViduHttpException;
import io.openvidu.java.client.OpenViduJavaClientException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.ErrorResponse;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

@ControllerAdvice
public class ConfExceptionHandler extends ResponseEntityExceptionHandler {

    @ExceptionHandler(ConfException.class)
    protected ResponseEntity<ConfErrorResponse> handleConfException(ConfException e) {
        ConfErrorCode errorCode = e.getErrorCode();
        ConfErrorResponse errorResponse = new ConfErrorResponse(errorCode);
        return new ResponseEntity<>(errorResponse, errorCode.getHttpStatus());
    }

    @ExceptionHandler(OpenViduJavaClientException.class)
    public ResponseEntity<ConfErrorResponse> handleOpenViduJavaClientException(OpenViduJavaClientException ex) {
        ConfErrorResponse response = new ConfErrorResponse(ConfErrorCode.INTERNAL_SERVER_ERROR);
        return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @ExceptionHandler(OpenViduHttpException.class)
    public ResponseEntity<ConfErrorResponse> handleOpenViduHttpException(OpenViduHttpException ex) {
        ConfErrorResponse response = new ConfErrorResponse(ConfErrorCode.INTERNAL_SERVER_ERROR);
        return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
