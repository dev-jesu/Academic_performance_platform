import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import studentService from "../services/studentService";
import DashboardLayout from "../components/layout/DashboardLayout";
import StudentPerformanceChart from "../components/charts/StudentPerformanceChart";
import SgpaTrendChart from "../components/charts/SgpaTrendChart";

const MentorStudentDetails = () => {
  const { studentId } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeSem, setActiveSem] = useState(null);

  const getRoman = (num) => {
    const roman = { 1: "I", 2: "II", 3: "III", 4: "IV", 5: "V", 6: "VI", 7: "VII", 8: "VIII" };
    return roman[num] || num;
  };

  const getFullDept = (dept) => {
    const depts = {
      'CSE': 'COMPUTER SCIENCE AND ENGINEERING',
      'MECH': 'MECHANICAL ENGINEERING',
      'CIVIL': 'CIVIL ENGINEERING'
    };
    return depts[dept] || dept;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const performanceData = await studentService.getPerformance(studentId);
        setData(performanceData);
        if (performanceData?.semesters?.length > 0) {
          const sorted = [...performanceData.semesters].sort((a, b) => b.semester - a.semester);
          setActiveSem(sorted[0].semester);
        }
      } catch (err) {
        setError("Failed to load student performance data.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [studentId]);

  if (loading) return <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">Loading...</div>;

  return (
    <DashboardLayout title="Student Marks View">
      <div className="space-y-12 w-full max-w-[1400px] mx-auto pb-20">
        
        {/* Profile Card & Back Action */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-1">
               <button
                 onClick={() => navigate(-1)}
                 className="w-full btn-glass px-8 py-4 text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-3 group mb-4"
               >
                 <span className="group-hover:-translate-x-1 transition-transform">←</span> Back to List
               </button>

               <div className="glass-card p-10 flex flex-col items-center bg-white shadow-xl">
                  <div className="w-40 h-40 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-5xl font-black text-white shadow-2xl border-8 border-white mb-8">
                    {data?.student?.[0]}
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 text-center uppercase tracking-tight mb-2">{data?.student}</h3>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">roll no: {data?.roll_no}</p>
                  
                  <div className="w-full mt-8 pt-8 border-t border-slate-100 space-y-4">
                     <div className="flex justify-between items-center">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Enrollment Status</span>
                        <span className="text-[10px] font-black text-green-500 uppercase bg-green-50 px-3 py-1 rounded-lg border border-green-100">Continuing</span>
                     </div>
                     <div className="flex justify-between items-center">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Semester</span>
                        <span className="text-sm font-black text-slate-800 uppercase">{getRoman(data?.semester_id)}</span>
                     </div>
                  </div>
               </div>
            </div>

            <div className="md:col-span-3 space-y-8">
               <div className="glass-card p-10 bg-white">
                 <div className="flex items-center gap-4 mb-6">
                    <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest bg-indigo-50 px-3 py-1.5 rounded-lg border border-indigo-100">
                       Status: Active
                    </span>
                 </div>
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Degree</p>
                 <h4 className="text-xl font-black text-slate-800 uppercase mb-8 tracking-tight">B.E. - {getFullDept(data?.department)}</h4>
                 
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Mentor</p>
                       <p className="text-lg font-black text-indigo-600 uppercase underline decoration-indigo-100">{data?.mentor_name}</p>
                    </div>
                    <div className="p-6 bg-indigo-600 rounded-2xl shadow-xl shadow-indigo-600/20">
                       <p className="text-[10px] font-black text-indigo-200 uppercase tracking-widest mb-1 text-right">Cumulative CGPA</p>
                       <p className="text-3xl font-black text-white text-right">{data?.cgpa || '0.00'}</p>
                    </div>
                 </div>
               </div>

               {/* SGPA Progression Chart for Mentor to see trends */}
               <SgpaTrendChart semesters={data?.semesters || []} />
            </div>
        </div>

        {/* Semester Marks — Tabbed Navigation */}
        {data?.semesters?.length > 0 && (
        <div className="space-y-0">
          {/* Section Header */}
          <div className="mb-8">
              <h3 className="text-2xl font-black text-slate-900 tracking-tight uppercase">Marks Table</h3>
              <p className="text-slate-500 text-xs font-bold mt-1 uppercase tracking-widest">Select a semester to view marks</p>
          </div>

          {/* Semester Tab Pills */}
          <div className="glass-card p-2 mb-8 inline-flex gap-1.5 flex-wrap bg-white shadow-sm border border-slate-100">
            {data.semesters
              .sort((a, b) => a.semester - b.semester)
              .map((sem) => (
                <button
                  key={sem.semester}
                  onClick={() => setActiveSem(sem.semester)}
                  className={`px-5 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all duration-300 ${
                    activeSem === sem.semester
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30 scale-105'
                      : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800'
                  }`}
                >
                  Sem {getRoman(sem.semester)}
                </button>
              ))}
          </div>

          {/* Active Semester Content */}
          {(() => {
            const sem = data.semesters.find(s => s.semester === activeSem);
            if (!sem) return null;
            return (
              <div key={sem.semester} className="space-y-8 animate-fade-in">
                <div className="table-container border border-slate-100 shadow-sm overflow-hidden">
                  <div className="p-8 border-b border-slate-200 flex items-center justify-between bg-white">
                    <div>
                      <h3 className="text-xl font-black text-slate-900 tracking-tight uppercase">Semester {getRoman(sem.semester)}</h3>
                      <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mt-1 italic">
                         Semester GPA (SGPA): <span className="text-indigo-600 ml-2 font-black">{sem.sgpa?.toFixed(2) || '0.00'}</span>
                      </p>
                    </div>
                    <div className="px-4 py-2 bg-indigo-50 border border-indigo-100 rounded-xl">
                        <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">{sem.courses.length} Subjects</span>
                    </div>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr>
                          <th className="table-header">Subject</th>
                          <th className="table-header text-center">PT-1</th>
                          <th className="table-header text-center">PT-2</th>
                          <th className="table-header text-center">Sem Exam</th>
                          <th className="table-header text-center">Final Score</th>
                          <th className="table-header text-right">Grade</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {sem.courses.map((course, idx) => (
                          <tr key={idx} className="table-row group">
                            <td className="px-8 py-6">
                              <p className="text-sm font-black text-slate-900 group-hover:text-indigo-400 transition-colors uppercase tracking-tight">{course.course}</p>
                            </td>
                            <td className="px-8 py-6 text-center text-sm font-black text-slate-700 font-mono">{course.pt1 ?? "—"}</td>
                            <td className="px-8 py-6 text-center text-sm font-black text-slate-700 font-mono">{course.pt2 ?? "—"}</td>
                            <td className="px-8 py-6 text-center text-sm font-black text-slate-700 font-mono">{course.semester_exam ?? "—"}</td>
                            <td className="px-8 py-6 text-center text-sm font-black text-indigo-600 bg-indigo-50/20">{course.final_score ?? "—"}</td>
                            <td className="px-8 py-6 text-right">
                              <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border ${
                                course.grade === 'S' || course.grade === 'A' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                                course.grade === 'B' || course.grade === 'C' ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' :
                                'bg-slate-50 text-slate-500 border-slate-700/50'
                              }`}>
                                {course.grade || "PENDING"}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                
                <div className="pl-6 border-l-4 border-indigo-500/10">
                  <StudentPerformanceChart data={sem.courses} />
                </div>
              </div>
            );
          })()}
        </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default MentorStudentDetails;