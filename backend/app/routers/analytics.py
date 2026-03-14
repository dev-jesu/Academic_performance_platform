from fastapi import APIRouter, Depends
from typing import Optional
from ..database import get_supabase

router = APIRouter(prefix="/analytics", tags=["analytics"])


@router.get("/class-performance")
async def class_performance(department: Optional[str] = None, supabase = Depends(get_supabase)):

    if department:
        res = supabase.table("enrollments")\
            .select("final_score, students!inner(department)")\
            .eq("students.department", department)\
            .execute()
    else:
        res = supabase.table("enrollments").select("final_score").execute()

    scores = [r["final_score"] for r in res.data if r["final_score"] is not None]

    if not scores:
        return {"message": "No scores available"}

    avg = sum(scores) / len(scores)

    topper = max(scores)

    weak = [s for s in scores if s < 50]

    return {
        "class_average": round(avg, 2),
        "top_score": topper,
        "weak_students": len(weak)
    }


@router.get("/grade-distribution")
async def grade_distribution(department: Optional[str] = None, supabase = Depends(get_supabase)):

    if department:
        res = supabase.table("enrollments")\
            .select("grade, students!inner(department)")\
            .eq("students.department", department)\
            .execute()
    else:
        res = supabase.table("enrollments").select("grade").execute()

    dist = {}

    for r in res.data:
        g = r["grade"]
        if g:
            dist[g] = dist.get(g, 0) + 1

    return dist


@router.get("/student-progress/{student_id}")
async def student_progress(student_id: int, supabase = Depends(get_supabase)):

    enrollments = supabase.table("enrollments")\
        .select("id")\
        .eq("student_id", student_id)\
        .execute()

    pt1 = []
    pt2 = []
    sem = []

    for e in enrollments.data:

        assessments = supabase.table("assessments")\
            .select("score, assessment_type_id")\
            .eq("enrollment_id", e["id"])\
            .execute()

        for a in assessments.data:

            if a["assessment_type_id"] == 1:
                pt1.append(a["score"])

            elif a["assessment_type_id"] == 2:
                pt2.append(a["score"])

            elif a["assessment_type_id"] == 3:
                sem.append(a["score"])

    return {
        "progress": [
            {"exam": "PT1", "score": sum(pt1)/len(pt1) if pt1 else 0},
            {"exam": "PT2", "score": sum(pt2)/len(pt2) if pt2 else 0},
            {"exam": "SEM", "score": sum(sem)/len(sem) if sem else 0}
        ]
    }