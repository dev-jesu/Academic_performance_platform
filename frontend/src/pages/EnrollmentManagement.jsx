import React, { useEffect, useState } from "react";
import enrollmentService from "../services/enrollmentService";
import adminService from "../services/adminService";
import api from "../api/apiClient";
import DashboardLayout from "../components/layout/DashboardLayout";

const EnrollmentManagement = () => {
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");
  const [loading, setLoading] = useState(false);

  const getFullDept = (dept) => {
    const depts = {
      'CSE': 'Computer Science',
      'MECH': 'Mechanical Engineering',
      'CIVIL': 'Civil Engineering'
    };
    return depts[dept] || dept;
  };

  const getRomanYear = (year) => {
    const roman = { 1: "I", 2: "II", 3: "III" };
    return roman[year] || year;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [dashData, enrollData, semesterRes, courseRes] = await Promise.all([
          adminService.getDashboard(),
          enrollmentService.getEnrollments(),
          api.get("/semesters"), // Assuming this exists
          api.get("/courses")
        ]);
        setStudents(dashData.students);
        setEnrollments(enrollData);
        setSemesters(semesterRes.data);
        setCourses(courseRes.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  const handleEnroll = async () => {
    if (!selectedStudent || !selectedCourse || !selectedSemester) {
      alert("Please select all fields");
      return;
    }
    setLoading(true);
    try {
      await enrollmentService.createEnrollment({
        student_id: parseInt(selectedStudent),
        course_id: parseInt(selectedCourse),
        semester_id: parseInt(selectedSemester)
      });
      alert("Enrollment successful!");
      // Refresh list
      const updated = await enrollmentService.getEnrollments();
      setEnrollments(updated);
    } catch (err) {
      alert("Failed to enroll student.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout title="Enrollment Management">
      <div className="space-y-12 w-full max-w-[1400px] mx-auto">
        <div className="glass-card p-10">
          <div className="mb-10">
            <h3 className="text-2xl font-black text-slate-900 tracking-tight uppercase">Registry Enrollment</h3>
            <p className="text-slate-500 text-sm font-medium mt-1">Initialize new academic mappings between students and modules.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-3">
              <label className="block text-[10px] font-black text-indigo-400 uppercase tracking-widest italic">Student Identity</label>
              <select
                className="w-full input-field h-14 font-bold text-sm"
                value={selectedStudent}
                onChange={e => setSelectedStudent(e.target.value)}
              >
                <option value="">Search Student Identity...</option>
                {students.map(s => <option key={s.id} value={s.id}>{s.name} ({s.roll_no} • {getRomanYear(s.year)})</option>)}
              </select>
            </div>
            <div className="space-y-3">
              <label className="block text-[10px] font-black text-indigo-400 uppercase tracking-widest italic">Module Attribution</label>
              <select
                className="w-full input-field h-14 font-bold text-sm"
                value={selectedCourse}
                onChange={e => setSelectedCourse(e.target.value)}
              >
                <option value="">Select Course...</option>
                {courses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
              </select>
            </div>
            <div className="space-y-3">
              <label className="block text-[10px] font-black text-indigo-400 uppercase tracking-widest italic">Academic Cycle</label>
              <select
                className="w-full input-field h-14 font-bold text-sm"
                value={selectedSemester}
                onChange={e => setSelectedSemester(e.target.value)}
              >
                <option value="">Select Semester...</option>
                {semesters.map(s => <option key={s.id} value={s.id}>{s.name} ({s.academic_year})</option>)}
              </select>
            </div>
          </div>
          
          <div className="mt-10">
            <button
              onClick={handleEnroll}
              disabled={loading}
              className="w-full btn-primary h-14 text-sm font-black uppercase tracking-widest"
            >
              {loading ? "Processing Registry..." : "Commit Enrollment"}
            </button>
          </div>
        </div>

        <div className="table-container">
          <div className="p-8 border-b border-slate-200 flex items-center justify-between bg-white">
            <div>
              <h3 className="text-xl font-black text-slate-900 tracking-tight">Active Registrations</h3>
              <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em] mt-1.5 italic">Session 2023-24 Registry Log</p>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-xl">
               <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse" />
               <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Secure Link Active</span>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr>
                  <th className="table-header">Registry Ref</th>
                  <th className="table-header">Student Identity</th>
                  <th className="table-header">Module Attribution</th>
                  <th className="table-header">Assigned Mentor</th>
                  <th className="table-header">Academic Cycle</th>
                  <th className="table-header text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {enrollments.map((e) => {
                  const mentor = e.students?.mentorships?.[0]?.mentors;
                  return (
                    <tr key={e.id} className="table-row group text-sm">
                      <td className="px-8 py-6">
                        <span className="font-mono font-bold text-indigo-400 opacity-60">REG-{e.id}</span>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex flex-col">
                          <span className="text-sm font-black text-slate-900 group-hover:text-indigo-400 transition-colors uppercase tracking-tight">
                            {e.students?.name || "Unknown"}
                          </span>
                          <span className="text-[10px] text-indigo-500 font-black font-mono">SRV: {e.students?.roll_no || 'N/A'}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-slate-300 group-hover:text-slate-900 transition-colors">
                            {e.courses?.title || "Unknown"}
                          </span>
                          <span className="text-[10px] text-slate-500 font-bold font-mono">MOD-{e.course_id}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        {mentor ? (
                          <div className="flex items-center gap-2">
                             <div className="w-7 h-7 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-[10px] font-black text-indigo-400">
                                {mentor.name[0]}
                             </div>
                             <span className="text-xs font-bold text-slate-400">{mentor.name}</span>
                          </div>
                        ) : (
                          <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest italic">Unassigned</span>
                        )}
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-slate-300">
                            {e.semesters?.name || "Unknown"}
                          </span>
                          <span className="text-[10px] text-slate-500 font-bold font-mono text-nowrap">CYC-{e.semester_id}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-center">
                        <span className="px-4 py-1.5 rounded-xl bg-green-500/10 text-green-400 border border-green-500/20 text-[10px] font-black uppercase tracking-widest">
                          Validated
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default EnrollmentManagement;
