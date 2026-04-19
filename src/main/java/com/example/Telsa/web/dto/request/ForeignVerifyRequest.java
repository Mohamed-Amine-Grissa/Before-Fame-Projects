package com.example.Telsa.web.dto.request;

import com.example.Telsa.domain.model.TeslaModel;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class ForeignVerifyRequest {
    @NotBlank
    private String chassisNumber;

    @NotNull
    private TeslaModel teslaModel;
}

