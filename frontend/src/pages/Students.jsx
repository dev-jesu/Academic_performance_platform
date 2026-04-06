import { useEffect, useState } from "react";
import DashboardLayout from "../components/layout/DashboardLayout";
import api from "../api/apiClient";
import adminService from "../services/adminService";

function Students() {

  const [students, setStudents] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    department: "CSE",
    year: 1,
    semester_id: 1,
    password: "student123"
  });
  const [loading, setLoading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const handleDeleteStudent = async (studentId) => {
    try {
      await adminService.deleteStudent(studentId);
      setStudents(students.filter(s => s.id !== studentId));
      setDeleteConfirm(null);
    } catch (err) {
      console.error(err);
      alert("Failed to delete student: " + (err.response?.data?.detail || err.message));
      setDeleteConfirm(null);
    }
  };

  const getRomanYear = (year) => {
    const roman = { 1: "I", 2: "II", 3: "III" };
    return roman[year] || year;
  };

  useEffect(() => {

    const fetchStudents = async () => {

      try {

        const res = await api.get("/students");

        setStudents(res.data);

      } catch (error) {

        console.error("Error fetching students:", error);

      }

    };

    fetchStudents();

  }, []);

  const handleCreateStudent = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await adminService.createStudent(formData);
      alert("Student created successfully!");
      setShowAddForm(false);
      setFormData({
        name: "",
        email: "",
        department: "CSE",
        year: 1,
        semester_id: 1,
        password: "student123"
      });
      // Refresh list
      const res = await api.get("/students");
      setStudents(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to create student: " + (err.response?.data?.detail || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleYearChange = (year) => {
    const semMap = { 1: 1, 2: 3, 3: 5 };
    setFormData({ ...formData, year: parseInt(year), semester_id: semMap[year] || 1 });
  };

  const totalPages = Math.ceil(students.length / itemsPerPage);
  const indexOfLastStudent = currentPage * itemsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - itemsPerPage;
  const currentStudents = students.slice(indexOfFirstStudent, indexOfLastStudent);

  const prevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const nextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  return (

    <DashboardLayout title="Student Directory">
      <div className="space-y-10 w-full max-w-[1400px] mx-auto">
         <div className="glass-card p-10 flex items-center justify-between bg-white">
            <div>
               <h3 className="text-2xl font-black text-slate-900 tracking-tight uppercase">Academic Cohort</h3>
               <p className="text-slate-500 text-sm font-medium mt-1">Comprehensive list of all registered student identities.</p>
            </div>
            <div className="flex items-center gap-4">
               <div className="bg-indigo-500/10 border border-indigo-500/20 px-5 py-2.5 rounded-xl">
                  <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">{students.length} Records Detected</span>
               </div>
               <button 
                onClick={() => setShowAddForm(!showAddForm)}
                className="btn-primary px-6 py-2.5 text-[10px] font-black uppercase tracking-widest"
               >
                {showAddForm ? "Close Form" : "Add Student"}
               </button>
            </div>
         </div>

         {showAddForm && (
           <div className="glass-card p-10 bg-white border-indigo-500/20 animate-in fade-in duration-500">
             <h3 className="text-xl font-black text-slate-900 mb-8 uppercase tracking-tight">Register New Student</h3>
             <form onSubmit={handleCreateStudent} className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Full Name</label>
                  <input 
                    type="text" 
                    required
                    className="input-field h-12 px-4 text-sm font-bold"
                    placeholder="Enter full name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Email Address</label>
                  <input 
                    type="email" 
                    required
                    className="input-field h-12 px-4 text-sm font-bold"
                    placeholder="student@college.edu"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Department</label>
                  <select 
                    className="input-field h-12 px-4 text-sm font-bold"
                    value={formData.department}
                    onChange={(e) => setFormData({...formData, department: e.target.value})}
                  >
                    <option value="CSE">CSE</option>
                    <option value="MECH">MECH</option>
                    <option value="CIVIL">CIVIL</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Academic Year</label>
                  <select 
                    className="input-field h-12 px-4 text-sm font-bold"
                    value={formData.year}
                    onChange={(e) => handleYearChange(e.target.value)}
                  >
                    <option value={1}>1st Year (Sem 1)</option>
                    <option value={2}>2nd Year (Sem 3)</option>
                    <option value={3}>3rd Year (Sem 5)</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Default Password</label>
                  <input 
                    type="text" 
                    required
                    className="input-field h-12 px-4 text-sm font-bold"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                  />
                </div>
                <div className="flex items-end">
                  <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full btn-primary h-12 text-[10px] font-black uppercase tracking-widest shadow-lg shadow-indigo-500/20"
                  >
                    {loading ? "Registering..." : "Finalize Registration"}
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
                  <th className="table-header">Student Name</th>
                  <th className="table-header">Department</th>
                  <th className="table-header">Email</th>
                  <th className="table-header">Roll No</th>
                  <th className="table-header">Year</th>
                  <th className="table-header text-right">CGPA</th>
                  <th className="table-header text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {currentStudents.map((student) => (
                  <tr key={student.id} className="table-row group">
                    <td className="px-8 py-6">
                      <span className="font-mono font-bold text-indigo-400 opacity-60">#{student.id}</span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                         <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 font-black text-xs group-hover:border-indigo-500/30 transition-all">
                            {student.name[0]}
                         </div>
                         <span className="text-sm font-black text-slate-900 group-hover:text-indigo-400 transition-colors uppercase tracking-tight">{student.name}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className="px-3 py-1 rounded-lg bg-indigo-50 border border-indigo-100 text-[10px] font-black text-indigo-600 uppercase tracking-widest">
                        {student.department}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <span className="text-sm font-bold text-slate-600">{student.email}</span>
                    </td>
                    <td className="px-8 py-6">
                      <span className="text-sm font-black text-indigo-600 font-mono underline decoration-indigo-500/30 underline-offset-4 bg-indigo-50 px-2 py-0.5 rounded-md">{student.roll_no || 'N/A'}</span>
                    </td>
                    <td className="px-8 py-6">
                      <span className="px-3 py-1 rounded-lg bg-indigo-50 border border-indigo-100 text-[10px] font-black text-indigo-600 uppercase tracking-widest">
                        Year {getRomanYear(student.year)}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right">
                       <span className="text-lg font-black text-slate-900">{student.final_cgpa?.toFixed(2) || '0.00'}</span>
                       <span className="text-[10px] font-black text-slate-300 ml-1">/10</span>
                    </td>
                    <td className="px-8 py-6 text-center">
                       <button
                         onClick={() => setDeleteConfirm(student)}
                         className="px-3 py-1.5 rounded-lg bg-red-50 border border-red-100 text-[10px] font-black text-red-500 uppercase tracking-widest hover:bg-red-100 transition-colors"
                       >
                         Delete
                       </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {totalPages > 1 && (
          <div className="flex justify-between items-center mt-6">
            <button 
              onClick={prevPage} 
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-colors ${currentPage === 1 ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100'}`}
            >
              Previous
            </button>
            <span className="text-xs font-bold text-slate-500">
              Page {currentPage} of {totalPages}
            </span>
            <button 
              onClick={nextPage} 
              disabled={currentPage === totalPages}
              className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-colors ${currentPage === totalPages ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100'}`}
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-10 max-w-md w-full mx-4 shadow-2xl">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">⚠️</span>
              </div>
              <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight mb-2">Confirm Deletion</h3>
              <p className="text-sm text-slate-500 mb-8">
                Are you sure you want to delete <strong className="text-slate-900">{deleteConfirm.name}</strong>? This will permanently remove all their academic records, enrollments, and assessments.
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="flex-1 px-6 py-3 rounded-xl border border-slate-200 text-sm font-black text-slate-600 uppercase tracking-widest hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeleteStudent(deleteConfirm.id)}
                  className="flex-1 px-6 py-3 rounded-xl bg-red-500 text-sm font-black text-white uppercase tracking-widest hover:bg-red-600 transition-colors shadow-lg shadow-red-500/20"
                >
                  Yes, Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>

  );

}

export default Students;