package com.example.Telsa.domain.service;

import com.example.Telsa.infrastructure.config.AuditLogger;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class LockService {

    private final int maxAttempts;
    private final long lockDurationMinutes;
    private final Map<String, LockRecord> locks = new ConcurrentHashMap<>();
    private final AuditLogger auditLogger;

    public LockService(@Value("${lock.max-attempts}") int maxAttempts,
                       @Value("${lock.duration-minutes}") long lockDurationMinutes,
                       AuditLogger auditLogger) {
        this.maxAttempts = maxAttempts;
        this.lockDurationMinutes = lockDurationMinutes;
        this.auditLogger = auditLogger;
    }

    public void recordFailure(String key) {
        LockRecord record = locks.getOrDefault(key, new LockRecord(0, null));
        int updatedFailures = record.failureCount + 1;
        Instant lockedUntil = record.lockedUntil;

        if (updatedFailures >= maxAttempts) {
            lockedUntil = Instant.now().plus(lockDurationMinutes, ChronoUnit.MINUTES);
            auditLogger.logAccountLocked(key, "Too many failed attempts");
        }

        locks.put(key, new LockRecord(updatedFailures, lockedUntil));
    }

    public boolean isLocked(String key) {
        LockRecord record = locks.get(key);
        if (record == null || record.lockedUntil == null) {
            return false;
        }

        if (Instant.now().isBefore(record.lockedUntil)) {
            return true;
        }

        locks.remove(key);
        return false;
    }

    public void resetFailures(String key) {
        locks.remove(key);
    }

    public long getRetryAfterSeconds(String key) {
        if (!isLocked(key)) {
            return 0;
        }
        LockRecord record = locks.get(key);
        if (record == null || record.lockedUntil == null) {
            return 0;
        }
        return ChronoUnit.SECONDS.between(Instant.now(), record.lockedUntil);
    }

    private record LockRecord(int failureCount, Instant lockedUntil) {
    }
}
