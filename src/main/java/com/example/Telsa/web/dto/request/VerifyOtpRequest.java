package com.example.Telsa.web.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class VerifyOtpRequest {
    @NotNull
    private UUID userId;

    @NotBlank
    @Size(min = 6, max = 6)
    private String otp;
}

