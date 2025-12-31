package com.__105.Banchan.redis.service.impl;

import com.__105.Banchan.redis.service.TokenBlacklistService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.util.concurrent.TimeUnit;

@Service
public class TokenBlacklistServiceImpl implements TokenBlacklistService {

    private final RedisTemplate<String, String> redisTemplate; // final로 선언
    private final Logger log = LoggerFactory.getLogger(getClass());

    // RedisTemplate을 주입받는 생성자
    public TokenBlacklistServiceImpl(RedisTemplate<String, String> redisTemplate) {
        this.redisTemplate = redisTemplate;
    }

    @Override
    public void blacklistToken(String token) {
        // 블랙리스트에 토큰 추가, 예를 들어 24시간 후 만료
        redisTemplate.opsForValue().set(token, "blacklisted", 24, TimeUnit.HOURS);
        log.info("Token added to blacklist: {}", token); // 로그 추가
    }

    @Override
    public boolean isTokenBlacklisted(String token) {
        boolean isBlacklisted = redisTemplate.hasKey(token);
        log.info("Is token blacklisted: {} -> {}", token, isBlacklisted); // 로그 추가
        return isBlacklisted;
    }
}