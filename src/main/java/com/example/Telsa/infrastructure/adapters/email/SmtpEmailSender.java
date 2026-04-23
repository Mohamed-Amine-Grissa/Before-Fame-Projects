package com.example.Telsa.infrastructure.adapters.email;

import com.example.Telsa.domain.ports.EmailSender;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

@Component
@Slf4j
public class SmtpEmailSender implements EmailSender {

    private final JavaMailSender mailSender;
    private final String appBaseUrl;

    public SmtpEmailSender(JavaMailSender mailSender,
                           @Value("${app.base-url}") String appBaseUrl) {
        this.mailSender = mailSender;
        this.appBaseUrl = appBaseUrl;
    }

    @Override
    public void sendVerificationEmail(String toEmail, String verifyUrl) {
        String targetUrl = (verifyUrl == null || verifyUrl.isBlank()) ? appBaseUrl : verifyUrl;
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("Verify your Telsa account email");
        message.setText("Click the link to verify your email: " + targetUrl
                + "\nThis link expires in 24 hours.");
        try {
            mailSender.send(message);
        } catch (Exception ex) {
            log.error("Email delivery failed for {}", toEmail, ex);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Email delivery failed");
        }
    }
}

