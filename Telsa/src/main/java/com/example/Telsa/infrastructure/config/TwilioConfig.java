package com.example.Telsa.infrastructure.config;

import com.twilio.Twilio;
import jakarta.annotation.PostConstruct;
import lombok.Getter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

@Configuration
@Getter
public class TwilioConfig {

    @Value("${twilio.account-sid}")
    private String accountSid;

    @Value("${twilio.auth-token}")
    private String authToken;

    @Value("${twilio.phone-number}")
    private String phoneNumber;

    @Value("${otp.length:6}")
    private int otpLength;

    @Value("${otp.expiration-minutes:5}")
    private int otpExpirationMinutes;

    @Value("${otp.max-retries:3}")
    private int otpMaxRetries;

    @PostConstruct
    public void init() {
        Twilio.init(accountSid, authToken);
    }
}
