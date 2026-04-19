package com.example.Telsa.domain.service;

import com.example.Telsa.domain.exception.AccountLockedException;
import com.example.Telsa.domain.model.User;
import com.example.Telsa.infrastructure.adapters.db.UserRepository;
import com.example.Telsa.infrastructure.config.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final LockService lockService;
    private final OtpService otpService;
    private final BCryptPasswordEncoder passwordEncoder;

    public UUID login(String email, String password) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid credentials"));

        String lockKey = user.getId().toString();
        if (lockService.isLocked(lockKey)) {
            long retryAfterSeconds = lockService.getRetryAfterSeconds(lockKey);
            throw new AccountLockedException(retryAfterSeconds);
        }

        if (!passwordEncoder.matches(password, user.getPassword())) {
            lockService.recordFailure(lockKey);
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid credentials");
        }

        lockService.resetFailures(lockKey);

        if (!user.isVerified()) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN,
                    "Account not verified. Please complete phone verification.");
        }

        otpService.sendOtp(user.getId());
        return user.getId();
    }

    public TokenPair issueTokens(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
        return new TokenPair(
                jwtService.generateAccessToken(user),
                jwtService.generateRefreshToken(user)
        );
    }

    public TokenPair refreshAccessToken(String refreshToken) {
        if (!jwtService.validateToken(refreshToken)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid refresh token");
        }

        if (!jwtService.isRefreshToken(refreshToken)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Token is not a refresh token");
        }

        UUID userId = jwtService.extractUserId(refreshToken);
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid refresh token"));

        return new TokenPair(jwtService.generateAccessToken(user), refreshToken);
    }

    public record TokenPair(String accessToken, String refreshToken) {
    }
}

