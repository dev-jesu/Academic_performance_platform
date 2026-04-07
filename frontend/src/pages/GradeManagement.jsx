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
  const [editingId, setEditingId] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const user = authService.getCurrentUser();
    const id = user?.id;
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
      setSuccessMessage(`${student.students.name}'s marks have been updated successfully!`);
      setTimeout(() => setSuccessMessage(""), 4000);
      setEditingId(null);
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
    <DashboardLayout title="Entry Marks">
      <div className="space-y-10 w-full max-w-[1400px] mx-auto relative">
        {successMessage && (
          <div className="fixed top-24 right-10 z-50 animate-slide-in-right">
            <div className="bg-emerald-500 text-white px-8 py-5 rounded-2xl shadow-2xl shadow-emerald-500/20 flex items-center gap-4 border border-emerald-400">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center font-black">✓</div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest opacity-80">Update Saved</p>
                <p className="text-sm font-black uppercase tracking-tighter">{successMessage}</p>
              </div>
            </div>
          </div>
        )}

        <div className="glass-card p-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <label className="block text-indigo-400 text-[9px] font-black uppercase tracking-[0.2em] mb-2">Select Class</label>
              <h3 className="text-xl font-black text-slate-900 tracking-tight mb-1">Subject List</h3>
              <p className="text-slate-500 text-xs font-medium">Select a course to manage student performance records.</p>
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
                <h3 className="text-lg font-black text-slate-900 tracking-tight">Students in Class</h3>
                <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mt-1 italic">Session 2023-24</p>
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
                    <th className="table-header">Student Name</th>
                    <th className="table-header">PT-1 <span className="text-slate-600 ml-1">(/50)</span></th>
                    <th className="table-header">PT-2 <span className="text-slate-600 ml-1">(/50)</span></th>
                    <th className="table-header">Semester <span className="text-slate-600 ml-1">(/100)</span></th>
                    <th className="table-header text-right">Save Marks</th>
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
                            <p className="text-xs font-black text-slate-900 group-hover:text-indigo-400 transition-colors uppercase tracking-tight">{s.students.name}</p>
                            <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">{s.students.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <input
                          type="number"
                          placeholder="00"
                          readOnly={editingId !== s.id}
                          className={`w-24 input-field h-9 text-center font-black text-base transition-all duration-300 ${editingId === s.id ? 'border-indigo-500 ring-4 ring-indigo-500/10 scale-105 bg-white' : 'border-transparent bg-slate-50 opacity-60 pointer-events-none'}`}
                          value={getMark(s, 1)}
                          onChange={(e) => handleMarkChange(s.id, 1, e.target.value)}
                        />
                      </td>
                      <td className="px-6 py-4">
                        <input
                          type="number"
                          placeholder="00"
                          readOnly={editingId !== s.id}
                          className={`w-24 input-field h-9 text-center font-black text-base transition-all duration-300 ${editingId === s.id ? 'border-indigo-500 ring-4 ring-indigo-500/10 scale-105 bg-white' : 'border-transparent bg-slate-50 opacity-60 pointer-events-none'}`}
                          value={getMark(s, 2)}
                          onChange={(e) => handleMarkChange(s.id, 2, e.target.value)}
                        />
                      </td>
                      <td className="px-6 py-4">
                        <input
                          type="number"
                          placeholder="00"
                          readOnly={editingId !== s.id}
                          className={`w-24 input-field h-9 text-center font-black text-base transition-all duration-300 ${editingId === s.id ? 'border-indigo-500 ring-4 ring-indigo-500/10 scale-105 bg-white' : 'border-transparent bg-slate-50 opacity-60 pointer-events-none'}`}
                          value={getMark(s, 3)}
                          onChange={(e) => handleMarkChange(s.id, 3, e.target.value)}
                        />
                      </td>
                      <td className="px-6 py-4 text-right">
                        {editingId === s.id ? (
                           <button
                             onClick={() => saveMarks(s.id)}
                             disabled={saving}
                             className="btn-primary py-1.5 px-6 text-[10px] h-9 min-w-[100px] bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/20"
                           >
                             {saving ? "..." : "Confirm"}
                           </button>
                        ) : (
                           <button
                             onClick={() => setEditingId(s.id)}
                             className="btn-glass py-1.5 px-6 text-[10px] h-9 min-w-[100px] border-indigo-200 text-indigo-600 font-black uppercase tracking-widest hover:bg-indigo-50"
                           >
                             Update
                           </button>
                        )}
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
