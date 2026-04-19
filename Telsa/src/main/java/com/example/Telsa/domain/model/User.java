package com.example.Telsa.domain.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
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
@Table(name = "users")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(nullable = false)
    private String firstName;

    @Column(nullable = false)
    private String lastName;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private String phoneNumber;

    @Column(nullable = false)
    private String countryCode;

    @Column(nullable = false)
    private boolean verified;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private VehicleOrigin vehicleOrigin;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TeslaModel teslaModel;

    @ManyToOne
    @JoinColumn(name = "erp_local_id")
    private ErpTeslaLocal erpLocal;

    @ManyToOne
    @JoinColumn(name = "erp_foreign_id")
    private ErpTeslaForeign erpForeign;

    @Column(updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    private void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
