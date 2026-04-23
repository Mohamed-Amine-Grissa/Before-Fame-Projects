package com.example.Telsa.web.dto.request;

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
public class ForeignVerifyRequest {
    @NotBlank
    @Pattern(regexp = "^[A-Z0-9]{5,20}$", message = "Chassis number must be 5-20 alphanumeric characters only")
    private String chassisNumber;

    @NotNull
    private TeslaModel teslaModel;
}
