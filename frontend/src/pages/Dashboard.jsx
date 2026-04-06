import React, { useState, useEffect } from "react";
import adminService from "../services/adminService";
import DashboardLayout from "../components/layout/DashboardLayout";
import GradeDistribution from "../components/charts/GradeDistribution";
import LoadingSpinner from "../components/common/LoadingSpinner";
import EmptyState from "../components/common/EmptyState";

const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedDept, setSelectedDept] = useState("");

  // Paginated Students state
  const [studentsList, setStudentsList] = useState([]);
  const [totalStudents, setTotalStudents] = useState(0);
  const [page, setPage] = useState(0);
  const [studentSearch, setStudentSearch] = useState("");
  const [studentFilterDept, setStudentFilterDept] = useState("");
  const limit = 20;

  // Mapping Search/Filter
  const [mappingSearch, setMappingSearch] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [dashboardData, gradeDist] = await Promise.all([
          adminService.getDashboard(),
          adminService.getGradeDistribution()
        ]);
        
        setData(dashboardData);
        
        // Format grade dist for recharts: { grade, count }
        const formattedGrades = Object.entries(gradeDist).map(([grade, count]) => ({
          grade,
          count
        }));
        setGrades(formattedGrades);
      } catch (err) {
        setError("Failed to load admin dashboard.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Fetch paginated students
  useEffect(() => {
    const fetchStudents = async () => {
       try {
          const res = await adminService.getStudents(studentSearch, studentFilterDept, limit, page * limit);
          setStudentsList(res.students);
          setTotalStudents(res.total);
       } catch (err) {
          console.error("Student fetch failed:", err);
       }
    };
    if (!loading) fetchStudents();
  }, [page, studentSearch, studentFilterDept, loading]);

  useEffect(() => {
    const fetchGrades = async () => {
      try {
        const gradeDist = await adminService.getGradeDistribution(selectedDept);
        const formattedGrades = Object.entries(gradeDist).map(([grade, count]) => ({
          grade,
          count
        }));
        setGrades(formattedGrades);
      } catch (err) {
        console.error("Failed to filter grades:", err);
      }
    };
    if (!loading) fetchGrades();
  }, [selectedDept]);

  // Filtering for Local Mappings (Simple)
  const filteredMappings = data?.mentor_student_mapping?.filter(m => {
     const mentorName = m.mentors?.name?.toLowerCase() || "";
     const studentName = m.students?.name?.toLowerCase() || "";
     const search = mappingSearch.toLowerCase();
     return mentorName.includes(search) || studentName.includes(search);
  }) || [];

  if (loading) return <LoadingSpinner fullPage />;

  return (
   <DashboardLayout title="Dashboard">
      <div className="space-y-12 w-full max-w-[1400px] mx-auto">
   {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
           <div className="glass-card p-8 flex items-center justify-between border-l-4 border-indigo-500">
             <div>
               <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest mb-1">Students</p>
               <h3 className="text-3xl font-black text-slate-900">{data?.total_students || 0} Students</h3>
             </div>
             <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-xl">👥</div>
           </div>
           
           <div className="glass-card p-8 flex items-center justify-between border-l-4 border-violet-500">
             <div>
               <p className="text-[10px] text-violet-400 font-bold uppercase tracking-widest mb-1">Teachers</p>
               <h3 className="text-3xl font-black text-slate-900">{data?.total_mentors || 0} Mentors</h3>
             </div>
             <div className="w-12 h-12 bg-violet-50 rounded-xl flex items-center justify-center text-xl">🎓</div>
           </div>

           <div className="md:col-span-2 glass-card p-8 flex items-center justify-between bg-gradient-to-r from-slate-900 to-indigo-900 text-white border-0 shadow-indigo-500/20">
              <div>
                <p className="text-[10px] text-indigo-300 font-bold uppercase tracking-widest mb-1">School Status</p>
                <h3 className="text-xl font-bold italic tracking-tight">Classes Running Smoothly</h3>
              </div>
              <div className="flex gap-2">
                 <div className="w-3 h-3 bg-indigo-400 rounded-full animate-ping" />
                 <div className="w-3 h-3 bg-indigo-400 rounded-full" />
              </div>
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Grade Distribution */}
          <div className="glass-card p-10">
             <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h3 className="text-xl font-black text-slate-900 tracking-tight underline decoration-indigo-200 decoration-4 underline-offset-8">Grades Overview</h3>
                  <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mt-4 italic">All Departments</p>
                </div>
                <div className="flex flex-col gap-2">
                   <span className="text-[10px] font-black text-slate-400 uppercase text-right">Filter Department</span>
                   <select 
                     className="input-field h-10 px-6 text-[10px] font-black uppercase tracking-widest w-48 bg-slate-50"
                     value={selectedDept}
                     onChange={(e) => setSelectedDept(e.target.value)}
                   >
                     <option value="">All Departments</option>
                     <option value="CSE">Computing Science</option>
                     <option value="MECH">Mechanical Eng.</option>
                     <option value="CIVIL">Civil Engineering</option>
                   </select>
                </div>
             </div>
             {grades.length > 0 ? (
                <div className="h-[400px]">
                   <GradeDistribution data={grades} />
                </div>
             ) : (
                <div className="py-20 bg-slate-50 rounded-3xl border border-dashed border-slate-200 text-center">
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">No grade data for {selectedDept || 'all departments'}</p>
                </div>
             )}
          </div>
          
          {/* Administrative Summary & Mentorship Mapping */}
          <div className="glass-card overflow-hidden">
            <div className="p-8 border-b border-slate-100 bg-white">
               <h3 className="text-xl font-black text-slate-900 tracking-tight">Mentor-Student List</h3>
               <div className="mt-6 flex gap-4">
                  <div className="relative flex-1">
                     <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
                               <input 
                                  type="text" 
                                  placeholder="Search mentor or student..." 
                                  className="input-field h-10 pl-10 text-[10px] font-black uppercase tracking-widest"
                                  value={mappingSearch}
                                  onChange={(e) => setMappingSearch(e.target.value)}
                               />
                  </div>
               </div>
            </div>
            <div className="max-h-[500px] overflow-y-auto">
               <table className="w-full text-left">
                  <thead className="sticky top-0 bg-white shadow-sm z-10">
                     <tr>
                        <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Student</th>
                        <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Dept</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                     {filteredMappings.map((m, i) => (
                        <tr key={i} className="hover:bg-slate-50/50 transition-colors group">
                           <td className="px-6 py-4">
                              <p className="text-xs font-black text-indigo-500 uppercase">{m.students?.name}</p>
                              <p className="text-[9px] font-bold text-slate-400 uppercase mt-0.5">Assigned to: <span className="text-slate-900 italic font-black">{m.mentors?.name}</span></p>
                           </td>
                           <td className="px-6 py-4 text-right">
                              <span className="text-[9px] font-black bg-slate-100 px-2 py-1 rounded border border-slate-200 text-slate-500">
                                 {m.students?.department}
                              </span>
                           </td>
                        </tr>
                     ))}
                  </tbody>
               </table>
               {filteredMappings.length === 0 && <EmptyState message="No mentor-student pairs found" />}
            </div>
          </div>
        </div>

        {/* Paginated Student Registry */}
        <div className="table-container shadow-2xl shadow-indigo-500/5">
           <div className="p-10 border-b border-slate-100 bg-white flex flex-col md:flex-row md:items-center justify-between gap-8">
              <div>
                 <h3 className="text-2xl font-black text-slate-900 tracking-tight uppercase">Student List</h3>
                 <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.3em] mt-2">All Students</p>
              </div>
              
              <div className="flex flex-col md:flex-row items-center gap-4">
                 <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
                    <input 
                      type="text" 
                      placeholder="Search by Name or Roll No" 
                      className="input-field h-12 w-64 pl-12 text-[10px] font-black uppercase tracking-widest"
                      value={studentSearch}
                      onChange={(e) => { setStudentSearch(e.target.value); setPage(0); }}
                    />
                 </div>
                 <select 
                    className="input-field h-12 px-6 text-[10px] font-black uppercase tracking-widest w-48 bg-slate-50"
                    value={studentFilterDept}
                    onChange={(e) => { setStudentFilterDept(e.target.value); setPage(0); }}
                 >
                    <option value="">All Departments</option>
                    <option value="CSE">CSE</option>
                    <option value="MECH">MECH</option>
                    <option value="CIVIL">CIVIL</option>
                 </select>
              </div>
           </div>

           <div className="overflow-x-auto min-h-[400px]">
              <table className="w-full text-left">
                 <thead>
                    <tr>
                       <th className="table-header w-1/3">Student Identity</th>
                       <th className="table-header">Department</th>
                       <th className="table-header">Academic Year</th>
                       <th className="table-header text-right">CGPA</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-50">
                    {studentsList.map((s) => (
                       <tr key={s.id} className="table-row group">
                          <td className="px-8 py-6">
                             <p className="text-sm font-black text-slate-900 group-hover:text-indigo-500 transition-colors uppercase tracking-tight">{s.name}</p>
                             <p className="text-[10px] font-bold text-slate-400 font-mono italic mt-0.5">{s.email} | #{s.roll_no}</p>
                          </td>
                          <td className="px-8 py-6 font-black text-[10px] text-slate-500 uppercase tracking-widest">
                             {s.department}
                          </td>
                          <td className="px-8 py-6 font-black text-[10px] text-slate-500 uppercase tracking-widest">
                             Academic Yr-{s.year}
                          </td>
                          <td className="px-8 py-6 text-right">
                             <span className="text-xl font-black text-slate-900 underline decoration-indigo-100 decoration-4">{s.final_cgpa?.toFixed(2) || '0.00'}</span>
                             <span className="text-[10px] font-black text-slate-300 ml-1">/10.0</span>
                          </td>
                       </tr>
                    ))}
                 </tbody>
              </table>
              {studentsList.length === 0 && <EmptyState message="No students found" />}
           </div>

           {/* Pagination Dashboard */}
           <div className="p-8 border-t border-slate-100 bg-slate-50/50 flex flex-col md:flex-row items-center justify-between gap-6">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                 Showing <span className="text-slate-900">{(page * limit) + 1} - {Math.min((page + 1) * limit, totalStudents)}</span> of {totalStudents} students
              </p>
              
              <div className="flex items-center gap-3">
                 <button 
                   disabled={page === 0}
                   onClick={() => setPage(p => p - 1)}
                   className="h-10 px-8 rounded-xl border border-slate-200 bg-white text-[10px] font-black uppercase tracking-widest hover:border-indigo-400 transition-all disabled:opacity-30 disabled:hover:border-slate-200 flex items-center gap-2"
                 >
                    <span>←</span> Previous
                 </button>
                 <button 
                   disabled={(page + 1) * limit >= totalStudents}
                   onClick={() => setPage(p => p + 1)}
                   className="h-10 px-8 rounded-xl border border-slate-200 bg-white text-[10px] font-black uppercase tracking-widest hover:border-indigo-400 transition-all disabled:opacity-30 disabled:hover:border-slate-200 flex items-center gap-2"
                 >
                    Next <span>→</span>
                 </button>
              </div>
           </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;