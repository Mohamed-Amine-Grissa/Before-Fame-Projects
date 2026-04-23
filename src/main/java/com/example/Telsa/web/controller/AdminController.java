package com.example.Telsa.web.controller;

import com.example.Telsa.domain.model.ErpTeslaLocal;
import com.example.Telsa.domain.model.VehicleOrigin;
import com.example.Telsa.infrastructure.adapters.db.ErpTeslaForeignRepository;
import com.example.Telsa.infrastructure.adapters.db.ErpTeslaLocalRepository;
import com.example.Telsa.infrastructure.adapters.db.UserRepository;
import com.example.Telsa.web.dto.request.AdminLocalErpRequest;
import com.example.Telsa.web.dto.response.AdminStatsResponse;
import com.example.Telsa.web.dto.response.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final UserRepository userRepository;
    private final ErpTeslaLocalRepository erpTeslaLocalRepository;
    private final ErpTeslaForeignRepository erpTeslaForeignRepository;

    @GetMapping("/users")
    @Operation(summary = "List users")
    public ResponseEntity<ApiResponse<Page<?>>> listUsers(@RequestParam(defaultValue = "0") int page) {
        Page<?> users = userRepository.findAll(PageRequest.of(page, 20));
        return ResponseEntity.ok(ApiResponse.ok("Users retrieved", users));
    }

    @GetMapping("/users/{id}")
    @Operation(summary = "Get user by id")
    public ResponseEntity<ApiResponse<?>> getUser(@PathVariable UUID id) {
        var user = userRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
        return ResponseEntity.ok(ApiResponse.ok("User found", user));
    }

    @DeleteMapping("/users/{id}")
    @Operation(summary = "Delete user")
    public ResponseEntity<ApiResponse<Void>> deleteUser(@PathVariable UUID id) {
        var user = userRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
        userRepository.delete(user);
        return ResponseEntity.ok(ApiResponse.ok("User deleted."));
    }

    @GetMapping("/stats")
    @Operation(summary = "Get admin stats")
    public ResponseEntity<ApiResponse<AdminStatsResponse>> stats() {
        long totalUsers = userRepository.count();
        long verifiedUsers = userRepository.countByVerifiedTrue();
        long localVehicles = userRepository.countByVehicleOrigin(VehicleOrigin.LOCAL);
        long foreignVehicles = userRepository.countByVehicleOrigin(VehicleOrigin.FOREIGN);

        Map<String, Long> usersByModel = new HashMap<>();
        for (Object[] row : userRepository.countByTeslaModel()) {
            if (row.length >= 2 && row[0] != null && row[1] != null) {
                usersByModel.put(row[0].toString(), ((Number) row[1]).longValue());
            }
        }

        var response = new AdminStatsResponse(totalUsers, verifiedUsers, localVehicles, foreignVehicles, usersByModel);
        return ResponseEntity.ok(ApiResponse.ok("Stats retrieved", response));
    }

    @PostMapping("/erp/local")
    @Operation(summary = "Add local ERP vehicle")
    public ResponseEntity<ApiResponse<ErpTeslaLocal>> addLocalErp(@RequestBody AdminLocalErpRequest request) {
        if (erpTeslaLocalRepository.existsByChassisNumber(request.chassisNumber())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Vehicle already exists");
        }

        ErpTeslaLocal saved = erpTeslaLocalRepository.save(ErpTeslaLocal.builder()
                .chassisNumber(request.chassisNumber())
                .plateNumber(request.plateNumber())
                .plateType(request.plateType())
                .teslaModel(request.teslaModel())
                .build());

        return ResponseEntity.ok(ApiResponse.ok("Vehicle added to local ERP.", saved));
    }
}

