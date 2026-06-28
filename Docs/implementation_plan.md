# Enterprise LMS — Frontend From Scratch

A team of 3 is building the React 18 + TypeScript + Tailwind CSS frontend for the Enterprise LMS from scratch inside `/Users/avulaajaykumarreddy/Developer/LMSLocal`.

---

## Tech Stack (as specified in Basenote.txt)

- **Framework**: React 17 with TypeScript (via Vite)
- **Styling**: Tailwind CSS v3
- **Routing**: React Router v6
- **State / Auth**: Context API + JWT (localStorage)
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **Notifications**: React Hot Toast
- **Build Tool**: Vite

---

## Team of 3 — Work Division

### 👤 Person 1 — Auth + Coordinator Module

Owns everything a Coordinator sees and does, plus the shared auth flow.

### 👤 Person 2 — Trainer Module

Owns everything a Trainer sees and does.

### 👤 Person 3 — Student Module + Zoom Integration

Owns everything a Student sees and does, including Zoom virtual classroom embed.

---

## Proposed Project Structure

```
LMSLocal/
├── public/
├── src/
│   ├── api/               # Axios instance + API call helpers
│   ├── assets/            # Images, logos
│   ├── components/
│   │   ├── common/        # Shared: Navbar, Sidebar, Loader, Modal, etc.
│   │   ├── auth/          # Login, ProtectedRoute
│   │   ├── coordinator/   # Coordinator-specific components
│   │   ├── trainer/       # Trainer-specific components
│   │   └── student/       # Student-specific components
│   ├── context/
│   │   └── AuthContext.tsx
│   ├── hooks/             # Custom hooks (useAuth, useApi, etc.)
│   ├── pages/
│   │   ├── auth/          # LoginPage
│   │   ├── coordinator/   # Dashboard, Courses, Batches, Users, Schedule
│   │   ├── trainer/       # Dashboard, MyClasses, Attendance, Assignments, Grades
│   │   └── student/       # Dashboard, MyCourses, LiveClass, Assignments, Progress
│   ├── routes/            # AppRouter with role-based protected routes
│   ├── types/             # Shared TypeScript interfaces
│   ├── utils/             # Helpers (jwt decode, date format, etc.)
│   ├── App.tsx
│   └── main.tsx
├── index.html
├── tailwind.config.js
├── tsconfig.json
├── vite.config.ts
└── package.json
```

---

## Page Inventory by Role

### 🔐 Shared / Auth (Person 1)

| Page          | Route      |
| ------------- | ---------- |
| Login         | `/login` |
| 404 Not Found | `*`      |

### 📋 Coordinator (Person 1)

| Page              | Route                      |
| ----------------- | -------------------------- |
| Dashboard         | `/coordinator/dashboard` |
| Manage Courses    | `/coordinator/courses`   |
| Manage Batches    | `/coordinator/batches`   |
| Manage Trainers   | `/coordinator/trainers`  |
| Manage Students   | `/coordinator/students`  |
| Schedule Sessions | `/coordinator/schedule`  |

### 🎓 Trainer (Person 2)

| Page        | Route                    |
| ----------- | ------------------------ |
| Dashboard   | `/trainer/dashboard`   |
| My Classes  | `/trainer/classes`     |
| Attendance  | `/trainer/attendance`  |
| Assignments | `/trainer/assignments` |
| Grades      | `/trainer/grades`      |

### 🧑‍🎓 Student (Person 3)

| Page               | Route                    |
| ------------------ | ------------------------ |
| Dashboard          | `/student/dashboard`   |
| My Courses         | `/student/courses`     |
| Live Class (Zoom)  | `/student/live`        |
| Assignments        | `/student/assignments` |
| Progress / Reports | `/student/progress`    |

---

## Proposed Changes

### [NEW] Vite + React + TypeScript project scaffold

Run `npx create-vite@latest ./ --template react-ts` in `/Users/avulaajaykumarreddy/Developer/LMSLocal`

### [NEW] Tailwind CSS setup

Install and configure Tailwind CSS v3 with the Vite plugin.

### [NEW] Core shared files

- `src/api/axiosInstance.ts` — Axios with JWT interceptor
- `src/context/AuthContext.tsx` — Login state, role, token
- `src/routes/AppRouter.tsx` — Role-based routing + ProtectedRoute
- `src/types/index.ts` — Shared types (User, Course, Batch, etc.)
- `src/components/common/` — Sidebar, Navbar, Loader, Modal

### [NEW] Auth Pages (Person 1)

- `src/pages/auth/LoginPage.tsx`

### [NEW] Coordinator Pages (Person 1)

- Dashboard, Courses, Batches, Trainers, Students, Schedule

### [NEW] Trainer Pages (Person 2)

- Dashboard, Classes, Attendance, Assignments, Grades

### [NEW] Student Pages (Person 3)

- Dashboard, Courses, LiveClass (Zoom SDK), Assignments, Progress

---

## Open Questions

> [!IMPORTANT]
> **1. Backend URL** — What is the base URL for the Spring Boot backend API? (e.g., `http://localhost:8080`). This goes into Axios config.

> [!IMPORTANT]
> **2. Who builds what?** — Should I scaffold **all pages as stubs** now so all 3 people can start, or should I build out **fully functional** pages one module at a time?

> [!IMPORTANT]
> **3. Design Theme** — Any color preference? The default plan uses a **dark blue / indigo** professional enterprise theme. Confirm or specify a different palette.

> [!IMPORTANT]
> **4. Zoom SDK** — Do you have a Zoom SDK Key/Secret already? The student Live Class page will need it to embed the Zoom meeting UI.

---

## Verification Plan

### Automated

- `npm run build` — TypeScript compilation must pass with zero errors
- `npm run dev` — Dev server must launch and all routes must render

### Manual

- Login with each role → verify redirect to correct dashboard
- Protected routes redirect unauthenticated users to `/login`
- Sidebar navigation works per role
