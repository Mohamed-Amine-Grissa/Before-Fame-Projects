package com.example.Telsa.web.dto.response;

import java.util.Map;

public record AdminStatsResponse(
        long totalUsers,
        long verifiedUsers,
        long localVehicles,
        long foreignVehicles,
        Map<String, Long> usersByModel
) {
}

