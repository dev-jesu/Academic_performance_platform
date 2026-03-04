import { Plus, Trash2, Search, Edit3, UserPlus, X } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import useStore from '../store/useStore';

const StudentList = () => {
    const { students, fetchStudents, addStudent, deleteStudent, loading, error } = useStore();
    const [searchTerm, setSearchTerm] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    const [newStudent, setNewStudent] = useState({ name: '', email: '', major: '', cgpa: '' });

    useEffect(() => {
        const delaySearch = setTimeout(() => {
            fetchStudents({ q: searchTerm });
        }, 500);

        return () => clearTimeout(delaySearch);
    }, [searchTerm, fetchStudents]);

    const filteredStudents = students;

    const handleAdd = async (e) => {
        e.preventDefault();
        const loadToast = toast.loading('Adding student...');
        try {
            const success = await addStudent(newStudent);
            if (success) {
                toast.success('Student added successfully!', { id: loadToast });
                setShowAddModal(false);
                setNewStudent({ name: '', email: '', major: '', cgpa: '' });
            } else {
                toast.error('Failed to add student.', { id: loadToast });
            }
        } catch (err) {
            toast.error('Something went wrong.', { id: loadToast });
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this student?')) {
            const loadToast = toast.loading('Deleting student...');
            try {
                const success = await deleteStudent(id);
                if (success) {
                    toast.success('Student deleted.', { id: loadToast });
                } else {
                    toast.error('Failed to delete student.', { id: loadToast });
                }
            } catch (err) {
                toast.error('Something went wrong.', { id: loadToast });
            }
        }
    };

    return (
        <div className="space-y-6">
            {/* Search and Add Bar */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#a0a0a0]" size={20} />
                    <input
                        type="text"
                        placeholder="Search students..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-[#1e1e1e] border border-[#333] py-3 pl-12 pr-4 rounded-xl focus:border-[#00bfa5] focus:outline-none transition-all"
                    />
                </div>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="bg-[#00bfa5] text-white px-6 py-3 rounded-xl flex items-center space-x-2 hover:bg-[#00897b] transition-all"
                >
                    <UserPlus size={20} />
                    <span>Add Student</span>
                </button>
            </div>

            {/* Students Table */}
            <div className="bg-[#1e1e1e]/60 backdrop-blur-lg border border-[#333] rounded-2xl overflow-hidden">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-[#333]/50 text-[#a0a0a0] text-sm uppercase">
                            <th className="px-6 py-4 font-medium">Name</th>
                            <th className="px-6 py-4 font-medium">Email</th>
                            <th className="px-6 py-4 font-medium">Major</th>
                            <th className="px-6 py-4 font-medium">CGPA</th>
                            <th className="px-6 py-4 font-medium">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#333]">
                        <AnimatePresence>
                            {filteredStudents.map((student) => (
                                <motion.tr
                                    key={student.id}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="hover:bg-[#333]/30 transition-colors"
                                >
                                    <td className="px-6 py-4 font-medium">{student.name}</td>
                                    <td className="px-6 py-4 text-[#a0a0a0]">{student.email}</td>
                                    <td className="px-6 py-4">{student.major || '-'}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-md text-sm ${student.cgpa >= 8 ? 'bg-green-500/20 text-green-400' : 'bg-amber-500/20 text-amber-400'}`}>
                                            {student.cgpa || '-'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 flex space-x-3">
                                        <button className="text-[#a0a0a0] hover:text-[#00bfa5] transition-colors"><Edit3 size={18} /></button>
                                        <button onClick={() => handleDelete(student.id)} className="text-[#a0a0a0] hover:text-red-400 transition-colors"><Trash2 size={18} /></button>
                                    </td>
                                </motion.tr>
                            ))}
                        </AnimatePresence>
                    </tbody>
                </table>
                {loading && <div className="p-8 text-center text-[#a0a0a0]">Loading students...</div>}
                {!loading && filteredStudents.length === 0 && <div className="p-8 text-center text-[#a0a0a0]">No students found.</div>}
            </div>

            {/* Add Modal */}
            <AnimatePresence>
                {showAddModal && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-[#1e1e1e] border border-[#333] w-full max-w-md p-8 rounded-3xl shadow-2xl"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-2xl font-bold">New Student</h3>
                                <button onClick={() => setShowAddModal(false)} className="text-[#a0a0a0] hover:text-white transition-colors">
                                    <X size={24} />
                                </button>
                            </div>
                            <form onSubmit={handleAdd} className="space-y-4">
                                <input
                                    type="text" placeholder="Full Name" required
                                    value={newStudent.name} onChange={e => setNewStudent({ ...newStudent, name: e.target.value })}
                                    className="w-full bg-[#121212] border border-[#333] p-4 rounded-xl focus:border-[#00bfa5] outline-none transition-all"
                                />
                                <input
                                    type="email" placeholder="Email" required
                                    value={newStudent.email} onChange={e => setNewStudent({ ...newStudent, email: e.target.value })}
                                    className="w-full bg-[#121212] border border-[#333] p-4 rounded-xl focus:border-[#00bfa5] outline-none transition-all"
                                />
                                <input
                                    type="text" placeholder="Major"
                                    value={newStudent.major} onChange={e => setNewStudent({ ...newStudent, major: e.target.value })}
                                    className="w-full bg-[#121212] border border-[#333] p-4 rounded-xl focus:border-[#00bfa5] outline-none transition-all"
                                />
                                <input
                                    type="number" step="0.01" placeholder="CGPA"
                                    value={newStudent.cgpa} onChange={e => setNewStudent({ ...newStudent, cgpa: e.target.value })}
                                    className="w-full bg-[#121212] border border-[#333] p-4 rounded-xl focus:border-[#00bfa5] outline-none transition-all"
                                />
                                <div className="flex space-x-4 mt-8">
                                    <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 py-4 text-[#a0a0a0] font-medium hover:text-white transition-colors">Cancel</button>
                                    <button type="submit" className="flex-1 bg-[#00bfa5] py-4 rounded-xl font-bold hover:bg-[#00897b] transition-all">Add Student</button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default StudentList;
