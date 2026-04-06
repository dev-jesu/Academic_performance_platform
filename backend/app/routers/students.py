from fastapi import APIRouter, Depends, HTTPException
from typing import List, Optional
from ..database import get_supabase
from ..models import Student, StudentCreate
from app.utils.dependencies import get_current_user   # ✅ NEW

router = APIRouter(prefix="/students", tags=["students"])


# -----------------------------
# GET ALL STUDENTS (ADMIN ONLY)
# -----------------------------
@router.get("/", response_model=List[Student])
async def get_students(
    q: Optional[str] = None,
    department: Optional[str] = None,
    supabase = Depends(get_supabase),
    user = Depends(get_current_user)
):

    # ✅ Only admin allowed
    if user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Admin only")

    query = supabase.table("students").select("*")

    if q:
        query = query.or_(f"name.ilike.%{q}%,email.ilike.%{q}%")

    if department:
        query = query.eq("department", department)

    res = query.execute()
    return res.data


# -----------------------------
# STUDENT PERFORMANCE
# -----------------------------
@router.get("/{student_id}/performance")
async def get_student_performance(
    student_id: int,
    supabase = Depends(get_supabase),
    user = Depends(get_current_user)
):

    # ✅ Authorization check
    if user["role"] == "student":
        if user["id"] != student_id:
            raise HTTPException(status_code=403, detail="Access denied")

    elif user["role"] == "mentor":
        # Verify the mentor is assigned to this student
        mentorship_check = supabase.table("mentorships")\
            .select("id")\
            .eq("mentor_id", user["id"])\
            .eq("student_id", student_id)\
            .execute()
        if not mentorship_check.data:
            raise HTTPException(status_code=403, detail="Not your assigned student")

    elif user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")

    # -----------------------------
    # 1. Get student info
    # -----------------------------
    student_res = supabase.table("students")\
        .select("name, roll_no, year, department, final_cgpa, semester_id")\
        .eq("id", student_id)\
        .execute()

    if not student_res.data:
        raise HTTPException(status_code=404, detail="Student not found")

    student = student_res.data[0]

    # -----------------------------
    # 2. Get mentor name
    # -----------------------------
    mentor_res = supabase.table("mentorships")\
        .select("mentors(name)")\
        .eq("student_id", student_id)\
        .execute()
    
    mentor_name = (
        mentor_res.data[0]["mentors"]["name"]
        if mentor_res.data and mentor_res.data[0].get("mentors")
        else "Not Assigned"
    )

    # -----------------------------
    # 3. SGPA history
    # -----------------------------
    sgpa_res = supabase.table("semester_results")\
        .select("semester_id, sgpa")\
        .eq("student_id", student_id)\
        .execute()
    
    sgpa_map = {item["semester_id"]: item["sgpa"] for item in sgpa_res.data}

    # -----------------------------
    # 4. Enrollments + assessments
    # -----------------------------
    enrollments_res = supabase.table("enrollments")\
        .select("semester_id, final_score, grade, courses(title), assessments(score, assessment_type_id)")\
        .eq("student_id", student_id)\
        .execute()

    semesters = {}

    for enr in enrollments_res.data:
        semester = enr["semester_id"]
        assessments = enr.get("assessments", [])

        pt1 = next((a["score"] for a in assessments if a["assessment_type_id"] == 1), None)
        pt2 = next((a["score"] for a in assessments if a["assessment_type_id"] == 2), None)
        sem_exam = next((a["score"] for a in assessments if a["assessment_type_id"] == 3), None)

        course_data = {
            "course": enr["courses"]["title"] if enr.get("courses") else "Unknown",
            "pt1": pt1,
            "pt2": pt2,
            "semester_exam": sem_exam,
            "final_score": enr.get("final_score"),
            "grade": enr.get("grade")
        }

        if semester not in semesters:
            semesters[semester] = {
                "semester": semester,
                "sgpa": sgpa_map.get(semester, 0.0),
                "courses": []
            }

        semesters[semester]["courses"].append(course_data)

    # Include SGPA-only semesters
    for sem_id, sgpa in sgpa_map.items():
        if sem_id not in semesters:
            semesters[sem_id] = {
                "semester": sem_id,
                "sgpa": sgpa,
                "courses": []
            }

    return {
        "student": student["name"],
        "roll_no": student["roll_no"],
        "year": student["year"],
        "semester_id": student["semester_id"],
        "department": student["department"],
        "cgpa": student["final_cgpa"],
        "mentor_name": mentor_name,
        "semesters": list(semesters.values())
    }