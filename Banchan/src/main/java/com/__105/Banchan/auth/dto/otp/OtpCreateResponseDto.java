package com.__105.Banchan.auth.dto.otp;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OtpCreateResponseDto {
    private boolean success;
    private String message;
    private String otp;

}
