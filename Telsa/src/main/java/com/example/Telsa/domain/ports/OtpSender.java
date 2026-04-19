package com.example.Telsa.domain.ports;

public interface OtpSender {
    void sendOtp(String toPhoneNumber, String otpCode, int validMinutes);
}
