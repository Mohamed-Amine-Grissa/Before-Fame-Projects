package com.example.Telsa.domain.exception;

public class AccountLockedException extends RuntimeException {
    private final long retryAfterSeconds;

    public AccountLockedException(long retryAfterSeconds) {
        super("Account locked");
        this.retryAfterSeconds = retryAfterSeconds;
    }

    public long getRetryAfterSeconds() {
        return retryAfterSeconds;
    }
}

