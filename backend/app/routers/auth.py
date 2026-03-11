from fastapi import APIRouter, Depends, HTTPException, status
from ..database import get_supabase
from ..models import UserLogin, Token

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/login", response_model=Token)
async def login(credentials: UserLogin, supabase = Depends(get_supabase)):

    email = credentials.email
    password = credentials.password

    # Check mentor login
    mentor_res = supabase.table("mentors") \
        .select("*") \
        .eq("email", email) \
        .execute()

    if mentor_res.data:
        mentor = mentor_res.data[0]

        if mentor["password"] == password:
            return {
                "access_token": f"mentor_token_{mentor['id']}",
                "token_type": "bearer",
                "role": "mentor"
            }

        raise HTTPException(status_code=401, detail="Invalid password")


    # Check student login
    student_res = supabase.table("students") \
        .select("*") \
        .eq("email", email) \
        .execute()

    if student_res.data:
        student = student_res.data[0]

        if student["password"] == password:
            return {
                "access_token": f"student_token_{student['id']}",
                "token_type": "bearer",
                "role": "student"
            }

        raise HTTPException(status_code=401, detail="Invalid password")


    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="User not found"
    )