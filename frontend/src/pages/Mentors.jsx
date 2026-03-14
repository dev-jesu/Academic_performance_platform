import React, { useEffect, useState } from "react";
import DashboardLayout from "../components/layout/DashboardLayout";
import api from "../api/apiClient";
import adminService from "../services/adminService";

const Mentors = () => {
  const [mentors, setMentors] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    department: "CSE",
    faculty_id: "",
    password: "mentor123"
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchMentors = async () => {
      try {
        const res = await api.get("/mentors");
        setMentors(res.data);
      } catch (error) {
        console.error("Error fetching mentors:", error);
      }
    };
    fetchMentors();
  }, []);

  const handleCreateMentor = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await adminService.createMentor(formData);
      alert("Mentor created successfully!");
      setShowAddForm(false);
      setFormData({
        name: "",
        email: "",
        department: "CSE",
        faculty_id: "",
        password: "mentor123"
      });
      // Refresh list
      const res = await api.get("/mentors");
      setMentors(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to create mentor: " + (err.response?.data?.detail || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout title="Faculty Directory">
      <div className="space-y-10 w-full max-w-[1400px] mx-auto">
        <div className="glass-card p-10 flex items-center justify-between bg-white">
          <div>
            <h3 className="text-2xl font-black text-slate-900 tracking-tight uppercase">Academic Mentors</h3>
            <p className="text-slate-500 text-sm font-medium mt-1">Directory of certified faculty members and their departments.</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="bg-violet-500/10 border border-violet-500/20 px-5 py-2.5 rounded-xl">
              <span className="text-[10px] font-black text-violet-400 uppercase tracking-widest">{mentors.length} Mentors Registered</span>
            </div>
            <button 
              onClick={() => setShowAddForm(!showAddForm)}
              className="btn-primary px-6 py-2.5 text-[10px] font-black uppercase tracking-widest bg-violet-600 hover:bg-violet-700"
            >
              {showAddForm ? "Close Form" : "Add Mentor"}
            </button>
          </div>
        </div>

        {showAddForm && (
          <div className="glass-card p-10 bg-white border-violet-500/20 animate-in fade-in duration-500">
            <h3 className="text-xl font-black text-slate-900 mb-8 uppercase tracking-tight">Register New Faculty</h3>
            <form onSubmit={handleCreateMentor} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-violet-400 uppercase tracking-widest">Full Name</label>
                <input 
                  type="text" 
                  required
                  className="input-field h-12 px-4 text-sm font-bold border-violet-100"
                  placeholder="Enter mentor name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-violet-400 uppercase tracking-widest">Faculty ID</label>
                <input 
                  type="text" 
                  required
                  className="input-field h-12 px-4 text-sm font-bold border-violet-100"
                  placeholder="e.g. CSE001"
                  value={formData.faculty_id}
                  onChange={(e) => setFormData({...formData, faculty_id: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-violet-400 uppercase tracking-widest">Faculty Email</label>
                <input 
                  type="email" 
                  required
                  className="input-field h-12 px-4 text-sm font-bold border-violet-100"
                  placeholder="mentor@college.edu"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-violet-400 uppercase tracking-widest">Department</label>
                <select 
                  className="input-field h-12 px-4 text-sm font-bold border-violet-100"
                  value={formData.department}
                  onChange={(e) => setFormData({...formData, department: e.target.value})}
                >
                  <option value="CSE">CSE</option>
                  <option value="MECH">MECH</option>
                  <option value="CIVIL">CIVIL</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-violet-400 uppercase tracking-widest">Passphrase</label>
                <input 
                  type="text" 
                  required
                  className="input-field h-12 px-4 text-sm font-bold border-violet-100"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
              </div>
              <div className="lg:col-span-5 flex justify-end">
                <button 
                  type="submit" 
                  disabled={loading}
                  className="px-12 btn-primary h-12 text-[10px] font-black uppercase tracking-widest shadow-lg shadow-violet-500/20 bg-violet-600 hover:bg-violet-700"
                >
                  {loading ? "Registering..." : "Commit Faculty Profile"}
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="table-container">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr>
                  <th className="table-header w-24">ID</th>
                  <th className="table-header">Faculty Identity</th>
                  <th className="table-header">Faculty ID</th>
                  <th className="table-header">Digital Path</th>
                  <th className="table-header">Department</th>
                  <th className="table-header text-right">Auth Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {mentors.map((mentor) => (
                  <tr key={mentor.id} className="table-row group">
                    <td className="px-8 py-6">
                      <span className="font-mono font-bold text-violet-400 opacity-60">#M-{mentor.id}</span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-violet-50 border border-violet-100 flex items-center justify-center text-violet-400 font-black text-xs group-hover:border-violet-500/30 transition-all">
                          {mentor.name[0]}
                        </div>
                        <span className="text-sm font-black text-slate-900 group-hover:text-violet-400 transition-colors uppercase tracking-tight">{mentor.name}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className="text-sm font-black text-indigo-600 font-mono bg-indigo-50 px-2 py-0.5 rounded-md">
                        {mentor.faculty_id || "N/A"}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <span className="text-sm font-bold text-slate-600">{mentor.email}</span>
                    </td>
                    <td className="px-8 py-6">
                      <span className="px-3 py-1 rounded-lg bg-violet-50 border border-violet-100 text-[10px] font-black text-violet-600 uppercase tracking-widest">
                        {mentor.department}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right">
                       <span className="px-3 py-1 rounded-lg bg-slate-900 border border-slate-200 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                          Active Faculty
                       </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Mentors;
