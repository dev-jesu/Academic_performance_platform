import httpx
import json
from datetime import date

BASE_URL = "http://127.0.0.1:8002"

def test_mentor_fill_marks():
    # 1. Mentor Login
    print("Mentor Login...")
    resp = httpx.post(f"{BASE_URL}/auth/login", json={
        "email": "mentor_test@college.com",
        "password": "mentor123"
    })
    token_mentor = resp.json()["access_token"]
    headers_mentor = {"Authorization": f"Bearer {token_mentor}"}

    # 2. Enter Marks for Enrollment 751 (MA101)
    enrollment_id = 751
    assessments = [
        {"type_id": 1, "score": 45, "name": "PT1"},
        {"type_id": 2, "score": 46, "name": "PT2"},
        {"type_id": 3, "score": 92, "name": "SEMESTER"}
    ]

    for ass in assessments:
        print(f"Entering marks for {ass['name']} (Score: {ass['score']})...")
        r = httpx.post(f"{BASE_URL}/assessments/", json={
            "enrollment_id": enrollment_id,
            "assessment_type_id": ass["type_id"],
            "score": ass["score"],
            "date_taken": date.today().isoformat()
        }, headers=headers_mentor)
        if r.status_code != 200:
            print(f"Failed to enter marks: {r.text}")
            return

    # 3. Student Verification
    print("\nStudent Login...")
    resp = httpx.post(f"{BASE_URL}/auth/login", json={
        "email": "student_test@college.com",
        "password": "mentor123"
    })
    student_id = resp.json()["id"]
    token_student = resp.json()["access_token"]
    headers_student = {"Authorization": f"Bearer {token_student}"}

    print(f"Checking Student performance for Student ID {student_id}...")
    r = httpx.get(f"{BASE_URL}/students/{student_id}/performance", headers=headers_student)
    
    if r.status_code == 200:
        perf = r.json()
        print("\n--- PERFORMANCE DATA ---")
        print(f"Student: {perf['student']}")
        for sem in perf["semesters"]:
            print(f"\nSemester: {sem['semester']}")
            for course in sem["courses"]:
                 print(f" - Course: {course['course']}")
                 print(f"   PT1: {course['pt1']}, PT2: {course['pt2']}, Semester: {course['semester_exam']}")
                 print(f"   Final Score: {course['final_score']}%, Grade: {course['grade']}")
    else:
        print(f"Failed to fetch performance: {r.text}")

if __name__ == "__main__":
    test_mentor_fill_marks()
