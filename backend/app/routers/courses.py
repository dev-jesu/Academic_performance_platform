from fastapi import APIRouter, Depends, HTTPException, status
from typing import List, Optional
from ..database import get_supabase
from ..models import Course, CourseCreate

router = APIRouter(prefix="/courses", tags=["courses"])

@router.get("/", response_model=List[Course])
async def get_courses(
    q: Optional[str] = None,
    department: Optional[str] = None,
    supabase = Depends(get_supabase)
):
    query = supabase.table("course").select("*")
    
    if q:
        # Search in course code and title
        query = query.or_(f"code.ilike.%{q}%,title.ilike.%{q}%")
    
    if department:
        query = query.eq("department", department)
        
    response = query.execute()
    return response.data

@router.post("/", response_model=Course, status_code=status.HTTP_201_CREATED)
async def create_course(course: CourseCreate, supabase = Depends(get_supabase)):
    response = supabase.table("course").insert(course.model_dump()).execute()
    if not response.data:
        raise HTTPException(status_code=400, detail="Failed to create course")
    return response.data[0]

@router.get("/{course_id}", response_model=Course)
async def get_course(course_id: int, supabase = Depends(get_supabase)):
    response = supabase.table("course").select("*").eq("id", course_id).execute()
    if not response.data:
        raise HTTPException(status_code=404, detail="Course not found")
    return response.data[0]

@router.put("/{course_id}", response_model=Course)
async def update_course(course_id: int, course: CourseCreate, supabase = Depends(get_supabase)):
    response = supabase.table("course").update(course.model_dump()).eq("id", course_id).execute()
    if not response.data:
        raise HTTPException(status_code=404, detail="Course not found")
    return response.data[0]

@router.delete("/{course_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_course(course_id: int, supabase = Depends(get_supabase)):
    response = supabase.table("course").delete().eq("id", course_id).execute()
    if not response.data:
        raise HTTPException(status_code=404, detail="Course not found")
    return None
