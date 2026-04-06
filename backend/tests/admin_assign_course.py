import httpx
import json

BASE_URL = "http://127.0.0.1:8002"

def test_admin_assign_course():
    print("Admin Login...")
    resp = httpx.post(f"{BASE_URL}/auth/login", json={
        "email": "admin@college.com",
        "password": "admin123"
    })
    token = resp.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    mentor_id = 22
    # Assign MA101, PH101
    courses = [6, 7]
    results = []

    for course_id in courses:
        print(f"Assigning course {course_id} to mentor {mentor_id}...")
        try:
             # Admin endpoint: POST /admin/assign-course
             # Model: AssignCourseMentor { course_id, mentor_id }
            r = httpx.post(f"{BASE_URL}/admin/assign-course", json={
                "course_id": course_id,
                "mentor_id": mentor_id
            }, headers=headers)
            
            if r.status_code == 200:
                results.append({"course_id": course_id, "status": "SUCCESS"})
            else:
                results.append({"course_id": course_id, "status": "FAILED/ALREADY_ASSIGNED", "detail": r.text})
        except Exception as e:
            results.append({"course_id": course_id, "status": "ERROR", "detail": str(e)})

    print("\n--- Assign Course Summary ---")
    print(json.dumps(results, indent=2))

if __name__ == "__main__":
    test_admin_assign_course()
