# LMS Microservices — Backend Structure

## Overview

```
lms-microservices/
├── eureka-server/          (port 8761) — Service Discovery
├── api-gateway/             (port 8080) — Spring Cloud Gateway, routes all traffic
├── auth-service/            (port 8084) — Login + JWT issuing (no DB)
├── student-service/         (port 8081) — MySQL: student_db
├── trainer-service/         (port 8082) — MySQL: trainer_db
└── coordinator-service/     (port 8083) — MySQL: coordinator_db + courses/enrollments
```

---

## 1. eureka-server (8761)

- `EurekaServerApplication.java` — pure discovery server, self-preservation disabled, no self-registration.

```
eureka-server/src/main/java/com/org/lms/eureka/
└── EurekaServerApplication.java
```

---

## 2. api-gateway (8080)

- `ApiGatewayApplication.java` — Spring Cloud Gateway, load-balances via Eureka (`lb://`).

### Routes (`application.yml`)

| Path | Target |
|---|---|
| `/api/v1/students/**` | student-service |
| `/api/v1/trainers/**` | trainer-service |
| `/api/v1/coordinators/**` | coordinator-service |
| `/api/v1/courses/**` | coordinator-service |
| `/api/v1/auth/**` | auth-service |

```
api-gateway/src/main/java/com/org/lms/gateway/
└── ApiGatewayApplication.java
```

---

## 3. auth-service (8084) — no database

Central login/JWT-issuing service. Delegates credential lookups to the other services.

```
auth-service/src/main/java/com/org/lms/auth/
├── AuthController.java
├── AuthService.java
├── AuthServiceApplication.java
├── client/
│   ├── CoordinatorClient.java
│   ├── StudentClient.java
│   └── TrainerClient.java
├── config/
│   └── SecurityConfig.java
├── dto/
│   ├── AuthResponse.java
│   ├── LoginRequest.java
│   └── UserLookupResponse.java
└── security/
    └── JwtTokenProvider.java   # the ONLY service that SIGNS tokens
```

---

## 4. student-service (8081) — MySQL `student_db`

```
student-service/src/main/java/com/org/lms/student/
├── StudentServiceApplication.java
├── config/
│   └── SecurityConfig.java
├── controller/
│   ├── StudentController.java          # public API
│   └── StudentInternalController.java  # used by auth-service for lookup
├── dto/
│   ├── StudentRegisterRequest.java
│   ├── StudentResponse.java
│   └── UserLookupResponse.java
├── entity/
│   └── Student.java
├── repository/
│   └── StudentRepository.java
├── security/
│   ├── JwtAuthFilter.java
│   └── JwtTokenProvider.java   # verifies tokens only
└── service/
    └── StudentService.java
```

---

## 5. trainer-service (8082) — MySQL `trainer_db`

```
trainer-service/src/main/java/com/org/lms/trainer/
├── TrainerServiceApplication.java
├── config/
│   └── SecurityConfig.java
├── controller/
│   ├── TrainerController.java
│   └── TrainerInternalController.java
├── dto/
│   ├── TrainerResponse.java
│   ├── TrainerSignupRequest.java
│   └── UserLookupResponse.java
├── entity/
│   └── Trainer.java
├── repository/
│   └── TrainerRepository.java
├── security/
│   ├── JwtAuthFilter.java
│   └── JwtTokenProvider.java
└── service/
    └── TrainerService.java
```

---

## 6. coordinator-service (8083) — MySQL `coordinator_db`

Broadest service — owns both coordinators and courses.

```
coordinator-service/src/main/java/com/org/lms/coordinator/
├── CoordinatorServiceApplication.java
├── config/
│   └── SecurityConfig.java
├── controller/
│   ├── CoordinatorController.java
│   ├── CoordinatorInternalController.java
│   └── CourseController.java
├── dto/
│   ├── CoordinatorResponse.java
│   ├── CoordinatorSignupRequest.java
│   ├── CourseRequest.java
│   ├── CourseResponse.java
│   ├── EnrollmentResponse.java
│   └── UserLookupResponse.java
├── entity/
│   ├── Coordinator.java
│   ├── Course.java
│   └── CourseEnrollment.java
├── repository/
│   ├── CoordinatorRepository.java
│   ├── CourseEnrollmentRepository.java
│   └── CourseRepository.java
├── security/
│   ├── JwtAuthFilter.java
│   └── JwtTokenProvider.java
└── service/
    ├── CoordinatorService.java
    └── CourseService.java
```

---

## Cross-Cutting Patterns

### Auth flow
```
client → api-gateway → auth-service
                            │
                            ▼ (Feign-style client)
        student/trainer/coordinator *InternalController
                    (credential lookup)
                            │
                            ▼
        auth-service signs JWT with shared secret
                            │
                            ▼
   downstream services verify (not sign) via own JwtAuthFilter
```

### Service discovery
Every service registers with Eureka at `localhost:8761`. The gateway routes via `lb://` load-balanced URIs (`spring.cloud.gateway.routes[].uri`).

### Data layer
`student-service`, `trainer-service`, and `coordinator-service` each own a separate MySQL schema (`student_db`, `trainer_db`, `coordinator_db`) — no shared database, classic **database-per-service** pattern. `auth-service` and `eureka-server` are stateless (no DB).

### JWT secret
Shared across all services via `JWT_SECRET` env var (defaulted in each `application.yml`). Only `auth-service` signs tokens; every other service only verifies them.

### Package convention
`com.org.lms.<domain>` with consistent sub-packages across business services:
```
controller / service / repository / entity / dto / security / config
```

### Ports summary

| Service | Port | Database |
|---|---|---|
| eureka-server | 8761 | — |
| api-gateway | 8080 | — |
| auth-service | 8084 | — |
| student-service | 8081 | student_db |
| trainer-service | 8082 | trainer_db |
| coordinator-service | 8083 | coordinator_db |
