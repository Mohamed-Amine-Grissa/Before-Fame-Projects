package com.example.Telsa.infrastructure.adapters.db;

import com.example.Telsa.domain.model.ErpTeslaForeign;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface ErpTeslaForeignRepository extends JpaRepository<ErpTeslaForeign, UUID> {
    boolean existsByChassisNumber(String chassisNumber);
    Optional<ErpTeslaForeign> findByChassisNumber(String chassisNumber);
}

