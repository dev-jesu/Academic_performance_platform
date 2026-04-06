import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import mentorService from "../services/mentorService";
import authService from "../services/authService";
import DashboardLayout from "../components/layout/DashboardLayout";
import EmptyState from "../components/common/EmptyState";

const getFullDept = (dept) => {
  const map = { CSE: "Computer Science", MECH: "Mechanical", CIVIL: "Civil" };
  return map[dept] || dept || "N/A";
};

const getRomanYear = (year) => {
  const roman = { 1: "I", 2: "II", 3: "III", 4: "IV" };
  return roman[year] || year;
};

const MentorDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [studentSearch, setStudentSearch] = useState("");
  const [studentFilterDept, setStudentFilterDept] = useState("");

  const fetchStudents = async () => {
    try {
      const user = authService.getCurrentUser();
      if (!user || !user.id) return;
      const students = await mentorService.getMentorStudents(user.id, studentSearch, studentFilterDept);
      setData(prev => ({ ...prev, students }));
    } catch (err) {
      console.error("Mentor students fetch failed:", err);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = authService.getCurrentUser();
        if (!user || !user.id) throw new Error("Mentor not authenticated");
        const mentorId = user.id;

        const dashboardData = await mentorService.getDashboard(mentorId);
        setData(dashboardData);
      } catch (err) {
        setError("Failed to load mentor dashboard.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
     if (!loading) fetchStudents();
  }, [studentSearch, studentFilterDept, loading]);

  if (loading) return <div className="min-h-screen bg-slate-900 flex items-center justify-center text-slate-100">Loading Mentor Dashboard...</div>;

  return (
    <DashboardLayout title="Mentor Dashboard">
      <div className="space-y-12 w-full max-w-[1400px] mx-auto">
        {/* Mentor Detail Header */}
        <div className="glass-card p-10 bg-white border-l-8 border-indigo-500 shadow-xl shadow-indigo-500/5">
           <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <p className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.3em] mb-2">Mentor Info</p>
                <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tight italic decoration-indigo-200 decoration-8 underline-offset-[-2px]">{authService.getCurrentUser()?.name}</h2>
                <div className="flex items-center gap-4 mt-6">
                   <span className="text-[10px] font-black text-slate-500 uppercase bg-slate-100 px-4 py-2 rounded-xl border border-slate-200">
                      Faculty ID: {authService.getCurrentUser()?.faculty_id || 'Staff'}
                   </span>
                   <span className="text-[10px] font-black text-indigo-600 uppercase bg-indigo-50 border border-indigo-100 px-4 py-2 rounded-xl">
                      Department: {getFullDept(authService.getCurrentUser()?.department)}
                   </span>
                </div>
              </div>
           </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="glass-card p-10 flex items-center justify-between group hover:border-indigo-500/30 transition-all duration-500 border-0 shadow-lg">
            <div>
               <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-[0.2em] mb-3">Students</p>
               <h3 className="text-5xl font-black text-slate-900 group-hover:text-indigo-400 transition-colors tracking-tighter">{data?.students_count || 0}</h3>
               <p className="text-xs font-bold text-slate-400 mt-2 uppercase tracking-widest">Assigned to You</p>
            </div>
            <div className="w-20 h-20 rounded-3xl bg-indigo-500/10 flex items-center justify-center text-3xl group-hover:rotate-12 transition-all grayscale group-hover:grayscale-0">
              👥
            </div>
          </div>
          
          <div className="glass-card p-10 flex items-center justify-between group hover:border-violet-500/30 transition-all duration-500 border-0 shadow-lg">
            <div>
               <p className="text-[10px] text-violet-400 font-bold uppercase tracking-[0.2em] mb-3">Courses</p>
               <h3 className="text-5xl font-black text-slate-900 group-hover:text-violet-400 transition-colors tracking-tighter">{data?.courses_count || 0}</h3>
               <p className="text-xs font-bold text-slate-400 mt-2 uppercase tracking-widest">This Semester</p>
            </div>
            <div className="w-20 h-20 rounded-3xl bg-violet-500/10 flex items-center justify-center text-3xl group-hover:-rotate-12 transition-all grayscale group-hover:grayscale-0">
              🎓
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Mentees List */}
          <div className="glass-card overflow-hidden shadow-2xl border-0">
            <div className="p-8 border-b border-slate-50 bg-white">
               <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div>
                    <h3 className="text-xl font-black text-slate-900 tracking-tight">Your Students</h3>
                     <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em] mt-1.5 italic">Click on a student to view details</p>
                  </div>
                  <div className="flex gap-2">
                     <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs">🔍</span>
                        <input 
                           type="text"                            placeholder="Search student..." 
                           className="input-field h-9 pl-8 text-[9px] font-black uppercase tracking-widest w-40 bg-slate-50"
                           value={studentSearch}
                           onChange={(e) => setStudentSearch(e.target.value)}
                        />
                     </div>
                     <select 
                       className="input-field h-9 px-4 text-[9px] font-black uppercase tracking-widest w-32 bg-slate-50"
                       value={studentFilterDept}
                       onChange={(e) => setStudentFilterDept(e.target.value)}
                     >
                        <option value="">All Depts</option>
                       <option value="CSE">CSE</option>
                       <option value="MECH">MECH</option>
                       <option value="CIVIL">CIVIL</option>
                     </select>
                  </div>
               </div>
            </div>
            <div className="p-8 max-h-[600px] overflow-y-auto custom-scrollbar">
              {data?.students.length > 0 ? (
                <div className="grid grid-cols-1 gap-4">
                  {data.students.map((student) => (
                    <Link
                      key={student.id}
                      to={`/mentor/student/${student.id}`}
                      className="flex items-center justify-between p-6 rounded-3xl bg-slate-50 hover:bg-white border border-transparent hover:border-indigo-100 hover:shadow-xl hover:shadow-indigo-500/5 transition-all group relative overflow-hidden"
                    >
                      <div className="absolute left-0 top-0 w-1 h-full bg-indigo-500 scale-y-0 group-hover:scale-y-100 transition-transform origin-bottom" />
                      <div className="flex items-center gap-6">
                        <div className="w-14 h-14 rounded-2xl bg-slate-900 text-indigo-400 flex items-center justify-center text-xl font-black group-hover:bg-indigo-500 group-hover:text-white transition-all shadow-lg">
                          {student.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-base font-black text-slate-900 group-hover:text-indigo-600 transition-colors uppercase tracking-tight">{student.name}</p>
                          <div className="flex items-center gap-3 mt-1.5">
                            <span className="text-xs font-black text-indigo-500 font-mono bg-indigo-50 px-2 py-1 rounded-lg">{student.roll_no}</span>
                            <span className="text-xs text-slate-500 font-bold uppercase">{student.department} • Year {getRomanYear(student.year)}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 translate-x-4 transition-all duration-500">
                        <span className="text-[9px] font-black text-indigo-600 uppercase tracking-widest mt-1">View Details</span>
                        <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 text-lg">→</div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <EmptyState message="No students found" />
              )}
            </div>
          </div>

          {/* Courses List */}
          <div className="glass-card overflow-hidden">
            <div className="p-8 border-b border-slate-200 bg-white">
               <h3 className="text-xl font-black text-slate-900 tracking-tight">Courses</h3>
               <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em] mt-1.5">Your Courses</p>
            </div>
            <div className="p-6">
              {data?.courses.length > 0 ? (
                <div className="grid grid-cols-1 gap-4">
                  {data.courses.map((course) => (
                    <div key={course.id} className="p-6 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between group hover:border-violet-500/30 transition-all">
                      <div>
                        <p className="text-base font-black text-slate-900 group-hover:text-violet-400 transition-colors uppercase tracking-tight">{course.title}</p>
                         <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Course ID: {course.id}</p>
                      </div>
                      <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center text-violet-400 group-hover:rotate-12 transition-transform">
                        🔖
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-4 grayscale opacity-20">🔖</div>
                  <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest">No courses yet</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default MentorDashboard;