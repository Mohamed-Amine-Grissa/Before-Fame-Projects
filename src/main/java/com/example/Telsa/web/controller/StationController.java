package com.example.Telsa.web.controller;

import com.example.Telsa.domain.model.TeslaModel;
import com.example.Telsa.domain.service.ChargingStationService;
import com.example.Telsa.web.dto.response.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/stations")
@SecurityRequirement(name = "bearerAuth")
@RequiredArgsConstructor
public class StationController {

    private final ChargingStationService chargingStationService;

    @GetMapping("/nearby")
    @Operation(summary = "Get nearby charging stations")
    public ResponseEntity<ApiResponse<List<ChargingStationService.StationDto>>> nearby(
            @RequestParam double lat,
            @RequestParam double lng,
            @RequestParam TeslaModel teslaModel,
            @RequestParam(required = false) Integer modelYear) {
        List<ChargingStationService.StationDto> stations = chargingStationService.getNearbyStations(
                lat,
                lng,
                teslaModel,
                modelYear
        );
        return ResponseEntity.ok(ApiResponse.ok("Stations found", stations));
    }
}
