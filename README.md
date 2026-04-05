# Academic Performance Assessment & Mentorship Platform

A professional-grade, full-stack platform built with **FastAPI**, **Supabase (PostgreSQL)**, and **React** designed for educational institutions to manage student assessments, performance trends, and mentor-mentee relationships.

## 🚀 Recent Enhancements: Academic Sync & Intelligence (Completed)

We have recently finalized the core performance and identity modules, transforming the platform into a high-utility academic tool.

### ✨ Key Features
- **Premium Student Profiles**: Dynamic, initial-based avatars, academic status checks, and comprehensive metadata including Romanized semester values and mentor assignments.
- **Faculty ID System**: Dedicated Faculty ID integration for all mentors, allowing for institutional tracking and personalized dashboards.
- **Mentor Intelligence Suite**: Specialized dashboards for faculty members featuring "Mentee Fleet" monitoring and "Course Portfolio" management.
- **Visual Performance Analytics**: Interactive **SGPA Trend Charts** (Bar Charts) and course-wise performance visualizations without visual clutter (grid-free mode).
- **UI/UX Refinement**: Premium Dark Mode with **Glassmorphism**, smooth transitions, and a consistent "Institutional Premium" aesthetic.
- **Optimized Data Pipeline**: Real-time academic results synchronization and historical SGPA performance tracking via the `semester_results` matrix.

## 🛠️ Tech Stack
- **Backend**: Python 3.x, FastAPI, Pydantic (Strong Typing), Supabase (PostgreSQL).
- **Frontend**: React (Vite), Tailwind CSS, Framer Motion, Recharts.
- **Authentication**: Perfected JWT-based secure session management featuring:
    - **Argon2/Bcrypt Password Hashing**: Securely stored credentials using `passlib`.
    - **Role-Based Access Control (RBAC)**: Fine-grained permissions for Student, Mentor, and Admin.
    - **Session Recovery**: Automatic token recovery and session expiration handling (401 logout).
- **Database**: PostgreSQL with Supabase, GIN/Trigram search indexing, and relational performance tracking.

## 📁 Project Structure
```text
miniProject/
├── backend/
│   ├── app/                # Application Logic
│   │   ├── routers/        # API Routes (Auth, Students, Mentors, Grades, etc.)
│   │   ├── models.py       # Pydantic Schemas & Data Structures
│   │   ├── database.py     # Supabase Connection
│   │   └── main.py         # App Entry Point
│   └── requirements.txt    # Python Dependencies
├── frontend/               # React (Vite) Frontend
│   ├── src/
│   │   ├── components/     # UI Components & Premium Layouts
│   │   ├── services/       # API Abstraction Layers (auth, student, mentor)
│   │   ├── pages/          # Full-page views (Dashboard, Profile, Mentors)
│   │   └── App.jsx         # Global Routing Configuration
└── README.md
```

## 🚀 Local Deployment Guide

### 1. Repository Setup
```bash
git clone <your-repo-url>
cd miniProject
```

### 2. Digital Infrastructure (Backend)
```bash
# Environment Isolation
python -m venv venv
.\venv\Scripts\activate

# Dependency Injection
pip install -r backend/requirements.txt

# Database Synchronization
# Ensure your .env is populated with SUPABASE_URL and SUPABASE_KEY
uvicorn backend.app.main:app --reload
```

### 3. Client Interface (Frontend)
```bash
cd frontend
npm install
npm run dev
```

### 4. Interactive Links
- **Client Workspace**: [http://localhost:5173/](http://localhost:5173/)
- **API Specification (Swagger)**: [http://localhost:8000/docs](http://localhost:8000/docs)

---
Developed for high-performance academic tracking and institutional synchronization.
