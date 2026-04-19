package com.example.Telsa.web.dto.request;

import com.example.Telsa.domain.model.PlateType;
import com.example.Telsa.domain.model.TeslaModel;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class LocalVerifyRequest {
    @NotBlank
    private String chassisNumber;

    @NotBlank
    private String plateNumber;

    @NotNull
    private PlateType plateType;

    @NotNull
    private TeslaModel teslaModel;
}

