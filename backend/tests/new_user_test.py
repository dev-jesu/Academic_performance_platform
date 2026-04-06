import httpx
import json

BASE_URL = "http://127.0.0.1:8002"

def test_new_user_flow():
    # 1. Mentor Login (Turing)
    print("Logging in as Mentor (turing@college.edu)...")
    m_resp = httpx.post(f"{BASE_URL}/auth/login", json={
        "email": "turing@college.edu",
        "password": "mentor123"
    })
    m_data = m_resp.json()
    m_id = m_data["id"]
    m_token = m_data["access_token"]
    m_headers = {"Authorization": f"Bearer {m_token}"}

    # 2. Check Mentor GET
    print(f"Checking Mentor {m_id} Dashboard...")
    m_dash = httpx.get(f"{BASE_URL}/mentors/{m_id}/dashboard", headers=m_headers).json()
    print(f"Found {m_dash['students_count']} students and {m_dash['courses_count']} courses assigned.")
    
    # 3. Find an Enrollment for Mark Update
    if m_dash["courses_count"] > 0:
        course_id = m_dash["courses"][0]["id"]
        print(f"Getting students for Course {course_id}...")
        course_students = httpx.get(f"{BASE_URL}/mentors/{m_id}/course/{course_id}/students", headers=m_headers).json()
        
        if course_students and len(course_students) > 0:
            enrollment = course_students[0]
            print(f"Updating mark for Enrollment {enrollment['id']} (Assessment ID 1)...")
            
            # Post a new score (PT1 - Type 1)
            up_resp = httpx.post(f"{BASE_URL}/assessments/", json={
                "enrollment_id": enrollment["id"],
                "assessment_type_id": 1,
                "score": 48.5,
                "date_taken": "2026-04-05"
            }, headers=m_headers)
            
            if up_resp.status_code == 200:
                print("UPDATE SUCCESSFUL.")
            else:
                print(f"UPDATE FAILED: {up_resp.text}")
        else:
            print("No students found in this course.")
    else:
        print("No courses assigned to this mentor.")

    # 4. Check Student GET (Arjun)
    print("\nLogging in as Student (arjun1@college.edu)...")
    s_resp = httpx.post(f"{BASE_URL}/auth/login", json={
        "email": "arjun1@college.edu",
        "password": "student123"
    })
    s_data = s_resp.json()
    s_id = s_data["id"]
    s_token = s_data["access_token"]
    s_headers = {"Authorization": f"Bearer {s_token}"}

    print(f"Checking Student {s_id} Performance...")
    s_perf = httpx.get(f"{BASE_URL}/students/{s_id}/performance", headers=s_headers).json()
    print(f"Found {len(s_perf['semesters'])} semesters of data for {s_perf['student']}.")

if __name__ == "__main__":
    test_new_user_flow()
