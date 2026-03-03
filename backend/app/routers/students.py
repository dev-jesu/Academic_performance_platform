from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from .database import get_supabase
from .models import Student, StudentCreate

router = APIRouter(prefix="/students", tags=["students"])

@router.get("/", response_model=List[Student])
async def get_students(supabase = Depends(get_supabase)):
    response = supabase.table("student").select("*").execute()
    return response.data

@router.post("/", response_model=Student, status_code=status.HTTP_201_CREATED)
async def create_student(student: StudentCreate, supabase = Depends(get_supabase)):
    response = supabase.table("student").insert(student.model_dump()).execute()
    if not response.data:
        raise HTTPException(status_code=400, detail="Failed to create student")
    return response.data[0]

@router.get("/{student_id}", response_model=Student)
async def get_student(student_id: int, supabase = Depends(get_supabase)):
    response = supabase.table("student").select("*").eq("id", student_id).execute()
    if not response.data:
        raise HTTPException(status_code=404, detail="Student not found")
    return response.data[0]

@router.put("/{student_id}", response_model=Student)
async def update_student(student_id: int, student: StudentCreate, supabase = Depends(get_supabase)):
    response = supabase.table("student").update(student.model_dump()).eq("id", student_id).execute()
    if not response.data:
        raise HTTPException(status_code=404, detail="Student not found")
    return response.data[0]

@router.delete("/{student_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_student(student_id: int, supabase = Depends(get_supabase)):
    response = supabase.table("student").delete().eq("id", student_id).execute()
    if not response.data:
        raise HTTPException(status_code=404, detail="Student not found")
    return None
