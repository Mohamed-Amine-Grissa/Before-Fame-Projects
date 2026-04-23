package com.example.Telsa.domain.service;

import com.example.Telsa.domain.model.User;
import com.example.Telsa.domain.ports.EmailSender;
import com.example.Telsa.infrastructure.adapters.db.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class EmailVerificationService {

    private final UserRepository userRepository;
    private final EmailSender emailSender;

    @Value("${app.base-url}")
    private String appBaseUrl;

    public void sendVerificationEmail(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        if (user.isEmailVerified()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email already verified");
        }

        String token = UUID.randomUUID().toString().replace("-", "");
        user.setEmailVerifyToken(token);
        user.setEmailTokenExpiresAt(LocalDateTime.now().plusHours(24));
        userRepository.save(user);

        String url = appBaseUrl + "/api/auth/verify-email?token=" + token;
        emailSender.sendVerificationEmail(user.getEmail(), url);
    }

    public boolean verifyEmail(String token) {
        User user = userRepository.findByEmailVerifyToken(token)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid verification link"));

        if (user.getEmailTokenExpiresAt() == null || user.getEmailTokenExpiresAt().isBefore(LocalDateTime.now())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Verification link has expired");
        }

        user.setEmailVerified(true);
        user.setEmailVerifyToken(null);
        user.setEmailTokenExpiresAt(null);
        userRepository.save(user);
        return true;
    }
}

