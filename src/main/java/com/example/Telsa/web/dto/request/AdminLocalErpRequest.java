package com.example.Telsa.web.dto.request;

import com.example.Telsa.domain.model.PlateType;
import com.example.Telsa.domain.model.TeslaModel;

public record AdminLocalErpRequest(
        String chassisNumber,
        String plateNumber,
        PlateType plateType,
        TeslaModel teslaModel
) {
}

