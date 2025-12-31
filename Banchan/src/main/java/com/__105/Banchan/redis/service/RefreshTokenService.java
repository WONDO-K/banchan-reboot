package com.__105.Banchan.redis.service;

import org.springframework.transaction.annotation.Transactional;

public interface RefreshTokenService {

    @Transactional
    void saveTokenInfo(String email, String refreshToken, String accessToken);

}
