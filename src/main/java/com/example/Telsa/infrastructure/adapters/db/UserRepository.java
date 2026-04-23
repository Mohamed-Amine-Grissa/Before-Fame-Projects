package com.example.Telsa.infrastructure.adapters.db;

import com.example.Telsa.domain.model.User;
import com.example.Telsa.domain.model.VehicleOrigin;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface UserRepository extends JpaRepository<User, UUID> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
    Optional<User> findById(UUID id);
    Optional<User> findByEmailVerifyToken(String emailVerifyToken);
    long countByVerifiedTrue();
    long countByVehicleOrigin(VehicleOrigin origin);

    @Query("SELECT u.teslaModel, COUNT(u) FROM User u GROUP BY u.teslaModel")
    List<Object[]> countByTeslaModel();
}
