# Frontend Project Context (React / Vite)

## Project Overview
- **Name:** Telsa Charging Points Frontend
- **Framework:** React 19 / Vite
- **Language:** TypeScript
- **Styling:** Tailwind CSS (v4), `clsx`, `tailwind-merge`
- **Key Integrations:** 
  - Mapbox GL / `react-map-gl` (for visual map networks)
  - Google GenAI (for Gemini integrations)
  - `motion` (by Framer Motion) for UI animations
  - Lucide React (for Icons)

## Application Architecture
The application represents a Single Page Application (SPA), heavily driven by a multi-step workflow.

### 1. Verification Flow UI (`App.tsx`)
The frontend defines a `Step`-based wizard structure to onboard/verify vehicles before accessing properties like charging grids.
- **Steps:** 
  - `origin`: Select vehicle origin (Local vs Foreign).
  - `vehicle`: Enter/Verify vehicle details.
  - `identity`: Collect user identifying information.
  - `verify`: OTP validation.
  - `finish`: Completion summary.
  - `maps`: Network viewing using Mapbox.
- **Components:** Contains visually rich animations (`AnimatePresence`, custom `MagneticBtn` abstractions) for deep UI/UX focus. Uses Framer Motion for layout transitions.

### 2. Services (`services/api.ts`)
Encapsulates backend interactions, mapping precisely to the endpoints exposed in `SecurityConfig.java`.
- Abstracted `apiService` handles cross-origin HTTP calls.
- Integrates with Spring Boot backend domain logic (Auth, verification, OTP requests, and user registration).

### 3. Types and Interfaces (`types/api.ts`)
Strong typing enforces consistency with payload specs in the Java backend. 
- Aligns with backend representations of `LocalVerifyRequest`, `ForeignVerifyRequest`, `LoginRequest`, `SendOtpRequest`, `VerifyOtpRequest`, and `RegisterRequest`.

### 4. Environment & Keys
- Leverages Vite's `process.env.VITE_*` variable patterns natively injected.
- **Dependencies:** Google GenAI SDK (`VITE_GEMINI_API_KEY`) and Mapbox SDK (`VITE_MAPBOX_TOKEN`).

## Development Scripts
- `npm run dev`: Boots Vite dev server locally.
- `npm run build`: Generates production bundle.
- `npm run lint`: Validates TS code.

## Related Documentation Context
The `frontend/` root hosts multiple implementation blueprints:
- `ARCHITECTURE_DIAGRAM.md`
- `COORDINATES_REFERENCE.md`
- `LOCATION_STATS_IMPLEMENTATION.md`
- `MAPBOX_SETUP.md`
- `QUICK_START_LOCATIONS.md`
- `QUICK_TEST_GUIDE.md`

*(Note for Claude: Refer to `Backend.md` to see the REST targets natively complementing `api.ts`.)*
