package com.example.Telsa.web.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class OtpVerifyResponse {
    private boolean success;
    private int retriesRemaining;
    private String accessToken;
    private String refreshToken;
}

