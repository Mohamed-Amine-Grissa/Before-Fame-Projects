package com.example.Telsa.web.dto.response;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class ApiResponse<T> {
    private boolean success;
    private String message;
    private T data;
    private Long retryAfterSeconds;

    public static <T> ApiResponse<T> ok(String message, T data) {
        return ApiResponse.<T>builder()
                .success(true)
                .message(message)
                .data(data)
                .build();
    }

    public static <T> ApiResponse<T> ok(String message) {
        return ApiResponse.<T>builder()
                .success(true)
                .message(message)
                .build();
    }

    public static <T> ApiResponse<T> fail(String message) {
        return ApiResponse.<T>builder()
                .success(false)
                .message(message)
                .build();
    }
}

