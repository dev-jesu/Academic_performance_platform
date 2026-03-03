from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from ..database import get_supabase
from ..models import Assessment, AssessmentCreate

router = APIRouter(prefix="/assessments", tags=["assessments"])

@router.get("/", response_model=List[Assessment])
async def get_assessments(supabase = Depends(get_supabase)):
    response = supabase.table("assessment").select("*").execute()
    return response.data

@router.post("/", response_model=Assessment, status_code=status.HTTP_201_CREATED)
async def create_assessment(assessment: AssessmentCreate, supabase = Depends(get_supabase)):
    response = supabase.table("assessment").insert(assessment.model_dump()).execute()
    if not response.data:
        raise HTTPException(status_code=400, detail="Failed to create assessment")
    return response.data[0]

@router.get("/{assessment_id}", response_model=Assessment)
async def get_assessment(assessment_id: int, supabase = Depends(get_supabase)):
    response = supabase.table("assessment").select("*").eq("id", assessment_id).execute()
    if not response.data:
        raise HTTPException(status_code=404, detail="Assessment not found")
    return response.data[0]

@router.put("/{assessment_id}", response_model=Assessment)
async def update_assessment(assessment_id: int, assessment: AssessmentCreate, supabase = Depends(get_supabase)):
    response = supabase.table("assessment").update(assessment.model_dump()).eq("id", assessment_id).execute()
    if not response.data:
        raise HTTPException(status_code=404, detail="Assessment not found")
    return response.data[0]

@router.delete("/{assessment_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_assessment(assessment_id: int, supabase = Depends(get_supabase)):
    response = supabase.table("assessment").delete().eq("id", assessment_id).execute()
    if not response.data:
        raise HTTPException(status_code=404, detail="Assessment not found")
    return None
