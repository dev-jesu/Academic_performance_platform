from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from ..database import get_supabase
from ..models import UserLogin, Token
from ..utils.auth import create_access_token, verify_password, ACCESS_TOKEN_EXPIRE_MINUTES

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/login", response_model=Token)
async def login(credentials: UserLogin, supabase = Depends(get_supabase)):

    email = credentials.email
    password = credentials.password

    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)

    # Check mentor login
    mentor_res = supabase.table("mentors") \
        .select("*") \
        .eq("email", email) \
        .execute()

    if mentor_res.data:
        mentor = mentor_res.data[0]

        # Use verify_password
        if verify_password(password, mentor["password"]):
            access_token = create_access_token(
                data={"sub": str(mentor["id"]), "role": "mentor"},
                expires_delta=access_token_expires
            )
            return {
                "access_token": access_token,
                "token_type": "bearer",
                "role": "mentor",
                "id": mentor["id"],
                "name": mentor["name"],
                "faculty_id": mentor.get("faculty_id"),
                "department": mentor.get("department")
            }

        raise HTTPException(status_code=401, detail="Incorrect email or password")


    # Check student login
    student_res = supabase.table("students") \
        .select("*") \
        .eq("email", email) \
        .execute()

    if student_res.data:
        student = student_res.data[0]

        # Use verify_password
        if verify_password(password, student["password"]):
            access_token = create_access_token(
                data={"sub": str(student["id"]), "role": "student"},
                expires_delta=access_token_expires
            )
            return {
                "access_token": access_token,
                "token_type": "bearer",
                "role": "student",
                "id": student["id"],
                "name": student["name"],
                "roll_no": student.get("roll_no"),
                "department": student.get("department")
            }

        raise HTTPException(status_code=401, detail="Incorrect email or password")
    

    # check admin first
    admin_res = supabase.table("admins").select("*").eq("email", email).execute()

    if admin_res.data:
        admin = admin_res.data[0]

        # Use verify_password
        if verify_password(password, admin["password"]):
            access_token = create_access_token(
                data={"sub": str(admin["id"]), "role": "admin"},
                expires_delta=access_token_expires
            )
            return {
                "access_token": access_token,
                "token_type": "bearer",
                "role": "admin",
                "id": admin["id"],
                "name": admin.get("name", "Administrator")
            }

    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Incorrect email or password"
    )