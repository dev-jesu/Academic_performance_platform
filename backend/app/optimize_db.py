import psycopg2
import os
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

def optimize_db():
    print("🚀 Starting database optimization...")
    try:
        conn = psycopg2.connect(DATABASE_URL)
        cur = conn.cursor()
        
        # Add GIN indices for ILIKE searches (requires pg_trgm extension)
        print("📦 Enabling pg_trgm extension...")
        cur.execute("CREATE EXTENSION IF NOT EXISTS pg_trgm;")
        
        print("🔍 Creating indices for 'student' table...")
        cur.execute("CREATE INDEX IF NOT EXISTS idx_student_name_trgm ON student USING gin (name gin_trgm_ops);")
        cur.execute("CREATE INDEX IF NOT EXISTS idx_student_email_trgm ON student USING gin (email gin_trgm_ops);")
        cur.execute("CREATE INDEX IF NOT EXISTS idx_student_major ON student (major);")
        
        print("🔍 Creating indices for 'course' table...")
        cur.execute("CREATE INDEX IF NOT EXISTS idx_course_code_trgm ON course USING gin (code gin_trgm_ops);")
        cur.execute("CREATE INDEX IF NOT EXISTS idx_course_title_trgm ON course USING gin (title gin_trgm_ops);")
        cur.execute("CREATE INDEX IF NOT EXISTS idx_course_department ON course (department);")
        
        conn.commit()
        cur.close()
        conn.close()
        print("✅ Database optimization complete!")
    except Exception as e:
        print(f"❌ Error during optimization: {e}")

if __name__ == "__main__":
    optimize_db()
