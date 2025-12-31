package com.__105.Banchan.auth.dto.otp;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OtpRequestDto {
    private String phoneNumber;
}
