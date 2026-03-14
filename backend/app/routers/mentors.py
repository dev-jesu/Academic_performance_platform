from fastapi import APIRouter, Depends, HTTPException
from typing import List
from ..database import get_supabase
from ..models import Mentor, MentorCreate

router = APIRouter(prefix="/mentors", tags=["mentors"])


@router.get("/", response_model=List[Mentor])
async def get_mentors(supabase = Depends(get_supabase)):

    res = supabase.table("mentors").select("*").execute()
    return res.data


@router.get("/{mentor_id}", response_model=Mentor)
async def get_mentor(mentor_id: int, supabase = Depends(get_supabase)):
    res = supabase.table("mentors").select("*").eq("id", mentor_id).execute()
    if not res.data:
        raise HTTPException(status_code=404, detail="Mentor not found")
    return res.data[0]




@router.get("/{mentor_id}/students")
async def get_mentor_students(mentor_id: int, supabase = Depends(get_supabase)):

    res = supabase.table("mentorships")\
        .select("students(*)")\
        .eq("mentor_id", mentor_id)\
        .execute()

    return [row["students"] for row in res.data]


@router.get("/{mentor_id}/courses")
async def get_mentor_courses(mentor_id: int, supabase = Depends(get_supabase)):

    res = supabase.table("course_mentors")\
        .select("courses(*)")\
        .eq("mentor_id", mentor_id)\
        .execute()

    return [row["courses"] for row in res.data]


@router.get("/{mentor_id}/dashboard")
async def mentor_dashboard(mentor_id: int, supabase = Depends(get_supabase)):

    mentor_res = supabase.table("mentors")\
        .select("*")\
        .eq("id", mentor_id)\
        .execute()

    if not mentor_res.data:
        raise HTTPException(status_code=404, detail="Mentor not found")

    mentor = mentor_res.data[0]

    students_res = supabase.table("mentorships")\
        .select("students(id,name,roll_no,department,year)")\
        .eq("mentor_id", mentor_id)\
        .execute()

    students = [s["students"] for s in students_res.data]

    courses_res = supabase.table("course_mentors")\
        .select("courses(id,title)")\
        .eq("mentor_id", mentor_id)\
        .execute()

    courses = [c["courses"] for c in courses_res.data]

    return {
        "mentor": mentor["name"],
        "students_count": len(students),
        "courses_count": len(courses),
        "students": students,
        "courses": courses
    }

@router.get("/{mentor_id}/course/{course_id}/students")
async def get_course_students(mentor_id: int, course_id: int, supabase = Depends(get_supabase)):
    # Verify mentor teaches this course
    mapping = supabase.table("course_mentors")\
        .select("*")\
        .eq("mentor_id", mentor_id)\
        .eq("course_id", course_id)\
        .execute()
    
    if not mapping.data:
        raise HTTPException(status_code=403, detail="Mentor not assigned to this course")

    # Get students enrolled in this course with their assessments
    res = supabase.table("enrollments")\
        .select("id, students(id, name, email), assessments(score, assessment_type_id)")\
        .eq("course_id", course_id)\
        .execute()

    return res.data