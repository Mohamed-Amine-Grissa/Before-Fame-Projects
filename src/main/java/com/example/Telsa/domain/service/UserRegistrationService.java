package com.example.Telsa.domain.service;

import com.example.Telsa.domain.model.ErpTeslaForeign;
import com.example.Telsa.domain.model.ErpTeslaLocal;
import com.example.Telsa.domain.model.User;
import com.example.Telsa.domain.model.VehicleOrigin;
import com.example.Telsa.infrastructure.adapters.db.ErpTeslaForeignRepository;
import com.example.Telsa.infrastructure.adapters.db.ErpTeslaLocalRepository;
import com.example.Telsa.infrastructure.adapters.db.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserRegistrationService {

    private final UserRepository userRepository;
    private final VehicleVerificationService vehicleVerificationService;
    private final BCryptPasswordEncoder passwordEncoder;
    private final ErpTeslaLocalRepository erpTeslaLocalRepository;
    private final ErpTeslaForeignRepository erpTeslaForeignRepository;

    public User registerUser(UUID verificationToken,
                             String firstName,
                             String lastName,
                             String email,
                             String password,
                             String phoneNumber,
                             String countryCode) {
        var context = vehicleVerificationService.consumeToken(verificationToken);

        if (userRepository.existsByEmail(email)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already registered");
        }

        validatePhone(context.origin(), countryCode, phoneNumber);

        String hashedPassword = passwordEncoder.encode(password);

        User.UserBuilder builder = User.builder()
                .firstName(firstName)
                .lastName(lastName)
                .email(email)
                .password(hashedPassword)
                .phoneNumber(phoneNumber)
                .countryCode(countryCode)
                .verified(false)
                .vehicleOrigin(context.origin())
                .teslaModel(context.teslaModel());

        if (context.origin() == VehicleOrigin.LOCAL) {
            ErpTeslaLocal local = erpTeslaLocalRepository.findById(context.erpLocalId())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Local ERP record not found"));
            builder.erpLocal(local);
        } else {
            ErpTeslaForeign foreign = erpTeslaForeignRepository.findById(context.erpForeignId())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Foreign ERP record not found"));
            builder.erpForeign(foreign);
        }

        return userRepository.save(builder.build());
    }

    private void validatePhone(VehicleOrigin origin, String countryCode, String phoneNumber) {
        if (origin == VehicleOrigin.LOCAL) {
            if (!"+216".equals(countryCode) || phoneNumber == null || !phoneNumber.matches("^\\d{8}$")) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                        "Tunisian phone number must be 8 digits with country code +216");
            }
        } else {
            if (countryCode == null || phoneNumber == null
                    || !countryNumberMatches(phoneNumber)
                    || !countryCode.matches("^\\+\\d{1,3}$")) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid international phone number format");
            }
        }
    }

    private boolean countryNumberMatches(String phoneNumber) {
        return phoneNumber.matches("^\\d{7,15}$");
    }
}

