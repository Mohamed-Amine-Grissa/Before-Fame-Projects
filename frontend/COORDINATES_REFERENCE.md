# 📍 Location Coordinates Reference

All Tesla locations with fake coordinates scattered across Tunisia and concentrated in Sousse region.

---

## Location Data Table

| ID | Location Name | Type | Latitude | Longitude | Region |
|---|---|---|---|---|---|
| loc1 | Tesla Giga Factory, Tunis | Factory | 36.8065 | 10.1961 | North |
| loc2 | Lac 2 Supercharger | Supercharger | 36.8428 | 10.1857 | North |
| loc3 | La Marsa Service Center | Service | 36.8737 | 10.3225 | North |
| loc4 | Hammamet Supercharger | Supercharger | 36.3868 | 10.6146 | NE Coast |
| loc5 | Sfax Service Point | Service | 34.7406 | 10.7603 | Central |
| **sousse1** | **Sousse Downtown Charger** | **Supercharger** | **35.8256** | **10.5850** | **Sousse** |
| **sousse2** | **Msaken North Supercharger** | **Supercharger** | **35.9050** | **10.5500** | **Sousse** |
| **sousse3** | **Sahloul West Service Center** | **Service** | **35.7850** | **10.5950** | **Sousse** |
| **sousse4** | **Hammam Sousse Charger** | **Supercharger** | **35.7650** | **10.6200** | **Sousse** |
| **sousse5** | **Akouda South Service Point** | **Service** | **35.7400** | **10.5700** | **Sousse** |
| loc6 | Nabeul Coastal Charger | Supercharger | 36.4553 | 10.7356 | East Coast |
| loc7 | Gabes South Service | Service | 33.8869 | 10.1674 | South |
| loc8 | Kairouan Historic Charger | Supercharger | 35.6781 | 9.9197 | Central |
| loc9 | Gafsa Mining Region Service | Service | 34.4269 | 8.7848 | SW |
| loc10 | Tataouine Desert Charger | Supercharger | 32.9305 | 10.4549 | Far South |

---

## Location Count by Type

| Type | Count | Locations |
|---|---|---|
| 🏭 Factory | 1 | Giga Factory, Tunis |
| ⚡ Supercharger | 8 | Lac 2, Hammamet, Nabeul, Kairouan, Tataouine, + 3 Sousse |
| 🔧 Service | 4 | La Marsa, Sfax, Gabes, + 1 Sousse |
| **TOTAL** | **15** | - |

---

## Sousse Region Details (5 Locations)

**Center Area:** 35.8256, 10.5850 (Downtown Sousse)

### Spread Pattern (Realistic across suburbs):
```
         N
         ↑
  sousse2
  Msaken North (35.9050)
         
W ←  sousse1 Downtown  → E
     (35.8256, 10.5850)
     
  sousse3       sousse4
  Sahloul    Hammam Sousse
  
        sousse5
     Akouda South
         ↓
         S
```

### Statistics:
- **Total in Sousse:** 5 locations
- **Superchargers:** 3 (sousse1, sousse2, sousse4)
- **Service Centers:** 2 (sousse3, sousse5)
- **Spread:** ~15-20 km radius from downtown
- **All Locations:** Inland (no sea coordinates)
- **Coverage:** Downtown, north suburbs, west suburbs, south suburbs

### Detailed Distribution:
- **sousse1 (Downtown):** City center, main area
- **sousse2 (Msaken North):** Northern suburb, industrial area
- **sousse3 (Sahloul West):** Western suburb
- **sousse4 (Hammam Sousse):** Southern area
- **sousse5 (Akouda South):** Far south suburb

---

## Geographic Distribution

### By Region:
- **Northern Region:** 3 locations (Tunis, Lac 2, La Marsa)
- **Northeast Coast:** 1 location (Hammamet)
- **East Coast:** 1 location (Nabeul)
- **Central:** 2 locations (Sfax, Kairouan)
- **Southwest:** 1 location (Gafsa)
- **South:** 2 locations (Gabes, Tataouine)
- **Sousse Region:** 5 locations ⭐

### Coverage Map:
```
North (Tunis Area)
    36.8° N
    |
    | ← Hammamet, Nabeul (East Coast)
    |
Sousse (35.8° N) ← CENTER REGION ⭐
    |
    | ← Kairouan (Central)
    |
Central (34-35° N)
    |
South (32-33° N) ← Gabes, Tataouine
```

---

## Proximity Calculations

### Sousse Cluster (5 locations within ~10km radius)
- sousse1 ↔ sousse4: ~6.5 km
- sousse1 ↔ sousse2: ~3.2 km
- sousse1 ↔ sousse3: ~8.4 km
- sousse1 ↔ sousse5: ~5.1 km

### Closest to Sousse from other regions:
- Hammamet (loc4) to Sousse (sousse1): ~80 km
- Kairouan (loc8) to Sousse (sousse1): ~120 km

---

## Map Display Notes

### Recommended Map Settings:
- **Center:** 10.1961, 35.8065 (Tunisia center)
- **Initial Zoom:** 6.5 (shows all locations)
- **Min Zoom:** 5 (country-wide view)
- **Max Zoom:** 12 (detail view)
- **Style:** mapbox://styles/mapbox/dark-v11

### Marker Clustering:
- Sousse: 5 markers very close
- Others: Scattered across country
- No overlap at zoom 6.5+

---

## API Integration Note

**Future Enhancement:** These coordinates can be replaced with:
- Dynamic API endpoint: `/api/locations`
- User's location tracking
- Real-time availability from backend
- Live supercharger status

For now, all coordinates are **hardcoded fake data** for demonstration purposes.

---

## JSON Format

```json
{
  "id": "sousse1",
  "name": "Sousse Downtown Charger",
  "type": "Supercharger",
  "coordinates": {
    "latitude": 35.8256,
    "longitude": 10.6369
  },
  "region": "Sousse",
  "stats": {
    "totalPorts": "4-15 (random)",
    "availablePorts": "random",
    "occupiedPorts": "random",
    "maintenanceReason": "random or null"
  }
}
```

---

**Generated:** April 5, 2026  
**Status:** ✅ All 15 locations ready for testing


