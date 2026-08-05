# LMS Microservices — Project Wiki

> Microservices version of the original `lms-backend` monolith. Splits a single Spring Boot app into 6 independently deployable services.

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Tech Stack](#tech-stack)
3. [Services & Ports](#services--ports)
4. [Service Details](#service-details)
5. [Data Model](#data-model)
6. [API Reference](#api-reference)
7. [Authentication & Security](#authentication--security)
8. [Setup & Run Order](#setup--run-order)
9. [What Changed vs. the Monolith](#what-changed-vs-the-monolith)
10. [Known Simplifications](#known-simplifications)

---

## Architecture Overview

```
                         ┌─────────────────┐
                         │  eureka-server   │  (8761) — service registry
                         └────────▲─────────┘
                                  │ register/discover
        ┌─────────────────────────┼─────────────────────────┐
        │                         │                          │
┌───────┴───────┐         ┌───────┴───────┐          ┌───────┴───────┐
│ student-service│         │trainer-service│          │coordinator-svc│
│    (8081)      │         │    (8082)     │          │    (8083)     │
│ student_db     │         │  trainer_db   │          │coordinator_db │
└───────▲────────┘         └───────▲───────┘          └───────▲───────┘
        │  /internal/students          /internal/trainers   /internal/coordinators
        │                             (looked up during login)
        │                                                     │
        └─────────────────┬───────────────────────────────────┘
                           │
                   ┌───────┴────────┐
                   │  auth-service  │ (8084) — stateless, signs JWTs
                   └───────▲────────┘
                           │
                   ┌───────┴────────┐
                   │  api-gateway   │ (8080) — single public entry point
                   └───────▲────────┘
                           │
                       external clients
```

- **Single public entry point**: all external traffic goes through `api-gateway` on port 8080.
- **Service discovery**: every service (except the gateway's static config) resolves peers by name via Eureka — no hardcoded `host:port`.
- **Database-per-service**: `student_db`, `trainer_db`, `coordinator_db` are fully isolated MySQL schemas. No service queries another's tables directly.
- **Stateless auth**: `auth-service` has no database — it looks up credentials from the three data services over internal REST calls, then signs a JWT.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Language / JDK | Java 17 |
| Framework | Spring Boot 3.4.2 |
| Service discovery | Spring Cloud Netflix Eureka (`spring-cloud-starter-netflix-eureka-client` / `-server`) |
| Gateway | Spring Cloud Gateway |
| Spring Cloud BOM | 2024.0.0 |
| Persistence | Spring Data JPA + Hibernate |
| Database | MySQL (`mysql-connector-j`) |
| Security | Spring Security + method-level `@PreAuthorize` |
| JWT | `io.jsonwebtoken` (jjwt) 0.12.6 — api / impl / jackson |
| Validation | `spring-boot-starter-validation` (Jakarta Bean Validation) |
| Boilerplate | Lombok (optional, excluded from final jar) |
| Build | Maven (per-service `pom.xml`, no parent multi-module aggregator) |

---

## Services & Ports

| Service | Port | Owns database | Purpose |
|---|---|---|---|
| `eureka-server` | 8761 | – | Service discovery registry |
| `api-gateway` | 8080 | – | Single public entry point, routes requests |
| `student-service` | 8081 | `student_db` | Student registration + data |
| `trainer-service` | 8082 | `trainer_db` | Trainer registration + data |
| `coordinator-service` | 8083 | `coordinator_db` | Coordinator registration, course CRUD, enrollments |
| `auth-service` | 8084 | none (stateless) | Unified login across all 3 roles, JWT issuing |

---

## Service Details

### eureka-server
Pure Netflix Eureka discovery server. Does not register itself (`register-with-eureka: false`, `fetch-registry: false`); self-preservation disabled for local dev.

```
eureka-server/src/main/java/com/org/lms/eureka/
└── EurekaServerApplication.java
```

### api-gateway
Spring Cloud Gateway, load-balances to services via Eureka using `lb://<service-name>` URIs. Pure router — no auth/rate-limiting at this layer.

```
api-gateway/src/main/java/com/org/lms/gateway/
└── ApiGatewayApplication.java
```

Routes (`application.yml`):

| Path predicate | Target |
|---|---|
| `/api/v1/students/**` | `lb://student-service` |
| `/api/v1/trainers/**` | `lb://trainer-service` |
| `/api/v1/coordinators/**` | `lb://coordinator-service` |
| `/api/v1/courses/**` | `lb://coordinator-service` |
| `/api/v1/auth/**` | `lb://auth-service` |

### auth-service
Stateless login/JWT-issuing service. No JPA, no database.

```
auth-service/src/main/java/com/org/lms/auth/
├── AuthController.java
├── AuthService.java
├── AuthServiceApplication.java
├── client/                    # RestTemplate-based clients resolved via Eureka
│   ├── CoordinatorClient.java
│   ├── StudentClient.java
│   └── TrainerClient.java
├── config/SecurityConfig.java
├── dto/{AuthResponse, LoginRequest, UserLookupResponse}.java
└── security/JwtTokenProvider.java   # the ONLY service that SIGNS tokens
```

### student-service
```
student-service/src/main/java/com/org/lms/student/
├── StudentServiceApplication.java
├── config/SecurityConfig.java
├── controller/{StudentController, StudentInternalController}.java
├── dto/{StudentRegisterRequest, StudentResponse, UserLookupResponse}.java
├── entity/Student.java
├── repository/StudentRepository.java
├── security/{JwtAuthFilter, JwtTokenProvider}.java   # verify-only
└── service/StudentService.java
```

### trainer-service
```
trainer-service/src/main/java/com/org/lms/trainer/
├── TrainerServiceApplication.java
├── config/SecurityConfig.java
├── controller/{TrainerController, TrainerInternalController}.java
├── dto/{TrainerResponse, TrainerSignupRequest, UserLookupResponse}.java
├── entity/Trainer.java
├── repository/TrainerRepository.java
├── security/{JwtAuthFilter, JwtTokenProvider}.java
└── service/TrainerService.java
```

### coordinator-service
Broadest service — owns coordinators, courses, and enrollments.

```
coordinator-service/src/main/java/com/org/lms/coordinator/
├── CoordinatorServiceApplication.java
├── config/SecurityConfig.java
├── controller/{CoordinatorController, CoordinatorInternalController, CourseController}.java
├── dto/{CoordinatorResponse, CoordinatorSignupRequest, CourseRequest, CourseResponse, EnrollmentResponse, UserLookupResponse}.java
├── entity/{Coordinator, Course, CourseEnrollment}.java
├── repository/{CoordinatorRepository, CourseEnrollmentRepository, CourseRepository}.java
├── security/{JwtAuthFilter, JwtTokenProvider}.java
└── service/{CoordinatorService, CourseService}.java
```

---

## Data Model

### `students` (student_db) — `Student`
| Field | Type | Notes |
|---|---|---|
| studentId | Long | PK, identity |
| firstName / lastName | String(50) | required |
| email | String(150) | unique, required |
| phoneNumber | String(20) | |
| qualification | String(100) | |
| status | enum: `ACTIVE`, `INACTIVE` | default `ACTIVE` |
| enrollmentDate | LocalDate | |
| password | String(255) | hashed |
| role | enum: `STUDENT` | fixed |
| createdAt / updatedAt | LocalDateTime | auto-managed |

### `trainers` (trainer_db) — `Trainer`
| Field | Type | Notes |
|---|---|---|
| trainerId | Long | PK, identity |
| firstName / lastName | String(50) | required |
| email | String(150) | unique, required |
| phoneNumber | String(20) | |
| specialization | String(100) | |
| experienceYears | Integer | |
| designation | String(100) | |
| status | enum: `ACTIVE`, `INACTIVE` | default `ACTIVE` |
| joiningDate | LocalDate | |
| password | String(255) | hashed |
| role | enum: `TRAINER` | fixed |
| createdAt / updatedAt | LocalDateTime | auto-managed |

### `coordinators` (coordinator_db) — `Coordinator`
| Field | Type | Notes |
|---|---|---|
| coordinatorId | Long | PK, identity |
| fullName | String(100) | required |
| email | String(150) | unique, required |
| phoneNumber | String(20) | |
| role | enum: `COORDINATOR` | fixed |
| status | enum: `ACTIVE`, `INACTIVE` | default `ACTIVE` |
| password | String(255) | hashed |
| createdAt / updatedAt | LocalDateTime | auto-managed |

### `courses` (coordinator_db) — `Course`
| Field | Type | Notes |
|---|---|---|
| courseId | Long | PK, identity |
| title | String(150) | required |
| description | String(1000) | |
| category | String(100) | |
| duration | String(50) | |
| startDate / endDate | LocalDate | |
| createdByEmail | String(150) | owning coordinator |
| createdAt / updatedAt | LocalDateTime | auto-managed |

### `course_enrollments` (coordinator_db) — `CourseEnrollment`
| Field | Type | Notes |
|---|---|---|
| enrollmentId | Long | PK, identity |
| courseId | Long | FK → courses (logical, no cross-service FK) |
| studentEmail | String(150) | |
| enrolledAt | LocalDateTime | auto-set |

Unique constraint: `(course_id, student_email)` — a student can enroll in a given course only once.

---

## API Reference

All external traffic goes through the gateway on **port 8080**. `/internal/**` endpoints are **not** gateway-routed — they're only reachable service-to-service.

### auth-service — `/api/v1/auth`
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/v1/auth/login` | public | Login with email/password; returns JWT + email + role |

### student-service — `/api/v1/students`
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/v1/students/registerstudent` | public | Register a new student |

Internal only: `GET /internal/students/by-email/{email}` — used by auth-service.

### trainer-service — `/api/v1/trainers`
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/v1/trainers/registertrainer` | public | Register a new trainer |

Internal only: `GET /internal/trainers/by-email/{email}` — used by auth-service.

### coordinator-service — `/api/v1/coordinators`
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/v1/coordinators/registercoordinator` | public | Register a new coordinator |
| GET | `/api/v1/coordinators/test-access` | `ROLE_COORDINATOR` | Sanity-check endpoint for coordinator auth |

Internal only: `GET /internal/coordinators/by-email/{email}` — used by auth-service.

### coordinator-service — `/api/v1/courses`
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/v1/courses` | `ROLE_COORDINATOR` | Create a course (owner = authenticated coordinator) |
| GET | `/api/v1/courses` | public | List all courses |
| GET | `/api/v1/courses/{courseId}` | public | Get a course by ID |
| PUT | `/api/v1/courses/{courseId}` | `ROLE_COORDINATOR` | Update a course |
| DELETE | `/api/v1/courses/{courseId}` | `ROLE_COORDINATOR` | Delete a course |
| POST | `/api/v1/courses/{courseId}/enroll` | `ROLE_STUDENT` | Enroll the authenticated student in a course |

**Total public/protected endpoints: 12** (1 auth, 1 student, 1 trainer, 2 coordinator, 6 course) + 3 internal lookup endpoints.

### Request DTOs (key fields)

- `LoginRequest`: `email` (required), `password` (required)
- `StudentRegisterRequest`: `firstName*`, `lastName*`, `email* (@Email)`, `phoneNumber`, `qualification`, `password*`
- `TrainerSignupRequest`: `firstName*`, `lastName*`, `email* (@Email)`, `phoneNumber`, `specialization`, `experienceYears`, `designation`, `password*`
- `CoordinatorSignupRequest`: `fullName*`, `email* (@Email)`, `phoneNumber`, `password*`
- `CourseRequest`: `title*`, `description`, `category`, `duration`, `startDate*`, `endDate*`

(`*` = `@NotBlank`/`@NotNull` required)

---

## Authentication & Security

### Login flow (the key design decision)

`auth-service` has **no database of its own**. On `POST /api/v1/auth/login`:

1. Calls `student-service`'s `GET /internal/students/by-email/{email}` over REST (resolved via Eureka, no hardcoded host:port).
2. If not found, calls `trainer-service`'s equivalent internal endpoint.
3. If still not found, calls `coordinator-service`'s equivalent internal endpoint.
4. Whichever service responds with a match, `auth-service` verifies the password itself (its own `PasswordEncoder`) and issues a JWT containing the user's **email** and **role** as claims.
5. If no service matches, or the password doesn't match, login fails with "Invalid email or password".

This mirrors the "lookup-chain" design from the original monolith — each former repository call is now a network call to a different service.

### JWT

- Signed **only** by `auth-service` (`security/JwtTokenProvider`).
- Verified (not signed) independently by `student-service`, `trainer-service`, `coordinator-service` via their own `JwtAuthFilter` + `JwtTokenProvider`.
- **The `app.jwt.secret` value must be identical across all four services** — currently kept in sync via the same default value in each `application.yml` (overridable via `JWT_SECRET` env var).
- Default token expiry: 86,400,000 ms (24h), via `JWT_EXPIRATION_MS`.

### Role-based access control

Enforced with `@PreAuthorize` on individual endpoints:
- `ROLE_COORDINATOR` — course create/update/delete, coordinator test-access.
- `ROLE_STUDENT` — course enrollment.
- Registration endpoints and course read (`GET`) endpoints are public.

### Internal endpoints

`/internal/**` on each data service exists solely for `auth-service` to call during login. They are **not** registered as gateway routes, so external clients can't reach them through the public entry point (port 8080). They are *not* additionally locked down with a shared internal API key or mTLS — see [Known Simplifications](#known-simplifications).

---

## Setup & Run Order

### 1. Create the databases

```sql
SOURCE setup-databases.sql;
```

Update `datasource.username` / `datasource.password` in each service's `application.yml` (or set `SPRING_DATASOURCE_USERNAME` / `SPRING_DATASOURCE_PASSWORD`) to match your MySQL credentials.

### 2. Build each service

```bash
cd eureka-server && mvn clean install
cd ../api-gateway && mvn clean install
cd ../student-service && mvn clean install
cd ../trainer-service && mvn clean install
cd ../coordinator-service && mvn clean install
cd ../auth-service && mvn clean install
```

### 3. Start in this order

1. **eureka-server** — wait for full startup, verify `http://localhost:8761` shows the dashboard.
2. **student-service**, **trainer-service**, **coordinator-service** — any order, can start in parallel. Watch logs for Eureka registration confirmation.
3. **auth-service** — needs the three above registered so it can find them.
4. **api-gateway** — last; also needs Eureka up to resolve routes.

Refresh `http://localhost:8761` — all 5 registering services should be listed (eureka-server itself doesn't register).

### 4. Test through the gateway (port 8080 only)

```
POST http://localhost:8080/api/v1/students/registerstudent
POST http://localhost:8080/api/v1/trainers/registertrainer
POST http://localhost:8080/api/v1/coordinators/registercoordinator
POST http://localhost:8080/api/v1/auth/login
GET  http://localhost:8080/api/v1/courses
```

---

## What Changed vs. the Monolith

- One `lms_db` database became three: `student_db`, `trainer_db`, `coordinator_db`. No service queries another service's tables directly anymore.
- `AuthService` no longer injects `StudentRepository`/`TrainerRepository`/`CoordinatorRepository` directly — it injects `StudentClient`/`TrainerClient`/`CoordinatorClient`, which make REST calls instead.
- Each service is its own deployable unit with its own `pom.xml`, `@SpringBootApplication`, and port — e.g. `trainer-service` can be redeployed alone without touching the others.
- `JwtAuthFilter` and `JwtTokenProvider` (validation-only) are duplicated into each of the three data services, since each independently needs to verify token signatures for its protected endpoints.

## Known Simplifications

- **No gateway-level auth/rate-limiting** — the gateway is a pure router. JWT validation happens independently in each downstream service rather than once at the edge.
- **Internal endpoints are protected only by not being gateway-routed** — no shared internal API key or mTLS between services.
- **No message broker** (Kafka/RabbitMQ) — all inter-service communication is synchronous REST via `RestTemplate`. Fine for a request/response flow like login, but wouldn't fit an event-driven use case.
- **No config server** (Spring Cloud Config) — each service keeps its own local `application.yml`; shared values (like the JWT secret) must be kept in sync by hand across services.
- **No cross-service referential integrity** — `CourseEnrollment.courseId` and `.studentEmail` are logical references only; there's no DB-level FK across `coordinator_db` and `student_db`.
