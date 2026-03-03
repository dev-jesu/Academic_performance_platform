import React, { useEffect, useState } from 'react';
import { Plus, Trash2, Search, Edit3, UserPlus } from 'lucide-react';
import useStore from '../store/useStore';

const StudentList = () => {
    const { students, fetchStudents, addStudent, deleteStudent, loading, error } = useStore();
    const [searchTerm, setSearchTerm] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    const [newStudent, setNewStudent] = useState({ name: '', email: '', major: '', cgpa: '' });

    useEffect(() => {
        fetchStudents();
    }, [fetchStudents]);

    const filteredStudents = students.filter(s =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleAdd = async (e) => {
        e.preventDefault();
        const success = await addStudent(newStudent);
        if (success) {
            setShowAddModal(false);
            setNewStudent({ name: '', email: '', major: '', cgpa: '' });
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
                        {filteredStudents.map((student) => (
                            <tr key={student.id} className="hover:bg-[#333]/30 transition-colors">
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
                                    <button onClick={() => deleteStudent(student.id)} className="text-[#a0a0a0] hover:text-red-400 transition-colors"><Trash2 size={18} /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {loading && <div className="p-8 text-center text-[#a0a0a0]">Loading students...</div>}
                {!loading && filteredStudents.length === 0 && <div className="p-8 text-center text-[#a0a0a0]">No students found.</div>}
            </div>

            {/* Add Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-[#1e1e1e] border border-[#333] w-full max-w-md p-8 rounded-3xl shadow-2xl animate-in zoom-in duration-300">
                        <h3 className="text-2xl font-bold mb-6">New Student</h3>
                        <form onSubmit={handleAdd} className="space-y-4">
                            <input
                                type="text" placeholder="Full Name" required
                                value={newStudent.name} onChange={e => setNewStudent({ ...newStudent, name: e.target.value })}
                                className="w-full bg-[#121212] border border-[#333] p-4 rounded-xl focus:border-[#00bfa5] outline-none"
                            />
                            <input
                                type="email" placeholder="Email" required
                                value={newStudent.email} onChange={e => setNewStudent({ ...newStudent, email: e.target.value })}
                                className="w-full bg-[#121212] border border-[#333] p-4 rounded-xl focus:border-[#00bfa5] outline-none"
                            />
                            <input
                                type="text" placeholder="Major"
                                value={newStudent.major} onChange={e => setNewStudent({ ...newStudent, major: e.target.value })}
                                className="w-full bg-[#121212] border border-[#333] p-4 rounded-xl focus:border-[#00bfa5] outline-none"
                            />
                            <input
                                type="number" step="0.01" placeholder="CGPA"
                                value={newStudent.cgpa} onChange={e => setNewStudent({ ...newStudent, cgpa: e.target.value })}
                                className="w-full bg-[#121212] border border-[#333] p-4 rounded-xl focus:border-[#00bfa5] outline-none"
                            />
                            <div className="flex space-x-4 mt-8">
                                <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 py-4 text-[#a0a0a0] font-medium">Cancel</button>
                                <button type="submit" className="flex-1 bg-[#00bfa5] py-4 rounded-xl font-bold">Add Student</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StudentList;
