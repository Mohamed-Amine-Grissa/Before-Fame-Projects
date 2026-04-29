# Telsa Charging Points

![Java](https://img.shields.io/badge/Java-25-orange?logo=openjdk&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-4.0.4-brightgreen?logo=springboot&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-4169E1?logo=postgresql&logoColor=white)
![Maven](https://img.shields.io/badge/Maven-4.0-C71A36?logo=apachemaven&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-6.2-646CFF?logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.1-06B6D4?logo=tailwindcss&logoColor=white)
![JWT](https://img.shields.io/badge/Auth-JWT-black?logo=jsonwebtokens&logoColor=white)
![Twilio](https://img.shields.io/badge/SMS-Twilio-F22F46?logo=twilio&logoColor=white)
![Mapbox](https://img.shields.io/badge/Maps-Mapbox-000000?logo=mapbox&logoColor=white)
![Swagger](https://img.shields.io/badge/Docs-OpenAPI_3-85EA2D?logo=swagger&logoColor=black)

**Telsa Charging Points** is a full-stack platform built exclusively for verified Tesla owners in Tunisia. It combines vehicle identity verification, secure multi-factor authentication, and an interactive map of EV charging stations — all wrapped in a carefully crafted editorial UI.

The system enforces a deliberate onboarding flow: before a user can create an account, their vehicle must be verified against a local ERP registry (or a submitted *carte grise* for foreign vehicles). This gate ensures that only genuine Tesla owners gain access to the charging network.

---

## Features

- **Vehicle Verification Gate** — users must verify their Tesla (local or foreign) before registering. Local vehicles are checked against an internal ERP database by chassis and plate number. Foreign vehicles submit a *carte grise* document for review.
- **Two-Factor Authentication** — login triggers a 6-digit OTP delivered via Twilio SMS, with per-attempt retry tracking, 42-second cooldown timers, and a rate-limit lockout screen.
- **JWT Auth with Refresh Token Rotation** — stateless access tokens (15-minute TTL) paired with rotating refresh tokens (7-day TTL). Refresh tokens are SHA-256 hashed in the database.
- **Email Verification** — newly registered accounts receive a confirmation link via SMTP before being activated.
- **Charging Station Finder** — geolocation-aware station lookup using the Haversine formula. Results are filtered by Tesla model compatibility (CCS2, NACS, CHAdeMO, J1772, CCS1) and sorted by distance.
- **Account Lockout** — after 5 failed login attempts, an account is locked for 15 minutes with an audit trail entry.
- **IP-Based Rate Limiting** — sliding-window rate limiter (10 attempts / 60 minutes per IP) guards vehicle verification and auth endpoints.
- **Admin Dashboard** — role-protected panel for user management, ERP population, stats breakdown by model/origin, and user deletion.
- **Audit Logging** — structured audit log (`telsa-audit.log`) captures auth events, OTP activity, vehicle verifications, and account locks.
- **File Upload** — foreign vehicle *carte grise* documents are uploaded (up to 10 MB) and stored locally with UUID-named files.
- **Interactive Map** — Mapbox GL-powered station map with animated UI transitions (Framer Motion / `motion`), showing live compatibility for the user's specific Tesla model and year.
- **OpenAPI / Swagger UI** — full API documentation auto-generated via SpringDoc, accessible at `/swagger-ui.html`.
- **Flyway Migrations** — database schema versioned and applied automatically on startup.

---

## Tech Stack

### Backend

| Layer | Technology |
|---|---|
| Language | Java 25 |
| Framework | Spring Boot 4.0.4 |
| Build | Maven 4 (wrapper included) |
| Database | PostgreSQL (JPA / Hibernate) |
| Migrations | Flyway |
| Security | Spring Security · JWT (jjwt 0.12.3) · BCrypt |
| SMS | Twilio SDK 11.3.5 |
| Email | Spring Mail (SMTP / Gmail) |
| API Docs | SpringDoc OpenAPI 3.0.2 |
| Monitoring | Spring Actuator |
| Code Generation | Lombok |
| Testing | JUnit · H2 (in-memory for tests) |

### Frontend

| Layer | Technology |
|---|---|
| Language | TypeScript 5.8 |
| Framework | React 19 |
| Bundler | Vite 6.2 |
| Styling | Tailwind CSS 4.1 · clsx · tailwind-merge |
| Maps | Mapbox GL 3.21 · react-map-gl 8.1 |
| Animation | motion (Framer Motion) 12.23 |
| Icons | Lucide React |
| AI Integration | Google GenAI SDK (`@google/genai`) |

---

## Architecture

The backend follows **Domain-Driven Design (DDD)** with three cleanly separated layers:

```
┌─────────────────────────────────────────────────────┐
│                   Web Layer (REST)                   │
│  AuthController · OtpController · VehicleController  │
│  StationController · AdminController                 │
│  GlobalExceptionHandler · DTOs (Request/Response)    │
└───────────────────┬─────────────────────────────────┘
                    │
┌───────────────────▼─────────────────────────────────┐
│                  Domain Layer                        │
│  AuthService · OtpService · LockService              │
│  RateLimiterService · VehicleVerificationService     │
│  UserRegistrationService · EmailVerificationService  │
│  Ports: EmailSender · OtpSender · FileStorage        │
└───────────────────┬─────────────────────────────────┘
                    │
┌───────────────────▼─────────────────────────────────┐
│               Infrastructure Layer                  │
│  JPA Repositories · TwilioOtpSender                  │
│  SmtpEmailSender · LocalFileStorage                  │
│  JwtAuthFilter · JwtService · SecurityConfig         │
│  AuditLogger · Flyway · EnvValidationConfig          │
└─────────────────────────────────────────────────────┘
```

The frontend is a **React SPA** with a custom client-side router. Navigation is handled by a `path` state variable with page-wipe transitions. The API client layer (`services/api.js`) handles JWT injection, automatic token refresh on 401, and typed error propagation via `ApiError`.

---

## Project Structure

```
Telsa/
├── src/
│   └── main/
│       ├── java/com/example/Telsa/
│       │   ├── TelsaApplication.java
│       │   ├── domain/
│       │   │   ├── exception/          # AccountLockedException, RateLimitExceededException, ...
│       │   │   ├── model/              # User, ErpTeslaLocal, ErpTeslaForeign, TeslaModel, ...
│       │   │   ├── ports/              # EmailSender, OtpSender, FileStorage (interfaces)
│       │   │   └── service/            # AuthService, OtpService, LockService, ...
│       │   ├── infrastructure/
│       │   │   ├── adapters/
│       │   │   │   ├── db/             # JPA repositories
│       │   │   │   ├── email/          # SmtpEmailSender
│       │   │   │   ├── sms/            # TwilioOtpSender
│       │   │   │   └── storage/        # LocalFileStorage
│       │   │   └── config/             # SecurityConfig, JwtService, JwtAuthFilter, AuditLogger
│       │   └── web/
│       │       ├── controller/         # AuthController, OtpController, VehicleController, ...
│       │       ├── dto/
│       │       │   ├── request/        # LoginRequest, RegisterRequest, LocalVerifyRequest, ...
│       │       │   └── response/       # ApiResponse, LoginResponse, AdminStatsResponse, ...
│       │       └── exception/          # GlobalExceptionHandler
│       └── resources/
│           ├── application.properties
│           └── db/migration/           # Flyway SQL scripts
├── frontend/
│   ├── src/
│   │   ├── App.tsx                     # Client-side router + layout
│   │   ├── pages/
│   │   │   ├── Landing.jsx             # Public landing page
│   │   │   ├── Auth.jsx                # Register, Login, OTP, Locked state
│   │   │   ├── Verify.jsx              # Vehicle verification wizard
│   │   │   ├── AppShell.jsx            # Dashboard, Stations, Account
│   │   │   └── Admin.jsx               # Admin panel
│   │   ├── components/
│   │   │   └── primitives.jsx          # Input, Button, Cursor, PageWipe
│   │   ├── services/
│   │   │   ├── api.js                  # Typed API client with auto-refresh
│   │   │   └── auth.js                 # Token persistence helpers
│   │   ├── styles/
│   │   │   ├── tokens.css              # Design tokens (CSS variables)
│   │   │   └── keyframes.css           # Animation keyframes
│   │   └── types/
│   │       └── api.ts                  # TypeScript payload types
│   ├── vite.config.ts
│   └── package.json
├── diagrammes/
│   ├── 01_use_case.puml
│   ├── 02_class_diagram.puml
│   ├── 03_sequence_diagram.puml
│   └── rendus/                         # Rendered PNG/SVG diagrams
├── pom.xml
├── .env.example
└── mvnw
```

---

## Getting Started

### Prerequisites

- Java 25 (or 21 LTS as a compatible alternative)
- Maven 4+ (or use the included `./mvnw` wrapper)
- PostgreSQL running locally
- Node.js 20+
- A Twilio account with a verified phone number
- A Gmail App Password (or any SMTP provider)

### 1. Clone the repository

```bash
git clone https://github.com/your-username/telsa.git
cd telsa
```

### 2. Configure environment variables

Copy `.env.example` and fill in your credentials:

```bash
cp .env.example .env
```

Set the variables in your shell or `.env` file (see [Environment Variables](#environment-variables) below).

### 3. Set up the database

```sql
CREATE DATABASE "TelsaDB";
```

Flyway will apply migrations automatically on first startup.

### 4. Run the backend

```bash
./mvnw spring-boot:run
```

The API will be available at `http://localhost:8080`.
Swagger UI is at `http://localhost:8080/swagger-ui.html`.

### 5. Run the frontend

```bash
cd frontend
npm install
npm run dev
```

The app will be available at `http://localhost:3000`. The Vite dev server proxies `/api` calls to the Spring Boot backend.

### 6. Build for production

```bash
# Backend
./mvnw clean package

# Frontend
cd frontend && npm run build
```

---

## Environment Variables

### Backend (`.env` or shell exports)

```env
# Database
DB_URL=jdbc:postgresql://localhost:5432/TelsaDB
DB_USERNAME=TelsaDB
DB_PASSWORD=your_db_password

# JWT
JWT_SECRET=your_256_bit_base64_encoded_secret_here
JWT_ACCESS_EXPIRATION_MINUTES=15
JWT_REFRESH_EXPIRATION_DAYS=7

# Twilio (SMS / OTP)
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=+1234567890

# Email (SMTP)
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your_email@gmail.com
MAIL_PASSWORD=your_app_password

# Application
APP_BASE_URL=http://localhost:8080

# Mapbox (also used by backend for station token passing)
MapBox_API_Token=pk.eyJ1IjoiLi4uIn0...
```

### Frontend (`frontend/.env.local`)

```env
VITE_API_BASE=http://localhost:8080
VITE_MAPBOX_TOKEN=pk.eyJ1IjoiLi4uIn0...
GEMINI_API_KEY=your_gemini_api_key
```

---

## API Reference

All responses share a consistent envelope:

```json
{
  "success": true,
  "message": "Human-readable description",
  "data": { ... },
  "timestamp": "2026-04-29T10:00:00Z"
}
```

### Vehicle Verification (public)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/vehicles/verify/local` | Verify a local Tesla by chassis + plate number |
| `POST` | `/api/vehicles/verify/foreign` | Verify a foreign Tesla with *carte grise* upload |

### Authentication (public)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/register` | Register a new account (requires verification token) |
| `POST` | `/api/auth/login` | Login and trigger OTP delivery |
| `GET` | `/api/auth/verify-email` | Confirm email address via token |
| `POST` | `/api/auth/refresh` | Rotate access + refresh tokens |
| `POST` | `/api/auth/logout` | Revoke all refresh tokens |

### OTP (public)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/otp/send` | Send OTP to a user |
| `POST` | `/api/otp/verify` | Verify a 6-digit OTP and receive JWT tokens |
| `POST` | `/api/otp/resend` | Resend OTP (subject to rate limiting) |

### Charging Stations (authenticated)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/stations/nearby?lat=&lng=&teslaModel=&modelYear=` | Get compatible nearby stations |

### Admin (ROLE_ADMIN only)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/admin/users` | List all users (paginated) |
| `GET` | `/api/admin/users/{id}` | Get user by ID |
| `DELETE` | `/api/admin/users/{id}` | Delete a user |
| `GET` | `/api/admin/stats` | Platform statistics |
| `POST` | `/api/admin/erp/local` | Add a vehicle to the local ERP |

Full interactive documentation is available at `/swagger-ui.html` when the backend is running.

---

## Security Overview

- **Stateless sessions** — no server-side session state; every request carries a JWT.
- **BCrypt password hashing** — industry-standard adaptive hashing.
- **Refresh token hashing** — refresh tokens are stored as SHA-256 hashes; the raw token is only ever in transit.
- **OTP expiry** — codes expire after 5 minutes with a maximum of 3 attempts before lockout.
- **Account lockout** — 5 failed login attempts triggers a 15-minute lock with an audit entry.
- **IP rate limiting** — 10 attempts per 60-minute sliding window on sensitive endpoints.
- **Security headers** — HSTS (1 year, includeSubDomains), X-Content-Type-Options, X-Frame-Options (DENY).
- **Environment-only secrets** — no credentials are committed to code; all sensitive values are injected via environment variables.
- **Production note** — the app is designed to sit behind an Nginx reverse proxy with SSL termination.

---

## Roadmap

- **Docker Compose setup** — containerize the backend, frontend, and PostgreSQL for one-command local development.
- **Persistent rate limiting** — move the in-memory rate limiter and lock service to Redis for multi-instance deployments.
- **Admin role assignment** — expose an endpoint to promote/demote users, rather than managing roles directly in the database.
- **Push notifications** — notify users when a nearby station becomes available or when their account status changes.
- **Foreign vehicle review workflow** — build a dedicated admin UI for reviewing and approving uploaded *cartes grises*.
- **Real-time station availability** — integrate with live charging network APIs to reflect actual connector availability.
- **Mobile app** — React Native client sharing the same API contract.
- **CI/CD pipeline** — GitHub Actions workflow for automated tests and deployment to a cloud provider (Railway, Render, or AWS).

---

## Design & Diagrams

UML diagrams are located in the `diagrammes/` folder:

- `01_use_case.puml` — use case diagram (Visitor, Owner, Admin actors)
- `02_class_diagram.puml` — domain model class diagram
- `03_sequence_diagram.puml` — auth + OTP sequence

Pre-rendered PNG and SVG versions are in `diagrammes/rendus/`.

---

## License

This project is currently unlicensed. All rights reserved by the author.
