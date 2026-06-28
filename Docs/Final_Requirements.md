**Enterprise Learning Management System (LMS)**

Final Requirements Document

Version 1.0- Final Draft
June 2026

# Document Information

| **Field** | **Detail** |
| --- | --- |
| Project Name | Enterprise Learning Management System (LMS) |
| Document Type | Consolidated Requirements Specification |
| Version | 1.0 Final |
| Status | Final Draft |
| Date | June 2026 |

# Table of Contents

1. Title & Abstract

2. Purpose & Scope

3. Technology Stack

4. System Architecture Overview

5. User Roles & Data Models

6. Functional Requirements

7. API Endpoint Specification

8. Frontend Requirements

9. Non-Functional Requirements

10. DevOps & Deployment

11. End-to-End User Flows

12. Assumptions & Constraints

13. Verification Plan

# 1. Title & Abstract

**Title:** Enterprise Learning Management System (LMS) with Integrated Virtual Classroom, Role-Based Access Control, and Cloud-Native Deployment

## Abstract

The Enterprise Learning Management System (LMS) is a modern, scalable, and secure web-based platform designed to streamline the management, delivery, and monitoring of online and instructor-led training programs. The system provides a centralised environment where coordinators, trainers, and students can interact efficiently through course management, virtual classrooms, attendance tracking, assignment submissions, grading, and performance analytics.

The application is developed using a modern full-stack architecture consisting of Java 17 and Spring Boot 3.5.x for the backend services, React 17 with TypeScript and Tailwind CSS for the frontend user interface, and MySQL 8.4 LTS as the relational database management system. The platform follows a microservice-ready, containerised deployment model using Docker and supports automated build, test, and deployment pipelines through GitHub Actions CI/CD workflows.

A key feature of the system is the seamless integration of the Zoom Embedded Web SDK, enabling live virtual classes directly within the LMS interface. Trainers can schedule and conduct online sessions, while students can join classes without leaving the application. The backend securely generates Zoom meeting signatures and manages authentication using Zoom Server-to-Server OAuth credentials.

The system implements Role-Based Access Control (RBAC) using Spring Security and JWT authentication mechanisms.

# 2. Purpose & Scope

This document captures the functional and technical requirements for the Enterprise LMS. It is intended to align all stakeholders’ product, development, QA, and DevOps on what the system must do before development begins.

The platform allows:

* **Coordinators** to manage courses, batches, trainers, and students
* **Trainers** to conduct and assess classes
* **Students** to learn, attend live sessions, and track their own progress

— all within a single secured web application.

This consolidated specification covers: backend architecture, technology choices with justification, data layer, security model, integration with Zoom, frontend architecture, error handling, observability, DevOps pipeline, and deployment strategy. It is written so that an engineer unfamiliar with the project can set up a local environment, understand every architectural decision, and begin contributing within a day.

# 3. Technology Stack

## 3.1 Backend Core Runtime & Framework

| **Layer** | **Tool** | **Version** |
| --- | --- | --- |
| Language | Java (OpenJDK / Eclipse Temurin) | 17 (LTS) |
| Framework | Spring Boot | 3.5.x |
| Build Tool | Apache Maven | 3.9.x |
| Web Layer | Spring Web (Tomcat embedded) | Bundled with Boot 3.5.x (Tomcat 10.1.x) |

## 3.2 Security & Authentication

| **Tool** | **Version** |
| --- | --- |
| Spring Security | 6.4.x (managed by Spring Boot 3.5.x BOM) |
| jjwt (io.jsonwebtoken) | 0.12.x |

## 3.3 Data Layer

| **Tool** | **Version** |
| --- | --- |
| MySQL Server | 8.4 LTS |
| Spring Data JPA | 3.4.x (Boot-managed) |
| Hibernate ORM | 6.6.x (Boot-managed) |

## 3.4 Observability & Operations

| **Tool** | **Version** |
| --- | --- |
| SLF4J + Logback | Bundled with Spring Boot (Structured JSON logging) |
| Spring Boot Actuator | Boot-managed |

## 3.5 Testing

| **Tool** | **Purpose** |
| --- | --- |
| JUnit 5 | Unit & integration testing framework |
| Mockito | Mocking framework for service-layer tests |
| JaCoCo | Code coverage reporting (target: 80%+ line coverage) |

## 3.6 Frontend

| **Layer** | **Tool / Version** |
| --- | --- |
| Framework | React 17 with TypeScript |
| Build Tool | Vite |
| Styling | Tailwind CSS v3 |
| Routing | React Router v6 |
| State / Auth | Context API + JWT (localStorage) |
| HTTP Client | Axios |
| Icons | Lucide React |
| Notifications | React Hot Toast |

## 3.7 Virtual Classroom

| **Component** | **Technology** |
| --- | --- |
| SDK | Zoom Embedded Web SDK |
| Auth Model | Server-to-Server OAuth (Zoom) |
| Signature Generation | HMAC-SHA256 (backend) |

## 3.8 DevOps & Infrastructure

| **Component** | **Technology** |
| --- | --- |
| Source Code Management | GitHub |
| CI/CD Automation | GitHub Actions |
| Containerisation | Docker |
| Cloud Platform | Clever Cloud |
| Application Hosting | Render |
| Async Messaging | Apache Kafka |

# 4. System Architecture Overview

The system follows a three-tier architecture: React frontend communicates with the Spring Boot backend via REST APIs secured with JWT. The backend connects to MySQL for persistence, Zoom API for virtual classroom signatures, Apache Kafka for async messaging, and local/cloud file storage for assignment files.

## High-Level Architecture

┌─────────────────────────────┐
│ React Frontend │
│ (Vite + TypeScript + │
│ Tailwind CSS) │
└────────────┬────────────────┘
 │ REST API + JWT
┌────────────▼────────────────┐
│ Spring Boot Backend │
│ (Java 17) │
├─────────┬──────┬────────┬───┤
│ MySQL │ Zoom │ Kafka │FS │
│ 8.4 LTS │ API │ │ │
└─────────┴──────┴────────┴───┘

## Backend Project Structure

lms-backend/
├── src/
│ ├── main/
│ │ ├── java/com/org/lms/
│ │ │ ├── LmsApplication.java
│ │ │ ├── config/ # SecurityConfig, CorsConfig, OpenApiConfig
│ │ │ ├── security/ # JwtAuthFilter, JwtTokenProvider
│ │ │ ├── auth/ # Controller, service, DTOs
│ │ │ ├── user/ # Coordinator/Trainer/Student entities
│ │ │ ├── course/
│ │ │ ├── batch/
│ │ │ ├── session/
│ │ │ ├── attendance/
│ │ │ ├── assignment/
│ │ │ ├── zoom/
│ │ │ ├── common/
│ │ │ └── exception/
│ │ └── resources/
│ │ └── application.yml
│ └── test/
├── pom.xml
└── README.md

## Frontend Project Structure

LMSLocal/
├── public/
├── src/
│ ├── api/ # Axios instance + API call helpers
│ ├── assets/ # Images, logos
│ ├── components/
│ │ ├── common/ # Navbar, Sidebar, Loader, Modal
│ │ ├── auth/ # Login, ProtectedRoute
│ │ ├── coordinator/ # Coordinator-specific components
│ │ ├── trainer/ # Trainer-specific components
│ │ └── student/ # Student-specific components
│ ├── context/
│ │ └── AuthContext.tsx
│ ├── hooks/ # Custom hooks
│ ├── pages/
│ │ ├── auth/ # LoginPage
│ │ ├── coordinator/ # Dashboard, Courses, Batches, Users, Schedule
│ │ ├── trainer/ # Dashboard, Classes, Attendance, Assignments, Grades
│ │ └── student/ # Dashboard, Courses, LiveClass, Assignments, Progress
│ ├── routes/ # AppRouter with role-based protected routes
│ ├── types/ # Shared TypeScript interfaces
│ ├── utils/ # Helpers
│ ├── App.tsx
│ └── main.tsx
├── index.html
├── tailwind.config.js
├── tsconfig.json
├── vite.config.ts
└── package.json

# 5. User Roles & Data Models

Three primary user roles are supported. Each role has its own data model, responsibilities, and access boundaries.

## 5.1 Coordinator

Acts as the admin-level user. Owns the full lifecycle of courses, batches, trainers, and students.

| **Field** | **Type / Constraint** | **Notes** |
| --- | --- | --- |
| id | BIGINT, PK, Auto Increment |  |
| fullName | VARCHAR(100), NOT NULL |  |
| email | VARCHAR(150), UNIQUE, NOT NULL | Used as login credential |
| phoneNumber | VARCHAR(20) | Optional |
| role | ENUM fixed as COORDINATOR |  |
| status | ENUM: ACTIVE / INACTIVE | Default: ACTIVE |
| password | VARCHAR(255), NOT NULL | BCrypt hashed |
| createdAt | DATETIME | Auto-set on insert |
| updatedAt | DATETIME | Auto-set on update |

**Responsibilities:**

* Create, update, and delete courses
* Create batches and link them to courses
* Add trainers and students to the system
* Assign trainers to batches
* Enroll students into batches
* Schedule live class sessions
* Monitor attendance and performance reports

## 5.2 Trainer

Conducts live classes, records attendance, creates assignments, evaluates submissions, and publishes grades.

| **Field** | **Type / Constraint** | **Notes** |
| --- | --- | --- |
| trainer\_id | BIGINT, PK, Auto Increment |  |
| employee\_id | VARCHAR(50), UNIQUE, NOT NULL | Corporate employee identifier |
| first\_name | VARCHAR(50), NOT NULL |  |
| last\_name | VARCHAR(50), NOT NULL |  |
| email | VARCHAR(150), UNIQUE, NOT NULL | Used as login credential |
| phone\_number | VARCHAR(20) | Optional |
| specialization | VARCHAR(100) | Subject / domain area |
| experience\_years | INT | Years of experience |
| designation | VARCHAR(100) | Job title |
| status | ENUM: ACTIVE / INACTIVE | Default: ACTIVE |
| joining\_date | DATE |  |
| password | VARCHAR(255), NOT NULL | BCrypt hashed |
| created\_at | DATETIME | Auto-set on insert |
| updated\_at | DATETIME | Auto-set on update |

**Responsibilities:**

* View and join scheduled class sessions
* Conduct live Zoom sessions (host role)
* Record attendance for students per session
* Create assignments and attach supporting files
* Evaluate student submissions and enter scores
* Publish grades and written feedback

## 5.3 Student

Represents a learner enrolled in one or more courses and batches.

| **Field** | **Type / Constraint** | **Notes** |
| --- | --- | --- |
| studentId | BIGINT, PK, Auto Increment |  |
| employeeId | VARCHAR(50), UNIQUE, NOT NULL | Corporate employee identifier |
| firstName | VARCHAR(50), NOT NULL |  |
| lastName | VARCHAR(50), NOT NULL |  |
| email | VARCHAR(150), UNIQUE, NOT NULL | Used as login credential |
| phoneNumber | VARCHAR(20) | Optional |
| qualification | VARCHAR(100) | Highest qualification |
| status | ENUM: ACTIVE / INACTIVE | Default: ACTIVE |
| enrollmentDate | DATE | Date added to a batch |
| password | VARCHAR(255), NOT NULL | BCrypt hashed |
| role | ENUM fixed as STUDENT |  |
| createdAt | DATETIME | Auto-set on insert |
| updatedAt | DATETIME | Auto-set on update |

**Responsibilities:**

* View assigned courses and batch schedule
* Join live Zoom sessions (attendee role) within the browser
* Access learning materials uploaded per course
* Submit assignment files before the due date
* Track own attendance percentage
* View grades and trainer feedback

# 6. Functional Requirements

## 6.1 Authentication & Authorisation

* All users log in with email and password via POST /api/v1/auth/login
* System returns a JWT token on successful authentication
* All protected routes require Authorization: Bearer <token> header
* Passwords are stored as BCrypt hashes never plaintext
* New users are registered by a Coordinator (no public self-registration)
* Token refresh supported via POST /api/v1/auth/refresh-token
* Users can view their profile via GET /api/v1/auth/profile
* Password change supported via PUT /api/v1/auth/change-password
* JWT is stateless; logout handled client-side by clearing stored token

## 6.2 Course Management

* Coordinator can create a course with title, description, category, duration, start and end dates
* Coordinator can update or delete any course
* All authenticated users can view the course list
* Individual course details accessible by ID

## 6.3 Batch Management

* Coordinator creates batches linked to a course, with name, start/end dates, and max student capacity
* Coordinator assigns one or more trainers to a batch
* Coordinator enrolls students into a batch
* A student or trainer can belong to multiple batches
* Trainer and student assignment/enrollment managed via dedicated sub-resource endpoints

## 6.4 Session / Virtual Classroom Scheduling

* Coordinator schedules a live class session by specifying batch, trainer, start time, duration, and topic
* Trainers can view their own upcoming sessions
* Students can view sessions associated with their enrolled batches
* Sessions can be created, viewed, updated, and deleted

## 6.5 Virtual Classroom Zoom Integration

* Backend generates a Zoom meeting signature via HMAC-SHA256 using Server-to-Server OAuth credentials
* Trainer joins as host (role = 1); Student joins as attendee (role = 0)
* Zoom session is embedded directly inside the LMS no external redirect
* Zoom credentials (Account ID, Client ID, Client Secret) are stored in environment variables only
* Zoom meeting IDs are created externally (via Zoom dashboard or API) and linked to sessions; the LMS generates only the join signature

## 6.6 Attendance

* Trainer records attendance per student per session (present / absent)
* Coordinator can view attendance for any session
* Student can view their own attendance history and percentage
* Attendance data queryable by class ID or student ID

## 6.7 Assignments

* Trainer creates an assignment for a course with title, description, due date, max score, and optional file attachment
* Student submits a file upload against an assignment before the due date
* Trainer reviews all submissions, enters a numeric score and optional feedback
* Assignments can be created, viewed, updated, and deleted

## 6.8 Submissions

* Student submits assignment work via file upload (multipart)
* Submissions queryable by assignment ID or individual submission ID
* Submission timestamps recorded automatically

## 6.9 Grading

* Trainer enters score and feedback for each submission
* Grades are published and become visible to the student
* Grades queryable by student or by assignment

## 6.10 Reporting & Dashboard

* Coordinator can view attendance summaries across sessions and batches
* Student can view their own performance grades, scores, attendance percentage
* Coordinator Dashboard: System-wide metrics (total courses, batches, students, trainers)
* Trainer Dashboard: Assigned batches, upcoming sessions, pending assignments to review
* Student Dashboard: Enrolled courses, upcoming classes, attendance %, recent grades

## 6.11 File Management

* Multipart file upload for assignment attachments and submissions
* File type and size validation required before storage
* Files stored on local filesystem for v1 (S3 or equivalent can be introduced later)
* Files can be uploaded, downloaded by ID, and deleted

# 7. API Endpoint Specification

**Base path:** /api/v1 All endpoints except /api/v1/auth/login require a valid JWT in the Authorization header.

## 7.1 Authentication Module

| **Method** | **Endpoint** | **Access** | **Description** |
| --- | --- | --- | --- |
| POST | /api/v1/auth/login | Public | Email + password → JWT token |
| POST | /api/v1/auth/logout | Authenticated | Invalidate session (client-side) |
| POST | /api/v1/auth/refresh-token | Authenticated | Refresh JWT token |
| GET | /api/v1/auth/profile | Authenticated | Get current user profile |
| PUT | /api/v1/auth/change-password | Authenticated | Change password |

## 7.2 Course Module

| **Method** | **Endpoint** | **Access** | **Description** |
| --- | --- | --- | --- |
| POST | /api/v1/courses | Coordinator | Create a new course |
| GET | /api/v1/courses | All roles | List all courses |
| GET | /api/v1/courses/{courseId} | All roles | Get course by ID |
| PUT | /api/v1/courses/{courseId} | Coordinator | Update course |
| DELETE | /api/v1/courses/{courseId} | Coordinator | Delete course |

## 7.3 Batch Module

| **Method** | **Endpoint** | **Access** | **Description** |
| --- | --- | --- | --- |
| POST | /api/v1/batches | Coordinator | Create a new batch (linked to course) |
| GET | /api/v1/batches | All roles | List all batches |
| GET | /api/v1/batches/{batchId} | All roles | Get batch by ID |
| PUT | /api/v1/batches/{batchId} | Coordinator | Update batch |
| DELETE | /api/v1/batches/{batchId} | Coordinator | Delete batch |

## 7.4 Student Module

| **Method** | **Endpoint** | **Access** | **Description** |
| --- | --- | --- | --- |
| POST | /api/v1/students | Coordinator | Register a new student |
| GET | /api/v1/students | Coordinator | List all students |
| GET | /api/v1/students/{studentId} | Coordinator, Self | Get student by ID |
| PUT | /api/v1/students/{studentId} | Coordinator | Update student |
| DELETE | /api/v1/students/{studentId} | Coordinator | Delete student |

## 7.5 Trainer Module

| **Method** | **Endpoint** | **Access** | **Description** |
| --- | --- | --- | --- |
| GET | /api/v1/trainers | Coordinator | List all trainers |
| GET | /api/v1/trainers/{trainerId} | Coordinator, Self | Get trainer by ID |
| PUT | /api/v1/trainers/{trainerId} | Coordinator | Update trainer |
| GET | /api/v1/trainers/{trainerId}/courses | Coordinator, Self | Get trainer's courses |
| GET | /api/v1/trainers/{trainerId}/batches | Coordinator, Self | Get trainer's batches |

## 7.6 Trainer Assignment (to Batch)

| **Method** | **Endpoint** | **Access** | **Description** |
| --- | --- | --- | --- |
| POST | /api/v1/batches/{batchId}/trainers | Coordinator | Assign trainer to batch |
| GET | /api/v1/batches/{batchId}/trainers | Coordinator | List trainers in batch |
| DELETE | /api/v1/batches/{batchId}/trainers/{trainerId} | Coordinator | Remove trainer from batch |

## 7.7 Student Enrollment (to Batch)

| **Method** | **Endpoint** | **Access** | **Description** |
| --- | --- | --- | --- |
| POST | /api/v1/batches/{batchId}/students | Coordinator | Enroll student in batch |
| GET | /api/v1/batches/{batchId}/students | Coordinator | List students in batch |
| DELETE | /api/v1/batches/{batchId}/students/{studentId} | Coordinator | Remove student from batch |

## 7.8 Virtual Classroom / Session Module

| **Method** | **Endpoint** | **Access** | **Description** |
| --- | --- | --- | --- |
| POST | /api/v1/classes | Coordinator | Schedule a class session |
| GET | /api/v1/classes | Coordinator | List all sessions |
| GET | /api/v1/classes/{classId} | All roles | Get session by ID |
| PUT | /api/v1/classes/{classId} | Coordinator | Update session |
| DELETE | /api/v1/classes/{classId} | Coordinator | Delete session |

## 7.9 Attendance Module

| **Method** | **Endpoint** | **Access** | **Description** |
| --- | --- | --- | --- |
| POST | /api/v1/attendance | Trainer | Record attendance |
| GET | /api/v1/attendance | Coordinator | List all attendance records |
| GET | /api/v1/attendance/class/{classId} | Trainer, Coordinator | Attendance for a class |
| GET | /api/v1/attendance/student/{studentId} | Student (self), Coordinator | Attendance history for student |

## 7.10 Assignment Module

| **Method** | **Endpoint** | **Access** | **Description** |
| --- | --- | --- | --- |
| POST | /api/v1/assignments | Trainer | Create assignment |
| GET | /api/v1/assignments | All roles | List all assignments |
| GET | /api/v1/assignments/{assignmentId} | All roles | Get assignment by ID |
| PUT | /api/v1/assignments/{assignmentId} | Trainer | Update assignment |
| DELETE | /api/v1/assignments/{assignmentId} | Trainer | Delete assignment |

## 7.11 Submission Module

| **Method** | **Endpoint** | **Access** | **Description** |
| --- | --- | --- | --- |
| POST | /api/v1/submissions | Student | Submit assignment work (multipart) |
| GET | /api/v1/submissions | Trainer, Coordinator | List all submissions |
| GET | /api/v1/submissions/{submissionId} | Trainer, Student (self) | Get submission by ID |
| GET | /api/v1/submissions/assignment/{assignmentId} | Trainer | All submissions for assignment |

## 7.12 Grading Module

| **Method** | **Endpoint** | **Access** | **Description** |
| --- | --- | --- | --- |
| POST | /api/v1/grades | Trainer | Enter grade (score, feedback) |
| GET | /api/v1/grades/student/{studentId} | Student (self), Coordinator | Grades for a student |
| GET | /api/v1/grades/assignment/{assignmentId} | Trainer | Grades for an assignment |
| PUT | /api/v1/grades/{gradeId} | Trainer | Update a grade |

## 7.13 Reports Module

| **Method** | **Endpoint** | **Access** | **Description** |
| --- | --- | --- | --- |
| GET | /api/v1/reports/attendance | Coordinator | Attendance summary reports |
| GET | /api/v1/reports/performance | Coordinator | Performance analytics |
| GET | /api/v1/reports/courses | Coordinator | Course-level reports |
| GET | /api/v1/reports/batches | Coordinator | Batch-level reports |

## 7.14 Dashboard Module

| **Method** | **Endpoint** | **Access** | **Description** |
| --- | --- | --- | --- |
| GET | /api/v1/dashboard/coordinator | Coordinator | System-wide aggregated metrics |
| GET | /api/v1/dashboard/trainer | Trainer | Trainer-specific dashboard data |
| GET | /api/v1/dashboard/student | Student | Student-specific dashboard data |

## 7.15 File Management Module

| **Method** | **Endpoint** | **Access** | **Description** |
| --- | --- | --- | --- |
| POST | /api/v1/files | Trainer, Student | Upload a file |
| GET | /api/v1/files/{fileId} | Authenticated | Download a file |
| DELETE | /api/v1/files/{fileId} | Trainer, Coordinator | Delete a file |

## 7.16 Zoom Signature

| **Method** | **Endpoint** | **Access** | **Description** |
| --- | --- | --- | --- |
| POST | /api/v1/zoom/signature | Trainer, Student | Generate Zoom meeting signature |

# 8. Frontend Requirements

## 8.1 Team Structure & Work Division

| **Person** | **Module** | **Scope** |
| --- | --- | --- |
| Person 1 | Auth + Coordinator Module | Login flow, ProtectedRoute, all Coordinator pages |
| Person 2 | Trainer Module | All Trainer pages |
| Person 3 | Student Module + Zoom Integration | All Student pages, Zoom SDK embed |

## 8.2 Page Inventory by Role

### Shared / Auth (Person 1)

| **Page** | **Route** |
| --- | --- |
| Login | /login |
| 404 Not Found | \* |

### Coordinator (Person 1)

| **Page** | **Route** |
| --- | --- |
| Dashboard | /coordinator/dashboard |
| Manage Courses | /coordinator/courses |
| Manage Batches | /coordinator/batches |
| Manage Trainers | /coordinator/trainers |
| Manage Students | /coordinator/students |
| Schedule Sessions | /coordinator/schedule |

### Trainer (Person 2)

| **Page** | **Route** |
| --- | --- |
| Dashboard | /trainer/dashboard |
| My Classes | /trainer/classes |
| Attendance | /trainer/attendance |
| Assignments | /trainer/assignments |
| Grades | /trainer/grades |

### Student (Person 3)

| **Page** | **Route** |
| --- | --- |
| Dashboard | /student/dashboard |
| My Courses | /student/courses |
| Live Class (Zoom) | /student/live |
| Assignments | /student/assignments |
| Progress / Reports | /student/progress |

## 8.3 Core Frontend Components

| **Component** | **Location** | **Description** |
| --- | --- | --- |
| Axios Instance | src/api/axiosInstance.ts | Axios with JWT interceptor for auto-attaching Bearer tokens |
| Auth Context | src/context/AuthContext.tsx | Login state, role, token management |
| App Router | src/routes/AppRouter.tsx | Role-based routing + ProtectedRoute component |
| Shared Types | src/types/index.ts | TypeScript interfaces: User, Course, Batch, Session, etc. |
| Sidebar | src/components/common/Sidebar.tsx | Role-aware navigation sidebar |
| Navbar | src/components/common/Navbar.tsx | Top navigation bar with user info |
| Loader | src/components/common/Loader.tsx | Loading spinner/skeleton component |
| Modal | src/components/common/Modal.tsx | Reusable modal dialog |

# 9. Non-Functional Requirements

## 9.1 Security

| **Requirement** | **Detail** |
| --- | --- |
| Authentication | JWT stateless auth with configurable expiry |
| Password Storage | BCrypt hashed never plaintext |
| Transport | HTTPS enforced in production |
| Zoom Secrets | Stored in environment variables only never in source code |
| CORS | Restricted to frontend origin only |
| Role Enforcement | Spring Security RBAC; method-level @PreAuthorize annotations |

## 9.2 Performance

| **Requirement** | **Target** |
| --- | --- |
| API Response Time | Under 500ms for standard reads |
| Zoom Signature | Generated server-side only, sub-100ms |
| Connection Pooling | HikariCP for MySQL connections |

## 9.3 Testing

| **Area** | **Target** |
| --- | --- |
| Framework | JUnit 5 + Mockito for all service classes |
| Coverage | 80%+ line coverage via JaCoCo |
| Scope | Unit tests for all service classes; integration tests for critical flows |

## 9.4 File Handling

| **Requirement** | **Detail** |
| --- | --- |
| Upload Mechanism | Multipart file upload |
| Validation | File type and size validation before storage |
| Storage (v1) | Local filesystem |
| Storage (future) | S3 or equivalent cloud storage |

## 9.5 Database

| **Requirement** | **Detail** |
| --- | --- |
| Engine | MySQL 8.4 LTS |
| Connection Pool | HikariCP |
| Schema Management | Flyway migrations |
| ORM | Spring Data JPA + Hibernate 6.6.x |

## 9.6 Logging & Observability

| **Requirement** | **Detail** |
| --- | --- |
| Framework | SLF4J + Logback |
| Format | Structured JSON logging |
| Health Checks | Spring Boot Actuator endpoints |

# 10. DevOps & Deployment

## 10.1 CI/CD Pipeline

All code changes pushed to the main branch automatically trigger the GitHub Actions pipeline, which executes the following stages in sequence:

* **1. Source Trigger** Developer pushes code to the GitHub repository
* **2. Build** The application is compiled and packaged
* **3. Test** Automated test suite executes
* **4. Containerisation** Docker images are built for frontend and backend services
* **5. Push** Images pushed to container registry
* **6. Deployment** Images deployed to Render for hosting
* **7. Availability** Updated application becomes available to end users

## 10.2 Containerisation

* Frontend and backend are each packaged as independent Docker images
* docker-compose provided for local development environment
* Ensures environment consistency across development, testing, and production

## 10.3 Deployment Architecture

GitHub Repository
 ↓
GitHub Actions (CI/CD Pipeline)
 ↓
Docker Images (Frontend & Backend)
 ↓
 ├── Render (Application Hosting)
 ├── Clever Cloud (Cloud Platform)
 ├── MySQL Database
 └── Kafka Topics → Consumer Services

## 10.4 Async Messaging

* Apache Kafka for event-driven communication between services
* Supports decoupled service interactions for future scalability

# 11. End-to-End User Flows

## 11.1 Coordinator Flow

Login → Create Course → Create Batch (linked to Course) → Add Trainer → Add Students
→ Assign Trainer to Batch → Enroll Students in Batch → Schedule Session → Monitor Reports

## 11.2 Trainer Flow

Login → View Scheduled Sessions → Fetch Zoom Signature → Join Session as Host
→ Record Attendance → Create Assignment → Review Submissions → Enter Score & Feedback → Publish Grade

## 11.3 Student Flow

Login → View Enrolled Sessions → Fetch Zoom Signature → Join Session In-Browser
→ Access Materials → Upload Assignment Submission → View Attendance → View Published Grades

# 12. Assumptions & Constraints

| **#** | **Assumption / Constraint** |
| --- | --- |
| 1 | All users are pre-registered by a Coordinator there is no public self-registration |
| 2 | A student or trainer can belong to multiple batches simultaneously |
| 3 | Zoom meeting IDs are created externally (via Zoom dashboard or API) and linked to sessions; the LMS generates only the join signature |
| 4 | File storage is local filesystem for v1; S3 or equivalent can be introduced in a later phase |
| 5 | The application is deployed as Docker containers; cloud provider is not prescribed (Render / Clever Cloud supported) |
| 6 | Backend API versioning follows /api/v1/ prefix convention |
| 7 | Frontend communicates with backend exclusively through the REST API |
| 8 | Apache Kafka is available for async messaging but is not required for core flows in v1 |

# 13. Verification Plan

## 13.1 Backend Automated Testing

* mvn test All unit tests must pass
* JUnit 5 + Mockito for service-layer tests
* JaCoCo code coverage ≥ 80%
* Integration tests for auth flow, CRUD operations, and Zoom signature generation

## 13.2 Frontend Automated Testing

* npm run build TypeScript compilation must pass with zero errors
* npm run dev Dev server must launch and all routes must render

## 13.3 Manual Verification

| **Test** | **Expected Result** |
| --- | --- |
| Login with each role | Redirect to correct role-specific dashboard |
| Protected routes (unauthenticated) | Redirect to /login |
| Sidebar navigation | Renders role-appropriate menu items |
| Coordinator: full CRUD on courses, batches, users | Data persists and reflects in lists |
| Trainer: join Zoom, record attendance, grade submissions | All actions complete without errors |
| Student: join Zoom, submit assignment, view grades | All actions complete without errors |

## 13.4 DevOps Verification

* docker build Both frontend and backend images build successfully
* docker-compose up Full stack launches locally
* GitHub Actions Pipeline passes on push to main