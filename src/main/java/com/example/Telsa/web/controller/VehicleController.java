package com.example.Telsa.web.controller;

import com.example.Telsa.domain.model.TeslaModel;
import com.example.Telsa.domain.service.VehicleVerificationService;
import com.example.Telsa.web.dto.request.LocalVerifyRequest;
import com.example.Telsa.web.dto.response.ApiResponse;
import com.example.Telsa.web.dto.response.VerificationTokenResponse;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/vehicles")
@RequiredArgsConstructor
public class VehicleController {

    private final VehicleVerificationService vehicleVerificationService;

    @PostMapping("/verify/local")
    @Operation(summary = "Verify a local Tesla vehicle")
    public ResponseEntity<ApiResponse<VerificationTokenResponse>> verifyLocal(
            @Valid @RequestBody LocalVerifyRequest request) {
        var result = vehicleVerificationService.verifyLocalVehicle(
                request.getChassisNumber(),
                request.getPlateNumber(),
                request.getPlateType(),
                request.getTeslaModel()
        );
        return ResponseEntity.ok(ApiResponse.ok(
                "Vehicle verified",
                new VerificationTokenResponse(result.verificationToken(), result.expiresInSeconds())
        ));
    }

    @PostMapping("/verify/foreign")
    @Operation(summary = "Verify a foreign Tesla vehicle")
    public ResponseEntity<ApiResponse<VerificationTokenResponse>> verifyForeign(
            @RequestParam String chassisNumber,
            @RequestParam TeslaModel teslaModel,
            @RequestParam MultipartFile carteGrise) {
        var result = vehicleVerificationService.verifyForeignVehicle(chassisNumber, teslaModel, carteGrise);
        return ResponseEntity.ok(ApiResponse.ok(
                "Foreign vehicle registered",
                new VerificationTokenResponse(result.verificationToken(), result.expiresInSeconds())
        ));
    }
}

