from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import date

# Student Models
class StudentBase(BaseModel):
    name: str
    email: EmailStr
    major: Optional[str] = None
    cgpa: Optional[float] = Field(None, ge=0.0, le=10.0)

class StudentCreate(StudentBase):
    pass

class Student(StudentBase):
    id: int
    
    class Config:
        from_attributes = True

# Course Models
class CourseBase(BaseModel):
    code: str
    title: str
    credits: int = Field(..., gt=0)

class CourseCreate(CourseBase):
    pass

class Course(CourseBase):
    id: int

    class Config:
        from_attributes = True

# Enrollment Models
class EnrollmentBase(BaseModel):
    student_id: int
    course_id: int
    semester: str
    grade: Optional[float] = None

class EnrollmentCreate(EnrollmentBase):
    pass

class Enrollment(EnrollmentBase):
    id: int

    class Config:
        from_attributes = True

# Mentor Models
class MentorBase(BaseModel):
    name: str
    email: EmailStr

class MentorCreate(MentorBase):
    pass

class Mentor(MentorBase):
    id: int

    class Config:
        from_attributes = True

# Assessment Models
class AssessmentBase(BaseModel):
    enrollment_id: int
    type: str  # Exam, Assignment, Project
    score: float
    date_taken: date

class AssessmentCreate(AssessmentBase):
    pass

class Assessment(AssessmentBase):
    id: int

    class Config:
        from_attributes = True

# Auth Models
class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str
