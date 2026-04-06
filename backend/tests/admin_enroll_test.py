import httpx
import json

BASE_URL = "http://127.0.0.1:8002"

def test_admin_enrollment():
    print("Admin Login...")
    resp = httpx.post(f"{BASE_URL}/auth/login", json={
        "email": "admin@college.com",
        "password": "admin123"
    })
    token = resp.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # Enrollment data for Semester 1 (Student ID 183)
    student_id = 183
    semester_id = 1
    courses_to_enroll = [6, 7, 8] # MA101, PH101, CY101

    results = []

    for course_id in courses_to_enroll:
        print(f"Enrolling student {student_id} in course {course_id}...")
        try:
            r = httpx.post(f"{BASE_URL}/enrollments/", json={
                "student_id": student_id,
                "course_id": course_id,
                "semester_id": semester_id
            }, headers=headers)
            
            if r.status_code == 200:
                results.append({"course_id": course_id, "status": "SUCCESS"})
            else:
                results.append({"course_id": course_id, "status": "FAILED", "detail": r.text})
        except Exception as e:
            results.append({"course_id": course_id, "status": "ERROR", "detail": str(e)})

    print("\n--- Enrollment Results ---")
    print(json.dumps(results, indent=2))

if __name__ == "__main__":
    test_admin_enrollment()
