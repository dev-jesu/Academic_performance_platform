from fastapi import APIRouter, Depends
from typing import List
from ..database import get_supabase
from ..models import Assessment, AssessmentCreate
from ..utils.grade import calculate_grade

router = APIRouter(prefix="/assessments", tags=["assessments"])


@router.get("/", response_model=List[Assessment])
async def get_assessments(supabase = Depends(get_supabase)):

    res = supabase.table("assessments").select("*").execute()
    return res.data


@router.post("/", response_model=Assessment)
async def create_assessment(data: AssessmentCreate, supabase = Depends(get_supabase)):

    # UPSERT mark (update if exists for enrollment + type combo)
    # Check if exists first
    existing = supabase.table("assessments")\
        .select("id")\
        .eq("enrollment_id", data.enrollment_id)\
        .eq("assessment_type_id", data.assessment_type_id)\
        .execute()

    if existing.data:
        res = supabase.table("assessments")\
            .update(data.model_dump(mode='json'))\
            .eq("id", existing.data[0]["id"])\
            .execute()
    else:
        res = supabase.table("assessments").insert(data.model_dump(mode='json')).execute()
    
    assessment = res.data[0]

    enrollment_id = data.enrollment_id

    # Fetch all marks for this enrollment
    marks_res = supabase.table("assessments") \
        .select("score") \
        .eq("enrollment_id", enrollment_id) \
        .execute()

    marks = [m["score"] for m in marks_res.data]

    if len(marks) >= 3:   # PT1 + PT2 + SEM

        total = sum(marks)

        percentage = (total / 200) * 100

        grade = calculate_grade(percentage)

        # Update enrollment table
        supabase.table("enrollments") \
            .update({
                "final_score": percentage,
                "grade": grade
            }) \
            .eq("id", enrollment_id) \
            .execute()

    return assessment