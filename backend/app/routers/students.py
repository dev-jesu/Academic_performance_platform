from fastapi import APIRouter, Depends, HTTPException, status
from typing import List, Optional
from ..database import get_supabase
from ..models import Student, StudentCreate

router = APIRouter(prefix="/students", tags=["students"])

@router.get("/", response_model=List[Student])
async def get_students(
    q: Optional[str] = None,
    major: Optional[str] = None,
    limit: int = 10,
    offset: int = 0,
    supabase = Depends(get_supabase)
):
    query = supabase.table("student").select("*")
    
    if q:
        # Simple search in name and email
        query = query.or_(f"name.ilike.%{q}%,email.ilike.%{q}%")
    
    if major:
        query = query.eq("major", major)
        
    response = query.range(offset, offset + limit - 1).execute()
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
