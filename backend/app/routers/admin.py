from fastapi import APIRouter, Depends, HTTPException, status
from typing import Optional, List
from datetime import date
from ..database import get_supabase
from ..models import AdminCreateStudent, AdminCreateMentor, AssignStudentMentor, AssignCourseMentor, ResetPassword
from app.utils.dependencies import get_current_user   # ✅ NEW

router = APIRouter(prefix="/admin", tags=["admin"])


# -----------------------------
# HELPER: ADMIN AUTH CHECK
# -----------------------------
def require_admin(user):
    if user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")


# -----------------------------
# CREATE STUDENT
# -----------------------------
@router.post("/students")
async def create_student(
    student: AdminCreateStudent,
    supabase = Depends(get_supabase),
    user = Depends(get_current_user)   # ✅ NEW
):
    require_admin(user)  # ✅ NEW

    data = student.model_dump()

    # Generate roll_no
    dept = data["department"]
    year = data["year"]
    
    dept_map = {"CSE": "CS", "MECH": "ME", "CIVIL": "CE"}
    dept_code = dept_map.get(dept, "XX")
    
    year_map = {1: "21", 2: "22", 3: "23"}
    year_prefix = year_map.get(year, "00")
    
    existing = supabase.table("students")\
        .select("roll_no")\
        .eq("department", dept)\
        .eq("year", year)\
        .order("roll_no", desc=True)\
        .limit(1)\
        .execute()
        
    if existing.data and existing.data[0].get("roll_no"):
        last_roll = existing.data[0]["roll_no"]
        try:
            num = int(last_roll[-3:]) + 1
        except:
            num = 1
    else:
        num = 1
        
    data["roll_no"] = f"{year_prefix}{dept_code}{num:03d}"

    # Init SGPA/CGPA
    if "current_sgpa" not in data: data["current_sgpa"] = 0
    if "final_cgpa" not in data: data["final_cgpa"] = 0

    res = supabase.table("students").insert(data).execute()

    return {
        "message": "Student created successfully",
        "student": res.data[0]
    }


# -----------------------------
# CREATE MENTOR
# -----------------------------
@router.post("/mentors")
async def create_mentor(
    mentor: AdminCreateMentor,
    supabase = Depends(get_supabase),
    user = Depends(get_current_user)
):
    require_admin(user)

    data = mentor.model_dump()

    existing = supabase.table("mentors")\
        .select("id")\
        .eq("email", mentor.email)\
        .execute()

    if existing.data:
        raise HTTPException(400, "Mentor with this email already exists")

    res = supabase.table("mentors").insert(data).execute()

    return {
        "message": "Mentor created successfully",
        "mentor": res.data[0]
    }


# -----------------------------
# ASSIGN STUDENT TO MENTOR
# -----------------------------
@router.post("/assign-student")
async def assign_student(
    data: AssignStudentMentor,
    supabase = Depends(get_supabase),
    user = Depends(get_current_user)
):
    require_admin(user)

    student = supabase.table("students")\
        .select("id")\
        .eq("id", data.student_id)\
        .execute()

    if not student.data:
        raise HTTPException(404, "Student not found")

    mentor = supabase.table("mentors")\
        .select("id")\
        .eq("id", data.mentor_id)\
        .execute()

    if not mentor.data:
        raise HTTPException(404, "Mentor not found")

    res = supabase.table("mentorships").insert({
        "student_id": data.student_id,
        "mentor_id": data.mentor_id,
        "start_date": date.today().isoformat()
    }).execute()

    return {
        "message": "Student assigned successfully",
        "mapping": res.data[0]
    }


# -----------------------------
# GET PAGINATED STUDENTS (ADMIN REGISTRY)
# -----------------------------
@router.get("/registry")
async def get_students(
    search: Optional[str] = None,
    department: Optional[str] = None,
    limit: int = 10,
    offset: int = 0,
    supabase = Depends(get_supabase),
    user = Depends(get_current_user)
):
    require_admin(user)

    query = supabase.table("students")\
        .select("id,name,email,roll_no,department,year,final_cgpa", count="exact")

    if search:
        # Search by name OR roll_no
        query = query.or_(f"name.ilike.%{search}%,roll_no.ilike.%{search}%")

    if department:
        query = query.eq("department", department)

    res = query.range(offset, offset + limit - 1).execute()

    return {
        "students": res.data,
        "total": res.count,
        "limit": limit,
        "offset": offset
    }


# -----------------------------
# ADMIN DASHBOARD
# -----------------------------
@router.get("/dashboard")
async def admin_dashboard(
    supabase = Depends(get_supabase),
    user = Depends(get_current_user)
):
    require_admin(user)

    # Note: For dashboard summary, we still want counts
    students_res = supabase.table("students").select("id", count="exact").execute()
    mentors_res = supabase.table("mentors").select("id,name,email", count="exact").execute()
    mappings_res = supabase.table("mentorships")\
        .select("students(name,email,roll_no,department), mentors(name), start_date")\
        .execute()

    return {
        "total_students": students_res.count,
        "total_mentors": mentors_res.count,
        "mentors": mentors_res.data,
        "mentor_student_mapping": mappings_res.data
    }


# -----------------------------
# GET STUDENT DETAILS
# -----------------------------
@router.get("/students/{student_id}")
async def get_student(
    student_id: int,
    supabase = Depends(get_supabase),
    user = Depends(get_current_user)
):
    require_admin(user)

    student = supabase.table("students")\
        .select("id,name,email,roll_no,year,department,final_cgpa")\
        .eq("id", student_id)\
        .execute()

    if not student.data:
        raise HTTPException(404, "Student not found")

    mentor = supabase.table("mentorships")\
        .select("mentors(name,email)")\
        .eq("student_id", student_id)\
        .execute()

    return {
        "student": student.data[0],
        "mentor": mentor.data
    }


# -----------------------------
# GET MENTOR STUDENTS
# -----------------------------
@router.get("/mentors/{mentor_id}/students")
async def get_mentor_students(
    mentor_id: int,
    supabase = Depends(get_supabase),
    user = Depends(get_current_user)
):
    require_admin(user)

    mentor = supabase.table("mentors")\
        .select("id,name,email")\
        .eq("id", mentor_id)\
        .execute()

    if not mentor.data:
        raise HTTPException(404, "Mentor not found")

    students = supabase.table("mentorships")\
        .select("students(id,name,email,roll_no,year,final_cgpa)")\
        .eq("mentor_id", mentor_id)\
        .execute()

    student_list = [s["students"] for s in students.data]

    courses = supabase.table("course_mentors")\
        .select("courses(id,code,title,credits)")\
        .eq("mentor_id", mentor_id)\
        .execute()

    course_list = [c["courses"] for c in courses.data]

    return {
        "mentor": mentor.data[0],
        "students_assigned": student_list,
        "courses_taught": course_list
    }


# -----------------------------
# ASSIGN COURSE TO MENTOR
# -----------------------------
@router.post("/assign-course")
async def assign_course(
    data: AssignCourseMentor,
    supabase = Depends(get_supabase),
    user = Depends(get_current_user)
):
    require_admin(user)

    course = supabase.table("courses")\
        .select("id")\
        .eq("id", data.course_id)\
        .execute()

    if not course.data:
        raise HTTPException(status_code=404, detail="Course not found")

    mentor = supabase.table("mentors")\
        .select("id")\
        .eq("id", data.mentor_id)\
        .execute()

    if not mentor.data:
        raise HTTPException(status_code=404, detail="Mentor not found")

    existing = supabase.table("course_mentors")\
        .select("id")\
        .eq("course_id", data.course_id)\
        .eq("mentor_id", data.mentor_id)\
        .execute()

    if existing.data:
        raise HTTPException(status_code=400, detail="Mentor already assigned")

    res = supabase.table("course_mentors").insert({
        "course_id": data.course_id,
        "mentor_id": data.mentor_id
    }).execute()

    return {
        "message": "Course assigned successfully",
        "mapping": res.data[0]
    }


# -----------------------------
# DELETE STUDENT
# -----------------------------
@router.delete("/students/{student_id}")
async def delete_student(
    student_id: int,
    supabase = Depends(get_supabase),
    user = Depends(get_current_user)
):
    require_admin(user)

    student = supabase.table("students").select("id,name").eq("id", student_id).execute()
    if not student.data:
        raise HTTPException(status_code=404, detail="Student not found")

    # Delete related records first (cascade)
    # 1. Get enrollment IDs for this student
    enrollments = supabase.table("enrollments").select("id").eq("student_id", student_id).execute()
    for enr in enrollments.data:
        # Delete assessments for each enrollment
        supabase.table("assessments").delete().eq("enrollment_id", enr["id"]).execute()

    # 2. Delete enrollments
    supabase.table("enrollments").delete().eq("student_id", student_id).execute()

    # 3. Delete mentorships
    supabase.table("mentorships").delete().eq("student_id", student_id).execute()

    # 4. Delete semester results
    supabase.table("semester_results").delete().eq("student_id", student_id).execute()

    # 5. Finally delete the student
    supabase.table("students").delete().eq("id", student_id).execute()

    return {"message": f"Student '{student.data[0]['name']}' deleted successfully"}


# -----------------------------
# DELETE MENTOR
# -----------------------------
@router.delete("/mentors/{mentor_id}")
async def delete_mentor(
    mentor_id: int,
    supabase = Depends(get_supabase),
    user = Depends(get_current_user)
):
    require_admin(user)

    mentor = supabase.table("mentors").select("id,name").eq("id", mentor_id).execute()
    if not mentor.data:
        raise HTTPException(status_code=404, detail="Mentor not found")

    # Delete related records first
    supabase.table("mentorships").delete().eq("mentor_id", mentor_id).execute()
    supabase.table("course_mentors").delete().eq("mentor_id", mentor_id).execute()

    # Delete the mentor
    supabase.table("mentors").delete().eq("id", mentor_id).execute()

    return {"message": f"Mentor '{mentor.data[0]['name']}' deleted successfully"}


# -----------------------------
# RESET PASSWORD
# -----------------------------
@router.post("/reset-password")
async def reset_password(
    data: ResetPassword,
    supabase = Depends(get_supabase),
    user = Depends(get_current_user)
):
    require_admin(user)

    table = "students" if data.user_type == "student" else "mentors"
    
    # Update the password directly
    res = supabase.table(table).update({"password": data.new_password}).eq("id", data.user_id).execute()

    if not res.data:
        raise HTTPException(404, f"{data.user_type.capitalize()} not found")

    return {"message": "Password reset successfully"}