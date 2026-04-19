package com.example.Telsa.infrastructure.adapters.db;

import com.example.Telsa.domain.model.ErpTeslaLocal;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface ErpTeslaLocalRepository extends JpaRepository<ErpTeslaLocal, UUID> {
    Optional<ErpTeslaLocal> findByChassisNumber(String chassisNumber);
    boolean existsByChassisNumber(String chassisNumber);
}
