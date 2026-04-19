package com.example.Telsa.domain.service;

import com.example.Telsa.domain.model.ChargingPortType;
import com.example.Telsa.domain.model.TeslaModel;
import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.EnumSet;
import java.util.List;

@Service
public class ChargingStationService {

    private final List<StationDefinition> stations = new ArrayList<>();

    @PostConstruct
    void initStations() {
        stations.add(new StationDefinition(
                "TotalEnergies Charger - Tunis Centre",
                "Av. Habib Bourguiba, Tunis",
                36.8190,
                10.1658,
                List.of(ChargingPortType.CCS2, ChargingPortType.J1772)
        ));
        stations.add(new StationDefinition(
                "Shell Recharge - La Marsa",
                "Route de La Marsa, Tunis",
                36.8878,
                10.3250,
                List.of(ChargingPortType.CCS2, ChargingPortType.J1772)
        ));
        stations.add(new StationDefinition(
                "EV Station - Lac 1",
                "Les Berges du Lac, Tunis",
                36.8326,
                10.2306,
                List.of(ChargingPortType.CCS2, ChargingPortType.CHADEMO, ChargingPortType.J1772)
        ));
        stations.add(new StationDefinition(
                "Carthage Charging Hub",
                "Carthage, Tunis",
                36.8528,
                10.3236,
                List.of(ChargingPortType.CCS2, ChargingPortType.J1772)
        ));
        stations.add(new StationDefinition(
                "Sfax EV Point",
                "Centre Sfax, Sfax",
                34.7406,
                10.7603,
                List.of(ChargingPortType.CCS2, ChargingPortType.J1772)
        ));
        stations.add(new StationDefinition(
                "Sousse Supercharge",
                "Sousse Centre, Sousse",
                35.8245,
                10.6346,
                List.of(ChargingPortType.NACS, ChargingPortType.CCS1, ChargingPortType.CCS2)
        ));
        stations.add(new StationDefinition(
                "Hammamet Resort Charger",
                "Hammamet Nord, Nabeul",
                36.4000,
                10.6167,
                List.of(ChargingPortType.CCS2, ChargingPortType.J1772)
        ));
        stations.add(new StationDefinition(
                "Djerba Airport Charger",
                "Aeroport Djerba, Medenine",
                33.8754,
                10.7754,
                List.of(ChargingPortType.CCS2, ChargingPortType.CHADEMO)
        ));
    }

    public List<ChargingPortType> getCompatiblePorts(TeslaModel model, Integer modelYear) {
        return switch (model) {
            case MODEL_3, MODEL_Y -> List.of(ChargingPortType.CCS2, ChargingPortType.J1772);
            case MODEL_S, MODEL_X -> modelYear != null && modelYear < 2022
                    ? List.of(ChargingPortType.CHADEMO, ChargingPortType.J1772)
                    : List.of(ChargingPortType.CCS2, ChargingPortType.J1772);
            case CYBERTRUCK -> List.of(ChargingPortType.NACS, ChargingPortType.CCS1);
        };
    }

    public List<StationDto> getNearbyStations(double lat, double lng, TeslaModel teslaModel, Integer modelYear) {
        List<ChargingPortType> compatiblePorts = getCompatiblePorts(teslaModel, modelYear);
        EnumSet<ChargingPortType> compatibleSet = EnumSet.copyOf(compatiblePorts);
        List<StationDto> results = new ArrayList<>();

        for (StationDefinition station : stations) {
            if (!hasAnyCompatiblePort(station.compatiblePorts(), compatibleSet)) {
                continue;
            }

            double distanceKm = haversine(lat, lng, station.lat(), station.lng());
            results.add(new StationDto(
                    station.name(),
                    station.address(),
                    station.lat(),
                    station.lng(),
                    station.compatiblePorts(),
                    distanceKm
            ));
        }

        results.sort(Comparator.comparingDouble(StationDto::distanceKm));
        return results;
    }

    private boolean hasAnyCompatiblePort(List<ChargingPortType> stationPorts, EnumSet<ChargingPortType> compatible) {
        for (ChargingPortType port : stationPorts) {
            if (compatible.contains(port)) {
                return true;
            }
        }
        return false;
    }

    private double haversine(double lat1, double lon1, double lat2, double lon2) {
        double earthRadius = 6371.0;
        double dLat = Math.toRadians(lat2 - lat1);
        double dLon = Math.toRadians(lon2 - lon1);
        double a = Math.pow(Math.sin(dLat / 2), 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.pow(Math.sin(dLon / 2), 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return earthRadius * c;
    }

    private record StationDefinition(String name,
                                     String address,
                                     double lat,
                                     double lng,
                                     List<ChargingPortType> compatiblePorts) {
    }

    public record StationDto(String name,
                             String address,
                             double lat,
                             double lng,
                             List<ChargingPortType> compatiblePorts,
                             double distanceKm) {
    }
}
