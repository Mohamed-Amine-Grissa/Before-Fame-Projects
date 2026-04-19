package com.example.Telsa.web.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.UUID;

@Getter
@AllArgsConstructor
public class RegisterResponse {
    private UUID userId;
    private String message;
}

