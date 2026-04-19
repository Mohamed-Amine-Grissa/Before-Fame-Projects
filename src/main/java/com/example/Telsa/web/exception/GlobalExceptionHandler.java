package com.example.Telsa.web.exception;

import com.example.Telsa.domain.exception.AccountLockedException;
import com.example.Telsa.domain.exception.MaxOtpRetriesException;
import com.example.Telsa.domain.exception.OtpExpiredException;
import com.example.Telsa.web.dto.response.ApiResponse;
import io.jsonwebtoken.JwtException;
import jakarta.persistence.EntityNotFoundException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.multipart.MultipartException;
import org.springframework.web.server.ResponseStatusException;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<Map<String, String>>> handleValidationErrors(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        for (FieldError error : ex.getBindingResult().getFieldErrors()) {
            errors.put(error.getField(), error.getDefaultMessage());
        }
        return ResponseEntity.badRequest().body(ApiResponse.<Map<String, String>>builder()
                .success(false)
                .message("Validation failed")
                .data(errors)
                .build());
    }

    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<ApiResponse<Void>> handleResponseStatus(ResponseStatusException ex) {
        String message = ex.getReason() == null ? "Request failed" : ex.getReason();
        return ResponseEntity.status(ex.getStatusCode()).body(ApiResponse.<Void>builder()
                .success(false)
                .message(message)
                .build());
    }

    @ExceptionHandler(AccountLockedException.class)
    public ResponseEntity<ApiResponse<Void>> handleAccountLocked(AccountLockedException ex) {
        return ResponseEntity.status(HttpStatus.LOCKED).body(ApiResponse.<Void>builder()
                .success(false)
                .message("Account locked")
                .retryAfterSeconds(ex.getRetryAfterSeconds())
                .build());
    }

    @ExceptionHandler(MaxOtpRetriesException.class)
    public ResponseEntity<ApiResponse<Void>> handleMaxOtpRetries(MaxOtpRetriesException ex) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(ApiResponse.<Void>builder()
                .success(false)
                .message(ex.getMessage())
                .build());
    }

    @ExceptionHandler(OtpExpiredException.class)
    public ResponseEntity<ApiResponse<Void>> handleOtpExpired(OtpExpiredException ex) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(ApiResponse.<Void>builder()
                .success(false)
                .message(ex.getMessage())
                .build());
    }

    @ExceptionHandler(MultipartException.class)
    public ResponseEntity<ApiResponse<Void>> handleMultipartError(MultipartException ex) {
        return ResponseEntity.badRequest().body(ApiResponse.<Void>builder()
                .success(false)
                .message("Invalid or missing file upload")
                .build());
    }

    @ExceptionHandler(JwtException.class)
    public ResponseEntity<ApiResponse<Void>> handleJwtError(JwtException ex) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(ApiResponse.<Void>builder()
                .success(false)
                .message("Invalid or expired token")
                .build());
    }

    @ExceptionHandler(EntityNotFoundException.class)
    public ResponseEntity<ApiResponse<Void>> handleEntityNotFound(EntityNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ApiResponse.<Void>builder()
                .success(false)
                .message("Resource not found")
                .build());
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<Void>> handleGeneralErrors(Exception ex) {
        log.error("Unexpected server error", ex);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ApiResponse.<Void>builder()
                .success(false)
                .message("Internal server error")
                .build());
    }
}
