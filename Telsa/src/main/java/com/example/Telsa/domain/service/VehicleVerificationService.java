package com.example.Telsa.domain.service;

import com.example.Telsa.domain.model.ErpTeslaForeign;
import com.example.Telsa.domain.model.ErpTeslaLocal;
import com.example.Telsa.domain.model.PlateType;
import com.example.Telsa.domain.model.TeslaModel;
import com.example.Telsa.domain.model.VehicleOrigin;
import com.example.Telsa.domain.ports.FileStorage;
import com.example.Telsa.infrastructure.adapters.db.ErpTeslaForeignRepository;
import com.example.Telsa.infrastructure.adapters.db.ErpTeslaLocalRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Locale;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Service
@RequiredArgsConstructor
public class VehicleVerificationService {

    private static final int EXPIRATION_SECONDS = 600;

    private final ErpTeslaLocalRepository erpTeslaLocalRepository;
    private final ErpTeslaForeignRepository erpTeslaForeignRepository;
    private final FileStorage fileStorage;

    private final ConcurrentHashMap<UUID, VerificationContext> verificationSessions = new ConcurrentHashMap<>();

    public VerificationResult verifyLocalVehicle(String chassisNumber,
                                                 String plateNumber,
                                                 PlateType plateType,
                                                 TeslaModel teslaModel) {
        String normalizedChassis = normalizeChassis(chassisNumber);
        String normalizedPlate = normalizePlate(plateNumber);

        validatePlate(plateType, normalizedPlate);

        ErpTeslaLocal record = erpTeslaLocalRepository.findByChassisNumber(normalizedChassis)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "Vehicle not found in local ERP. Check chassis number."));

        String erpPlate = normalizePlate(record.getPlateNumber());
        if (!erpPlate.equals(normalizedPlate)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Plate number does not match ERP record");
        }

        if (record.getTeslaModel() != teslaModel) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Tesla model does not match ERP record");
        }

        UUID verificationToken = UUID.randomUUID();
        verificationSessions.put(verificationToken, new VerificationContext(
                record.getId(), null, teslaModel, VehicleOrigin.LOCAL, Instant.now().plusSeconds(EXPIRATION_SECONDS)));

        return new VerificationResult(verificationToken, EXPIRATION_SECONDS);
    }

    public VerificationResult verifyForeignVehicle(String chassisNumber,
                                                   TeslaModel teslaModel,
                                                   MultipartFile carteGrise) {
        String normalizedChassis = normalizeChassis(chassisNumber);

        if (erpTeslaForeignRepository.existsByChassisNumber(normalizedChassis)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Vehicle already registered");
        }

        String originalName = carteGrise.getOriginalFilename();
        String extension = originalName == null ? "" : originalName.substring(originalName.lastIndexOf('.') + 1);
        String ext = extension.toLowerCase(Locale.ROOT);
        if (!(ext.equals("jpg") || ext.equals("jpeg") || ext.equals("png") || ext.equals("pdf"))) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid file type");
        }

        String storedPath;
        try {
            storedPath = fileStorage.store(carteGrise, "carte-grise/");
        } catch (IOException ex) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "File storage failed", ex);
        }

        ErpTeslaForeign saved = erpTeslaForeignRepository.save(ErpTeslaForeign.builder()
                .chassisNumber(normalizedChassis)
                .carteGrisePath(storedPath)
                .teslaModel(teslaModel)
                .build());

        UUID verificationToken = UUID.randomUUID();
        verificationSessions.put(verificationToken, new VerificationContext(
                null, saved.getId(), teslaModel, VehicleOrigin.FOREIGN, Instant.now().plusSeconds(EXPIRATION_SECONDS)));

        return new VerificationResult(verificationToken, EXPIRATION_SECONDS);
    }

    public VerificationContext consumeToken(UUID verificationToken) {
        VerificationContext context = verificationSessions.get(verificationToken);
        if (context == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Verification session not found or expired");
        }

        if (Instant.now().isAfter(context.expiresAt())) {
            verificationSessions.remove(verificationToken);
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Verification session has expired");
        }

        verificationSessions.remove(verificationToken);
        return context;
    }

    private String normalizeChassis(String chassisNumber) {
        return chassisNumber == null ? "" : chassisNumber.trim().toUpperCase();
    }

    private String normalizePlate(String plateNumber) {
        return plateNumber == null ? "" : plateNumber.trim().toUpperCase().replaceAll("\\s+", " ");
    }

    private void validatePlate(PlateType plateType, String plateNumber) {
        switch (plateType) {
            case TN -> {
                if (!plateNumber.matches("^\\d{1,3} TUN \\d{1,4}$")) {
                    throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid plate format for TN type");
                }
            }
            case RS -> {
                if (!plateNumber.matches("^\\d{6}$")) {
                    throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid plate format for RS type");
                }
            }
            case CD -> {
                if (!plateNumber.matches("^\\d{6}$")) {
                    throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid plate format for CD type");
                }
            }
        }
    }

    public record VerificationContext(UUID erpLocalId,
                                      UUID erpForeignId,
                                      TeslaModel teslaModel,
                                      VehicleOrigin origin,
                                      Instant expiresAt) {
    }
}
