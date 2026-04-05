from fastapi import APIRouter, Depends, HTTPException
from typing import List
from ..database import get_supabase
from ..models import Semester, SemesterCreate
from app.utils.dependencies import get_current_user   # ✅ NEW

router = APIRouter(prefix="/semesters", tags=["semesters"])


# -----------------------------
# GET ALL SEMESTERS (ALL USERS)
# -----------------------------
@router.get("/", response_model=List[Semester])
async def get_semesters(
    supabase = Depends(get_supabase),
    user = Depends(get_current_user)
):

    res = supabase.table("semesters").select("*").execute()
    return res.data


# -----------------------------
# CREATE SEMESTER (ADMIN ONLY)
# -----------------------------
@router.post("/", response_model=Semester)
async def create_semester(
    data: SemesterCreate,
    supabase = Depends(get_supabase),
    user = Depends(get_current_user)
):

    if user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Admin only")

    res = supabase.table("semesters").insert(data.model_dump()).execute()
    return res.data[0]


# -----------------------------
# GET SEMESTER BY ID (ALL USERS)
# -----------------------------
@router.get("/{semester_id}", response_model=Semester)
async def get_semester(
    semester_id: int,
    supabase = Depends(get_supabase),
    user = Depends(get_current_user)
):

    res = supabase.table("semesters")\
        .select("*")\
        .eq("id", semester_id)\
        .execute()

    if not res.data:
        raise HTTPException(status_code=404, detail="Semester not found")

    return res.data[0]


# -----------------------------
# DELETE SEMESTER (ADMIN ONLY)
# -----------------------------
@router.delete("/{semester_id}")
async def delete_semester(
    semester_id: int,
    supabase = Depends(get_supabase),
    user = Depends(get_current_user)
):

    if user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Admin only")

    supabase.table("semesters")\
        .delete()\
        .eq("id", semester_id)\
        .execute()

    return {"message": "Semester deleted"}