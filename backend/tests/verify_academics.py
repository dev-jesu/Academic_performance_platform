import httpx
import json

BASE_URL = "http://127.0.0.1:8002"

def verify_empty_academics():
    print("Logging in as Test Student...")
    try:
        resp = httpx.post(f"{BASE_URL}/auth/login", json={
            "email": "student_test@college.com",
            "password": "mentor123"
        })
        if resp.status_code != 200:
            print(f"Login failed: {resp.text}")
            return
        
        user_data = resp.json()
        student_id = user_data["id"]
        token = user_data["access_token"]
        print(f"Logged in! Student ID: {student_id}")

        headers = {"Authorization": f"Bearer {token}"}
        
        print(f"Fetching performance for student {student_id}...")
        resp = httpx.get(f"{BASE_URL}/students/{student_id}/performance", headers=headers)
        
        if resp.status_code == 200:
            perf_data = resp.json()
            print("\nAcademic Details Summary:")
            print(f"Student: {perf_data['student']}")
            print(f"Roll No: {perf_data['roll_no']}")
            print(f"CGPA: {perf_data['cgpa']}")
            print(f"Mentor: {perf_data['mentor_name']}")
            print(f"Semesters Data Count: {len(perf_data['semesters'])}")
            
            if len(perf_data['semesters']) == 0:
                print("\nResult: Academics are EMPTY as expected.")
            else:
                print("\nResult: Academics are NOT empty (Found data for semesters).")
                print(json.dumps(perf_data['semesters'], indent=2))
        else:
            print(f"Failed to fetch academics: {resp.text}")
            
    except Exception as e:
        print(f"Error: {str(e)}")

if __name__ == "__main__":
    # Ensure server is up if needed, but assuming it's still running from previous Turn's uvicorn run 
    # (Actually I stopped it? I'll restart it in the background if needed).
    verify_empty_academics()
