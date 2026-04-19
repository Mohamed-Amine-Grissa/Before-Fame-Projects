package com.example.Telsa.infrastructure.adapters.sms;

import com.example.Telsa.domain.ports.OtpSender;
import com.example.Telsa.infrastructure.config.TwilioConfig;
import com.twilio.exception.TwilioException;
import com.twilio.rest.api.v2010.account.Message;
import com.twilio.type.PhoneNumber;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ResponseStatusException;

@Component
@RequiredArgsConstructor
public class TwilioOtpSender implements OtpSender {

    private static final Logger log = LoggerFactory.getLogger(TwilioOtpSender.class);

    private final TwilioConfig twilioConfig;

    @Override
    public void sendOtp(String toPhoneNumber, String otpCode, int validMinutes) {
        String body = "Your Telsa verification code is: " + otpCode +
                ". Valid for " + validMinutes + " minutes. Do not share this code.";

        try {
            Message message = Message.creator(
                    new PhoneNumber(toPhoneNumber),
                    new PhoneNumber(twilioConfig.getPhoneNumber()),
                    body
            ).create();

            log.info("Twilio OTP sent. sid={}", message.getSid());
        } catch (TwilioException ex) {
            log.error("Failed to send OTP via Twilio", ex);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "SMS delivery failed");
        }
    }
}

