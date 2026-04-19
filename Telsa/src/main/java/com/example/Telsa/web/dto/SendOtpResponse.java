package com.example.Telsa.web.dto;

public record SendOtpResponse(
        boolean success,
        String message,
        String otpSessionId,
        int expiresInSeconds
) {
}

