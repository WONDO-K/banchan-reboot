package com.__105.Banchan.auth.dto.otp;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OtpValidateRequestDto {
    private String phoneNumber;
    private String otp;
}
