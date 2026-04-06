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
    semesters,
    enrollments,
    assessments,
    analytics,
    admin
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

allow_origins_str = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000,http://localhost:5173")
origins = [origin.strip() for origin in allow_origins_str.split(",") if origin.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.middleware("http")
async def add_security_headers(request: Request, call_next):
    response = await call_next(request)
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["X-XSS-Protection"] = "1; mode=block"
    response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
    response.headers["Content-Security-Policy"] = "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self' https://ggjjwgczbzxhketbgatf.supabase.co"
    return response

# -----------------------------
# REGISTER ROUTERS
# -----------------------------

app.include_router(auth.router)
app.include_router(students.router)
app.include_router(courses.router)
app.include_router(mentors.router)
app.include_router(semesters.router)
app.include_router(enrollments.router)
app.include_router(assessments.router)
app.include_router(analytics.router)
app.include_router(admin.router)

# Uncomment later when created
# app.include_router(semesters.router)
# app.include_router(enrollments.router)

# -----------------------------
# GLOBAL ERROR HANDLER
# -----------------------------

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    is_dev = os.getenv("ENVIRONMENT", "development") == "development"
    return JSONResponse(
        status_code=500,
        content={
            "message": "An internal server error occurred.",
            "detail": str(exc) if is_dev else "Please contact support for assistance.",
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

    port = int(os.getenv("PORT", 8000))
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=port,
        reload=os.getenv("ENVIRONMENT", "development") == "development"
    )