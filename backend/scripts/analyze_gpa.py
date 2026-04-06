import os
from dotenv import load_dotenv
import supabase

load_dotenv()
s = supabase.create_client(os.environ['SUPABASE_URL'], os.environ['SUPABASE_KEY'])

# 1. MECH/CIVIL Students with 0 CGPA
res = s.table('students').select('id,name,department,final_cgpa').in_('department', ['MECH', 'CIVIL']).eq('final_cgpa', 0).limit(10).execute()
print(f"MECH/CIVIL students with 0 CGPA: {len(res.data)}")

for st in res.data:
    sid = st['id']
    # 2. enrollments for them
    enr = s.table('enrollments').select('id,course_id,grade,final_score,semester_id').eq('student_id', sid).execute()
    print(f"Student: {st['name']} (ID: {sid}) | Enrollments counts: {len(enr.data)}")
    marks_exist = any(enr_it['grade'] for enr_it in enr.data)
    print(f"  Any grades found? {'YES' if marks_exist else 'NO'}")
    if marks_exist:
        print(f"  Sample grades: {[ (enr_it['grade'], enr_it['final_score']) for enr_it in enr.data if enr_it['grade'] ]}")
    
    # 3. Check semester_results
    sr = s.table('semester_results').select('id,sgpa,semester_id').eq('student_id', sid).execute()
    print(f"  Semester results records: {len(sr.data)}")
    if not sr.data and marks_exist:
        print(f"  !!! DATA INCONSISTENCY: Grades in enrollments but NO entries in semester_results table.")
