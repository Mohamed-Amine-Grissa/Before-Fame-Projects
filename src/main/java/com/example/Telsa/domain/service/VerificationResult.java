package com.example.Telsa.domain.service;

import java.util.UUID;

public record VerificationResult(UUID verificationToken, int expiresInSeconds) {
}

