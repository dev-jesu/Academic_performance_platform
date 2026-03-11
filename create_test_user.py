import os
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()

def create_test_user():
    url = os.getenv("SUPABASE_URL")
    key = os.getenv("SUPABASE_KEY")
    supabase: Client = create_client(url, key)
    
    email = "admin@example.com"
    password = "password123"
    
    print(f"Creating test user: {email}...")
    try:
        # Check if user already exists by trying to sign in
        try:
            supabase.auth.sign_in_with_password({"email": email, "password": password})
            print("User already exists and credentials match.")
            return
        except:
            pass

        # Try to sign up
        res = supabase.auth.sign_up({
            "email": email,
            "password": password,
        })
        print(f"Success! User created: {email}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    create_test_user()
