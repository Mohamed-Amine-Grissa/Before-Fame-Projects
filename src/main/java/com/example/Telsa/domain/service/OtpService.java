package com.example.Telsa.domain.service;

import com.example.Telsa.domain.exception.AccountLockedException;
import com.example.Telsa.domain.exception.MaxOtpRetriesException;
import com.example.Telsa.domain.exception.OtpExpiredException;
import com.example.Telsa.domain.model.User;
import com.example.Telsa.domain.ports.OtpSender;
import com.example.Telsa.infrastructure.adapters.db.UserRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.security.SecureRandom;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Service
@RequiredArgsConstructor
public class OtpService {

    private static final Logger log = LoggerFactory.getLogger(OtpService.class);

    private final OtpSender otpSender;
    private final UserRepository userRepository;
    private final LockService lockService;

    @Value("${otp.expiration-minutes}")
    private int expirationMinutes;

    @Value("${otp.max-retries}")
    private int maxRetries;

    @Value("${otp.rate-limit-seconds}")
    private int rateLimitSeconds;

    private final Map<UUID, OtpEntry> otpStore = new ConcurrentHashMap<>();

    public void sendOtp(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found."));

        if (lockService.isLocked(userId.toString())) {
            long retryAfterSeconds = lockService.getRetryAfterSeconds(userId.toString());
            throw new AccountLockedException(retryAfterSeconds);
        }

        OtpEntry existing = otpStore.get(userId);
        if (existing != null) {
            long secondsSinceLastSend = ChronoUnit.SECONDS.between(existing.sentAt(), Instant.now());
            if (secondsSinceLastSend < rateLimitSeconds) {
                long remaining = rateLimitSeconds - secondsSinceLastSend;
                throw new ResponseStatusException(HttpStatus.TOO_MANY_REQUESTS,
                        "Please wait " + remaining + " seconds before requesting a new OTP");
            }
        }

        String code = String.format("%06d", new SecureRandom().nextInt(999999));
        Instant now = Instant.now();
        Instant expiresAt = now.plus(expirationMinutes, ChronoUnit.MINUTES);
        String fullPhone = user.getCountryCode() + user.getPhoneNumber();

        otpStore.put(userId, new OtpEntry(code, expiresAt, maxRetries, fullPhone, now));
        otpSender.sendOtp(fullPhone, code, expirationMinutes);
        log.info("OTP sent to userId: {}", userId);
    }

    public VerifyOtpResult verifyOtp(UUID userId, String providedOtp) {
        OtpEntry entry = otpStore.get(userId);
        if (entry == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "No active OTP session found");
        }

        if (lockService.isLocked(userId.toString())) {
            long retryAfterSeconds = lockService.getRetryAfterSeconds(userId.toString());
            throw new AccountLockedException(retryAfterSeconds);
        }

        if (Instant.now().isAfter(entry.expiresAt())) {
            otpStore.remove(userId);
            throw new OtpExpiredException("OTP has expired. Please request a new one.");
        }

        if (entry.retriesRemaining() == 0) {
            otpStore.remove(userId);
            throw new MaxOtpRetriesException("Maximum retries exceeded.");
        }

        if (!entry.code().equals(providedOtp)) {
            int retriesRemaining = entry.retriesRemaining() - 1;
            lockService.recordFailure(userId.toString());

            if (retriesRemaining == 0) {
                otpStore.remove(userId);
                throw new MaxOtpRetriesException("Invalid OTP. No retries remaining.");
            }

            otpStore.put(userId, new OtpEntry(entry.code(), entry.expiresAt(), retriesRemaining, entry.fullPhoneNumber(), entry.sentAt()));
            return new VerifyOtpResult(false, retriesRemaining, null, null);
        }

        otpStore.remove(userId);
        lockService.resetFailures(userId.toString());
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found."));
        user.setVerified(true);
        userRepository.save(user);
        return new VerifyOtpResult(true, 0, null, null);
    }

    public void resendOtp(UUID userId) {
        otpStore.remove(userId);
        sendOtp(userId);
    }

    public OtpSession generateAndSendOtp(UUID userId, String countryCode, String phoneNumber) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found."));
        user.setCountryCode(countryCode.trim());
        user.setPhoneNumber(phoneNumber.trim());
        userRepository.save(user);

        sendOtp(userId);
        OtpEntry entry = otpStore.get(userId);
        if (entry == null) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "OTP session not created.");
        }
        return new OtpSession(userId, entry.expiresAt());
    }

    public VerifyOtpResult verifyOtpByUserId(UUID userId, String providedOtp) {
        return verifyOtp(userId, providedOtp);
    }

    public static record VerifyOtpResult(boolean success, int retriesRemaining, String accessToken, String refreshToken) {
        public boolean isSuccess() {
            return success;
        }

        public int getRetriesRemaining() {
            return retriesRemaining;
        }
    }

    private record OtpEntry(String code, Instant expiresAt, int retriesRemaining, String fullPhoneNumber, Instant sentAt) {
    }

    public static class OtpSession {
        private final UUID id;
        private final Instant expiresAt;

        public OtpSession(UUID id, Instant expiresAt) {
            this.id = id;
            this.expiresAt = expiresAt;
        }

        public UUID getId() {
            return id;
        }

        public Instant getExpiresAt() {
            return expiresAt;
        }
    }
}
