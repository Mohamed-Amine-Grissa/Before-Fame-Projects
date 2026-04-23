package com.example.Telsa.domain.ports;

public interface EmailSender {
    void sendVerificationEmail(String toEmail, String verifyUrl);
}

