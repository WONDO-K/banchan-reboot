package com.__105.Banchan.redis.repository;

import java.util.Optional;

public interface OtpRepository {
    void saveOtp(String phoneNumber, String otp, int expirationMinutes);
    Optional<String> findOtpByPhoneNumber(String phoneNumber);
    void deleteOtpByPhoneNumber(String phoneNumber);
    void saveAttempt(String phoneNumber, int expirationMinutes);
    Optional<Integer> findAttemptsByPhoneNumber(String phoneNumber);
    void deleteAttemptsByPhoneNumber(String phoneNumber);
    void lockUser(String phoneNumber, int lockTimeMinutes);
    boolean existsLockByPhoneNumber(String phoneNumber);
    void deleteLockByPhoneNumber(String phoneNumber);
}
