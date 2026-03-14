import React, { useEffect, useState } from "react";
import mentorService from "../services/mentorService";
import assessmentService from "../services/assessmentService";
import authService from "../services/authService";
import DashboardLayout from "../components/layout/DashboardLayout";
import api from "../api/apiClient";

const GradeManagement = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [mentorId, setMentorId] = useState(null);

  useEffect(() => {
    const user = authService.getCurrentUser();
    const id = user.access_token.split("_").pop();
    setMentorId(id);

    const fetchCourses = async () => {
      const data = await mentorService.getMentorStudents(id); 
      // Actually mentorService needs a getCourses for mentor
      const coursesData = await mentorService.getDashboard(id);
      setCourses(coursesData.courses);
    };
    fetchCourses();
  }, []);

  const handleCourseChange = async (courseId) => {
    if (!courseId) {
      setSelectedCourse("");
      setStudents([]);
      return;
    }
    setSelectedCourse(courseId);
    setLoading(true);
    try {
      const response = await api.get(`/mentors/${mentorId}/course/${courseId}/students`);
      setStudents(response.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkChange = (enrollmentId, typeId, score) => {
    setStudents(prev => prev.map(s => {
      if (s.id === enrollmentId) {
        const newAssessments = [...(s.assessments || [])];
        const idx = newAssessments.findIndex(a => a.assessment_type_id === typeId);
        const parsedScore = score === "" ? "" : parseFloat(score);
        
        if (idx > -1) {
          newAssessments[idx] = { ...newAssessments[idx], score: parsedScore };
        } else {
          newAssessments.push({ assessment_type_id: typeId, score: parsedScore });
        }
        return { ...s, assessments: newAssessments };
      }
      return s;
    }));
  };

  const saveMarks = async (enrollmentId) => {
    setSaving(true);
    const student = students.find(s => s.id === enrollmentId);
    try {
      // Assessment types: 1=PT1, 2=PT2, 3=SEM
      const marks = [
        { typeId: 1, score: getMark(student, 1) },
        { typeId: 2, score: getMark(student, 2) },
        { typeId: 3, score: getMark(student, 3) }
      ];

      for (const m of marks) {
        if (m.score !== "" && m.score !== null && !isNaN(m.score)) {
          await assessmentService.upsertAssessment({
            enrollment_id: enrollmentId,
            assessment_type_id: m.typeId,
            score: parseFloat(m.score),
            date_taken: new Date().toISOString().split('T')[0]
          });
        }
      }
      alert("Marks saved successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to save marks. Check console for details.");
    } finally {
      setSaving(false);
    }
  };

  const getMark = (student, typeId) => {
    const a = student.assessments?.find(a => a.assessment_type_id === typeId);
    return a ? a.score : "";
  };

  return (
    <DashboardLayout title="Grade Management">
      <div className="space-y-10 w-full max-w-[1400px] mx-auto">
        <div className="glass-card p-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <label className="block text-indigo-400 text-[10px] font-black uppercase tracking-[0.2em] mb-3">Academic Selection</label>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight mb-1">Course Catalog</h3>
              <p className="text-slate-500 text-sm font-medium">Select a course to manage student performance records.</p>
            </div>
            
            <select
              value={selectedCourse}
              onChange={(e) => handleCourseChange(e.target.value)}
              className="w-full md:w-80 input-field font-bold text-sm h-12"
            >
              <option value="">Select an active course...</option>
              {courses.map(c => (
                <option key={c.id} value={c.id}>{c.title}</option>
              ))}
            </select>
          </div>
        </div>

        {selectedCourse && (
          <div className="table-container">
            <div className="p-8 border-b border-slate-200 flex items-center justify-between bg-white">
              <div>
                <h3 className="text-xl font-black text-slate-900 tracking-tight">Student Enrollment List</h3>
                <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1.5 italic">Session 2023-24</p>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-xl">
                <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse" />
                <span className="text-[10px] text-indigo-400 font-black uppercase tracking-widest">{students.length} Enrolled</span>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr>
                    <th className="table-header">Student Identity</th>
                    <th className="table-header">PT-1 <span className="text-slate-600 ml-1">(/50)</span></th>
                    <th className="table-header">PT-2 <span className="text-slate-600 ml-1">(/50)</span></th>
                    <th className="table-header">Semester <span className="text-slate-600 ml-1">(/100)</span></th>
                    <th className="table-header text-right">Commit Changes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {students.map((s) => (
                    <tr key={s.id} className="table-row group">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-700/50 flex items-center justify-center text-slate-400 font-black text-sm group-hover:border-indigo-500/50 transition-all duration-300">
                            {s.students.name[0]}
                          </div>
                          <div>
                            <p className="text-sm font-black text-slate-900 group-hover:text-indigo-400 transition-colors uppercase tracking-tight">{s.students.name}</p>
                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">{s.students.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <input
                          type="number"
                          placeholder="00"
                          className="w-28 input-field h-11 text-center font-black text-lg"
                          value={getMark(s, 1)}
                          onChange={(e) => handleMarkChange(s.id, 1, e.target.value)}
                        />
                      </td>
                      <td className="px-8 py-6">
                        <input
                          type="number"
                          placeholder="00"
                          className="w-28 input-field h-11 text-center font-black text-lg"
                          value={getMark(s, 2)}
                          onChange={(e) => handleMarkChange(s.id, 2, e.target.value)}
                        />
                      </td>
                      <td className="px-8 py-6">
                        <input
                          type="number"
                          placeholder="00"
                          className="w-28 input-field h-11 text-center font-black text-lg"
                          value={getMark(s, 3)}
                          onChange={(e) => handleMarkChange(s.id, 3, e.target.value)}
                        />
                      </td>
                      <td className="px-8 py-6 text-right">
                        <button
                          onClick={() => saveMarks(s.id)}
                          disabled={saving}
                          className="btn-primary py-2 px-8 text-xs h-11 min-w-[120px]"
                        >
                          {saving ? "Syncing..." : "Update Mark"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default GradeManagement;
