package com.example.Telsa.domain.service;

public record VerifyOtpResult(boolean success, int retriesRemaining, String accessToken, String refreshToken) {
}

