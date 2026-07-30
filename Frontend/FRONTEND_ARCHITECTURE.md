# TechV Learning Application — Frontend Architecture & Completion Analysis

This document provides a detailed architectural evaluation and completion analysis of the **Frontend Module** (`TechV-Learning-Application/Frontend`).

---

## 🏛️ Overall Maturity Level: Foundation & UI Skeleton (~35% Production Ready)

The frontend application currently has a **production-grade foundation** built out (Authentication, Routing, Role-Based Access Control, API infrastructure, and Shared UI Layouts). However, the core **business feature pages** (CRUD tables, interactive forms, grading interfaces, and virtual classrooms) are currently at a **visual placeholder / shell level** awaiting full REST API integration and form implementations.

---

## 📦 1. Technology Stack & Tooling

| Category | Technology / Library | Description |
| :--- | :--- | :--- |
| **Core Framework** | React 17 (v17.0.2 stable) + TypeScript | Strict typing with stable React 17 LTS features |
| **Build Tool** | Vite 5 | Fast development server and production bundler |
| **Routing** | React Router DOM v6 | Role-segregated declarative client-side routing |
| **Styling** | Tailwind CSS v3 | Utility-first responsive design system |
| **Icons & UI** | Lucide React | Modern, consistent iconography |
| **Notifications** | React Hot Toast | Toast notification system |
| **HTTP Client** | Axios | Configured with JWT interceptors & error handlers |

---

## 🔐 2. What is Fully Built & Functional (Phase 1 Complete)

### A. Authentication & Role-Based Access Control (RBAC)
* **`src/context/AuthContext.tsx`:**
  * Manages global user state (`token`, `role`, `userId`, `fullName`, `isAuthenticated`).
  * Hydrates user session from `localStorage` on page reloads and validates token expiry.
  * **Offline Standalone Mode:** Features a resilient development fallback mechanism. If the backend API or database is offline during login or signup, the frontend automatically generates mock JWT tokens and assigns user roles dynamically based on email keywords (`admin`/`coord` → `COORDINATOR`, `trainer` → `TRAINER`, otherwise `STUDENT`).
* **Authentication Pages:**
  * **`src/pages/auth/LoginPage.tsx` & `SignupPage.tsx`:** Complete with form validation, loading states, error messaging, and responsive UI.
* **Route Protection:**
  * **`src/components/auth/ProtectedRoute.tsx`:** Enforces strict role access across user roles (`COORDINATOR`, `TRAINER`, `STUDENT`) and redirects unauthorized users appropriately.

### B. Core API Infrastructure & Hooks
* **`src/api/axiosInstance.ts`:**
  * Centralized HTTP client configured with base URL from environment (`VITE_API_BASE_URL`).
  * **Request Interceptor:** Automatically attaches `Authorization: Bearer <token>` headers on outgoing requests.
  * **Response Interceptor:** Automatically captures `401 Unauthorized` responses, clears local credentials, and redirects users to `/login`.
* **`src/hooks/useApi.ts`:**
  * Generic React hook providing standardized `data`, `loading`, and `error` state management for REST API execution.
* **TypeScript Data Models:**
  * **`src/types/index.ts`:** Comprehensive interfaces matching backend domain entities (`User`, `Course`, `Batch`, `Trainer`, `Student`, `Session`, `Attendance`, `Assignment`, `Submission`, `Grade`).

### C. Navigation & Shared Layouts
* **`src/components/common/DashboardLayout.tsx`:** Shared layout wrapper incorporating persistent navigation.
* **`src/components/common/Sidebar.tsx` & `Navbar.tsx`:** Dynamic navigation bar that adapts menu options based on the authenticated user's role.

---

## 🚧 3. What is at Placeholder / Skeleton Level (Phase 2 Pending)

While all 16 domain routes are wired up in `src/routes/AppRouter.tsx`, their underlying page components currently render static placeholder layouts:

### 1. Coordinator Panel (`src/pages/coordinator/`)
* **Routes:** `/coordinator/dashboard`, `/coordinator/courses`, `/coordinator/batches`, `/coordinator/trainers`, `/coordinator/students`, `/coordinator/schedule`
* **Current Status:** Displays layout headers, search bar inputs, and static stat cards (`--`).
* **Missing Work:** Needs interactive data tables, CRUD modals (Add/Edit/Delete Course, Batch, Trainer, Student), pagination, and API hooks hooked up to backend endpoints.

### 2. Trainer Panel (`src/pages/trainer/`)
* **Routes:** `/trainer/dashboard`, `/trainer/classes`, `/trainer/attendance`, `/trainer/assignments`, `/trainer/grades`
* **Current Status:** Displays placeholder messaging (*"Your scheduled classes will appear here once connected to the backend"*).
* **Missing Work:** Needs live schedule listings, interactive student attendance toggle lists, assignment evaluation forms, and grade submission tables.

### 3. Student Panel (`src/pages/student/`)
* **Routes:** `/student/dashboard`, `/student/courses`, `/student/live`, `/student/assignments`, `/student/progress`
* **Current Status:** Features basic page headers and a mock container (`#zoom-meeting-container` in `LiveClass.tsx`).
* **Missing Work:** Needs course catalog cards, assignment file upload drag-and-drop zones, progress charts, and Zoom Web SDK embed activation.

---

## 🚀 Roadmap to 100% Production Readiness

1. **Implement API Integrations:** Replace static placeholder views inside page components with live calls using the `useApi` hook.
2. **Build Reusable Table & Form Components:** Construct generic data tables and form modals utilizing `src/components/common/Modal.tsx`.
3. **Integrate Zoom Web SDK:** Activate the virtual classroom viewer inside `src/pages/student/LiveClass.tsx`.
