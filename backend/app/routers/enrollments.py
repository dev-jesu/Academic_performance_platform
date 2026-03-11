from fastapi import APIRouter, Depends, HTTPException
from typing import List
from ..database import get_supabase
from ..models import Enrollment, EnrollmentCreate

router = APIRouter(prefix="/enrollments", tags=["enrollments"])


# Get all enrollments
@router.get("/", response_model=List[Enrollment])
async def get_enrollments(supabase = Depends(get_supabase)):

    res = supabase.table("enrollments").select("*").execute()

    return res.data


# Create enrollment
@router.post("/", response_model=Enrollment)
async def create_enrollment(data: EnrollmentCreate, supabase = Depends(get_supabase)):

    res = supabase.table("enrollments").insert(data.model_dump()).execute()

    return res.data[0]


# Get enrollment by id
@router.get("/{enrollment_id}", response_model=Enrollment)
async def get_enrollment(enrollment_id: int, supabase = Depends(get_supabase)):

    res = supabase.table("enrollments").select("*").eq("id", enrollment_id).execute()

    if not res.data:
        raise HTTPException(status_code=404, detail="Enrollment not found")

    return res.data[0]


# Delete enrollment
@router.delete("/{enrollment_id}")
async def delete_enrollment(enrollment_id: int, supabase = Depends(get_supabase)):

    supabase.table("enrollments").delete().eq("id", enrollment_id).execute()

    return {"message": "Enrollment deleted"}