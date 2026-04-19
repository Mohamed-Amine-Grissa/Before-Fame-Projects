package com.example.Telsa.domain.exception;

public class MaxOtpRetriesException extends RuntimeException {
    public MaxOtpRetriesException(String message) {
        super(message);
    }
}

