# 🚗 TELSA Backend Architecture Documentation

**Project:** Telsa Vehicle Registration System  
**Version:** 0.0.1-SNAPSHOT  
**Java Version:** 25  
**Framework:** Spring Boot 4.0.4  
**Build Tool:** Maven  
**Database:** PostgreSQL  

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Technology Stack & Dependencies](#technology-stack--dependencies)
3. [Project Structure](#project-structure)
4. [Database Schema](#database-schema)
5. [Core Services & Logic](#core-services--logic)
6. [API Endpoints](#api-endpoints)
7. [Request/Response Flow](#requestresponse-flow)
8. [Configuration](#configuration)
9. [Error Handling](#error-handling)

---

## 🎯 Overview

**TELSA** is a Spring Boot REST API backend for vehicle registration and SMS-based OTP verification. The system manages:
- **Vehicle Registration** (Local & Foreign vehicles)
- **User Authentication** via OTP/SMS
- **Identity Verification**
- **License Plate Validation** (TN, RS, CD, FOREIGN types)
- **VIN Verification and Authorization**

### Key Features:
✅ Two-factor authentication via SMS (powered by Twilio)  
✅ Vehicle identification with plate type validation  
✅ Rate limiting for OTP requests  
✅ Duplicate vehicle/user prevention  
✅ Vehicle ownership conflict detection  
✅ RESTful API with proper HTTP status codes  
✅ Comprehensive error handling & logging  

---

## 📦 Technology Stack & Dependencies

### Core Framework
```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-webmvc</artifactId>
    <!-- REST API & Web Services -->
</dependency>

<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-security</artifactId>
    <!-- Security & CORS -->
</dependency>
```

### Database & ORM
```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-jpa</artifactId>
    <!-- JPA ORM for database operations -->
</dependency>

<dependency>
    <groupId>org.postgresql</groupId>
    <artifactId>postgresql</artifactId>
    <scope>runtime</scope>
    <!-- PostgreSQL JDBC Driver -->
</dependency>
```

### Validation & Lombok
```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-validation</artifactId>
    <!-- Input validation (jakarta.validation) -->
</dependency>

<dependency>
    <groupId>org.projectlombok</groupId>
    <artifactId>lombok</artifactId>
    <!-- Reduces boilerplate code (@Getter, @Setter, @Builder) -->
</dependency>
```

### SMS & Communication
```xml
<dependency>
    <groupId>com.twilio.sdk</groupId>
    <artifactId>twilio</artifactId>
    <version>11.3.5</version>
    <!-- SMS delivery via Twilio API -->
</dependency>
```

### Monitoring & Documentation
```xml
<dependency>
    <groupId>org.springdoc</groupId>
    <artifactId>springdoc-openapi-starter-webmvc-ui</artifactId>
    <version>3.0.2</version>
    <!-- Swagger OpenAPI UI at /swagger-ui.html -->
</dependency>

<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-actuator</artifactId>
    <!-- Health checks & metrics at /actuator -->
</dependency>
```

### Development Tools
```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-devtools</artifactId>
    <scope>runtime</scope>
    <optional>true</optional>
    <!-- Live reload during development -->
</dependency>
```

---

## 🏗️ Project Structure

```
src/main/java/com/example/Telsa/
├── TelsaApplication.java                    # Spring Boot entry point
├── domain/                                  # Business logic layer
│   ├── model/                               # JPA Entities
│   │   ├── User.java                        # User entity with vehicle relationship
│   │   ├── AllLocalCar.java                 # All registered vehicles
│   │   ├── TelsaVehicles.java               # Authorized Telsa vehicles (ERP)
│   │   ├── OtpRecord.java                   # OTP verification records
│   │   └── PlateType.java                   # Enum: TN, RS, CD, FOREIGN
│   │
│   ├── ports/                               # Port interfaces (repository abstractions)
│   │   └── OtpSender.java                   # Interface for OTP sending
│   │
│   └── service/                             # Business logic services
│       ├── IdentificationService.java       # Vehicle identification & verification
│       ├── VehicleRegistrationService.java  # Vehicle & user registration
│       ├── OtpService.java                  # OTP generation, sending, verification
│       └── VerifyOtpResult (inner class)    # OTP verification result DTO
│
├── infrastructure/                          # Infrastructure layer
│   ├── adapters/
│   │   └── db/                              # Repository implementations
│   │       ├── UserRepository.java          # User CRUD operations
│   │       ├── OtpRecordRepository.java     # OTP CRUD operations
│   │       ├── AllLocalCarRepository.java   # Vehicle CRUD operations
│   │       └── TelsaVehicleRepository.java  # Telsa vehicle CRUD operations
│   │
│   └── config/                              # Configuration classes
│       ├── TwilioConfig.java                # Twilio credentials & initialization
│       ├── SecurityConfig.java              # CORS & security settings
│       ├── WebConfig.java                   # Web configuration
│       ├── AllLocalCarSeeder.java           # Test data seeder
│       └── ErpVehicleSeeder.java            # Telsa vehicle seeder
│
├── web/                                     # API layer (Controllers & DTOs)
│   ├── controller/                          # REST endpoints
│   │   ├── AuthController.java              # User authentication endpoints
│   │   ├── VehicleController.java           # Vehicle verification endpoints
│   │   └── SMSController.java               # OTP send/verify endpoints
│   │
│   ├── dto/                                 # Data Transfer Objects
│   │   ├── Request DTOs:
│   │   │   ├── PlateTypeInitRequest.java    # Initialize verification session
│   │   │   ├── VerifyRequest.java           # Verify VIN + plate
│   │   │   ├── SendOtpRequest.java          # Send OTP request
│   │   │   ├── VerifyOtpRequest.java        # Verify OTP code
│   │   │   ├── VehicleRegistrationRequest.java
│   │   │   ├── VehicleEndpointRegistrationRequest.java
│   │   │   └── AuthRegistrationRequest.java
│   │   │
│   │   └── Response DTOs:
│   │       ├── PlateTypeInitResponse.java   # Verification session response
│   │       ├── IdentificationResponse.java  # Vehicle verification response
│   │       ├── SendOtpResponse.java         # OTP send response
│   │       ├── VerifyOtpResponse.java       # OTP verify response
│   │       ├── VehicleRegistrationResponse.java
│   │       └── CheckVinResponse.java
│   │
│   └── exception/
│       └── GlobalExceptionHandler.java      # Centralized error handling
│
└── resources/
    ├── application.properties               # Configuration (port, DB, Twilio)
    └── application-test.properties          # Test configuration
```

---

## 🗄️ Database Schema

### 📊 Entities & Relationships

#### **users** Table
```
┌─────────────────────────────┬──────────────┬──────────────┐
│ Column          │ Type      │ Constraints  │
├─────────────────────────────┼──────────────┼──────────────┤
│ id              │ UUID      │ PRIMARY KEY  │
│ first_name      │ VARCHAR   │ NOT NULL     │
│ last_name       │ VARCHAR   │ NOT NULL     │
│ email           │ VARCHAR   │ UNIQUE, NN   │
│ phone_number    │ VARCHAR   │ NOT NULL     │
│ country_code    │ VARCHAR   │ NOT NULL     │
│ verified        │ BOOLEAN   │ NOT NULL     │
│ vehicle_id (FK) │ UUID      │ NOT NULL     │ → all_local_cars.id
└─────────────────────────────┴──────────────┴──────────────┘
```

#### **all_local_cars** Table
```
┌─────────────────────────────┬──────────────┬──────────────┐
│ Column          │ Type      │ Constraints  │
├─────────────────────────────┼──────────────┼──────────────┤
│ id              │ UUID      │ PRIMARY KEY  │
│ chassis_number  │ VARCHAR   │ UNIQUE, NN   │
│ plate_number    │ VARCHAR   │ NOT NULL     │
│ plate_type      │ VARCHAR   │ NOT NULL     │
│ created_at      │ TIMESTAMP │ DEFAULT NOW  │
└─────────────────────────────┴──────────────┴──────────────┘
```

#### **telsa_vehicles** Table
```
┌─────────────────────────────┬──────────────┬──────────────┐
│ Column          │ Type      │ Constraints  │
├─────────────────────────────┼──────────────┼──────────────┤
│ id              │ UUID      │ PRIMARY KEY  │
│ chassis_number  │ VARCHAR   │ UNIQUE, NN   │
│ plate_number    │ VARCHAR   │ NOT NULL     │
│ plate_type      │ VARCHAR   │ NOT NULL     │
│ created_at      │ TIMESTAMP │ DEFAULT NOW  │
└─────────────────────────────┴──────────────┴──────────────┘
```

#### **otp_records** Table
```
┌──────────────────────┬──────────────┬──────────────┐
│ Column               │ Type         │ Constraints  │
├──────────────────────┼──────────────┼──────────────┤
│ id                   │ UUID         │ PRIMARY KEY  │
│ user_id (FK)         │ UUID         │ NOT NULL     │
│ phone_number         │ VARCHAR      │ NOT NULL     │
│ otp_code             │ VARCHAR(6)   │ NOT NULL     │
│ created_at           │ TIMESTAMP    │ NOT NULL     │
│ expires_at           │ TIMESTAMP    │ NOT NULL     │
│ retries_remaining    │ INT          │ NOT NULL     │
│ verified             │ BOOLEAN      │ NOT NULL     │
└──────────────────────┴──────────────┴──────────────┘
```

### 🔗 Relationships
```
User (Many) ──── (One) AllLocalCar
                 @ManyToOne with @JoinColumn("vehicle_id")

OtpRecord references User.id for verification context
```

### 📋 Plate Types
```java
enum PlateType {
    TN,      // Tunisian: "123 TUN 1234"
    RS,      // Regional: "RS 123"
    CD,      // Diplomatic: "12 CD 12"
    FOREIGN  // Import: (any format)
}
```

---

## ⚙️ Core Services & Logic

### 1️⃣ **IdentificationService** 🔍

**Purpose:** Verify vehicle VIN and license plate authenticity

**Key Methods:**

#### `initializePlateType(PlateTypeInitRequest)`
- Creates a verification session (10-minute TTL)
- Returns `verificationId` for subsequent requests
- **Stored in:** `ConcurrentHashMap<UUID, VerificationContext>`

```java
Request:  { plateType: "TN" }
Response: {
  success: true,
  message: "Plate type valid",
  verificationId: "uuid-1234..."
}
```

#### `verifyVehicle(VerifyRequest)`
- Validates VIN format: `^[A-Z]{3}[A-Z0-9]{14}$`
- Checks if VIN starts with "TLS" (authorized prefix)
- Validates plate format based on type
- Creates vehicle in `telsa_vehicles` if authorized
- **Throws:** `ResponseStatusException` if VIN unauthorized

```
Flow:
1. Load verification context by verificationId
2. Normalize VIN & plate number
3. Check VIN format validity
4. Verify "TLS" prefix
5. Validate plate number format
6. Check/create in TelsaVehicles
7. Clean up verification context
```

**Rate Limiting:** None at identification level (handles at OTP level)

---

### 2️⃣ **VehicleRegistrationService** 🚙

**Purpose:** Register vehicles and users with comprehensive validation

**Key Methods:**

#### `registerVehicle(VehicleRegistrationRequest)`
- Full vehicle + user registration in one call
- **Validates:**
  - VIN format & uniqueness
  - Plate number format & type
  - Email uniqueness
  - VIN authorization (TLS prefix)

```java
Request: {
  chassisNumber: "TLS12345678901234",
  plateNumber: "123 TUN 1234",
  plateType: "TN",
  firstName: "John",
  lastName: "Doe",
  email: "john@example.com"
}

Response: User object (id, email, verified: false)
```

#### `registerUser(AuthRegistrationRequest)`
- Register user with existing vehicle
- **Validates:**
  - Email uniqueness
  - Phone number format (8-15 digits)
  - Vehicle ownership conflict
  - Vehicle existence

```java
Request: {
  firstName: "Jane",
  lastName: "Smith",
  email: "jane@example.com",
  phoneNumber: "+21612345678",
  countryCode: "+216",
  vehicleId: "uuid..."
}
```

#### Helper Methods:
- `upsertAllLocalCar()` - Update or create in all_local_cars
- `upsertTelsaVehicle()` - Update or create in telsa_vehicles
- `normalizeChassisNumber()` - Uppercase trim
- `normalizePlateNumber()` - Uppercase, normalize spaces
- `isValidPlateNumber()` - Regex validation per type
- `isValidPhoneNumber()` - 8-15 digit validation

---

### 3️⃣ **OtpService** 📱

**Purpose:** Generate, send, and verify one-time passwords via SMS

**Key Methods:**

#### `generateAndSendOtp(userId, countryCode, phoneNumber)`
- **Validation:**
  - User exists in database
  - Phone format valid (8-15 digits)
  - Rate limiting: 60-second wait between requests
  - Delete old unverified OTP

- **Generation:**
  - Generates 6-digit random code
  - Creates OtpRecord with expiration (5 min default)
  - Sets max retries (3 default)

- **Sending:**
  - Calls `sendOtpViaTwilio(fullPhone, otp)`
  - Twilio initializes with AccountSid & AuthToken
  - Logs success/failure

```java
private void sendOtpViaTwilio(String toPhoneNumber, String otpCode) {
    twilioConfig.initTwilio();
    String messageBody = "Your Telsa verification code is: " + otpCode +
                        ". Valid for " + minutes + " minutes.";
    Message message = Message.creator(
        new PhoneNumber(toPhoneNumber),
        new PhoneNumber(twilioConfig.getPhoneNumber()),
        messageBody
    ).create();
}
```

#### `verifyOtpByUserId(userId, providedOtp)`
- Load most recent unverified OTP for user
- **Checks:**
  - OTP not already verified
  - Not expired
  - Retries remaining > 0
  - Code matches

- **On Success:**
  - Mark OTP as verified
  - Set user `verified = true`

- **On Failure:**
  - Decrement retries
  - Throw error if retries exhausted

```
Retry Logic:
1. Check if retries > 0
2. Decrement retries
3. If retries still > 0: return VerifyOtpResult(false, retriesRemaining)
4. If retries = 0: delete OTP & throw error
```

#### `resendOtp(userId, countryCode, phoneNumber)`
- Deletes old OTP
- Generates new one (same flow as generateAndSendOtp)

---

## 🔌 API Endpoints

### Base URL
```
http://localhost:8080/api
```

### 1. **VEHICLE IDENTIFICATION** 🚗

#### **POST** `/vehicles/identify`
Initialize vehicle verification session

```
Request:
{
  "plateType": "TN|RS|CD|FOREIGN"
}

Response (200 OK):
{
  "success": true,
  "message": "Plate type valid",
  "verificationId": "550e8400-e29b-41d4-a716-446655440000"
}

Errors:
- 400: Invalid plateType format
```

---

#### **POST** `/vehicles/verify`
Verify vehicle VIN against ERP

```
Request:
{
  "verificationId": "550e8400-e29b-41d4-a716-446655440000",
  "chassisNumber": "TLS12345678901234",
  "plateNumber": "123 TUN 1234"
}

Response (200 OK):
{
  "success": true,
  "message": "Vehicle verified successfully in ERP."
}

Errors:
- 400: Invalid VIN format
- 401: VIN not authorized (doesn't start with TLS)
- 404: Vehicle not found in ERP
- 409: Plate doesn't match ERP record
```

---

#### **GET** `/vehicles/check-vin`
Quick VIN validation

```
Query Parameters:
  ?vin=TLS12345678901234&plateType=TN

Response (200 OK):
{
  "exists": true,
  "isTelsa": true,
  "message": "Valid Telsa vehicle found"
}
```

---

### 2. **USER REGISTRATION** 👤

#### **POST** `/auth/register`
Register user with complete details

```
Request:
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com"
}

Response (200 OK):
User object (JSON)

Errors:
- 409: Email already exists
```

---

#### **POST** `/vehicles/register`
Full vehicle + user registration

```
Request:
{
  "chassisNumber": "TLS12345678901234",
  "plateNumber": "123 TUN 1234",
  "plateType": "TN",
  "firstName": "Jane",
  "lastName": "Smith",
  "email": "jane@example.com"
}

Response (200 OK):
{
  "success": true,
  "message": "Vehicle registered successfully. Proceed to OTP verification.",
  "id": "uuid-of-user"
}

Errors:
- 400: Invalid VIN/plate format
- 409: Duplicate vehicle/email
```

---

### 3. **OTP VERIFICATION** 🔐

#### **POST** `/otp/send`
Send OTP code via SMS

```
Request:
{
  "userId": "550e8400-e29b-41d4-a716-446655440000",
  "countryCode": "+216",
  "phoneNumber": "12345678"
}

Response (200 OK):
{
  "success": true,
  "message": "OTP sent successfully to your phone number.",
  "otpId": "otp-record-uuid",
  "expiresInSeconds": 300
}

Errors:
- 400: Invalid phone format
- 404: User not found
- 429: Rate limit exceeded (wait 60 seconds)
- 500: Twilio SMS delivery failed
```

---

#### **POST** `/otp/verify`
Verify OTP code provided by user

```
Request:
{
  "userId": "550e8400-e29b-41d4-a716-446655440000",
  "otp": "123456"
}

Response (200 OK):
{
  "success": true,
  "message": "OTP verified successfully! Your vehicle is now registered.",
  "retriesRemaining": 0
}

Response (200 OK - Failed):
{
  "success": false,
  "message": "Invalid OTP code. 2 retries remaining.",
  "retriesRemaining": 2
}

Errors:
- 401: OTP expired, invalid, or max retries exceeded
- 404: OTP session not found
```

---

#### **POST** `/otp/resend`
Resend OTP code

```
Request:
{
  "userId": "550e8400-e29b-41d4-a716-446655440000",
  "countryCode": "+216",
  "phoneNumber": "12345678"
}

Response (200 OK):
{
  "success": true,
  "message": "OTP resent successfully to your phone number.",
  "otpId": "otp-record-uuid",
  "expiresInSeconds": 300
}
```

---

## 🔄 Request/Response Flow

### **Complete Registration Workflow** 📋

```
STEP 1: IDENTIFY PLATE TYPE
┌── Client POST /vehicles/identify
│   { plateType: "TN" }
│
└── Server → IdentificationService.initializePlateType()
    - Create verification session (10 min TTL)
    - Return verificationId
    └→ Response: verificationId

STEP 2: VERIFY VEHICLE
┌── Client POST /vehicles/verify
│   { verificationId, chassisNumber, plateNumber }
│
└── Server → IdentificationService.verifyVehicle()
    - Load verification context
    - Validate VIN format
    - Check TLS prefix
    - Create TelsaVehicles
    - Clean context
    └→ Response: { success, message }

STEP 3: REGISTER VEHICLE & USER
┌── Client POST /vehicles/register
│   { chassisNumber, plateNumber, firstName, lastName, email }
│
└── Server → VehicleRegistrationService.registerVehicle()
    - Validate VIN format & uniqueness
    - Check email uniqueness
    - Create AllLocalCar
    - Create TelsaVehicles (if TLS prefix)
    - Create User (verified: false)
    - Return userId
    └→ Response: userId

STEP 4: SEND OTP
┌── Client POST /otp/send
│   { userId, countryCode, phoneNumber }
│
└── Server → OtpService.generateAndSendOtp()
    - Validate phone format
    - Check rate limit (60s)
    - Generate 6-digit code
    - Create OtpRecord (5 min expiry)
    - Call Twilio API
    - Log SMS SID
    └→ Response: { expiresInSeconds, otpId }

STEP 5: VERIFY OTP
┌── Client POST /otp/verify
│   { userId, otp }
│
└── Server → OtpService.verifyOtpByUserId()
    - Load latest unverified OTP
    - Check expiry & retries
    - Compare code
    - Mark verified
    - Set user.verified = true
    └→ Response: { success }

✅ REGISTRATION COMPLETE
```

---

## ⚙️ Configuration

### **application.properties** 🔧

```ini
# Server Configuration
spring.application.name=Telsa

# Database Configuration
spring.datasource.url=jdbc:postgresql://localhost:5432/TelsaDB
spring.datasource.username=postgres
spring.datasource.password=Med147Grissa258

# Hibernate/JPA Configuration
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true

# Twilio SMS Configuration (⚠️ Use environment variables)
twilio.account-sid=${TWILIO_ACCOUNT_SID:}      # From Twilio Console
twilio.auth-token=${TWILIO_AUTH_TOKEN:}        # From Twilio Console
twilio.phone-number=${TWILIO_PHONE_NUMBER:}    # Your Twilio phone

# OTP Configuration
otp.length=6                                    # OTP code length
otp.expiration-minutes=5                        # Valid for 5 minutes
otp.max-retries=3                               # 3 attempts allowed

# Logging Configuration
logging.level.com.example.Telsa=INFO
logging.level.org.springframework.web=WARN
logging.level.org.hibernate.SQL=DEBUG
```

### **Environment Variables Setup** 🔐

```bash
# Set Twilio credentials (Never commit to code!)
export TWILIO_ACCOUNT_SID="ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
export TWILIO_AUTH_TOKEN="your_auth_token_here"
export TWILIO_PHONE_NUMBER="+1234567890"

# Run application
java -jar target/Telsa-0.0.1-SNAPSHOT.jar
```

---

## ❌ Error Handling

### **GlobalExceptionHandler** 🛡️

Centralized error handling for all exceptions

```java
@RestControllerAdvice
public class GlobalExceptionHandler {
    // Catches @Valid validation errors
    // Catches ResponseStatusException
    // Returns standardized error response
}
```

### **Common HTTP Status Codes**

| Code | Scenario | Example |
|------|----------|---------|
| **200** | Success | OTP sent, vehicle verified |
| **400** | Invalid input | Bad VIN format, invalid phone |
| **404** | Not found | User not found, vehicle not found |
| **409** | Conflict | Duplicate email, vehicle already owned |
| **429** | Rate limited | Too many OTP requests (wait 60s) |
| **500** | Server error | Twilio SMS failed, DB connection error |
| **401** | Unauthorized | VIN unauthorized, OTP expired |

### **Response Format**

```json
{
  "success": true/false,
  "message": "Human readable error/success message",
  "data": { /* optional data */ }
}
```

---

## 🚀 Running the Application

### **Prerequisites**
- Java 25
- PostgreSQL 12+
- Maven 3.8+
- Twilio account & credentials

### **Build & Run**

```bash
# Build with Maven
mvn clean install

# Run application
mvn spring-boot:run

# Or with JAR
java -jar target/Telsa-0.0.1-SNAPSHOT.jar

# Application runs on http://localhost:8080
# Swagger UI: http://localhost:8080/swagger-ui.html
# Health checks: http://localhost:8080/actuator/health
```

### **Database Setup**

```sql
-- PostgreSQL
CREATE DATABASE TelsaDB;
CREATE USER telsa WITH PASSWORD 'Med147Grissa258';
GRANT ALL PRIVILEGES ON DATABASE TelsaDB TO telsa;

-- JPA will auto-create tables on first run
-- (spring.jpa.hibernate.ddl-auto=update)
```

---

## 📊 API Response Examples

### Example 1: Full Registration Success
```json
// Step 1: Initialize
POST /api/vehicles/identify
{
  "plateType": "TN"
}
→
{
  "success": true,
  "message": "Plate type valid",
  "verificationId": "abc-123-def-456"
}

// Step 2: Verify Vehicle
POST /api/vehicles/verify
{
  "verificationId": "abc-123-def-456",
  "chassisNumber": "TLS12345678901234",
  "plateNumber": "123 TUN 1234"
}
→
{
  "success": true,
  "message": "Vehicle verified successfully in ERP."
}

// Step 3: Register
POST /api/vehicles/register
{
  "chassisNumber": "TLS12345678901234",
  "plateNumber": "123 TUN 1234",
  "plateType": "TN",
  "firstName": "Mohamed",
  "lastName": "Ahmed",
  "email": "m.ahmed@example.com"
}
→
{
  "success": true,
  "message": "Vehicle registered successfully. Proceed to OTP verification.",
  "id": "user-uuid-123"
}

// Step 4: Send OTP
POST /api/otp/send
{
  "userId": "user-uuid-123",
  "countryCode": "+216",
  "phoneNumber": "12345678"
}
→
{
  "success": true,
  "message": "OTP sent successfully to your phone number.",
  "otpId": "otp-uuid-456",
  "expiresInSeconds": 300
}

// Step 5: Verify OTP
POST /api/otp/verify
{
  "userId": "user-uuid-123",
  "otp": "123456"
}
→
{
  "success": true,
  "message": "OTP verified successfully! Your vehicle is now registered.",
  "retriesRemaining": 0
}
```

### Example 2: Error Scenarios

```json
// Invalid VIN Format
POST /api/vehicles/verify
{
  "verificationId": "abc-123",
  "chassisNumber": "INVALID123",
  "plateNumber": "123 TUN 1234"
}
→ 400 Bad Request
{
  "success": false,
  "message": "Invalid VIN format. VIN must be 17 characters: 3 letters + 14 alphanumeric characters."
}

// VIN Not Authorized
POST /api/vehicles/verify
{
  "verificationId": "abc-123",
  "chassisNumber": "BMW12345678901234",
  "plateNumber": "123 TUN 1234"
}
→ 401 Unauthorized
{
  "success": false,
  "message": "Vehicle is not authorized for Telsa service. VIN must start with TLS."
}

// Rate Limited OTP
POST /api/otp/send (within 60 seconds)
→ 429 Too Many Requests
{
  "success": false,
  "message": "Please wait before requesting a new OTP. Try again in 45 seconds."
}

// Invalid OTP Code
POST /api/otp/verify
{
  "userId": "user-uuid",
  "otp": "000000"
}
→ 200 OK (but invalid)
{
  "success": false,
  "message": "Invalid OTP code. 2 retries remaining.",
  "retriesRemaining": 2
}
```

---

## 🔗 Key Architecture Patterns

### **Hexagonal Architecture (Ports & Adapters)**
```
┌─────────────────────────────────┐
│  Web Layer (Controllers/DTOs)   │
└────────────────┬────────────────┘
                 │
┌────────────────▼────────────────┐
│  Domain Layer (Services)        │
│  - IdentificationService        │
│  - VehicleRegistrationService   │
│  - OtpService                   │
└────────────────┬────────────────┘
                 │
┌────────────────▼────────────────┐
│  Infrastructure Layer           │
│  - Repositories (DB Adapters)   │
│  - TwilioConfig (SMS Adapter)   │
└────────────────┬────────────────┘
                 │
┌────────────────▼────────────────┐
│  External Services              │
│  - PostgreSQL                   │
│  - Twilio API                   │
└─────────────────────────────────┘
```

### **Dependency Injection**
- Constructor injection via Lombok `@RequiredArgsConstructor`
- Spring manages bean lifecycle

### **Validation Strategy**
- **Input validation:** Jakarta `@Valid` annotations
- **Business validation:** Service methods
- **Database constraints:** Unique indexes, foreign keys

### **Error Handling Strategy**
- Exception propagation → `GlobalExceptionHandler`
- Standardized HTTP status codes
- Logging for audit trail

---

## 📝 Summary

**TELSA Backend** is a well-architected Spring Boot microservice that:
- ✅ Manages vehicle registration with multi-type license plate support
- ✅ Implements secure 2FA via SMS/OTP
- ✅ Validates VINs against authorized prefixes
- ✅ Prevents duplicate registrations & ownership conflicts
- ✅ Uses PostgreSQL for persistent storage
- ✅ Integrates Twilio for SMS delivery
- ✅ Follows clean architecture principles
- ✅ Provides comprehensive error handling & logging
- ✅ Exposes RESTful API with OpenAPI/Swagger documentation

---

**Last Updated:** April 19, 2026  
**Backend Version:** 0.0.1-SNAPSHOT

