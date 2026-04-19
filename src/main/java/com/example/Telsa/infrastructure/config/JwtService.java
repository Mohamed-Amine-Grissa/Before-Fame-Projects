package com.example.Telsa.infrastructure.config;

import com.example.Telsa.domain.model.User;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.security.Key;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.UUID;

@Service
public class JwtService {

    private final String secret;
    private final long accessExpirationMinutes;
    private final long refreshExpirationDays;

    public JwtService(
            @Value("${jwt.secret}") String secret,
            @Value("${jwt.access-token-expiration-minutes}") long accessExpirationMinutes,
            @Value("${jwt.refresh-token-expiration-days}") long refreshExpirationDays) {
        this.secret = secret;
        this.accessExpirationMinutes = accessExpirationMinutes;
        this.refreshExpirationDays = refreshExpirationDays;
    }

    public String generateAccessToken(User user) {
        Instant now = Instant.now();
        return Jwts.builder()
                .subject(user.getId().toString())
                .issuedAt(Date.from(now))
                .expiration(Date.from(now.plus(accessExpirationMinutes, ChronoUnit.MINUTES)))
                .claim("role", "USER")
                .signWith(signingKey())
                .compact();
    }

    public String generateRefreshToken(User user) {
        Instant now = Instant.now();
        return Jwts.builder()
                .subject(user.getId().toString())
                .issuedAt(Date.from(now))
                .expiration(Date.from(now.plus(refreshExpirationDays, ChronoUnit.DAYS)))
                .claim("type", "refresh")
                .signWith(signingKey())
                .compact();
    }

    public boolean validateToken(String token) {
        try {
            Jwts.parser()
                    .verifyWith(signingKey())
                    .build()
                    .parseSignedClaims(token);
            return true;
        } catch (JwtException | IllegalArgumentException ex) {
            return false;
        }
    }

    public UUID extractUserId(String token) {
        String subject = Jwts.parser()
                .verifyWith(signingKey())
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .getSubject();
        return UUID.fromString(subject);
    }

    public boolean isRefreshToken(String token) {
        String type = Jwts.parser()
                .verifyWith(signingKey())
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .get("type", String.class);
        return "refresh".equals(type);
    }

    private SecretKey signingKey() {
        return Keys.hmacShaKeyFor(Decoders.BASE64.decode(secret));
    }
}

