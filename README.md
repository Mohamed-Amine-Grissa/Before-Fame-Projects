# Telsa — Product Requirements Document (PRD)

> **Tesla-exclusive, vehicle-gated authentication and charging-guidance platform for the Tunisian EV market.**

---

## Table of Contents

1. [Problem Statement](#1-problem-statement)
2. [Vision & Positioning](#2-vision--positioning)
3. [Stakeholders & Target Users](#3-stakeholders--target-users)
4. [Core Principles](#4-core-principles)
5. [Functional Requirements](#5-functional-requirements)
   - 5.1 [Vehicle Registry (ERP)](#51-vehicle-registry-erp)
   - 5.2 [Registration Flow](#52-registration-flow)
   - 5.3 [Authentication Flow](#53-authentication-flow)
   - 5.4 [Charging Station Guidance](#54-charging-station-guidance)
6. [Non-Functional Requirements](#6-non-functional-requirements)
7. [Domain Concepts & Business Rules](#7-domain-concepts--business-rules)
8. [Technology Stack](#8-technology-stack)
   - 8.1 [Backend](#81-backend)
   - 8.2 [Frontend](#82-frontend)
   - 8.3 [Infrastructure & Tooling](#83-infrastructure--tooling)
9. [Security Model](#9-security-model)
10. [API Design Principles](#10-api-design-principles)
11. [Out of Scope (Current Version)](#11-out-of-scope-current-version)
12. [Future Roadmap](#12-future-roadmap)

---

## 1. Problem Statement

Standard authentication services treat identity as purely digital — anyone with an email and a password can register. For a platform dedicated to Tesla EV owners in Tunisia, this is insufficient.

There is no existing platform that:
- Restricts registration exclusively to **verified Tesla vehicle owners**
- Accounts for **both locally-present and imported Tesla vehicles** with separate verification paths
- Enforces **mandatory multi-factor authentication** (not optional) on every login
- Provides **Tesla-model-aware charging station guidance** tailored to the Tunisian charging landscape

**Telsa** is built to fill this gap.

---

## 2. Vision & Positioning

> **Telsa is a Tunisia-focused, Tesla-exclusive platform that binds every user account to a verified vehicle and guides authenticated owners to compatible charging infrastructure.**

| Dimension | Generic Auth Service | Telsa |
|---|---|---|
| Who can register? | Anyone with an email | Only verified Tesla owners |
| What defines identity? | Email + password | Verified vehicle + phone + password |
| MFA policy | Optional | Mandatory SMS OTP on every login |
| Domain knowledge | None | VIN formats, Tunisian plate types, EV charging ports |
| Post-login value | Nothing | Charging station compatibility guidance |

---

## 3. Stakeholders & Target Users

| Role | Description |
|---|---|
| **Tesla Owner (Local)** | Owns a Tesla officially registered/present in Tunisia. Verifies via the `ERPTeslaLocal` registry. |
| **Tesla Owner (Foreign)** | Owns an imported Tesla not in the local registry. Verifies via Carte Grise document upload. |
| **Platform Administrator** | Manages vehicle registry data, reviews foreign vehicle submissions, and monitors system health. |

---

## 4. Core Principles

1. **Vehicle First.** A user account cannot exist without a verified Tesla vehicle. The car is the entry point.
2. **No Password-Only Login.** Every login session requires passing an SMS OTP challenge. JWT is issued only after OTP success.
3. **Domain Integrity.** Plate formats, VIN/chassis rules, and charging port compatibility are enforced at the system level, not left to user discretion.
4. **Separation of Concerns.** Local and foreign vehicle onboarding are distinct flows with distinct verification authorities.

---

## 5. Functional Requirements

### 5.1 Vehicle Registry (ERP)

The system maintains two separate vehicle registries:

#### `ERPTeslaLocal`
- Contains official records of Tesla vehicles **present in Tunisia**.
- Each record includes: VIN/chassis number, plate number, plate type, and model metadata.
- Used as the **source of truth** for local vehicle verification during registration.
- Plate types supported: `TN` (standard Tunisian), `RS` (special), `CD` (diplomatic), `FOREIGN`.

#### `ERPTeslaForeign`
- Handles Tesla vehicles **imported privately** that are not in the local ERP.
- Verification is document-based: the user uploads their **Carte Grise** along with metadata (chassis number, model, etc.).
- Submissions are subject to manual or assisted review before registration is approved.

---

### 5.2 Registration Flow

Registration is **vehicle-gated**. Users cannot simply sign up with an email.

#### Local Vehicle Path
```
1. User provides: chassis number + plate number + plate type
2. System queries ERPTeslaLocal
3. If match found → proceed to account creation
4. If no match → registration rejected with appropriate error
5. User provides: phone number + password
6. Account is created and linked to the verified vehicle
```

#### Foreign Vehicle Path
```
1. User declares their vehicle is imported
2. User uploads: Carte Grise (document) + chassis number + model info
3. System queues submission for verification
4. Upon approval → user is notified and can complete account creation
5. Account is created and linked to the verified foreign vehicle
```

**Duplicate prevention rules:**
- A chassis number cannot be linked to more than one active account.
- A plate number cannot be registered twice.
- Phone numbers must be unique per account.

---

### 5.3 Authentication Flow

Authentication is **always multi-factor**. Password alone is never sufficient.

```
1. User submits: phone number + password
2. System validates credentials
3. On success → SMS OTP is sent to the user's registered phone number (via Twilio)
4. User submits the OTP
5. On OTP success → JWT access token is issued
6. On OTP failure or expiry → access is denied; user must restart
```

**OTP rules:**
- OTP has a short time-to-live (TTL).
- Rate limiting applies to OTP request endpoints to prevent abuse.
- OTPs are single-use and invalidated after consumption or expiry.

---

### 5.4 Charging Station Guidance

After successful authentication, the platform provides personalized charging station recommendations.

- The user's verified Tesla model is used to determine **charging port standard** (e.g., NACS / CCS / Type 2).
- The system returns a list of **compatible charging stations** in Tunisia filtered by connector type.
- Station data includes location coordinates (rendered on an interactive map in the frontend).

---

## 6. Non-Functional Requirements

| Category | Requirement |
|---|---|
| **Security** | JWT-based stateless sessions; mandatory OTP on every login; password hashing via BCrypt |
| **Availability** | API must be resilient; health and metrics exposed via Spring Actuator |
| **Validation** | All incoming request data is validated server-side using Jakarta Bean Validation |
| **Observability** | Structured logging throughout; Actuator endpoints for health, metrics, and info |
| **API Documentation** | Auto-generated interactive docs via SpringDoc OpenAPI (Swagger UI) |
| **Testability** | Unit and integration tests with H2 in-memory database for test isolation |
| **Scalability** | Stateless backend designed for horizontal scaling |

---

## 7. Domain Concepts & Business Rules

### Vehicle Identification
- **VIN / Chassis Number:** Unique identifier for every vehicle. Must conform to VIN format rules and must match registry records.
- **Plate Number:** Validated against Tunisian plate formatting rules per plate type.
- **Plate Types:**
  - `TN` — Standard Tunisian civilian plate
  - `RS` — Special/government plate
  - `CD` — Diplomatic corps plate
  - `FOREIGN` — Foreign-issued plate (for imported vehicles)

### Charging Port Standards
| Tesla Model | Charging Port Standard |
|---|---|
| Model S / X / 3 / Y (recent) | NACS (North American Charging Standard) |
| Older imported models | CCS / Type 2 (depending on market of origin) |

The platform maps each verified Tesla model to its port standard and filters stations accordingly.

### Carte Grise (Vehicle Registration Document)
The official Tunisian (or foreign-country) vehicle registration document. Required for the foreign vehicle verification path when no ERP record exists. Uploaded as a document and retained for audit purposes.

---

## 8. Technology Stack

### 8.1 Backend

| Technology | Version | Role |
|---|---|---|
| **Java** | 25 | Language runtime (latest LTS with modern language features) |
| **Spring Boot** | 4.0.4 | Application framework — auto-configuration, embedded server, lifecycle |
| **Spring Web MVC** | (via Boot) | REST API layer — `@RestController`, request mapping, serialization |
| **Spring Security** | (via Boot) | Security filter chain, authentication manager, BCrypt password encoding |
| **Spring Data JPA** | (via Boot) | ORM layer — `@Entity`, `@Repository`, query derivation |
| **Hibernate** | (via JPA) | JPA implementation — DDL generation, entity lifecycle |
| **Jakarta Bean Validation** | (via Boot) | Request DTO validation — `@NotBlank`, `@Pattern`, `@Valid` |
| **PostgreSQL** | latest | Primary relational database |
| **H2 Database** | (test scope) | In-memory database for unit/integration testing |
| **JJWT** | 0.12.3 | JWT creation, signing, and validation (`jjwt-api`, `jjwt-impl`, `jjwt-jackson`) |
| **Twilio SDK** | 11.3.5 | SMS delivery — OTP generation and dispatch via Twilio Messaging API |
| **SpringDoc OpenAPI** | 3.0.2 | Auto-generated Swagger UI from code annotations (`/swagger-ui.html`) |
| **Spring Actuator** | (via Boot) | Health, metrics, and info endpoints (`/actuator/health`) |
| **Lombok** | latest | Boilerplate reduction — `@Getter`, `@Setter`, `@Builder`, `@AllArgsConstructor` |
| **Spring Boot DevTools** | (runtime) | Hot reload during local development |
| **Maven** | 3.x | Build and dependency management (via Maven Wrapper `mvnw`) |

### 8.2 Frontend

| Technology | Version | Role |
|---|---|---|
| **React** | 19 | UI component model and rendering |
| **TypeScript** | 5.8 | Static typing for the entire frontend codebase |
| **Tailwind CSS** | 4.x | Utility-first CSS framework for styling |
| **Vite** | 6 | Fast build tool and dev server |
| **Framer Motion** (`motion`) | 12 | Declarative animations and transitions |
| **Mapbox GL JS** | 3.x | Interactive map for charging station visualization |
| **react-map-gl** | 8.x | React wrapper for Mapbox GL |
| **Lucide React** | latest | Icon library |
| **Google GenAI SDK** | 1.x | Gemini API integration |
| **clsx + tailwind-merge** | latest | Conditional class merging utilities |
| **Express** | 4.x | Lightweight local server for development/preview |

### 8.3 Infrastructure & Tooling

| Tool | Role |
|---|---|
| **PostgreSQL** | Persistent data store (vehicles, users, OTP state, charging stations) |
| **Twilio** | SMS API — OTP delivery to user phone numbers |
| **Maven Wrapper** (`mvnw`) | Reproducible Maven builds without a local Maven install |
| **Spring Boot Maven Plugin** | Builds executable fat JARs for deployment |

---

## 9. Security Model

```
Password         → BCrypt hashed (Spring Security PasswordEncoder)
Authentication   → Phone + Password → OTP → JWT
JWT              → Signed with HMAC-SHA secret via JJWT; stateless; short-lived
OTP              → Single-use, TTL-controlled, rate-limited, delivered via Twilio SMS
CORS             → Configured explicitly in Spring Security filter chain
Input Validation → Jakarta Validation on all inbound DTOs
Access Control   → Spring Security method/endpoint security with role awareness
```

No session is issued. JWTs are stateless and validated per request.

---

## 10. API Design Principles

- **RESTful conventions:** resources, HTTP verbs, and standard status codes.
- **Self-documenting:** All endpoints are annotated with OpenAPI annotations and exposed at `/swagger-ui.html`.
- **Fail fast:** Request validation errors are returned immediately with structured error bodies.
- **Consistent error responses:** A uniform error envelope is used across all endpoints.
- **No password-only login endpoint:** The authentication flow is always two-step (credentials → OTP).

---

## 11. Out of Scope (Current Version)

- Admin dashboard UI (registry management is backend-only for now)
- Real-time charging station availability (static data)
- Payment or billing features
- OAuth2 / social login
- Multi-country support (Tunisia-only)
- iOS / Android native apps

---

## 12. Future Roadmap

> *(To be defined — items will be added here as future plans are confirmed.)*

---

## Getting Started

### Prerequisites
- Java 25
- Maven (or use the included `./mvnw` wrapper)
- PostgreSQL instance
- Twilio account (for SMS OTP)

### Run the Backend
```bash
./mvnw spring-boot:run
```

API docs available at: `http://localhost:8080/swagger-ui.html`  
Health check: `http://localhost:8080/actuator/health`

### Run the Frontend
```bash
cd frontend
npm install
npm run dev
```

Frontend runs at: `http://localhost:3000`

---

*For backend architecture details, database schema, and API endpoint documentation, see [`BACKEND_ARCHITECTURE.md`](./BACKEND_ARCHITECTURE.md).*
