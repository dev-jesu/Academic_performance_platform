from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from ..database import get_supabase
from ..models import Mentor, MentorCreate

router = APIRouter(prefix="/mentors", tags=["mentors"])

@router.get("/", response_model=List[Mentor])
async def get_mentors(supabase = Depends(get_supabase)):
    response = supabase.table("mentor").select("*").execute()
    return response.data

@router.post("/", response_model=Mentor, status_code=status.HTTP_201_CREATED)
async def create_mentor(mentor: MentorCreate, supabase = Depends(get_supabase)):
    response = supabase.table("mentor").insert(mentor.model_dump()).execute()
    if not response.data:
        raise HTTPException(status_code=400, detail="Failed to create mentor")
    return response.data[0]

@router.get("/{mentor_id}", response_model=Mentor)
async def get_mentor(mentor_id: int, supabase = Depends(get_supabase)):
    response = supabase.table("mentor").select("*").eq("id", mentor_id).execute()
    if not response.data:
        raise HTTPException(status_code=404, detail="Mentor not found")
    return response.data[0]

@router.put("/{mentor_id}", response_model=Mentor)
async def update_mentor(mentor_id: int, mentor: MentorCreate, supabase = Depends(get_supabase)):
    response = supabase.table("mentor").update(mentor.model_dump()).eq("id", mentor_id).execute()
    if not response.data:
        raise HTTPException(status_code=404, detail="Mentor not found")
    return response.data[0]

@router.delete("/{mentor_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_mentor(mentor_id: int, supabase = Depends(get_supabase)):
    response = supabase.table("mentor").delete().eq("id", mentor_id).execute()
    if not response.data:
        raise HTTPException(status_code=404, detail="Mentor not found")
    return None
