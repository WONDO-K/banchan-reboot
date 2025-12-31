package com.__105.Banchan.common.exception;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import org.springframework.validation.FieldError;

import java.util.ArrayList;
import java.util.List;

@Getter
@Builder
@AllArgsConstructor
public class ErrorResponse {
    private int status;
    private String code;
    private String message;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    private List<CustomFieldError> customFieldErrors;

    public void setCustomFieldErrors(List<FieldError> fieldErrors) {
        customFieldErrors = new ArrayList<>();

        fieldErrors.forEach(error -> {
            customFieldErrors.add(new CustomFieldError(
                    error.getCodes()[0],
                    error.getRejectedValue(),
                    error.getDefaultMessage()
            ));
        });
    }

    @AllArgsConstructor
    @Getter
    public static class CustomFieldError{
        private String field;
        private Object value;
        private String reason;
    }
}
