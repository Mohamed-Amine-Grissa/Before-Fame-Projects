package com.example.Telsa.infrastructure.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
public class AuditLogger {

    private static final Logger audit = LoggerFactory.getLogger("AUDIT");

    public void logLoginAttempt(String email, boolean success, String ip) {
        audit.info("LOGIN_ATTEMPT | email={} | success={} | ip={}", email, success, ip);
    }

    public void logOtpSend(UUID userId, String phoneHint) {
        String masked = maskPhone(phoneHint);
        audit.info("OTP_SEND | userId={} | phone={}", userId, masked);
    }

    public void logOtpVerify(UUID userId, boolean success) {
        audit.info("OTP_VERIFY | userId={} | success={}", userId, success);
    }

    public void logVehicleVerification(String chassisNumber, String origin, boolean success) {
        audit.info("VEHICLE_VERIFY | chassis={} | origin={} | success={}", chassisNumber, origin, success);
    }

    public void logAccountLocked(String userId, String reason) {
        audit.warn("ACCOUNT_LOCKED | userId={} | reason={}", userId, reason);
    }

    private String maskPhone(String phoneHint) {
        if (phoneHint == null || phoneHint.isBlank()) {
            return "****";
        }
        String digits = phoneHint.replaceAll("\\D", "");
        if (digits.length() <= 4) {
            return "****" + digits;
        }
        return "****" + digits.substring(digits.length() - 4);
    }
}

