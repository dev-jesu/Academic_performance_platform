from fastapi import APIRouter, Depends, HTTPException
from typing import List
from ..database import get_supabase
from ..models import Semester, SemesterCreate

router = APIRouter(prefix="/semesters", tags=["semesters"])


# Get all semesters
@router.get("/", response_model=List[Semester])
async def get_semesters(supabase = Depends(get_supabase)):

    res = supabase.table("semesters").select("*").execute()

    return res.data


# Create semester
@router.post("/", response_model=Semester)
async def create_semester(data: SemesterCreate, supabase = Depends(get_supabase)):

    res = supabase.table("semesters").insert(data.model_dump()).execute()

    return res.data[0]


# Get semester by id
@router.get("/{semester_id}", response_model=Semester)
async def get_semester(semester_id: int, supabase = Depends(get_supabase)):

    res = supabase.table("semesters").select("*").eq("id", semester_id).execute()

    if not res.data:
        raise HTTPException(status_code=404, detail="Semester not found")

    return res.data[0]


# Delete semester
@router.delete("/{semester_id}")
async def delete_semester(semester_id: int, supabase = Depends(get_supabase)):

    supabase.table("semesters").delete().eq("id", semester_id).execute()

    return {"message": "Semester deleted"}