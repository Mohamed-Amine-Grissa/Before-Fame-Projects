package com.example.Telsa.web.dto;

import jakarta.validation.constraints.NotBlank;

/**
 * Request to register a FOREIGN vehicle
 * Used when user selects "Foreign Car" and completes vehicle details
 * 
 * WARNING: Vehicle must have TLS prefix to be added to telsa_vehicles ERP
 */
public record RegisterForeignVehicleRequest(
        @NotBlank(message = "verificationId is required")
        String verificationId,
        
        @NotBlank(message = "chassisNumber is required")
        String chassisNumber,
        
        @NotBlank(message = "plateNumber is required")
        String plateNumber
) {
}

