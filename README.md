# Academic Performance Assessment & Mentorship Platform

A full-stack platform built with **FastAPI**, **Supabase (PostgreSQL)**, and **React** for managing student assessments, results, and mentor-mentee tracking.

## 🚀 Phase 3: UI/UX, Advanced Logic & Performance (Completed)

This phase polished the platform for professional use, including high-end UI effects and optimized data handling.

### ✨ Key Features
- **UI/UX Refinement**: Premium Dark Mode with **Glassmorphism**, smooth animations via `framer-motion`, and real-time feedback with `react-hot-toast`.
- **Advanced Search & Filtering**: Server-side optimized search (debounced) and multi-parameter filtering for Students and Courses.
- **Data Pagination**: Integrated limit-offset pagination for efficient data handling.
- **Database Optimization**: Implemented **GIN and Trigram indices** in Supabase for high-performance search results.
- **Reliability**: 100% backend router test coverage for core entities.

## 🛠️ Tech Stack
- **Backend**: Python, FastAPI, Pydantic, Supabase (PostgreSQL).
- **Frontend**: React (Vite), Tailwind CSS, Framer Motion, React-Hot-Toast.
- **State Management**: Zustand.
- **Testing**: Pytest, HTTPX.

## 📁 Project Structure
```text
miniProject/
├── backend/
│   ├── app/                # Application Logic
│   │   ├── routers/        # API Routes (Auth, Students, Courses, etc.)
│   │   ├── models.py       # Pydantic Schemas
│   │   ├── database.py     # Supabase Connection
│   │   └── main.py         # App Entry Point
│   └── tests/              # Backend Unit Tests
├── frontend/               # React (Vite) Frontend
│   ├── src/
│   │   ├── components/     # UI Components (Dashboard, StudentList)
│   │   ├── store/          # Zustand Global State Management
│   │   └── App.jsx         # Routing & Protected Routes
└── docs/                   # Documentation (Schema, Prompts, etc.)
```

## 🚀 Installation & Setup

1. **Clone & Navigate**:
   ```bash
   git clone <your-repo-url>
   cd miniProject
   ```

2. **Backend Setup**:
   ```bash
   python -m venv venv
   .\venv\Scripts\activate
   pip install -r backend/requirements.txt

   # Initialize Database & Indices
   python backend/app/init_db.py
   python backend/app/optimize_db.py
   ```

3. **Frontend Setup**:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

4. **Running Application**:
   - **Frontend**: [http://localhost:5173/](http://localhost:5173/)
   - **Backend**: [http://localhost:8000/docs](http://localhost:8000/docs) (Swagger UI)

## 📄 Documentation
- [Walkthrough](walkthrough.md)
- [Database Schema](docs/db_schema.md)
- [UI Prompt](docs/ui_prompt.md)
