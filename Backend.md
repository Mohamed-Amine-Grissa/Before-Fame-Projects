# Backend Project Context (Spring Boot)

## Project Overview
- **Name:** Telsa Charging Points Backend
- **Framework:** Spring Boot (Java 25 per properties, though realistically Java 17/21 based on Spring Boot version 3.x/4.x logic)
- **Build Tool:** Maven

## Architecture & Structure
The project follows Domain-Driven Design (DDD) principles with cleanly separated layers.

### 1. Domain Layer (`domain/`)
Core business logic and entities mapping to the Telsa specific rules.
- **Models/Entities:** `User`, `ErpTeslaLocal`, `ErpTeslaForeign`, `TeslaModel`, `ChargingPortType`, `PlateType`, `VehicleOrigin`.
- **Services:** Handles core mechanics like `AuthService`, `ChargingStationService`, `LockService`, `OtpService`, `RateLimiterService`, `UserRegistrationService`, and `VehicleVerificationService`.
- **Ports:** `FileStorage`, `OtpSender` (interfaces implemented in the Infrastructure layer).

### 2. Infrastructure Layer (`infrastructure/`)
Contains actual DB adapters, 3rd party providers, and Security.
- **Repositories (JPA/DB):** `UserRepository`, `ErpTeslaLocalRepository`, `ErpTeslaForeignRepository`.
- **Adapters:** `TwilioOtpSender` (SMS), `LocalFileStorage` (storage).
- **Config & Security:**
  - `SecurityConfig`: Stateless session, disables CSRF, custom CORS rules allowing all origins (`*`) and methods.
  - `JwtAuthFilter` & `JwtService`: Bearer token-based JWT authentication.
  - Free Endpoints: `/api/vehicles/verify/*`, `/api/auth/*`, `/api/otp/*`, Swagger `/v3/api-docs/**`, Actuator `/actuator/health`.
  - `WebConfig`, `TwilioConfig`, `EnvValidationConfig`, `ErpTeslaLocalSeeder`.

### 3. Web / Presentation Layer (`web/`)
REST Controllers and HTTP request/response payloads.
- **Controllers:** `AuthController`, `OtpController`, `StationController`, `VehicleController`.
- **DTOs:** Requests (`LoginRequest`, `RegisterRequest`, `SendOtpRequest`, `VerifyOtpRequest`, `LocalVerifyRequest`, `ForeignVerifyRequest`) and Responses (`ApiResponse`, `LoginResponse`, `OtpVerifyResponse`, `RegisterResponse`, etc.).
- **Exception Handling:** `GlobalExceptionHandler` intercepting domain exceptions (`AccountLockedException`, `MaxOtpRetriesException`, `OtpExpiredException`, `RateLimitExceededException`).

## Key Behaviors
- **Vehicle Verification:** Separate flows for Local (`ErpTeslaLocal`) & Foreign (`ErpTeslaForeign`) Tesla vehicles.
- **OTP mechanism:** Sending OTPs via Twilio, with rate-limiting, expiration, and lock-out mechanisms.
- **Auth Flow:** Register/Login generating JWTs (along with refresh token flow).
- **DB Migrations:** Flyway is used, noted by `db/migration/V1_0__cleanup_brand_prefix.sql`.

