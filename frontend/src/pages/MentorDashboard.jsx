import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import mentorService from "../services/mentorService";
import authService from "../services/authService";
import DashboardLayout from "../components/layout/DashboardLayout";

const MentorDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const getRomanYear = (year) => {
    const roman = { 1: "I", 2: "II", 3: "III" };
    return roman[year] || year;
  };

  const getFullDept = (dept) => {
    const depts = {
      'CSE': 'Computer Science',
      'MECH': 'Mechanical Engineering',
      'CIVIL': 'Civil Engineering'
    };
    return depts[dept] || dept;
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

  if (loading) return <div className="min-h-screen bg-slate-900 flex items-center justify-center text-slate-900">Loading...</div>;

  return (
    <DashboardLayout title="Mentor Intelligence Suite">
      <div className="space-y-12 w-full max-w-[1400px] mx-auto">
        {/* Mentor Detail Header */}
        <div className="glass-card p-10 bg-white border-l-8 border-violet-600">
           <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <p className="text-[10px] font-black text-violet-500 uppercase tracking-[0.3em] mb-2">Faculty Command Center</p>
                <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tight">{authService.getCurrentUser()?.name}</h2>
                <div className="flex items-center gap-4 mt-2">
                   <span className="text-[10px] font-black text-slate-500 uppercase bg-slate-100 px-3 py-1 rounded-lg">
                      Faculty ID: {authService.getCurrentUser()?.faculty_id || 'Institutional Staff'}
                   </span>
                   <span className="text-[10px] font-black text-violet-600 uppercase bg-violet-50 border border-violet-100 px-3 py-1 rounded-lg">
                      {getFullDept(authService.getCurrentUser()?.department)}
                   </span>
                </div>
              </div>
              <div className="flex h-16 items-center gap-4 px-8 bg-slate-50 rounded-2xl border border-slate-100">
                 <div className="text-right">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Digital Status</p>
                    <p className="text-sm font-black text-green-500 uppercase">Synchronized</p>
                 </div>
                 <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                 </div>
              </div>
           </div>
        </div>
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="glass-card p-10 flex items-center justify-between group hover:border-indigo-500/30 transition-all duration-500">
            <div>
              <p className="text-[10px] text-indigo-400 font-black uppercase tracking-[0.2em] mb-3">Mentee Fleet</p>
              <h3 className="text-4xl font-black text-slate-900 group-hover:text-indigo-400 transition-colors">{data?.students_count || 0}</h3>
              <p className="text-sm font-medium text-slate-500 mt-2">Active Student Allocations</p>
            </div>
            <div className="w-20 h-20 rounded-3xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-3xl group-hover:scale-110 transition-all">
              👥
            </div>
          </div>
          
          <div className="glass-card p-10 flex items-center justify-between group hover:border-violet-500/30 transition-all duration-500">
            <div>
              <p className="text-[10px] text-violet-400 font-black uppercase tracking-[0.2em] mb-3">Core Expertise</p>
              <h3 className="text-4xl font-black text-slate-900 group-hover:text-violet-400 transition-colors">{data?.courses_count || 0}</h3>
              <p className="text-sm font-medium text-slate-500 mt-2">Faculty Course Load</p>
            </div>
            <div className="w-20 h-20 rounded-3xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-3xl group-hover:scale-110 transition-all">
              🎓
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Mentees List */}
          <div className="glass-card overflow-hidden">
            <div className="p-8 border-b border-slate-200 bg-white">
              <h3 className="text-xl font-black text-slate-900 tracking-tight">Assigned Mentees</h3>
              <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em] mt-1.5">Direct Supervision</p>
            </div>
            <div className="p-6">
              {data?.students.length > 0 ? (
                <div className="grid grid-cols-1 gap-4">
                  {data.students.map((student) => (
                    <Link
                      key={student.id}
                      to={`/mentor/student/${student.id}`}
                      className="flex items-center justify-between p-5 rounded-2xl bg-slate-50 hover:bg-indigo-500/5 border border-slate-200 hover:border-indigo-500/30 transition-all group"
                    >
                      <div className="flex items-center gap-5">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500/20 to-violet-600/20 text-indigo-400 flex items-center justify-center font-black border border-indigo-500/20 group-hover:scale-105 transition-transform">
                          {student.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-base font-black text-slate-900 group-hover:text-indigo-400 transition-colors uppercase tracking-tight">{student.name}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[10px] font-black text-indigo-500 font-mono bg-indigo-50 px-1.5 py-0.5 rounded">ID: #{student.roll_no}</span>
                            <span className="w-1 h-1 bg-slate-200 rounded-full" />
                            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest italic">{getFullDept(student.department)} • Yr {getRomanYear(student.year)}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 group-hover:translate-x-2 transition-transform duration-300">
                        <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Profile</span>
                        <span className="text-indigo-500">→</span>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-4 grayscale opacity-20">👥</div>
                  <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest">No mentees assigned yet</p>
                </div>
              )}
            </div>
          </div>

          {/* Courses List */}
          <div className="glass-card overflow-hidden">
            <div className="p-8 border-b border-slate-200 bg-white">
              <h3 className="text-xl font-black text-slate-900 tracking-tight">Course Portfolio</h3>
              <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em] mt-1.5">Academic Responsibilities</p>
            </div>
            <div className="p-6">
              {data?.courses.length > 0 ? (
                <div className="grid grid-cols-1 gap-4">
                  {data.courses.map((course) => (
                    <div key={course.id} className="p-6 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between group hover:border-violet-500/30 transition-all">
                      <div>
                        <p className="text-base font-black text-slate-900 group-hover:text-violet-400 transition-colors uppercase tracking-tight">{course.title}</p>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Unit ID: SC-{course.id}</p>
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
                  <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest">No courses assigned yet</p>
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