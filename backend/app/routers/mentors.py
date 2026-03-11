from fastapi import APIRouter, Depends, HTTPException
from typing import List
from ..database import get_supabase
from ..models import Mentor, MentorCreate

router = APIRouter(prefix="/mentors", tags=["mentors"])


@router.get("/", response_model=List[Mentor])
async def get_mentors(supabase = Depends(get_supabase)):

    res = supabase.table("mentors").select("*").execute()
    return res.data


@router.post("/", response_model=Mentor)
async def create_mentor(mentor: MentorCreate, supabase = Depends(get_supabase)):

    res = supabase.table("mentors").insert(mentor.model_dump()).execute()

    return res.data[0]


@router.get("/{mentor_id}/students")
async def get_mentor_students(mentor_id: int, supabase = Depends(get_supabase)):

    res = supabase.table("mentorships") \
        .select("students(*)") \
        .eq("mentor_id", mentor_id) \
        .execute()

    return [row["students"] for row in res.data]


@router.get("/{mentor_id}/courses")
async def get_mentor_courses(mentor_id: int, supabase = Depends(get_supabase)):

    res = supabase.table("courses") \
        .select("*") \
        .eq("mentor_id", mentor_id) \
        .execute()

    return res.data


@router.get("/{mentor_id}/dashboard")
async def mentor_dashboard(mentor_id: int, supabase = Depends(get_supabase)):

    # Get mentor info
    mentor_res = supabase.table("mentors") \
        .select("*") \
        .eq("id", mentor_id) \
        .execute()

    if not mentor_res.data:
        raise HTTPException(status_code=404, detail="Mentor not found")

    mentor = mentor_res.data[0]

    # Get students under mentor
    students_res = supabase.table("mentorships") \
        .select("students(id,name)") \
        .eq("mentor_id", mentor_id) \
        .execute()

    students = [s["students"] for s in students_res.data]

    # Get courses taught by mentor
    courses_res = supabase.table("courses") \
        .select("id,title") \
        .eq("mentor_id", mentor_id) \
        .execute()

    courses = courses_res.data

    return {
        "mentor": mentor["name"],
        "students_count": len(students),
        "courses_count": len(courses),
        "students": students,
        "courses": courses
    }