# Backend Project Context (Spring Boot)

## Project Overview
- **Name:** Telsa Charging Points Backend
- **Framework:** Spring Boot (Java 25 per properties, though realistically Java 17/21 based on Spring Boot version 3.x/4.x logic)
- **Build Tool:** Maven

## Architecture & Structure
The project follows Domain-Driven Design (DDD) principles with cleanly separated layers.

### 1. Domain Layer (`domain/`)
Core business logic and entities mapping to the Telsa specific rules.
- **Models/Entities:** `User` (includes `role`, `emailVerified`), `RefreshToken` (revokable, hashed), `ErpTeslaLocal`, `ErpTeslaForeign`, `TeslaModel`, `PlateType`, `VehicleOrigin`.
- **Services:** `AuthService` (issues/rotates tokens), `EmailVerificationService`, `LockService`, `OtpService`, `RateLimiterService`, `UserRegistrationService`, `VehicleVerificationService`.
- **Ports:** `FileStorage`, `OtpSender`, `EmailSender`.

### 2. Infrastructure Layer (`infrastructure/`)
Contains actual DB adapters, 3rd party providers, and Security.
- **Repositories (JPA/DB):** `UserRepository`, `ErpTeslaLocalRepository`, `ErpTeslaForeignRepository`, `RefreshTokenRepository`.
- **Adapters:** `TwilioOtpSender` (SMS), `LocalFileStorage` (storage), `SmtpEmailSender` (Email).
- **Config & Security:**
  - `SecurityConfig`: Stateless session, disables CSRF, custom CORS (`*`). Enforces HTTPS security headers (HSTS, FrameOptions). Protects `/api/admin/**` with `ROLE_ADMIN`.
  - `JwtAuthFilter` & `JwtService`: Bearer token-based JWT auth. Access tokens include user roles. Refresh tokens are SHA-256 hashed.
  - `AuditLogger`: Structured logging (`telsa-audit.log`) for auth, OTP, vehicle verification, and account locks.
  - Free Endpoints: `/api/vehicles/verify/*`, `/api/auth/register`, `/api/auth/login`, `/api/auth/verify-email`, `/api/otp/*`, `/api/auth/refresh`.

### 3. Web / Presentation Layer (`web/`)
REST Controllers and HTTP request/response payloads.
- **Controllers:** `AuthController` (login/register/refresh/verify-email/logout), `OtpController`, `StationController`, `VehicleController`, `AdminController` (users, stats, local ERP).
- **DTOs:** Requests (`LoginRequest`, `RegisterRequest`, `AdminLocalErpRequest`, etc.) and Responses (`ApiResponse`, `AdminStatsResponse`, `TokenRefreshResponse`, etc.).
- **Exception Handling:** `GlobalExceptionHandler` intercepting domain exceptions (`AccountLockedException`, `RateLimitExceededException`, etc.).

## Key Behaviors
- **Vehicle Verification:** Separate flows for Local (`ErpTeslaLocal`) & Foreign (`ErpTeslaForeign`) Tesla vehicles.
- **OTP mechanism:** Sending OTPs via Twilio, with rate-limiting, expiration, and lock-out mechanisms.
- **Auth Flow:** Register/Login generating JWTs. Includes mandatory Email Verification (`EmailVerificationService`) and Refresh Token Rotation (old tokens revoked, new ones issued on refresh).
- **Admin Management:** `ROLE_ADMIN` access for user analytics, ERP population, and user deletion.
- **Audit & Security:** IP-based rate limiting, input sanitization on chassis/plate numbers, and extensive structured audit trails (`AUDIT` logger) for sensitive actions.
- **DB Migrations:** Flyway is used, noted by `db/migration/V1_0__cleanup_brand_prefix.sql`.

