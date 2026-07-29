# LMS Backend - Microservices Version

This is the microservices version of the original `lms-backend` monolith. It splits
the original single Spring Boot app into 5 independently deployable services.

## Services and ports

| Service              | Port | Owns database    | Purpose                                    |
|----------------------|------|------------------|---------------------------------------------|
| eureka-server        | 8761 | -                | Service discovery registry                  |
| api-gateway          | 8080 | -                | Single public entry point, routes requests  |
| student-service      | 8081 | student_db       | Student registration + data                 |
| trainer-service      | 8082 | trainer_db       | Trainer registration + data                  |
| coordinator-service  | 8083 | coordinator_db   | Coordinator registration + data              |
| auth-service         | 8084 | none (stateless) | Unified login across all 3 roles            |

## How login works across services (the key design decision)

`auth-service` has **no database of its own**. When a login request comes in:

1. It calls `student-service`'s internal endpoint `GET /internal/students/by-email/{email}`
   over REST (resolved via Eureka - no hardcoded host:port).
2. If not found, it calls `trainer-service`'s equivalent internal endpoint.
3. If still not found, it calls `coordinator-service`'s equivalent internal endpoint.
4. Whichever one responds with a match, `auth-service` verifies the password itself
   (it has its own `PasswordEncoder`) and issues a JWT containing the user's email
   and role as claims.

This mirrors the "Approach 1" lookup-chain design from the monolith, except each
"repository call" is now a network call to a different service.

**Internal endpoints** (`/internal/**` on each service) are NOT routed through the
API Gateway - only `auth-service` calls them directly, service-to-service. External
clients (Postman, a frontend) can only reach the public endpoints through the gateway
on port 8080.

## JWT secret must match everywhere

Every service that validates tokens (`student-service`, `trainer-service`,
`coordinator-service`) and the one that signs them (`auth-service`) must be
configured with the **exact same** `app.jwt.secret` value. This is already set
consistently in each `application.yml` via the same default value - if you change
it in one service (e.g. via the `JWT_SECRET` environment variable), you must
change it identically in all four.

## Setup and run order

### 1. Create the databases

```sql
-- run setup-databases.sql in MySQL Workbench or the mysql CLI
SOURCE setup-databases.sql;
```

Update the `datasource.username` / `datasource.password` in each service's
`application.yml` (or set `SPRING_DATASOURCE_USERNAME` / `SPRING_DATASOURCE_PASSWORD`
environment variables) to match your actual MySQL credentials.

### 2. Build each service

From inside each service folder:

```bash
cd eureka-server && mvn clean install
cd ../api-gateway && mvn clean install
cd ../student-service && mvn clean install
cd ../trainer-service && mvn clean install
cd ../coordinator-service && mvn clean install
cd ../auth-service && mvn clean install
```

(Or import each folder as a separate project into STS/IntelliJ.)

### 3. Start them in this order

Order matters the first time, since services register themselves with Eureka on
startup, and the gateway/auth-service need Eureka to already be up to resolve
other services by name.

1. **eureka-server** first - wait until you see it fully started, then check
   `http://localhost:8761` in a browser. You should see the Eureka dashboard.
2. **student-service**, **trainer-service**, **coordinator-service** - any order,
   can start in parallel. Watch their logs for `DiscoveryClient_STUDENT-SERVICE ...
   registration status: 204` (or similar) confirming Eureka registration.
3. **auth-service** - needs the three above to be registered so it can find them.
4. **api-gateway** last - it also needs Eureka up to resolve routes.

Refresh `http://localhost:8761` after everything is up - you should see all 5
services listed as registered instances (eureka-server itself doesn't register).

### 4. Test through the gateway (port 8080 - NOT the individual service ports)

All external requests go through the gateway now, same paths as before:

```
POST http://localhost:8080/api/v1/students/registerstudent
POST http://localhost:8080/api/v1/trainers/registertrainer
POST http://localhost:8080/api/v1/coordinators/registercoordinator
POST http://localhost:8080/api/v1/auth/login
```

Request/response shapes are identical to the monolith version - existing Postman
collections should work unchanged, just confirm you're hitting port 8080.

## What changed structurally vs. the monolith

- One `lms_db` database became three: `student_db`, `trainer_db`, `coordinator_db`.
  No service can query another service's tables directly anymore.
- `AuthService` no longer injects `StudentRepository`/`TrainerRepository`/
  `CoordinatorRepository` directly. It injects `StudentClient`/`TrainerClient`/
  `CoordinatorClient`, which make REST calls instead.
- Each service is now its own deployable unit with its own `pom.xml`, own
  `@SpringBootApplication`, own port - you could redeploy `trainer-service` alone
  without touching the others.
- `JwtAuthFilter` and `JwtTokenProvider` (validation-only) are duplicated into
  each of the three data services, since each one independently needs to be able
  to verify a token's signature for any future protected endpoints they add.

## Known simplifications (worth mentioning if asked in an interview)

- No API Gateway-level authentication/rate-limiting - the gateway is a pure router
  here. In a fuller setup, JWT validation could happen once at the gateway instead
  of independently in each service.
- Internal endpoints (`/internal/**`) are protected only by *not* being routed
  through the gateway - they're not additionally locked down with a shared internal
  API key or mTLS, which a production system would add.
- No message broker (Kafka/RabbitMQ) - all inter-service communication is
  synchronous REST via `RestTemplate`. That's a reasonable choice for a
  request/response flow like login, but wouldn't fit an event-driven use case.
- No config server (Spring Cloud Config) - each service still has its own local
  `application.yml`, so shared values (like the JWT secret) must be kept in sync
  by hand across services.
