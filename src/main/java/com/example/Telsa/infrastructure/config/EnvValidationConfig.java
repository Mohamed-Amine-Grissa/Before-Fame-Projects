package com.example.Telsa.infrastructure.config;
import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
@Configuration
public class EnvValidationConfig {
    private static final Logger log = LoggerFactory.getLogger(EnvValidationConfig.class);
    @Value("${twilio.account-sid:}")
    private String twilioAccountSid;
    @Value("${twilio.auth-token:}")
    private String twilioAuthToken;
    @Value("${twilio.phone-number:}")
    private String twilioPhoneNumber;
    @Value("${jwt.secret:}")
    private String jwtSecret;
    @Value("${spring.datasource.password:}")
    private String datasourcePassword;
    @PostConstruct
    public void validateEnv() {
        warnIfBlank("twilio.account-sid", twilioAccountSid);
        warnIfBlank("twilio.auth-token", twilioAuthToken);
        warnIfBlank("twilio.phone-number", twilioPhoneNumber);
        warnIfBlank("jwt.secret", jwtSecret);
        warnIfBlank("spring.datasource.password", datasourcePassword);
    }
    private void warnIfBlank(String propertyName, String value) {
        if (value == null || value.isBlank()) {
            log.warn("WARNING: {} is not set. Do not deploy to production without this value.", propertyName);
        }
    }
}
