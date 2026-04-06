from fastapi import APIRouter, Depends, HTTPException
from typing import List, Optional
from ..database import get_supabase
from ..models import Mentor, MentorCreate
from app.utils.dependencies import get_current_user   # ✅ NEW

router = APIRouter(prefix="/mentors", tags=["mentors"])


# -----------------------------
# HELPER: MENTOR AUTH CHECK
# -----------------------------
def require_mentor(user, mentor_id: int):
    if user["role"] != "mentor":
        raise HTTPException(status_code=403, detail="Mentor access required")

    if user["id"] != mentor_id:
        raise HTTPException(status_code=403, detail="Access denied")


# -----------------------------
# GET ALL MENTORS (ADMIN ONLY)
# -----------------------------
@router.get("/", response_model=List[Mentor])
async def get_mentors(
    supabase = Depends(get_supabase),
    user = Depends(get_current_user)
):
    if user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Admin only")

    res = supabase.table("mentors").select("*").execute()
    return res.data


# -----------------------------
# GET SINGLE MENTOR
# -----------------------------
@router.get("/{mentor_id}", response_model=Mentor)
async def get_mentor(
    mentor_id: int,
    supabase = Depends(get_supabase),
    user = Depends(get_current_user)
):
    # allow admin OR same mentor
    if user["role"] != "admin" and not (user["role"] == "mentor" and user["id"] == mentor_id):
        raise HTTPException(status_code=403, detail="Access denied")

    res = supabase.table("mentors").select("*").eq("id", mentor_id).execute()

    if not res.data:
        raise HTTPException(status_code=404, detail="Mentor not found")

    return res.data[0]


# -----------------------------
# GET MENTOR STUDENTS
# -----------------------------
@router.get("/{mentor_id}/students")
async def get_mentor_students(
    mentor_id: int,
    search: Optional[str] = None,
    department: Optional[str] = None,
    supabase = Depends(get_supabase),
    user = Depends(get_current_user)
):
    require_mentor(user, mentor_id)

    query = supabase.table("mentorships")\
        .select("students!inner(*)")\
        .eq("mentor_id", mentor_id)

    if search:
        query = query.or_(f"students.name.ilike.%{search}%,students.roll_no.ilike.%{search}%")
    
    if department:
        query = query.eq("students.department", department)

    res = query.execute()
    return [row["students"] for row in res.data]


# -----------------------------
# GET MENTOR COURSES
# -----------------------------
@router.get("/{mentor_id}/courses")
async def get_mentor_courses(
    mentor_id: int,
    supabase = Depends(get_supabase),
    user = Depends(get_current_user)
):
    require_mentor(user, mentor_id)

    res = supabase.table("course_mentors")\
        .select("courses(*)")\
        .eq("mentor_id", mentor_id)\
        .execute()

    return [row["courses"] for row in res.data]


# -----------------------------
# MENTOR DASHBOARD
# -----------------------------
@router.get("/{mentor_id}/dashboard")
async def mentor_dashboard(
    mentor_id: int,
    supabase = Depends(get_supabase),
    user = Depends(get_current_user)
):
    require_mentor(user, mentor_id)

    mentor_res = supabase.table("mentors")\
        .select("*")\
        .eq("id", mentor_id)\
        .execute()

    if not mentor_res.data:
        raise HTTPException(status_code=404, detail="Mentor not found")

    mentor = mentor_res.data[0]

    students_res = supabase.table("mentorships")\
        .select("students(id,name,roll_no,department,year)")\
        .eq("mentor_id", mentor_id)\
        .execute()

    students = [s["students"] for s in students_res.data]

    courses_res = supabase.table("course_mentors")\
        .select("courses(id,title)")\
        .eq("mentor_id", mentor_id)\
        .execute()

    courses = [c["courses"] for c in courses_res.data]

    return {
        "mentor": mentor["name"],
        "students_count": len(students),
        "courses_count": len(courses),
        "students": students,
        "courses": courses
    }


# -----------------------------
# COURSE STUDENTS (MENTOR ONLY)
# -----------------------------
@router.get("/{mentor_id}/course/{course_id}/students")
async def get_course_students(
    mentor_id: int,
    course_id: int,
    supabase = Depends(get_supabase),
    user = Depends(get_current_user)
):
    require_mentor(user, mentor_id)

    # Verify mentor teaches this course
    mapping = supabase.table("course_mentors")\
        .select("*")\
        .eq("mentor_id", mentor_id)\
        .eq("course_id", course_id)\
        .execute()
    
    if not mapping.data:
        raise HTTPException(status_code=403, detail="Mentor not assigned to this course")

    # Get students + assessments
    res = supabase.table("enrollments")\
        .select("id, students(id, name, email), assessments(score, assessment_type_id)")\
        .eq("course_id", course_id)\
        .execute()

    return res.data