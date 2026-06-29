# TechV LMS Backend - Spring Boot Project Skeleton

This project contains the backend core layer for the Enterprise Learning Management System (LMS). It is built using Java 17 and Spring Boot 3.5.0, persisted via a MySQL 8.4 database, and secured with Spring Security 6.4.x and JJWT 0.12.x stateless tokens.

---

## Technical Stack & Configuration

- **Java**: Version 17
- **Spring Boot**: Version 3.5.0
- **Build System**: Maven
- **Security**: Spring Security (RBAC) + JJWT 0.12.6
- **Database Persistence**: Spring Data JPA + Hibernate 6.6.x
- **Documentation**: SpringDoc OpenAPI 2.8.5 (Swagger UI accessible at `/swagger-ui/index.html` when running)
- **Aggregated Analytics & Monitoring**: Spring Boot Actuator

---

## Directory Architecture

The backend project structure is organized cleanly by domain modules:

```
src/main/java/com/org/lms/
├── LmsApplication.java        # Main Spring Boot entrypoint
├── config/                    # SecurityConfig, CorsConfig, OpenApiConfig
├── security/                  # JwtAuthFilter, JwtTokenProvider, CustomUserDetailsService
├── auth/                      # Controllers, Services, and credentials DTOs
├── user/                      # Student & Trainer entity subclasses, repositories, controllers
├── course/                    # Course entity, repository, service, and endpoints
├── batch/                     # Batch entity, courses links, trainer assignments, and student enrollments
├── session/                   # Class scheduling and Virtual classroom details
├── attendance/                # Class attendance records (present / absent)
├── assignment/                # Assignment CRUD, Student submissions, and Trainer grading
├── zoom/                      # HMAC-SHA256 signature generator for Zoom Web SDK
├── common/                    # UserRole, UserStatus, BaseEntity, and ApiResponse envelopes
└── exception/                 # ErrorResponse and GlobalExceptionHandler advice
```

---

## REST Endpoints Overview

All endpoints (except `/api/v1/auth/login`) require a valid JWT token in the `Authorization: Bearer <JWT>` header.

### 1. Authentication & Security
- `POST /api/v1/auth/login` (Public) - Login with email & password, returns JWT token.
- `POST /api/v1/auth/logout` (Authenticated) - Invalidate session client-side.
- `POST /api/v1/auth/refresh-token` (Authenticated) - Generates a renewed JWT.
- `GET /api/v1/auth/profile` (Authenticated) - Fetches the authenticated user profile.
- `PUT /api/v1/auth/change-password` (Authenticated) - Modifies current user password.

### 2. Student & Trainer Management (Coordinator Only)
- `POST /api/v1/students` - Register a student.
- `GET /api/v1/students` - List all students.
- `GET /api/v1/students/{studentId}` - Get student by ID (accessible by Coordinators or Self).
- `PUT /api/v1/students/{studentId}` - Update student record.
- `DELETE /api/v1/students/{studentId}` - Delete student.
- `POST /api/v1/trainers` - Register a trainer.
- `GET /api/v1/trainers` - List all trainers.
- `GET /api/v1/trainers/{trainerId}` - Get trainer by ID (accessible by Coordinators or Self).
- `PUT /api/v1/trainers/{trainerId}` - Update trainer record.

### 3. Course Management
- `POST /api/v1/courses` (Coordinator) - Create new course.
- `GET /api/v1/courses` (All) - List all courses.
- `GET /api/v1/courses/{courseId}` (All) - Details of a course.
- `PUT /api/v1/courses/{courseId}` (Coordinator) - Edit course.
- `DELETE /api/v1/courses/{courseId}` (Coordinator) - Delete course.

### 4. Batch & Enrollments Management (Coordinator Only)
- `POST /api/v1/batches` - Create a batch linked to a course.
- `GET /api/v1/batches` - List all batches.
- `PUT /api/v1/batches/{batchId}` - Update a batch.
- `DELETE /api/v1/batches/{batchId}` - Delete a batch.
- `POST /api/v1/batches/{batchId}/trainers` - Assign a trainer to a batch.
- `GET /api/v1/batches/{batchId}/trainers` - List all assigned trainers in a batch.
- `DELETE /api/v1/batches/{batchId}/trainers/{trainerId}` - Remove trainer from batch.
- `POST /api/v1/batches/{batchId}/students` - Enroll a student in a batch.
- `GET /api/v1/batches/{batchId}/students` - List all enrolled students in a batch.
- `DELETE /api/v1/batches/{batchId}/students/{studentId}` - Remove student from batch.

### 5. Session / Virtual Classroom
- `POST /api/v1/classes` (Coordinator) - Schedule a live class session.
- `GET /api/v1/classes` (Coordinator) - View all class schedules.
- `GET /api/v1/classes/trainer/{trainerId}` (Coordinator / Trainer) - Get scheduled sessions for a trainer.
- `GET /api/v1/classes/student/{studentId}` (Coordinator / Student) - Get sessions for batches enrolled by a student.

### 6. Attendance Tracking
- `POST /api/v1/attendance` (Trainer) - Save or update attendance for students.
- `GET /api/v1/attendance/class/{classId}` (Trainer / Coordinator) - Retrieve class attendance sheet.
- `GET /api/v1/attendance/student/{studentId}` (Coordinator / Student Self) - Student attendance history.

### 7. Assignments & Grading
- `POST /api/v1/assignments` (Trainer) - Create an assignment for a course.
- `GET /api/v1/assignments` (All) - List all assignments.
- `POST /api/v1/submissions` (Student) - Upload submission file path.
- `GET /api/v1/submissions/assignment/{assignmentId}` (Trainer) - List submissions.
- `POST /api/v1/grades` (Trainer) - Grade student submission with score & feedback.

### 8. Zoom Embedded Web SDK Integration
- `POST /api/v1/zoom/signature` (Trainer / Student) - Generates a secure HMAC-SHA256 signature for live classes.
  - Role resolver: Automatically flags a host role (`1`) if the requester has trainer/coordinator permissions, and attendee role (`0`) for students.

---

## Local Development & Setup

### 1. Prerequisites
- **Java JDK 17** ( Temurin or OpenJDK )
- **Maven** 3.9.x
- **MySQL Server** 8.4

### 2. Environment Variables
Create the database `lms_db` in MySQL and configure access via environment variables:
```bash
export SPRING_DATASOURCE_URL=jdbc:mysql://localhost:3306/lms_db
export SPRING_DATASOURCE_USERNAME=root
export SPRING_DATASOURCE_PASSWORD=yourpassword

# Zoom Credentials
export ZOOM_CLIENT_ID=your-zoom-client-id
export ZOOM_CLIENT_SECRET=your-zoom-client-secret
export ZOOM_ACCOUNT_ID=your-zoom-account-id
```

### 3. Run Application
Run the spring boot development target:
```bash
mvn spring-boot:run
```
The server will boot up locally on port `8080`.
Documentation index will be available at: `http://localhost:8080/swagger-ui/index.html`
