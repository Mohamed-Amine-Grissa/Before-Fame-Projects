package com.example.Telsa.web.controller;

import com.example.Telsa.domain.service.AuthService;
import com.example.Telsa.domain.service.UserRegistrationService;
import com.example.Telsa.web.dto.request.LoginRequest;
import com.example.Telsa.web.dto.request.RefreshTokenRequest;
import com.example.Telsa.web.dto.request.RegisterRequest;
import com.example.Telsa.web.dto.response.ApiResponse;
import com.example.Telsa.web.dto.response.LoginResponse;
import com.example.Telsa.web.dto.response.RegisterResponse;
import com.example.Telsa.web.dto.response.TokenRefreshResponse;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private static final int OTP_EXPIRES_SECONDS = 300;

    private final UserRegistrationService userRegistrationService;
    private final AuthService authService;

    @PostMapping("/register")
    @Operation(summary = "Register a new user account")
    public ResponseEntity<ApiResponse<RegisterResponse>> register(
            @Valid @RequestBody RegisterRequest request) {
        var user = userRegistrationService.registerUser(
                request.getVerificationToken(),
                request.getFirstName(),
                request.getLastName(),
                request.getEmail(),
                request.getPassword(),
                request.getPhoneNumber(),
                request.getCountryCode()
        );
        return ResponseEntity.ok(ApiResponse.ok(
                "Account created. Verify your phone.",
                new RegisterResponse(user.getId(), "Account created. Verify your phone.")
        ));
    }

    @PostMapping("/login")
    @Operation(summary = "Login and trigger OTP")
    public ResponseEntity<ApiResponse<LoginResponse>> login(
            @Valid @RequestBody LoginRequest request) {
        var userId = authService.login(request.getEmail(), request.getPassword());
        return ResponseEntity.ok(ApiResponse.ok(
                "OTP sent to your phone.",
                new LoginResponse(userId, "OTP sent to your phone.", OTP_EXPIRES_SECONDS)
        ));
    }

    @PostMapping("/refresh")
    @Operation(summary = "Refresh an access token")
    public ResponseEntity<ApiResponse<TokenRefreshResponse>> refresh(
            @Valid @RequestBody RefreshTokenRequest request) {
        var pair = authService.refreshAccessToken(request.getRefreshToken());
        return ResponseEntity.ok(ApiResponse.ok(
                "Token refreshed",
                new TokenRefreshResponse(pair.accessToken())
        ));
    }
}

