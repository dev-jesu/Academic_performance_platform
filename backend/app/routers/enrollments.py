from fastapi import APIRouter, Depends, HTTPException
from typing import List
from ..database import get_supabase
from ..models import Enrollment, EnrollmentCreate, EnrollmentDetailed
from app.utils.dependencies import get_current_user   # ✅ NEW

router = APIRouter(prefix="/enrollments", tags=["enrollments"])


# -----------------------------
# HELPER: ADMIN ONLY
# -----------------------------
def require_admin(user):
    if user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Admin only")


# -----------------------------
# GET ALL ENROLLMENTS
# -----------------------------
@router.get("/", response_model=List[EnrollmentDetailed])
async def get_enrollments(
    supabase = Depends(get_supabase),
    user = Depends(get_current_user)
):
    require_admin(user)

    res = supabase.table("enrollments")\
        .select("*, students(id, name, mentorships(mentors(id, name))), courses(id, title), semesters(id, name)")\
        .execute()

    return res.data


# -----------------------------
# CREATE ENROLLMENT
# -----------------------------
@router.post("/", response_model=Enrollment)
async def create_enrollment(
    data: EnrollmentCreate,
    supabase = Depends(get_supabase),
    user = Depends(get_current_user)
):
    require_admin(user)

    res = supabase.table("enrollments")\
        .insert(data.model_dump())\
        .execute()

    return res.data[0]


# -----------------------------
# GET ENROLLMENT BY ID
# -----------------------------
@router.get("/{enrollment_id}", response_model=Enrollment)
async def get_enrollment(
    enrollment_id: int,
    supabase = Depends(get_supabase),
    user = Depends(get_current_user)
):
    require_admin(user)

    res = supabase.table("enrollments")\
        .select("*")\
        .eq("id", enrollment_id)\
        .execute()

    if not res.data:
        raise HTTPException(status_code=404, detail="Enrollment not found")

    return res.data[0]


# -----------------------------
# DELETE ENROLLMENT
# -----------------------------
@router.delete("/{enrollment_id}")
async def delete_enrollment(
    enrollment_id: int,
    supabase = Depends(get_supabase),
    user = Depends(get_current_user)
):
    require_admin(user)

    supabase.table("enrollments")\
        .delete()\
        .eq("id", enrollment_id)\
        .execute()

    return {"message": "Enrollment deleted"}