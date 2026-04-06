import httpx
import json
import time

BASE_URL = "http://127.0.0.1:8002"

def test_full_flow():
    results = []
    
    # 1. Admin Login
    print("Logging in as Admin...")
    try:
        resp = httpx.post(f"{BASE_URL}/auth/login", json={
            "email": "admin@college.com",
            "password": "admin123"
        })
        if resp.status_code == 200:
            admin_token = resp.json()["access_token"]
            results.append({"step": "Admin Login", "status": "SUCCESS"})
        else:
            results.append({"step": "Admin Login", "status": "FAILED", "detail": resp.text})
            return results
    except Exception as e:
        results.append({"step": "Admin Login", "status": "ERROR", "detail": str(e)})
        return results

    headers = {"Authorization": f"Bearer {admin_token}"}

    # 2. Create Mentor
    print("Creating Mentor...")
    mentor_data = {
        "name": "Test Mentor",
        "email": "mentor_test@college.com",
        "password": "mentor123",
        "department": "CSE",
        "faculty_id": "F001"
    }
    try:
        resp = httpx.post(f"{BASE_URL}/admin/mentors", json=mentor_data, headers=headers)
        if resp.status_code == 200:
            mentor_id = resp.json()["mentor"]["id"]
            results.append({"step": "Create Mentor", "status": "SUCCESS", "id": mentor_id})
        elif resp.status_code == 400 and "exists" in resp.text:
            # Maybe already exists, let's try to find it
            results.append({"step": "Create Mentor", "status": "ALREADY_EXISTS"})
            # For simplicity, we'll try to continue if we can find it in dashboard
            dash = httpx.get(f"{BASE_URL}/admin/dashboard", headers=headers).json()
            mentor_id = next((m["id"] for m in dash["mentors"] if m["email"] == "mentor_test@college.com"), None)
        else:
            results.append({"step": "Create Mentor", "status": "FAILED", "detail": resp.text})
            return results
    except Exception as e:
        results.append({"step": "Create Mentor", "status": "ERROR", "detail": str(e)})
        return results

    # 3. Create Student
    print("Creating Student...")
    student_data = {
        "name": "Test Student",
        "email": "student_test@college.com",
        "department": "CSE",
        "year": 1,
        "semester_id": 1,
        "password": "mentor123"
    }
    try:
        resp = httpx.post(f"{BASE_URL}/admin/students", json=student_data, headers=headers)
        if resp.status_code == 200:
            student_id = resp.json()["student"]["id"]
            results.append({"step": "Create Student", "status": "SUCCESS", "id": student_id})
        elif resp.status_code == 400 and "exists" in resp.text:
             results.append({"step": "Create Student", "status": "ALREADY_EXISTS"})
             dash = httpx.get(f"{BASE_URL}/admin/dashboard", headers=headers).json()
             student_id = next((s["id"] for s in dash["students"] if s["email"] == "student_test@college.com"), None)
        else:
            # Fallback check dashboard
            dash = httpx.get(f"{BASE_URL}/admin/dashboard", headers=headers).json()
            student_id = next((s["id"] for s in dash["students"] if s["email"] == "student_test@college.com"), None)
            if student_id:
                results.append({"step": "Create Student", "status": "ALREADY_EXISTS"})
            else:
                results.append({"step": "Create Student", "status": "FAILED", "detail": resp.text})
                return results
    except Exception as e:
        results.append({"step": "Create Student", "status": "ERROR", "detail": str(e)})
        return results

    # 4. Map Student to Mentor
    print("Mapping Student to Mentor...")
    try:
        resp = httpx.post(f"{BASE_URL}/admin/assign-student", json={
            "student_id": student_id,
            "mentor_id": mentor_id
        }, headers=headers)
        if resp.status_code == 200:
            results.append({"step": "Assign Student", "status": "SUCCESS"})
        else:
            results.append({"step": "Assign Student", "status": "FAILED/ALREADY_MAPPED", "detail": resp.text})
    except Exception as e:
        results.append({"step": "Assign Student", "status": "ERROR", "detail": str(e)})

    # 5. Verify Mentor Login
    print("Verifying Mentor Login...")
    try:
        resp = httpx.post(f"{BASE_URL}/auth/login", json={
            "email": "mentor_test@college.com",
            "password": "mentor123"
        })
        if resp.status_code == 200:
            results.append({"step": "Mentor Login Verify", "status": "SUCCESS"})
        else:
            results.append({"step": "Mentor Login Verify", "status": "FAILED", "detail": resp.text})
    except Exception as e:
        results.append({"step": "Mentor Login Verify", "status": "ERROR", "detail": str(e)})

    # 6. Verify Student Login
    print("Verifying Student Login...")
    try:
        resp = httpx.post(f"{BASE_URL}/auth/login", json={
            "email": "student_test@college.com",
            "password": "mentor123"
        })
        if resp.status_code == 200:
            results.append({"step": "Student Login Verify", "status": "SUCCESS"})
        else:
            results.append({"step": "Student Login Verify", "status": "FAILED", "detail": resp.text})
    except Exception as e:
        results.append({"step": "Student Login Verify", "status": "ERROR", "detail": str(e)})

    return results

if __name__ == "__main__":
    final_results = test_full_flow()
    print("\n--- TEST SUMMARY ---")
    print(json.dumps(final_results, indent=2))
