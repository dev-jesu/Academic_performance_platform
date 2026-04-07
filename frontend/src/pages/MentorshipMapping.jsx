import React, { useState, useEffect } from "react";
import adminService from "../services/adminService";
import DashboardLayout from "../components/layout/DashboardLayout";
import LoadingSpinner from "../components/common/LoadingSpinner";
import EmptyState from "../components/common/EmptyState";

const MentorshipMapping = () => {
  const [students, setStudents] = useState([]);
  const [mentors, setMentors] = useState([]);
  const [currentMappings, setCurrentMappings] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Selection states
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [selectedMentor, setSelectedMentor] = useState("");
  const [assignLoading, setAssignLoading] = useState(false);
  const [search, setSearch] = useState("");

  const fetchData = async () => {
    try {
      const dashboardData = await adminService.getDashboard();
      // Fetch a larger set of students to ensure we see unmapped ones
      // In a real app, we'd have a specific "unmapped" endpoint
      const allStudentsRes = await adminService.getStudents("", "", 1000, 0);
      
      setMentors(dashboardData?.mentors || []);
      setCurrentMappings(dashboardData?.mentor_student_mapping || []);
      setStudents(allStudentsRes?.students || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAssign = async (e) => {
    e.preventDefault();
    if (selectedStudents.length === 0 || !selectedMentor) {
      alert("Please select students and a mentor.");
      return;
    }

    setAssignLoading(true);
    try {
      for (const studentId of selectedStudents) {
        await adminService.assignStudentMentor(parseInt(studentId), parseInt(selectedMentor));
      }
      alert("Successfully updated mentorship assignments.");
      setSelectedStudents([]);
      setSelectedMentor("");
      fetchData(); // Refresh list
    } catch (err) {
      console.error(err);
      alert("Mapping failed. Please try again.");
    } finally {
      setAssignLoading(false);
    }
  };

  const unmappedStudents = students.filter(s => 
    !currentMappings.some(m => m.students?.roll_no === s.roll_no)
  );

  const filteredUnmapped = unmappedStudents.filter(s => 
    s.name.toLowerCase().includes(search.toLowerCase()) || 
    s.roll_no.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <LoadingSpinner fullPage />;

  return (
    <DashboardLayout title="Mentorship Linker">
      <div className="space-y-10 w-full max-w-[1400px] mx-auto pb-20">
        
        {/* Header Section */}
        <div className="glass-card p-10 bg-white border-l-8 border-indigo-500 shadow-xl">
           <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mb-2">Administration Tool</p>
                <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tight italic">Mentorship Mapping</h2>
                <p className="text-slate-500 text-sm font-medium mt-2">Connect unassigned students with academic mentors.</p>
              </div>
              <div className="flex items-center gap-4">
                 <div className="bg-indigo-50 px-6 py-3 rounded-2xl border border-indigo-100 text-center">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Unmapped</p>
                    <p className="text-2xl font-black text-indigo-600">{unmappedStudents.length}</p>
                 </div>
              </div>
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
           
           {/* Left: Assignment Interface (2 cols) */}
           <div className="lg:col-span-2 space-y-8">
              <div className="glass-card overflow-hidden">
                 <div className="p-8 border-b border-slate-100 bg-white flex items-center justify-between">
                    <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Assignment Engine</h3>
                    <div className="flex items-center gap-2">
                       <span className={`w-2 h-2 rounded-full ${selectedStudents.length > 0 ? 'bg-amber-500 animate-pulse' : 'bg-slate-300'}`} />
                       <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{selectedStudents.length} Ready for Link</span>
                    </div>
                 </div>
                 
                 <form onSubmit={handleAssign} className="p-10 space-y-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                       
                       {/* Student Selection */}
                       <div className="space-y-4">
                          <div className="flex items-center justify-between">
                             <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">1. Select Student(s)</label>
                             {selectedStudents.length > 0 && (
                                <button type="button" onClick={() => setSelectedStudents([])} className="text-[9px] font-black text-red-400 uppercase hover:text-red-600 transition-colors">Clear Selection</button>
                             )}
                          </div>
                          <div className="glass-card bg-slate-50 border border-slate-100 overflow-hidden shadow-inner">
                             <div className="p-3 bg-white border-b border-slate-100 flex items-center gap-3">
                                <span className="text-slate-400 text-xs">🔍</span>
                                <input 
                                  type="text" 
                                  placeholder="Filter by name or roll..."
                                  className="w-full bg-transparent border-none focus:ring-0 text-[10px] font-black uppercase tracking-tight"
                                  value={search}
                                  onChange={(e) => setSearch(e.target.value)}
                                />
                             </div>
                             <div className="max-h-[300px] overflow-y-auto p-4 space-y-2">
                                {filteredUnmapped.length > 0 ? (
                                   filteredUnmapped.map((s) => (
                                     <label key={s.id} className={`flex items-center gap-4 p-4 rounded-2xl cursor-pointer border transition-all duration-300 ${selectedStudents.includes(s.id) ? 'bg-indigo-600 border-indigo-500 shadow-lg shadow-indigo-600/20 translate-x-1' : 'bg-white border-slate-100 hover:border-indigo-300'}`}>
                                        <input 
                                          type="checkbox" 
                                          className="hidden"
                                          checked={selectedStudents.includes(s.id)}
                                          onChange={(e) => {
                                            if(e.target.checked) setSelectedStudents([...selectedStudents, s.id]);
                                            else setSelectedStudents(selectedStudents.filter(id => id !== s.id));
                                          }}
                                        />
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs transition-colors ${selectedStudents.includes(s.id) ? 'bg-white/20 text-white' : 'bg-slate-50 text-slate-400'}`}>
                                          {s.name[0]}
                                        </div>
                                        <div>
                                          <p className={`text-xs font-black uppercase tracking-tight ${selectedStudents.includes(s.id) ? 'text-white' : 'text-slate-900 group-hover:text-indigo-400'}`}>{s.name}</p>
                                          <p className={`text-[10px] font-bold font-mono ${selectedStudents.includes(s.id) ? 'text-indigo-200' : 'text-slate-400'}`}>{s.roll_no}</p>
                                        </div>
                                     </label>
                                   ))
                                ) : (
                                   <div className="py-20 text-center opacity-40">
                                      <p className="text-[10px] font-black uppercase tracking-[0.3em]">Nothing to map</p>
                                   </div>
                                )}
                             </div>
                          </div>
                       </div>

                       {/* Mentor Selection */}
                       <div className="space-y-4">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">2. Select Primary Mentor</label>
                          <div className="space-y-8">
                             <div className="grid grid-cols-1 gap-3">
                                {mentors.map((m) => (
                                  <label key={m.id} className={`flex items-center justify-between p-5 rounded-2xl cursor-pointer border transition-all duration-300 ${parseInt(selectedMentor) === m.id ? 'bg-indigo-50 border-indigo-500 ring-2 ring-indigo-500/10' : 'bg-white border-slate-100 hover:border-indigo-200'}`}>
                                     <div className="flex items-center gap-4">
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs ${parseInt(selectedMentor) === m.id ? 'bg-indigo-600 text-white' : 'bg-slate-50 text-slate-400'}`}>
                                          {m.name[0]}
                                        </div>
                                        <div className="text-left">
                                          <p className="text-xs font-black text-slate-900 uppercase">{m.name}</p>
                                          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{m.department}</p>
                                        </div>
                                     </div>
                                     <input 
                                       type="radio" 
                                       name="mentor"
                                       value={m.id}
                                       checked={parseInt(selectedMentor) === m.id}
                                       onChange={(e) => setSelectedMentor(e.target.value)}
                                       className="w-5 h-5 border-2 border-slate-200 text-indigo-600 focus:ring-indigo-500"
                                     />
                                  </label>
                                ))}
                             </div>

                             <button
                               disabled={assignLoading || selectedStudents.length === 0 || !selectedMentor}
                               className="w-full btn-primary h-20 text-sm font-black uppercase tracking-widest shadow-2xl shadow-indigo-500/30 group disabled:opacity-30 disabled:grayscale"
                             >
                                <span className="flex items-center justify-center gap-4">
                                   {assignLoading ? 'Processing Batch...' : `Link ${selectedStudents.length} Students`}
                                   {!assignLoading && <span className="text-2xl group-hover:translate-x-2 transition-transform">→</span>}
                                </span>
                             </button>
                          </div>
                       </div>
                    </div>
                 </form>
              </div>
           </div>

           {/* Right: Existing Mappings List (1 col) */}
           <div className="lg:col-span-1">
              <div className="glass-card bg-white flex flex-col h-full border-l-4 border-indigo-200 shadow-lg">
                 <div className="p-8 border-b border-slate-100 bg-slate-50/50">
                    <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Current Registry</h3>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Existing Mappings</p>
                 </div>
                 <div className="flex-1 overflow-y-auto max-h-[700px]">
                    <div className="divide-y divide-slate-50">
                       {currentMappings.map((m, i) => (
                         <div key={i} className="p-6 hover:bg-slate-50 transition-colors">
                            <div className="flex justify-between items-start mb-2">
                               <span className="text-[9px] font-black text-indigo-500 uppercase bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">Mapped Pair</span>
                               <span className="text-[8px] font-bold text-slate-400 font-mono tracking-tighter italic">REG-LINK-{i+1}</span>
                            </div>
                            <p className="text-[11px] font-black text-slate-900 uppercase tracking-tight">{m.students?.name}</p>
                            <div className="flex items-center gap-2 mt-2 pt-2 border-t border-slate-50">
                               <span className="text-[8px] font-black text-slate-300 uppercase italic">Mentor:</span>
                               <span className="text-[10px] font-bold text-slate-500 uppercase">{m.mentors?.name}</span>
                            </div>
                         </div>
                       ))}
                       {currentMappings.length === 0 && <EmptyState message="No existing mappings" />}
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default MentorshipMapping;
