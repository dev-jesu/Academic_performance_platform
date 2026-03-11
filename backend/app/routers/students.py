from fastapi import APIRouter, Depends, HTTPException
from typing import List, Optional
from ..database import get_supabase
from ..models import Student, StudentCreate

router = APIRouter(prefix="/students", tags=["students"])


@router.get("/", response_model=List[Student])
async def get_students(
    q: Optional[str] = None,
    department: Optional[str] = None,
    supabase = Depends(get_supabase)
):

    query = supabase.table("students").select("*")

    if q:
        query = query.or_(f"name.ilike.%{q}%,email.ilike.%{q}%")

    if department:
        query = query.eq("department", department)

    res = query.execute()
    return res.data


@router.post("/", response_model=Student)
async def create_student(student: StudentCreate, supabase = Depends(get_supabase)):

    res = supabase.table("students").insert(student.model_dump()).execute()

    return res.data[0]


@router.get("/{student_id}", response_model=Student)
async def get_student(student_id: int, supabase = Depends(get_supabase)):

    res = supabase.table("students").select("*").eq("id", student_id).execute()

    if not res.data:
        raise HTTPException(404, "Student not found")

    return res.data[0]


@router.delete("/{student_id}")
async def delete_student(student_id: int, supabase = Depends(get_supabase)):

    supabase.table("students").delete().eq("id", student_id).execute()

    return {"message": "Student deleted"}


@router.get("/{student_id}/performance")
async def get_student_performance(student_id: int, supabase = Depends(get_supabase)):

    # Get student info
    student_res = supabase.table("students") \
        .select("*") \
        .eq("id", student_id) \
        .execute()

    if not student_res.data:
        raise HTTPException(status_code=404, detail="Student not found")

    student = student_res.data[0]

    # Get enrollments for student
    enrollments_res = supabase.table("enrollments") \
        .select("*") \
        .eq("student_id", student_id) \
        .execute()

    results = []

    for enrollment in enrollments_res.data:

        course_id = enrollment["course_id"]
        enrollment_id = enrollment["id"]

        # Get course
        course_res = supabase.table("courses") \
            .select("title") \
            .eq("id", course_id) \
            .execute()

        course_name = course_res.data[0]["title"]

        # Get assessments
        assess_res = supabase.table("assessments") \
            .select("score, assessment_type_id") \
            .eq("enrollment_id", enrollment_id) \
            .execute()

        pt1 = None
        pt2 = None
        sem = None

        for a in assess_res.data:

            if a["assessment_type_id"] == 1:
                pt1 = a["score"]

            elif a["assessment_type_id"] == 2:
                pt2 = a["score"]

            elif a["assessment_type_id"] == 3:
                sem = a["score"]

        results.append({
            "course": course_name,
            "pt1": pt1,
            "pt2": pt2,
            "semester": sem,
            "grade": enrollment["grade"]
        })

    return {
        "student": student["name"],
        "courses": results
    }