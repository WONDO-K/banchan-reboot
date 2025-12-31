package com.__105.Banchan.redis.repository;

import com.__105.Banchan.redis.repository.OtpRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.concurrent.TimeUnit;

@Repository
public class OtpRepositoryImpl implements OtpRepository {

    private static final String ATTEMPT_PREFIX = "OTP_ATTEMPT_"; // 시도 횟수 키의 접두사
    private static final String LOCK_PREFIX = "OTP_LOCK_"; // 잠금 키의 접두사

    @Autowired
    private RedisTemplate<String, String> redisTemplate;

    @Override
    public void saveOtp(String phoneNumber, String otp, int expirationMinutes) {
        redisTemplate.opsForValue().set(phoneNumber, otp, expirationMinutes, TimeUnit.MINUTES);
    }

    @Override
    public Optional<String> findOtpByPhoneNumber(String phoneNumber) {
        return Optional.ofNullable(redisTemplate.opsForValue().get(phoneNumber));
    }

    @Override
    public void deleteOtpByPhoneNumber(String phoneNumber) {
        redisTemplate.delete(phoneNumber);
    }

    @Override
    public void saveAttempt(String phoneNumber, int expirationMinutes) {
        String attemptKey = ATTEMPT_PREFIX + phoneNumber;
        redisTemplate.opsForValue().increment(attemptKey);
        redisTemplate.expire(attemptKey, expirationMinutes, TimeUnit.MINUTES);
    }

    @Override
    public Optional<Integer> findAttemptsByPhoneNumber(String phoneNumber) {
        String attemptKey = ATTEMPT_PREFIX + phoneNumber;
        String attempts = redisTemplate.opsForValue().get(attemptKey);
        return attempts == null ? Optional.empty() : Optional.of(Integer.parseInt(attempts));
    }

    @Override
    public void deleteAttemptsByPhoneNumber(String phoneNumber) {
        redisTemplate.delete(ATTEMPT_PREFIX + phoneNumber);
    }

    @Override
    public void lockUser(String phoneNumber, int lockTimeMinutes) {
        String lockKey = LOCK_PREFIX + phoneNumber;
        redisTemplate.opsForValue().set(lockKey, "LOCKED", lockTimeMinutes, TimeUnit.MINUTES);
    }

    @Override
    public boolean existsLockByPhoneNumber(String phoneNumber) {
        String lockKey = LOCK_PREFIX + phoneNumber;
        return redisTemplate.hasKey(lockKey);
    }

    @Override
    public void deleteLockByPhoneNumber(String phoneNumber) {
        redisTemplate.delete(LOCK_PREFIX + phoneNumber);
    }
}
