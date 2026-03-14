import os
import psycopg2
from dotenv import load_dotenv
from datetime import date

load_dotenv()


def seed_db():

    db_url = os.getenv("DATABASE_URL")

    if not db_url:
        print("DATABASE_URL not found")
        return

    try:

        conn = psycopg2.connect(db_url)
        cur = conn.cursor()

        print("Clearing existing data...")

        cur.execute("""
        TRUNCATE assessments,
        mentorships,
        enrollments,
        mentors,
        semesters,
        courses,
        students
        RESTART IDENTITY CASCADE;
        """)

        # --------------------------
        # INSERT STUDENTS
        # --------------------------

        students = [
            ("Alice Johnson", "alice@example.com", "CSE", 8.4),
            ("Bob Smith", "bob@example.com", "CSE", 7.9),
            ("Charlie Brown", "charlie@example.com", "IT", 8.9),
            ("David Miller", "david@example.com", "IT", 7.1)
        ]

        student_ids = []

        for s in students:

            cur.execute("""
            INSERT INTO students (name,email,department,cgpa)
            VALUES (%s,%s,%s,%s)
            RETURNING id
            """, s)

            student_ids.append(cur.fetchone()[0])

        print("Students inserted")


        # --------------------------
        # INSERT COURSES
        # --------------------------

        courses = [
            ("CS201", "Data Structures", 4, "CSE"),
            ("CS202", "Operating Systems", 4, "CSE"),
            ("IT301", "Database Systems", 4, "IT")
        ]

        course_ids = []

        for c in courses:

            cur.execute("""
            INSERT INTO courses(code,title,credits,department)
            VALUES(%s,%s,%s,%s)
            RETURNING id
            """, c)

            course_ids.append(cur.fetchone()[0])

        print("Courses inserted")


        # --------------------------
        # INSERT SEMESTER
        # --------------------------

        cur.execute("""
        INSERT INTO semesters(name,academic_year)
        VALUES('SEM3','2025')
        RETURNING id
        """)

        semester_id = cur.fetchone()[0]

        print("Semester inserted")


        # --------------------------
        # CREATE ENROLLMENTS
        # --------------------------

        enrollment_ids = []

        for student in student_ids:

            for course in course_ids:

                cur.execute("""
                INSERT INTO enrollments(student_id,course_id,semester_id)
                VALUES(%s,%s,%s)
                RETURNING id
                """, (student, course, semester_id))

                enrollment_ids.append(cur.fetchone()[0])

        print("Enrollments created")


        # --------------------------
        # GET ASSESSMENT TYPES
        # --------------------------

        cur.execute("SELECT id,name FROM assessment_types")

        types = {name: id for id, name in cur.fetchall()}


        # --------------------------
        # INSERT ASSESSMENTS
        # --------------------------

        for enroll in enrollment_ids:

            cur.execute("""
            INSERT INTO assessments(enrollment_id,assessment_type_id,score,date_taken)
            VALUES(%s,%s,%s,%s)
            """, (enroll, types["PT1"], 40, date(2025, 3, 10)))

            cur.execute("""
            INSERT INTO assessments(enrollment_id,assessment_type_id,score,date_taken)
            VALUES(%s,%s,%s,%s)
            """, (enroll, types["PT2"], 44, date(2025, 4, 5)))

            cur.execute("""
            INSERT INTO assessments(enrollment_id,assessment_type_id,score,date_taken)
            VALUES(%s,%s,%s,%s)
            """, (enroll, types["SEMESTER"], 78, date(2025, 5, 20)))

        print("Assessments inserted")


        # --------------------------
        # INSERT MENTORS
        # --------------------------

        mentors = [
            ("Dr. Alan Turing", "alan@college.edu"),
            ("Prof. Grace Hopper", "grace@college.edu")
        ]

        mentor_ids = []

        for m in mentors:

            cur.execute("""
            INSERT INTO mentors(name,email)
            VALUES(%s,%s)
            RETURNING id
            """, m)

            mentor_ids.append(cur.fetchone()[0])

        print("Mentors inserted")


        # --------------------------
        # CREATE MENTORSHIPS
        # --------------------------

        for i, student in enumerate(student_ids):

            mentor = mentor_ids[i % len(mentor_ids)]

            cur.execute("""
            INSERT INTO mentorships(mentor_id,student_id,start_date)
            VALUES(%s,%s,%s)
            """, (mentor, student, date(2025, 1, 1)))

        print("Mentorships created")


        conn.commit()

        cur.close()
        conn.close()

        print("Database seeded successfully!")


    except Exception as e:

        print("Seeding failed:", e)


if __name__ == "__main__":
    seed_db()