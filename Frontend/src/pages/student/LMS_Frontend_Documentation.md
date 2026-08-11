# 📘 Enterprise LMS — Frontend Documentation

**Version**: 1.0  
**Team**: 3 Frontend Engineers  
**Week**: Week 1 — Planning & Documentation  
**Stack**: React 18 + TypeScript + Tailwind CSS (Vite)

---

## 📌 Table of Contents
1. [Project Overview](#1-project-overview)
2. [Tech Stack & Tools](#2-tech-stack--tools)
3. [Team Responsibilities](#3-team-responsibilities)
4. [Folder Structure](#4-folder-structure)
5. [Pages & Routes](#5-pages--routes)
6. [Component Breakdown](#6-component-breakdown)
7. [API Contract (Frontend Needs)](#7-api-contract-frontend-needs)
8. [Design System](#8-design-system)
9. [Git Workflow](#9-git-workflow)
10. [Coding Conventions](#10-coding-conventions)
11. [Weekly Milestones](#11-weekly-milestones)

---

## 1. Project Overview

The Enterprise LMS is a web-based platform for managing online and instructor-led training programs.
Three types of users interact with the system:

| Role | What they do |
|------|-------------|
| **Coordinator** | Manages courses, batches, trainers, students, and schedules |
| **Trainer** | Conducts classes, takes attendance, creates and grades assignments |
| **Student** | Joins live classes (Zoom), submits assignments, tracks progress |

The frontend communicates with a **Java Spring Boot backend** via REST APIs and uses **JWT tokens** for authentication and role-based access control.

---

## 2. Tech Stack & Tools

| Category | Technology | Version |
|----------|-----------|---------|
| Framework | React | 18.x |
| Language | TypeScript | 5.x |
| Build Tool | Vite | 5.x |
| Styling | Tailwind CSS | 3.x |
| Routing | React Router DOM | 6.x |
| HTTP Client | Axios | 1.x |
| Icons | Lucide React | latest |
| Notifications | React Hot Toast | 2.x |
| Virtual Classroom | Zoom Embedded Web SDK | latest |
| Version Control | Git + GitHub | — |

### Dev Environment
- Node.js: v20+
- Package Manager: npm
- IDE: VS Code (recommended extensions: ESLint, Prettier, Tailwind IntelliSense)

---

## 3. Team Responsibilities

### 👤 Person 1 — Auth + Coordinator Module

**Owns:**
- Login page + JWT authentication flow
- AuthContext (global auth state)
- AppRouter (all routes + ProtectedRoute)
- All Coordinator pages and components
- Shared layout components (Sidebar base, Navbar base)

**Pages:**
`LoginPage`, `CoordinatorDashboard`, `ManageCourses`, `ManageBatches`, `ManageTrainers`, `ManageStudents`, `ScheduleSession`

---

### 👤 Person 2 — Trainer Module

**Owns:**
- Trainer-specific layout and sidebar
- All Trainer pages and components
- Attendance recording UI
- Assignment creation and grading UI

**Pages:**
`TrainerDashboard`, `MyClasses`, `AttendancePage`, `AssignmentsPage`, `GradesPage`

---

### 👤 Person 3 — Student Module + Zoom Integration

**Owns:**
- Student-specific layout and sidebar
- All Student pages and components
- Zoom Embedded Web SDK integration (Live Class page)
- Progress and reporting UI

**Pages:**
`StudentDashboard`, `MyCoursesPage`, `LiveClassPage`, `StudentAssignmentsPage`, `ProgressPage`

---

## 4. Folder Structure

```
LMSLocal/
├── public/
│   └── favicon.ico
├── src/
│   ├── api/
│   │   ├── axiosInstance.ts        # Base Axios config + JWT interceptor
│   │   ├── authApi.ts              # Login, logout API calls
│   │   ├── courseApi.ts            # Course CRUD
│   │   ├── batchApi.ts             # Batch CRUD
│   │   ├── userApi.ts              # Trainer/Student management
│   │   ├── attendanceApi.ts        # Attendance calls
│   │   ├── assignmentApi.ts        # Assignment CRUD + file upload
│   │   └── zoomApi.ts              # Zoom signature fetch
│   ├── assets/
│   │   └── logo.svg
│   ├── components/
│   │   ├── common/
│   │   │   ├── Navbar.tsx          # Top navigation bar (shared)
│   │   │   ├── Sidebar.tsx         # Sidebar wrapper (shared)
│   │   │   ├── Loader.tsx          # Full-page loading spinner
│   │   │   ├── Modal.tsx           # Reusable modal dialog
│   │   │   ├── Table.tsx           # Reusable data table
│   │   │   ├── StatCard.tsx        # Dashboard stats card
│   │   │   └── Badge.tsx           # Status badge (active/inactive/pending)
│   │   ├── coordinator/
│   │   │   ├── CourseForm.tsx      # Add/Edit course modal form
│   │   │   ├── BatchForm.tsx       # Add/Edit batch modal form
│   │   │   └── UserTable.tsx       # Reusable user list table
│   │   ├── trainer/
│   │   │   ├── AttendanceGrid.tsx  # Student attendance checkboxes
│   │   │   ├── AssignmentCard.tsx  # Assignment summary card
│   │   │   └── GradeForm.tsx       # Grade submission form
│   │   └── student/
│   │       ├── CourseCard.tsx      # Course card with progress bar
│   │       ├── ZoomMeeting.tsx     # Zoom SDK embed wrapper
│   │       └── ProgressChart.tsx  # Attendance & grade chart
│   ├── context/
│   │   └── AuthContext.tsx         # Auth state, login(), logout(), role
│   ├── hooks/
│   │   ├── useAuth.ts              # Consume AuthContext safely
│   │   └── useFetch.ts             # Generic data fetching hook
│   ├── pages/
│   │   ├── auth/
│   │   │   └── LoginPage.tsx
│   │   ├── coordinator/
│   │   │   ├── CoordinatorDashboard.tsx
│   │   │   ├── ManageCoursesPage.tsx
│   │   │   ├── ManageBatchesPage.tsx
│   │   │   ├── ManageTrainersPage.tsx
│   │   │   ├── ManageStudentsPage.tsx
│   │   │   └── ScheduleSessionPage.tsx
│   │   ├── trainer/
│   │   │   ├── TrainerDashboard.tsx
│   │   │   ├── MyClassesPage.tsx
│   │   │   ├── AttendancePage.tsx
│   │   │   ├── AssignmentsPage.tsx
│   │   │   └── GradesPage.tsx
│   │   └── student/
│   │       ├── StudentDashboard.tsx
│   │       ├── MyCoursesPage.tsx
│   │       ├── LiveClassPage.tsx
│   │       ├── StudentAssignmentsPage.tsx
│   │       └── ProgressPage.tsx
│   ├── routes/
│   │   └── AppRouter.tsx           # All routes + ProtectedRoute logic
│   ├── types/
│   │   └── index.ts                # All shared TypeScript types/interfaces
│   ├── utils/
│   │   ├── decodeJwt.ts            # JWT decode helper
│   │   └── formatDate.ts           # Date formatting helper
│   ├── App.tsx
│   └── main.tsx
├── index.html
├── tailwind.config.js
├── tsconfig.json
├── vite.config.ts
├── .env                            # VITE_API_URL, VITE_ZOOM_SDK_KEY
├── .env.example
├── .gitignore
└── package.json
```

---

## 5. Pages & Routes

```
/login                          → LoginPage             (Public)

/coordinator/dashboard          → CoordinatorDashboard  (Role: COORDINATOR)
/coordinator/courses            → ManageCoursesPage
/coordinator/batches            → ManageBatchesPage
/coordinator/trainers           → ManageTrainersPage
/coordinator/students           → ManageStudentsPage
/coordinator/schedule           → ScheduleSessionPage

/trainer/dashboard              → TrainerDashboard      (Role: TRAINER)
/trainer/classes                → MyClassesPage
/trainer/attendance             → AttendancePage
/trainer/assignments            → AssignmentsPage
/trainer/grades                 → GradesPage

/student/dashboard              → StudentDashboard      (Role: STUDENT)
/student/courses                → MyCoursesPage
/student/live                   → LiveClassPage
/student/assignments            → StudentAssignmentsPage
/student/progress               → ProgressPage

*                               → 404 Not Found         (All)
```

---

## 6. Component Breakdown

### Shared Components (Person 1 builds, all 3 use)

| Component | Props | Description |
|-----------|-------|-------------|
| `StatCard` | `title`, `value`, `icon`, `color` | Dashboard metric card |
| `Table` | `columns`, `data`, `onEdit`, `onDelete` | Generic sortable table |
| `Modal` | `isOpen`, `onClose`, `title`, `children` | Reusable dialog |
| `Badge` | `status: 'active'│'inactive'│'pending'` | Color-coded status pill |
| `Loader` | — | Centered full-page spinner |
| `Navbar` | `userName`, `role`, `onLogout` | Top bar with user info |
| `Sidebar` | `navItems`, `role` | Left nav with links + icons |

### Coordinator Components (Person 1)

| Component | Purpose |
|-----------|---------|
| `CourseForm` | Modal form for creating/editing a course |
| `BatchForm` | Modal form for creating/editing a batch |
| `UserTable` | Display trainer or student lists |

### Trainer Components (Person 2)

| Component | Purpose |
|-----------|---------|
| `AttendanceGrid` | Grid of students with Present/Absent toggle |
| `AssignmentCard` | Card showing assignment name, due date, submissions |
| `GradeForm` | Form to enter marks per student |

### Student Components (Person 3)

| Component | Purpose |
|-----------|---------|
| `CourseCard` | Course thumbnail + progress bar |
| `ZoomMeeting` | Zoom SDK wrapper, takes `meetingNumber` + `signature` |
| `ProgressChart` | Bar/pie chart for attendance % and grade distribution |

---

## 7. API Contract (Frontend Needs from Backend)

> These are the REST API endpoints the frontend expects. Backend team to confirm exact paths.

### Auth
| Method | Endpoint | Body | Response |
|--------|----------|------|----------|
| POST | `/api/auth/login` | `{email, password}` | `{token, role, userId, name}` |

### Courses
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/courses` | List all courses |
| POST | `/api/courses` | Create course |
| PUT | `/api/courses/{id}` | Update course |
| DELETE | `/api/courses/{id}` | Delete course |

### Batches
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/batches` | List all batches |
| POST | `/api/batches` | Create batch |
| PUT | `/api/batches/{id}` | Update batch |
| DELETE | `/api/batches/{id}` | Delete batch |

### Users
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users?role=TRAINER` | List trainers |
| GET | `/api/users?role=STUDENT` | List students |
| POST | `/api/users` | Register a user |
| DELETE | `/api/users/{id}` | Remove a user |

### Sessions / Schedule
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/sessions` | List all sessions |
| POST | `/api/sessions` | Schedule a session |
| GET | `/api/sessions/trainer/{id}` | Trainer's sessions |
| GET | `/api/sessions/student/{id}` | Student's sessions |

### Attendance
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/attendance` | Submit attendance for a session |
| GET | `/api/attendance/session/{id}` | Get attendance for a session |
| GET | `/api/attendance/student/{id}` | Student's attendance summary |

### Assignments
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/assignments/course/{id}` | Get assignments for a course |
| POST | `/api/assignments` | Create assignment (Trainer) |
| POST | `/api/assignments/{id}/submit` | Submit file (Student, multipart) |
| PUT | `/api/assignments/{id}/grade` | Submit grade (Trainer) |

### Zoom
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/zoom/signature` | Get meeting signature for SDK |

---

## 8. Design System

### Color Palette
```
Primary:     #4F46E5  (Indigo-600)
Primary Dark:#3730A3  (Indigo-800)
Accent:      #06B6D4  (Cyan-500)
Background:  #0F172A  (Slate-900)
Surface:     #1E293B  (Slate-800)
Border:      #334155  (Slate-700)
Text Primary:#F8FAFC  (Slate-50)
Text Muted:  #94A3B8  (Slate-400)
Success:     #22C55E  (Green-500)
Warning:     #F59E0B  (Amber-500)
Error:       #EF4444  (Red-500)
```

### Typography
```
Font Family: 'Inter', sans-serif  (Google Fonts)
Heading 1:   text-3xl font-bold
Heading 2:   text-2xl font-semibold
Heading 3:   text-xl font-semibold
Body:        text-base font-normal
Small/Muted: text-sm text-slate-400
```

### Spacing Scale (Tailwind defaults)
```
Card padding:    p-6
Section gap:     gap-6
Page padding:    px-6 py-8
Sidebar width:   w-64
Topbar height:   h-16
Border radius:   rounded-xl (cards), rounded-lg (buttons)
```

### Common Component Styles
```
Button Primary:   bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg
Button Secondary: bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg
Button Danger:    bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg
Input:            bg-slate-800 border border-slate-600 text-white rounded-lg px-3 py-2
Card:             bg-slate-800 border border-slate-700 rounded-xl p-6 shadow-lg
```

---

## 9. Git Workflow

### Branch Strategy
```
main              ← stable, always deployable
└── dev           ← integration branch (all PRs merge here first)
    ├── feature/auth-login          (Person 1)
    ├── feature/coordinator-*       (Person 1)
    ├── feature/trainer-*           (Person 2)
    └── feature/student-*           (Person 3)
```

### Rules
- Never commit directly to `main`
- Always branch off `dev`
- Branch naming: `feature/<module>-<short-description>`
- Commit messages: `feat:`, `fix:`, `chore:`, `docs:` prefixes
- Open a Pull Request to `dev` when a feature is complete
- At least 1 team member reviews before merging

### Example Commits
```
feat: add login page with JWT decode
feat: coordinator dashboard stats cards
fix: token not persisting on refresh
chore: setup tailwind config
docs: update API contract table
```

---

## 10. Coding Conventions

### TypeScript
- Always define types/interfaces in `src/types/index.ts`
- No `any` — use proper types
- Use `interface` for objects, `type` for unions/primitives

### React
- Functional components only (no class components)
- File name = Component name (PascalCase): `LoginPage.tsx`
- Custom hooks in `src/hooks/`, prefixed with `use`
- API calls only inside hooks or page components, never inside UI components

### File Structure per Component
```tsx
// 1. Imports
// 2. Types/interfaces (if local)
// 3. Component function
// 4. Return JSX
// 5. Export default
```

### Environment Variables
- All env vars prefixed with `VITE_` to be accessible in React
- Store in `.env`, never commit to Git
- Access via `import.meta.env.VITE_API_URL`

---

## 11. Weekly Milestones

| Week | Goal |
|------|------|
| **Week 1** | 📋 Planning, documentation, team alignment (current) |
| **Week 2** | 🔧 Project scaffold, shared infrastructure (Auth, Router, Layout) |
| **Week 3** | 📊 All 3 dashboards complete; Coordinator pages done |
| **Week 4** | 🎓 Trainer module complete; Student module complete |
| **Week 5** | 🔗 Backend API integration; Zoom SDK integration |
| **Week 6** | 🧪 Testing, bug fixes, UI polish, final demo |
