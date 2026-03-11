from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import date


# -----------------------------
# STUDENT MODELS
# -----------------------------

class StudentBase(BaseModel):
    name: str
    email: EmailStr
    department: Optional[str] = None
    cgpa: Optional[float] = Field(None, ge=0, le=10)


class StudentCreate(StudentBase):
    pass


class Student(StudentBase):
    id: int

    class Config:
        from_attributes = True


# -----------------------------
# COURSE MODELS
# -----------------------------

class CourseBase(BaseModel):
    code: str
    title: str
    credits: int = Field(..., gt=0)
    department: Optional[str] = None


class CourseCreate(CourseBase):
    pass


class Course(CourseBase):
    id: int

    class Config:
        from_attributes = True


# -----------------------------
# SEMESTER MODELS
# -----------------------------

class SemesterBase(BaseModel):
    name: str
    academic_year: str


class SemesterCreate(SemesterBase):
    pass


class Semester(SemesterBase):
    id: int

    class Config:
        from_attributes = True


# -----------------------------
# ENROLLMENT MODELS
# -----------------------------

class EnrollmentBase(BaseModel):
    student_id: int
    course_id: int
    semester_id: int


class EnrollmentCreate(EnrollmentBase):
    pass


class Enrollment(EnrollmentBase):
    id: int
    final_score: Optional[float] = None
    grade: Optional[str] = None

    class Config:
        from_attributes = True


# -----------------------------
# ASSESSMENT TYPE
# -----------------------------

class AssessmentType(BaseModel):
    id: int
    name: str
    max_marks: int


# -----------------------------
# ASSESSMENT MODELS
# -----------------------------

class AssessmentBase(BaseModel):
    enrollment_id: int
    assessment_type_id: int
    score: float
    date_taken: date


class AssessmentCreate(AssessmentBase):
    pass


class Assessment(AssessmentBase):
    id: int

    class Config:
        from_attributes = True


# -----------------------------
# MENTOR MODELS
# -----------------------------

class MentorBase(BaseModel):
    name: str
    email: EmailStr


class MentorCreate(MentorBase):
    pass


class Mentor(MentorBase):
    id: int

    class Config:
        from_attributes = True


# -----------------------------
# MENTORSHIP MODELS
# -----------------------------

class MentorshipBase(BaseModel):
    mentor_id: int
    student_id: int
    start_date: date
    end_date: Optional[date] = None


class MentorshipCreate(MentorshipBase):
    pass


class Mentorship(MentorshipBase):
    id: int


# -----------------------------
# AUTH MODELS
# -----------------------------

class UserLogin(BaseModel):
    email: EmailStr
    password: str


class Token(BaseModel):
    access_token: str
    token_type: str
    role: Optional[str] = "student"