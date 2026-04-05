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

  if (loading) return <LoadingSpinner fullPage />;

  return (
    <DashboardLayout title="Administrative Control Center">
      <div className="space-y-12 w-full max-w-[1400px] mx-auto">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="glass-card p-8 flex items-center justify-between group hover:border-indigo-500/30 transition-all duration-500">
            <div>
              <p className="text-[10px] text-indigo-400 font-black uppercase tracking-[0.2em] mb-2">Total Students</p>
              <h3 className="text-3xl font-black text-slate-900 group-hover:text-indigo-400 transition-colors uppercase tracking-tight">{data?.total_students || 0}</h3>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 font-black text-xl border border-indigo-500/20 group-hover:scale-110 transition-transform">
              👥
            </div>
          </div>
          
          <div className="glass-card p-8 flex items-center justify-between group hover:border-violet-500/30 transition-all duration-500">
            <div>
              <p className="text-[10px] text-violet-400 font-black uppercase tracking-[0.2em] mb-2">Certified Mentors</p>
              <h3 className="text-3xl font-black text-slate-900 group-hover:text-violet-400 transition-colors">{data?.total_mentors || 0}</h3>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-violet-500/10 flex items-center justify-center text-violet-400 font-black text-xl border border-violet-500/20 group-hover:rotate-12 transition-transform">
              🎓
            </div>
          </div>

          <div className="glass-card p-8 flex items-center justify-between group hover:border-cyan-500/30 transition-all duration-500 lg:col-span-2">
            <div>
              <p className="text-[10px] text-cyan-400 font-black uppercase tracking-[0.2em] mb-2">Platform Status</p>
              <h3 className="text-xl font-black text-slate-900 group-hover:text-cyan-400 transition-colors uppercase tracking-tight">System Operational</h3>
              <p className="text-[10px] text-slate-500 font-bold uppercase mt-1">Direct Database Connection: Active</p>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 bg-cyan-500 rounded-full animate-ping" />
              <span className="w-2 h-2 bg-cyan-500 rounded-full" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Grade Distribution */}
          <div className="glass-card p-8 relative overflow-hidden">
             <div className="mb-8 flex items-center justify-between">
                <div>
                   <h3 className="text-xl font-black text-slate-900 tracking-tight">Grade Spectrum Analysis</h3>
                   <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mt-1.5 italic">Institutional Performance Metrics</p>
                </div>
                <select 
                  className="input-field h-10 px-4 text-[10px] font-black uppercase tracking-widest w-40"
                  value={selectedDept}
                  onChange={(e) => setSelectedDept(e.target.value)}
                >
                  <option value="">Global View</option>
                  <option value="CSE">CSE Dept</option>
                  <option value="MECH">MECH Dept</option>
                  <option value="CIVIL">CIVIL Dept</option>
                </select>
             </div>
             <GradeDistribution data={grades} />
          </div>
          
          {/* Mapping Summary Table */}
          <div className="glass-card overflow-hidden">
            <div className="p-8 border-b border-slate-200 bg-white">
              <h3 className="text-xl font-black text-slate-900 tracking-tight">Administrative Summary</h3>
              <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em] mt-1.5">Operational Overview</p>
            </div>
            <div className="p-8">
              <p className="text-slate-400 text-sm font-medium mb-8 leading-relaxed">Centralized oversight of mentor-student dynamics across all academic departments.</p>
              <div className="space-y-6">
                 <div className="flex justify-between items-center p-4 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Global Assignments</span>
                    <span className="text-xl font-black text-indigo-400 font-mono tracking-tighter">{data?.mentor_student_mapping.length}</span>
                 </div>
                 <div className="bg-indigo-500/5 border border-indigo-500/10 rounded-xl p-5 text-center">
                    <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Next Sync Cycle</p>
                    <p className="text-sm font-bold text-slate-900 mt-1">Automatic (Every 5 minutes)</p>
                 </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mentor-Student Mappings Table */}
        <div className="table-container">
          <div className="p-8 border-b border-slate-200 flex justify-between items-center bg-white">
            <div>
              <h3 className="text-xl font-black text-slate-900 tracking-tight">Mentorship List</h3>
              <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mt-1.5 italic">Cross-Departmental Mapping</p>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-xl">
               <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse" />
               <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Real-time Pipeline</span>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr>
                  <th className="table-header">Student Identity</th>
                  <th className="table-header">Primary Mentor</th>
                  <th className="table-header">Division</th>
                  <th className="table-header text-right">Inception Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data?.mentor_student_mapping.length > 0 ? (
                  data.mentor_student_mapping.map((mapping, idx) => (
                    <tr key={idx} className="table-row group animate-fade-in" style={{ animationDelay: `${idx * 50}ms` }}>
                      <td className="px-8 py-6">
                        <p className="text-sm font-black text-slate-900 group-hover:text-indigo-400 transition-colors uppercase tracking-tight">{mapping.students?.name}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] font-black text-indigo-600 font-mono bg-indigo-50 px-1.5 py-0.5 rounded">#{mapping.students?.roll_no}</span>
                          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{mapping.students?.email}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-xs font-black text-slate-400 group-hover:text-violet-400 transition-colors">
                            {mapping.mentors?.name?.[0]}
                          </div>
                          <span className="text-sm font-bold text-slate-300 group-hover:text-slate-900 transition-colors">{mapping.mentors?.name}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <span className="px-3 py-1 rounded-lg bg-slate-50/50 border border-slate-800 text-[10px] font-black text-slate-500 uppercase tracking-widest group-hover:border-indigo-500/30 transition-colors">
                          {mapping.mentors?.department || "GENERAL"}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <span className="text-[11px] font-mono font-bold text-slate-600">
                          {mapping.start_date || "UNDEFINED"}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4">
                      <EmptyState message="Registry Clearance: 0 Records Found" />
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;