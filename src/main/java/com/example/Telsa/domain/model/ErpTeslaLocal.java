package com.example.Telsa.domain.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "erp_tesla_local")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ErpTeslaLocal {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(unique = true, nullable = false)
    private String chassisNumber;

    @Column(nullable = false)
    private String plateNumber;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PlateType plateType;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TeslaModel teslaModel;

    @Column(updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    private void onCreate() {
        createdAt = LocalDateTime.now();
    }
}

