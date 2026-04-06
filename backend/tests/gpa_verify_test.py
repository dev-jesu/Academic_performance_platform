import httpx
import json

BASE_URL = "http://127.0.0.1:8002"

def test_gpa_recalculation():
    # 1. Login as Mentor
    print("Mentor Login...")
    m_resp = httpx.post(f"{BASE_URL}/auth/login", json={
        "email": "mentor_test@college.com",
        "password": "mentor123"
    })
    m_token = m_resp.json()["access_token"]
    m_headers = {"Authorization": f"Bearer {m_token}"}

    # 2. Update PT1 for Enrollment 751
    print("Updating PT1 marks to 49...")
    up_resp = httpx.post(f"{BASE_URL}/assessments/", json={
        "enrollment_id": 751,
        "assessment_type_id": 1,
        "score": 49,
        "date_taken": "2026-04-05"
    }, headers=m_headers)
    
    if up_resp.status_code == 200:
        print("Update Success!")
    else:
        print(f"Update Failed: {up_resp.text}")
        return

    # 3. Login as Student and check CGPA
    print("\nStudent Login...")
    s_resp = httpx.post(f"{BASE_URL}/auth/login", json={
        "email": "student_test@college.com",
        "password": "mentor123"
    })
    s_id = s_resp.json()["id"]
    s_token = s_resp.json()["access_token"]
    s_headers = {"Authorization": f"Bearer {s_token}"}

    print(f"Checking Student {s_id} Performance...")
    s_perf = httpx.get(f"{BASE_URL}/students/{s_id}/performance", headers=s_headers).json()
    
    print("\n--- RESULTS ---")
    print(f"Student: {s_perf['student']}")
    print(f"Current CGPA: {s_perf['cgpa']}")
    
    if s_perf['cgpa'] > 0:
         print("SUCCESS! CGPA is now calculated and populated.")
    else:
         print("FAILED: CGPA is still 0.")

if __name__ == "__main__":
    test_gpa_recalculation()
