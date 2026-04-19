package com.example.Telsa.infrastructure.config;

import com.example.Telsa.domain.model.ErpTeslaLocal;
import com.example.Telsa.domain.model.PlateType;
import com.example.Telsa.domain.model.TeslaModel;
import com.example.Telsa.infrastructure.adapters.db.ErpTeslaLocalRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class ErpTeslaLocalSeeder implements ApplicationRunner {

    private final ErpTeslaLocalRepository erpTeslaLocalRepository;

    @Override
    public void run(ApplicationArguments args) {
        List<SeedEntry> entries = List.of(
                new SeedEntry("5YJ3E1EA1JF000001", "101 TUN 1234", PlateType.TN, TeslaModel.MODEL_3),
                new SeedEntry("5YJ3E7EA9JF000002", "202 TUN 5678", PlateType.TN, TeslaModel.MODEL_Y),
                new SeedEntry("5YJSA1E29JF000003", "123456", PlateType.RS, TeslaModel.MODEL_S),
                new SeedEntry("5YJXCAE29JF000004", "654321", PlateType.RS, TeslaModel.MODEL_X),
                new SeedEntry("7G2CECFU5NF000005", "111111", PlateType.CD, TeslaModel.CYBERTRUCK),
                new SeedEntry("5YJ3E1EA2KF000006", "303 TUN 9999", PlateType.TN, TeslaModel.MODEL_3),
                new SeedEntry("5YJ3E7EA3KF000007", "404 TUN 1111", PlateType.TN, TeslaModel.MODEL_Y),
                new SeedEntry("5YJSA1E24KF000008", "789012", PlateType.RS, TeslaModel.MODEL_S),
                new SeedEntry("5YJXCAE25KF000009", "345678", PlateType.CD, TeslaModel.MODEL_X),
                new SeedEntry("7G2CECFU6NF000010", "222222", PlateType.CD, TeslaModel.CYBERTRUCK)
        );

        for (SeedEntry entry : entries) {
            if (erpTeslaLocalRepository.existsByChassisNumber(entry.chassisNumber())) {
                continue;
            }

            ErpTeslaLocal erpTeslaLocal = ErpTeslaLocal.builder()
                    .chassisNumber(entry.chassisNumber())
                    .plateNumber(entry.plateNumber())
                    .plateType(entry.plateType())
                    .teslaModel(entry.teslaModel())
                    .build();
            erpTeslaLocalRepository.save(erpTeslaLocal);
        }
    }

    private record SeedEntry(String chassisNumber, String plateNumber, PlateType plateType, TeslaModel teslaModel) {
    }
}

