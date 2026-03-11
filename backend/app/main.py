from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import os
from dotenv import load_dotenv
from .routers import semesters
from .routers import enrollments

# Import Routers
from .routers import (
    auth,
    students,
    courses,
    mentors,
    assessments,
)

# Future routers
# from .routers import semesters, enrollments

load_dotenv()

app = FastAPI(
    title="Academic Performance Assessment Platform API",
    description="Backend API for student performance assessment, mentorship tracking, and academic analytics.",
    version="1.0.0",
)

# -----------------------------
# CORS CONFIGURATION
# -----------------------------

origins = [
    "http://localhost:3000",
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -----------------------------
# REGISTER ROUTERS
# -----------------------------

app.include_router(auth.router)
app.include_router(students.router)
app.include_router(courses.router)
app.include_router(mentors.router)
app.include_router(assessments.router)
app.include_router(semesters.router)
app.include_router(enrollments.router)

# Uncomment later when created
# app.include_router(semesters.router)
# app.include_router(enrollments.router)

# -----------------------------
# GLOBAL ERROR HANDLER
# -----------------------------

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=500,
        content={
            "message": "An internal server error occurred.",
            "detail": str(exc),
        },
    )

# -----------------------------
# ROOT ENDPOINT
# -----------------------------

@app.get("/")
async def root():
    return {
        "message": "Academic Performance Assessment Platform API running successfully"
    }

# -----------------------------
# HEALTH CHECK
# -----------------------------

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "environment": os.getenv("ENVIRONMENT", "development"),
    }


# -----------------------------
# RUN SERVER
# -----------------------------

if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )