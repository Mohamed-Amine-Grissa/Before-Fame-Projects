package com.example.Telsa.web.dto.request;

import com.example.Telsa.domain.model.PlateType;
import com.example.Telsa.domain.model.TeslaModel;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class LocalVerifyRequest {
    @NotBlank
    @Pattern(regexp = "^[A-Z0-9]{5,20}$", message = "Chassis number must be 5-20 alphanumeric characters only")
    private String chassisNumber;

    @NotBlank
    @Pattern(regexp = "^[A-Z0-9 ]{1,20}$", message = "Plate number contains invalid characters")
    private String plateNumber;

    @NotNull
    private PlateType plateType;

    @NotNull
    private TeslaModel teslaModel;
}
