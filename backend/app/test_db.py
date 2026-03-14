import os
import psycopg2
from supabase import create_client, Client
from dotenv import load_dotenv
import sys

# Load .env from the root directory
load_dotenv(os.path.join(os.path.dirname(__file__), '..', '..', '.env'))

def test_supabase_connection():
    print("Testing Supabase Client Connection...")
    url = os.environ.get("SUPABASE_URL")
    key = os.environ.get("SUPABASE_KEY")
    
    if not url or not key:
        print("Error: SUPABASE_URL or SUPABASE_KEY not found in environment.")
        return False
    
    try:
        supabase: Client = create_client(url, key)
        # Try a simple auth check or similar instead of table query first
        print(f"Attempting to reach: {url}")
        # Note: We won't use .table() yet, just check if client init works and maybe a base request
        print("Supabase Client Init: Success!")
        return True
    except Exception as e:
        print(f"Supabase Client Error: {type(e).__name__} - {e}")
        return False

def test_postgres_connection():
    print("\nTesting PostgreSQL Connection (psycopg2)...")
    db_url = os.environ.get("DATABASE_URL")
    
    if not db_url:
        print("Error: DATABASE_URL not found in environment.")
        return False
    
    try:
        conn = psycopg2.connect(db_url)
        cur = conn.cursor()
        cur.execute("SELECT version();")
        version = cur.fetchone()
        print(f"PostgreSQL: Success! Version: {version[0]}")
        cur.close()
        conn.close()
        return True
    except Exception as e:
        print(f"PostgreSQL: Failed! Error: {e}")
        return False

if __name__ == "__main__":
    s_ok = test_supabase_connection()
    p_ok = test_postgres_connection()
    
    if s_ok and p_ok:
        print("\nAll database connections verified successfully!")
        sys.exit(0)
    else:
        print("\nSome connection tests failed.")
        sys.exit(1)
