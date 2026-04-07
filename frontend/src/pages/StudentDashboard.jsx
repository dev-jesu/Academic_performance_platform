import React, { useEffect, useState } from "react";
import studentService from "../services/studentService";
import authService from "../services/authService";
import DashboardLayout from "../components/layout/DashboardLayout";
import StudentPerformanceChart from "../components/charts/StudentPerformanceChart";
import SgpaTrendChart from "../components/charts/SgpaTrendChart";

const StudentDashboard = () => {
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
        const currentUser = authService.getCurrentUser();
        if (!currentUser || !currentUser.id) throw new Error("User not authenticated");

        const performanceData = await studentService.getPerformance(currentUser.id);
        setData(performanceData);
        // Default to the latest (highest) semester
        if (performanceData?.semesters?.length > 0) {
          const sorted = [...performanceData.semesters].sort((a, b) => b.semester - a.semester);
          setActiveSem(sorted[0].semester);
        }
      } catch (err) {
        setError("Failed to load dashboard data.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">Loading...</div>;

  return (
    <DashboardLayout title="Academic Dashboard">
      <div className="space-y-12 w-full max-w-[1400px] mx-auto pb-20">
        
        {/* Profile Identity section - Redesigned per specification */}
        <div className="glass-card overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-0">
            {/* Left: Icon Section (No Photo) */}
            <div className="bg-slate-50 flex items-center justify-center p-8 border-r border-slate-100">
               <div className="w-40 h-40 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-5xl font-black text-white shadow-2xl border-8 border-white">
                  {data?.student?.[0]}
               </div>
            </div>

            {/* Middle: Details section */}
            <div className="md:col-span-3 p-10 bg-white">
              <div className="flex flex-col h-full justify-between">
                <div>
                  <div className="flex items-center gap-4 mb-4">
                    <span className="px-4 py-1.5 bg-green-500 text-white text-[10px] font-black uppercase tracking-widest rounded-lg">
                      ACTIVE STUDENT
                    </span>
                    <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest bg-indigo-50 px-3 py-1.5 rounded-lg border border-indigo-100">
                         Status: Pass
                    </span>
                  </div>
                  <h2 className="text-4xl font-black text-slate-900 tracking-tight uppercase mb-1">{data?.student}</h2>
                  <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-8 border-b border-slate-100 pb-4">
                     roll no: {data?.roll_no || 'N/A'}
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-12">
                     <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                         <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Current Semester</p>
                         <p className="text-lg font-black text-slate-900 uppercase">Semester - {getRoman(data?.semester_id)}</p>
                     </div>
                     <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                         <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Degree</p>
                         <p className="text-lg font-black text-slate-900 uppercase">B.E. - {getFullDept(data?.department)}</p>
                     </div>
                     <div className="p-4 bg-indigo-50 rounded-2xl border border-indigo-100">
                         <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] mb-1">Mentor</p>
                         <p className="text-lg font-black text-indigo-600 uppercase underline decoration-indigo-200">{data?.mentor_name}</p>
                     </div>
                     <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                         <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">CGPA</p>
                         <p className="text-lg font-black text-slate-900">{data?.cgpa || '0.00'} / 10.00</p>
                     </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Global SGPA Trend Visualization */}
        <section className="animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <SgpaTrendChart semesters={data?.semesters || []} />
        </section>

        {/* Semester Results — Tabbed Navigation */}
        {data?.semesters?.length > 0 && (
        <div className="space-y-0">
          {/* Section Header */}
          <div className="mb-8">
              <h3 className="text-2xl font-black text-slate-900 tracking-tight uppercase">My Marks</h3>
              <p className="text-slate-500 text-xs font-bold mt-1 uppercase tracking-widest">Select a semester to view your marks</p>
          </div>

          {/* Semester Tab Pills */}
          <div className="glass-card p-2 mb-8 inline-flex gap-1.5 flex-wrap">
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
                  <div className="p-6 md:p-8 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white">
                    <div>
                      <h3 className="text-xl font-black text-slate-900 tracking-tight uppercase">Semester {getRoman(sem.semester)}</h3>
                      <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mt-1 italic">
                           SGPA: <span className="text-indigo-600 ml-2">{sem.sgpa?.toFixed(2) || '0.00'}</span>
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <div className="px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl">
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{sem.courses.length} Subjects</span>
                      </div>
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
                            <td className="px-6 py-4 md:px-8 md:py-6">
                              <p className="text-xs md:text-sm font-black text-slate-900 group-hover:text-indigo-400 transition-colors uppercase tracking-tight">{course.course}</p>
                            </td>
                            <td className="px-4 py-4 md:px-8 md:py-6 text-center text-xs md:text-sm font-black text-slate-700">{course.pt1 ?? "—"}</td>
                            <td className="px-4 py-4 md:px-8 md:py-6 text-center text-xs md:text-sm font-black text-slate-700">{course.pt2 ?? "—"}</td>
                            <td className="px-4 py-4 md:px-8 md:py-6 text-center text-xs md:text-sm font-black text-slate-700">{course.semester_exam ?? "—"}</td>
                            <td className="px-4 py-4 md:px-8 md:py-6 text-center text-xs md:text-sm font-black text-indigo-600 bg-indigo-50/20">{course.final_score ?? "—"}</td>
                            <td className="px-4 py-4 md:px-8 md:py-6 text-right">
                              <span className={`px-3 py-1 md:px-4 md:py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border ${
                                course.grade === 'S' || course.grade === 'A' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                                course.grade === 'B' || course.grade === 'C' ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' :
                                'bg-slate-50 text-slate-400 border-slate-100'
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
                
                <div className="pl-4 md:pl-6 border-l-4 border-indigo-500/10">
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

export default StudentDashboard;