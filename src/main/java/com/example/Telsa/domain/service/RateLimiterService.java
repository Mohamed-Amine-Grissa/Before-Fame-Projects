package com.example.Telsa.domain.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class RateLimiterService {

    private final Map<String, RateLimitRecord> records = new ConcurrentHashMap<>();

    @Value("${ratelimit.max-attempts:10}")
    private int maxAttempts;

    @Value("${ratelimit.window-minutes:60}")
    private int windowMinutes;

    public boolean isAllowed(String key) {
        RateLimitRecord record = records.computeIfAbsent(key, k -> new RateLimitRecord(0, Instant.now()));
        Instant now = Instant.now();
        if (record.windowStart().plus(windowMinutes, ChronoUnit.MINUTES).isBefore(now)) {
            record = new RateLimitRecord(0, now);
            records.put(key, record);
        }
        if (record.attemptCount() >= maxAttempts) {
            return false;
        }
        records.put(key, new RateLimitRecord(record.attemptCount() + 1, record.windowStart()));
        return true;
    }

    public long getRetryAfterSeconds(String key) {
        RateLimitRecord record = records.get(key);
        if (record == null) {
            return 0;
        }
        Instant windowEnd = record.windowStart().plus(windowMinutes, ChronoUnit.MINUTES);
        long remaining = ChronoUnit.SECONDS.between(Instant.now(), windowEnd);
        return Math.max(0, remaining);
    }

    private record RateLimitRecord(int attemptCount, Instant windowStart) {
    }
}

