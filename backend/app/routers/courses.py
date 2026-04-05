from fastapi import APIRouter, Depends, HTTPException
from typing import List, Optional
from ..database import get_supabase
from ..models import Course, CourseCreate
from app.utils.dependencies import get_current_user   # ✅ NEW

router = APIRouter(prefix="/courses", tags=["courses"])


# -----------------------------
# GET COURSES (ALL LOGGED-IN USERS)
# -----------------------------
@router.get("/", response_model=List[Course])
async def get_courses(
    department: Optional[str] = None,
    supabase = Depends(get_supabase),
    user = Depends(get_current_user)
):

    query = supabase.table("courses").select("*")

    if department:
        query = query.eq("department", department)

    res = query.execute()
    return res.data


# -----------------------------
# CREATE COURSE (ADMIN ONLY)
# -----------------------------
@router.post("/", response_model=Course)
async def create_course(
    course: CourseCreate,
    supabase = Depends(get_supabase),
    user = Depends(get_current_user)
):

    if user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Admin only")

    res = supabase.table("courses").insert(course.model_dump()).execute()
    return res.data[0]


# -----------------------------
# GET SINGLE COURSE
# -----------------------------
@router.get("/{course_id}", response_model=Course)
async def get_course(
    course_id: int,
    supabase = Depends(get_supabase),
    user = Depends(get_current_user)
):

    res = supabase.table("courses")\
        .select("*")\
        .eq("id", course_id)\
        .execute()

    if not res.data:
        raise HTTPException(status_code=404, detail="Course not found")

    return res.data[0]