import os
import psycopg2
from dotenv import load_dotenv

load_dotenv()

SQL_SCHEMA = """

-- STUDENTS
CREATE TABLE IF NOT EXISTS students (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    department VARCHAR(100),
    cgpa NUMERIC(3,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- COURSES
CREATE TABLE IF NOT EXISTS courses (
    id SERIAL PRIMARY KEY,
    code VARCHAR(10) UNIQUE NOT NULL,
    title VARCHAR(200) NOT NULL,
    credits INT NOT NULL,
    department VARCHAR(100)
);

-- SEMESTERS
CREATE TABLE IF NOT EXISTS semesters (
    id SERIAL PRIMARY KEY,
    name VARCHAR(20) NOT NULL,
    academic_year VARCHAR(10) NOT NULL
);

-- ENROLLMENTS
CREATE TABLE IF NOT EXISTS enrollments (
    id SERIAL PRIMARY KEY,
    student_id INT REFERENCES students(id) ON DELETE CASCADE,
    course_id INT REFERENCES courses(id) ON DELETE CASCADE,
    semester_id INT REFERENCES semesters(id) ON DELETE CASCADE,
    final_score NUMERIC(5,2),
    grade VARCHAR(2),
    UNIQUE(student_id, course_id, semester_id)
);

-- ASSESSMENT TYPES (PT1, PT2, SEMESTER)
CREATE TABLE IF NOT EXISTS assessment_types (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    max_marks INT NOT NULL
);

-- ASSESSMENTS
CREATE TABLE IF NOT EXISTS assessments (
    id SERIAL PRIMARY KEY,
    enrollment_id INT REFERENCES enrollments(id) ON DELETE CASCADE,
    assessment_type_id INT REFERENCES assessment_types(id),
    score NUMERIC(5,2),
    date_taken DATE
);

-- MENTORS
CREATE TABLE IF NOT EXISTS mentors (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL
);

-- MENTORSHIPS
CREATE TABLE IF NOT EXISTS mentorships (
    id SERIAL PRIMARY KEY,
    mentor_id INT REFERENCES mentors(id) ON DELETE CASCADE,
    student_id INT REFERENCES students(id) ON DELETE CASCADE,
    start_date DATE,
    end_date DATE
);

"""


INSERT_TYPES = """
INSERT INTO assessment_types (name, max_marks)
VALUES
('PT1', 50),
('PT2', 50),
('SEMESTER', 100)
ON CONFLICT (name) DO NOTHING;
"""


def init_db():

    db_url = os.getenv("DATABASE_URL")

    if not db_url:
        print("DATABASE_URL not found in .env")
        return

    try:
        print("Connecting to database...")

        conn = psycopg2.connect(db_url)
        conn.autocommit = True
        cur = conn.cursor()

        print("Creating tables...")
        cur.execute(SQL_SCHEMA)

        print("Inserting default assessment types...")
        cur.execute(INSERT_TYPES)

        print("Database initialized successfully!")

        cur.close()
        conn.close()

    except Exception as e:
        print("Database initialization failed:", e)


if __name__ == "__main__":
    init_db()