package com.example.Telsa.domain.service;

import com.example.Telsa.domain.exception.AccountLockedException;
import com.example.Telsa.domain.model.RefreshToken;
import com.example.Telsa.domain.model.User;
import com.example.Telsa.infrastructure.adapters.db.RefreshTokenRepository;
import com.example.Telsa.infrastructure.adapters.db.UserRepository;
import com.example.Telsa.infrastructure.config.JwtService;
import com.example.Telsa.infrastructure.config.AuditLogger;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final LockService lockService;
    private final OtpService otpService;
    private final BCryptPasswordEncoder passwordEncoder;
    private final RefreshTokenRepository refreshTokenRepository;
    private final AuditLogger auditLogger;

    @Value("${jwt.refresh-token-expiration-days}")
    private long refreshExpirationDays;

    public UUID login(String email, String password, String ip) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid credentials"));

        String lockKey = user.getId().toString();
        if (lockService.isLocked(lockKey)) {
            auditLogger.logLoginAttempt(email, false, ip);
            long retryAfterSeconds = lockService.getRetryAfterSeconds(lockKey);
            throw new AccountLockedException(retryAfterSeconds);
        }

        if (!passwordEncoder.matches(password, user.getPassword())) {
            lockService.recordFailure(lockKey);
            auditLogger.logLoginAttempt(email, false, ip);
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid credentials");
        }

        lockService.resetFailures(lockKey);

        if (!user.isVerified()) {
            auditLogger.logLoginAttempt(email, false, ip);
            throw new ResponseStatusException(HttpStatus.FORBIDDEN,
                    "Account not verified. Please complete phone verification.");
        }

        auditLogger.logLoginAttempt(email, true, ip);
        otpService.sendOtp(user.getId());
        return user.getId();
    }

    public TokenPair issueTokens(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        String refreshToken = jwtService.generateRefreshToken(user);
        String refreshHash = jwtService.hashToken(refreshToken);
        RefreshToken tokenEntity = RefreshToken.builder()
                .userId(user.getId())
                .tokenHash(refreshHash)
                .expiresAt(LocalDateTime.now().plusDays(refreshExpirationDays))
                .revoked(false)
                .build();
        refreshTokenRepository.save(tokenEntity);

        return new TokenPair(
                jwtService.generateAccessToken(user),
                refreshToken
        );
    }

    public TokenPair refreshAccessToken(String refreshToken) {
        if (!jwtService.validateToken(refreshToken)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid refresh token");
        }

        if (!jwtService.isRefreshToken(refreshToken)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Token is not a refresh token");
        }

        String hash = jwtService.hashToken(refreshToken);
        RefreshToken tokenRecord = refreshTokenRepository.findByTokenHash(hash)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Refresh token not recognised"));

        if (tokenRecord.isRevoked()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Refresh token has been revoked");
        }

        if (tokenRecord.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Refresh token expired");
        }

        UUID userId = jwtService.extractUserId(refreshToken);
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid refresh token"));

        refreshTokenRepository.revokeByTokenHash(hash);

        String newRefreshToken = jwtService.generateRefreshToken(user);
        String newHash = jwtService.hashToken(newRefreshToken);
        RefreshToken newTokenRecord = RefreshToken.builder()
                .userId(user.getId())
                .tokenHash(newHash)
                .expiresAt(LocalDateTime.now().plusDays(refreshExpirationDays))
                .revoked(false)
                .build();
        refreshTokenRepository.save(newTokenRecord);

        return new TokenPair(jwtService.generateAccessToken(user), newRefreshToken);
    }

    public record TokenPair(String accessToken, String refreshToken) {
    }
}
