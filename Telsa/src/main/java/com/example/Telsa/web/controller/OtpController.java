package com.example.Telsa.web.controller;

import com.example.Telsa.domain.service.AuthService;
import com.example.Telsa.domain.service.OtpService;
import com.example.Telsa.web.dto.request.SendOtpRequest;
import com.example.Telsa.web.dto.request.VerifyOtpRequest;
import com.example.Telsa.web.dto.response.ApiResponse;
import com.example.Telsa.web.dto.response.OtpVerifyResponse;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/otp")
@RequiredArgsConstructor
public class OtpController {

    private final OtpService otpService;
    private final AuthService authService;

    @PostMapping("/send")
    @Operation(summary = "Send OTP to a user")
    public ResponseEntity<ApiResponse<Void>> sendOtp(@Valid @RequestBody SendOtpRequest request) {
        otpService.sendOtp(request.getUserId());
        return ResponseEntity.ok(ApiResponse.ok("OTP sent to your registered phone number."));
    }

    @PostMapping("/verify")
    @Operation(summary = "Verify OTP")
    public ResponseEntity<ApiResponse<OtpVerifyResponse>> verifyOtp(@Valid @RequestBody VerifyOtpRequest request) {
        var result = otpService.verifyOtp(request.getUserId(), request.getOtp());
        if (result.success()) {
            var tokens = authService.issueTokens(request.getUserId());
            return ResponseEntity.ok(ApiResponse.ok(
                    "Verified!",
                    new OtpVerifyResponse(true, 0, tokens.accessToken(), tokens.refreshToken())
            ));
        }
        return ResponseEntity.ok(ApiResponse.ok(
                "Invalid OTP",
                new OtpVerifyResponse(false, result.retriesRemaining(), null, null)
        ));
    }

    @PostMapping("/resend")
    @Operation(summary = "Resend OTP")
    public ResponseEntity<ApiResponse<Void>> resendOtp(@Valid @RequestBody SendOtpRequest request) {
        otpService.resendOtp(request.getUserId());
        return ResponseEntity.ok(ApiResponse.ok("OTP resent."));
    }
}

