# TechV Learning Enterprise Portal — Coordinator Module Design & Color System

> **Document Version**: 1.0 (Enterprise Standard)  
> **Target Audience**: All Frontend Development Teams (`Student Module Team`, `Trainer Module Team`, `QA Engineering`)  
> **Scope**: UI Design Tokens, Color Palettes, Tailwind CSS Utility Conventions, and Glassmorphism Standards derived from the **Coordinator Module** (`/Frontend/src/pages/coordinator/`).

---

## 📌 1. Executive Summary & Design Philosophy

The **Coordinator Module** establishes the baseline visual identity for the TechV Learning Enterprise Portal. To ensure a cohesive, modern, and premium user experience across all three role portals (Coordinator, Trainer, Student), all teams must adhere to the **CSS & Color Design System** detailed below.

### Core Aesthetic Pillars:
1. **Curated HSL & Hex Color Tokens**: Avoid raw browser default colors. We utilize tailored Indigo (`primary`), Slate, and functional accent colors.
2. **Glassmorphism & Depth**: Surfaces utilize frosted glass effects (`backdrop-blur-xl`, `bg-white/95`, `border-white/20`) layered over vibrant, dark-mode-friendly gradients.
3. **Micro-Interactions & Elevational Shadows**: Interactive elements (cards, buttons, modals) feature smooth hover lifts (`-translate-y-1`), transition curves (`duration-300`), and colored glow shadows (`shadow-primary-500/30`).

---

## 🎨 2. Core Color Palette (`tailwind.config.js`)

All teams must use the standardized `primary` scale extended in `tailwind.config.js`. This Indigo-centered scale provides optimal contrast and hierarchy across light and dark contexts.

| Color Token | Hex Code | Visual Preview / Description | Usage Guidelines |
| :--- | :---: | :--- | :--- |
| **`primary-50`** | `#eef2ff` | Softest Tint | Background fills for active table rows or secondary badge backgrounds. |
| **`primary-100`** | `#e0e7ff` | Light Tint | Border outlines for active input fields and soft tags. |
| **`primary-200`** | `#c7d2fe` | Subtle Accent | Subtitle text on dark hero banners and glassmorphism borders. |
| **`primary-300`** | `#a5b4fc` | Highlight Accent | Icons and secondary headers on dark slate backgrounds. |
| **`primary-400`** | `#818cf8` | Mid-Tone Accent | Hover states for dark-mode interactive components. |
| **`primary-500`** | `#6366f1` | **Base Primary** | Main brand color. Used for borders, active links, and focus rings. |
| **`primary-600`** | `#4f46e5` | **Primary Action** | Primary call-to-action (CTA) buttons and gradient start points. |
| **`primary-700`** | `#4338ca` | Dark Action | Hover states for primary buttons (`hover:from-primary-700`). |
| **`primary-800`** | `#3730a3` | Deep Tone | Dark stat card gradient end-points and active navigation states. |
| **`primary-900`** | `#312e81` | Deepest Anchor | Dark mode background accents and enterprise hero headers. |

---

## 🌈 3. Functional Gradients & Stat Cards

In the Coordinator Dashboard (`/coordinator/dashboard`), metric cards and hero banners utilize multi-stop diagonal gradients (`bg-gradient-to-br`) paired with background glow circles (`blur-xl`).

### A. Dashboard Stat Cards Palette
* **Total Courses (Curriculum Blue-Indigo)**:
  ```html
  <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-indigo-800 text-white shadow-lg rounded-2xl p-6">
  ```
* **Active Batches (Cohort Emerald-Teal)**:
  ```html
  <div className="bg-gradient-to-br from-emerald-600 via-teal-600 to-teal-800 text-white shadow-lg rounded-2xl p-6">
  ```
* **Faculty Trainers (Instructor Purple-Fuchsia)**:
  ```html
  <div className="bg-gradient-to-br from-purple-600 via-fuchsia-600 to-purple-800 text-white shadow-lg rounded-2xl p-6">
  ```
* **Enrolled Students (Learner Amber-Red)**:
  ```html
  <div className="bg-gradient-to-br from-amber-600 via-orange-600 to-red-700 text-white shadow-lg rounded-2xl p-6">
  ```

### B. Enterprise Hero Banner & Authentication Background
* **Welcome Banner / Auth Wrapper**:
  ```html
  <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-primary-950 min-h-screen">
  ```
* **Banner Decorative Glow Layer**:
  ```html
  <div className="absolute right-0 top-0 -mr-16 -mt-16 w-80 h-80 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none"></div>
  ```

---

## 💎 4. Glassmorphism & Surface Tokens

To achieve the signature "frosted glass" look without sacrificing text legibility, use our standardized opacity (`/95`, `/10`, `/20`) and blur (`backdrop-blur-xl`, `backdrop-blur-md`) classes.

| Component Type | Tailwind Classes | Example Context |
| :--- | :--- | :--- |
| **Modal / Card Surfaces** | `bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20` | Main login cards, CRUD dialogs, and schedule rosters. |
| **Glass Icon Containers** | `w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shadow-inner` | Icons inside stat cards and header widgets. |
| **Pill / Badge Glass** | `px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-indigo-200 border border-white/15` | Enterprise tags (`TechV Enterprise Learning Portal`). |

---

## 🏷️ 5. Functional Status Badges & Chips

Every module (Courses, Batches, Trainers, Students, Sessions) requires clear visual status indicators. Adhere to exact color pairs for status text and badge fills:

```html
<!-- ACTIVE / ONLINE / SUCCESS -->
<span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
  Active
</span>

<!-- INACTIVE / CANCELLED / ERROR -->
<span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800 border border-red-200">
  Inactive
</span>

<!-- PENDING / IN PROGRESS / WARNING -->
<span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200">
  In Progress
</span>

<!-- ZOOM / SYNCHRONOUS CLASSROOM -->
<span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-200">
  Zoom Live Session
</span>
```

---

## 🎥 6. Zoom Classroom Brand Integration

When embedding or launching Zoom virtual sessions (`/coordinator/schedule` & `/student/live-class`), use official Zoom Blue `#0E71EB` tokens combined with dark glass containers:

* **Zoom Primary Launch Card**:
  ```html
  <div className="bg-[#0E71EB] hover:bg-[#0051C3] text-white rounded-xl py-2 px-4 font-bold transition shadow-md">
    Launch Zoom Classroom
  </div>
  ```
* **Zoom Meeting ID Display Banner**:
  ```html
  <div className="bg-slate-900/90 backdrop-blur-md rounded-2xl border border-slate-800 p-4 text-white flex items-center justify-between">
    <span className="font-mono text-primary-300">881 2345 6789</span>
  </div>
  ```

---

## 🔘 7. Interactive Button Design Patterns

All primary and secondary buttons across the application must follow these specific elevational and active states:

### A. Primary Action Button (Gradient with Glow)
```html
<button className="w-full py-3 px-6 bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-700 hover:to-indigo-700 text-white rounded-xl font-semibold shadow-lg shadow-primary-500/30 hover:shadow-primary-500/50 transform transition active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer">
  <span>Submit Action</span>
</button>
```

### B. Secondary Action Button (Outlined Neutral)
```html
<button className="py-2.5 px-5 bg-gray-50/80 hover:bg-gray-100 text-gray-700 font-semibold rounded-xl border border-gray-200 transition active:scale-[0.99] flex items-center gap-2 cursor-pointer">
  <span>Cancel</span>
</button>
```

### C. Danger / Delete Button (Red Alert)
```html
<button className="py-2.5 px-5 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl shadow-md shadow-red-500/20 transition active:scale-[0.99] flex items-center gap-2 cursor-pointer">
  <span>Delete Item</span>
</button>
```

---

## 🔤 8. Typography & Form Inputs

* **Primary Font Family**: **Inter** (`font-sans`), loaded with weights `300`, `400`, `500`, `600`, `700`, and `800`.
* **Form Input Standard**: Form fields use subtle background fills with prominent primary focus rings:
  ```html
  <input
    type="text"
    className="w-full pl-10 pr-4 py-2.5 bg-gray-50/50 border border-gray-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition text-sm text-gray-900 placeholder-gray-400"
  />
  ```

---

## 📋 9. Quick Checklist for Frontend Teams

When building new modules (`Trainer Dashboard`, `Student Portal`, `Live Classes`), verify the following:
- [ ] No raw/generic colors (`bg-blue-500` or `bg-red-500`) — use exact gradient pairs or `primary-*` tokens.
- [ ] All interactive cards have hover elevations (`hover:-translate-y-1 hover:shadow-2xl transition-all duration-300`).
- [ ] All modals use `bg-white/95 backdrop-blur-xl rounded-3xl` containers.
- [ ] Primary buttons feature colored shadow glows (`shadow-lg shadow-primary-500/30`).
- [ ] Status badges always pair background tint (`bg-*-100`) with matching dark text (`text-*-800`) and border (`border-*-200`).
