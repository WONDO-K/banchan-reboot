package com.__105.Banchan.auth.dto.login;


import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class OriginLoginRequestDto { // 자체 로그인
    @NotBlank
    private String userId;
    @NotBlank
    private String passwordHash;
}
