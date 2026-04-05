from fastapi import APIRouter, Depends, HTTPException
from typing import List
from ..database import get_supabase
from ..models import Assessment, AssessmentCreate
from ..utils.grade import calculate_grade
from app.utils.dependencies import get_current_user   # ✅ NEW

router = APIRouter(prefix="/assessments", tags=["assessments"])


# -----------------------------
# GET ALL ASSESSMENTS (ADMIN ONLY)
# -----------------------------
@router.get("/", response_model=List[Assessment])
async def get_assessments(
    supabase = Depends(get_supabase),
    user = Depends(get_current_user)
):

    if user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Admin only")

    res = supabase.table("assessments").select("*").execute()
    return res.data


# -----------------------------
# CREATE / UPDATE ASSESSMENT
# -----------------------------
@router.post("/", response_model=Assessment)
async def create_assessment(
    data: AssessmentCreate,
    supabase = Depends(get_supabase),
    user = Depends(get_current_user)
):

    # ✅ Only mentor allowed
    if user["role"] != "mentor":
        raise HTTPException(status_code=403, detail="Mentor only")

    # -----------------------------
    # VERIFY MENTOR OWNS COURSE
    # -----------------------------
    enrollment_res = supabase.table("enrollments")\
        .select("course_id")\
        .eq("id", data.enrollment_id)\
        .execute()

    if not enrollment_res.data:
        raise HTTPException(status_code=404, detail="Enrollment not found")

    course_id = enrollment_res.data[0]["course_id"]

    mapping = supabase.table("course_mentors")\
        .select("id")\
        .eq("mentor_id", user["id"])\
        .eq("course_id", course_id)\
        .execute()

    if not mapping.data:
        raise HTTPException(status_code=403, detail="You are not assigned to this course")

    # -----------------------------
    # UPSERT ASSESSMENT
    # -----------------------------
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
        res = supabase.table("assessments")\
            .insert(data.model_dump(mode='json'))\
            .execute()
    
    assessment = res.data[0]

    enrollment_id = data.enrollment_id

    # -----------------------------
    # RE-CALCULATE FINAL SCORE
    # -----------------------------
    marks_res = supabase.table("assessments") \
        .select("score") \
        .eq("enrollment_id", enrollment_id) \
        .execute()

    marks = [m["score"] for m in marks_res.data]

    if len(marks) >= 3:   # PT1 + PT2 + SEM
        total = sum(marks)
        percentage = (total / 200) * 100
        from app.utils.grade import calculate_grade, get_grade_points
        grade = calculate_grade(percentage)

        # 1. Update Enrollment
        supabase.table("enrollments").update({
            "final_score": percentage,
            "grade": grade
        }).eq("id", enrollment_id).execute()

        # 2. Get Student/Semester info
        enr_data = supabase.table("enrollments").select("student_id, semester_id").eq("id", enrollment_id).execute()
        if enr_data.data:
            sid = enr_data.data[0]["student_id"]
            sem_id = enr_data.data[0]["semester_id"]

            # 3. Calculate SGPA
            sem_enrs = supabase.table("enrollments").select("grade, courses(credits)").eq("student_id", sid).eq("semester_id", sem_id).execute()
            pts, creds = 0.0, 0
            for r in sem_enrs.data:
                g = r.get("grade")
                c = r.get("courses", {}).get("credits", 0)
                if g and c:
                    pts += (get_grade_points(g) * c)
                    creds += c
            sgpa = round(pts / creds, 2) if creds > 0 else 0.0

            # Upsert semester_results
            res = supabase.table("semester_results").select("id").eq("student_id", sid).eq("semester_id", sem_id).execute()
            if res.data:
                supabase.table("semester_results").update({"sgpa": sgpa}).eq("id", res.data[0]["id"]).execute()
            else:
                supabase.table("semester_results").insert({"student_id": sid, "semester_id": sem_id, "sgpa": sgpa}).execute()

            # 4. Update Student CGPA
            all_res = supabase.table("semester_results").select("sgpa").eq("student_id", sid).execute()
            cgpa = round(sum(r["sgpa"] for r in all_res.data) / len(all_res.data), 2) if all_res.data else sgpa
            supabase.table("students").update({"current_sgpa": sgpa, "final_cgpa": cgpa}).eq("id", sid).execute()

    return assessment