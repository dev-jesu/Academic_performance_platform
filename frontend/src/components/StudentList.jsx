import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Search, Edit3, UserPlus, X, Filter, ChevronLeft, ChevronRight, MoreVertical } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import useStore from '../store/useStore';
import Button from './ui/Button';
import Card from './ui/Card';
import Input from './ui/Input';
import Skeleton from './ui/Skeleton';

const StudentList = () => {
    const { students, fetchStudents, addStudent, deleteStudent, isStudentsLoading } = useStore();
    const [searchTerm, setSearchTerm] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    const [newStudent, setNewStudent] = useState({ name: '', email: '', major: '', cgpa: '' });

    useEffect(() => {
        const delaySearch = setTimeout(() => {
            fetchStudents({ q: searchTerm });
        }, 500);

        return () => clearTimeout(delaySearch);
    }, [searchTerm, fetchStudents]);

    const handleAdd = async (e) => {
        e.preventDefault();
        const loadToast = toast.loading('Synchronizing records...');
        try {
            const success = await addStudent(newStudent);
            if (success) {
                toast.success('Successfully added to database.', { id: loadToast });
                setShowAddModal(false);
                setNewStudent({ name: '', email: '', major: '', cgpa: '' });
            } else {
                toast.error('Could not sync record.', { id: loadToast });
            }
        } catch (err) {
            toast.error('Network protocol error.', { id: loadToast });
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('This action will permanently delete this record. Continue?')) {
            const loadToast = toast.loading('Removing record...');
            try {
                const success = await deleteStudent(id);
                if (success) {
                    toast.success('Record purged.', { id: loadToast });
                } else {
                    toast.error('Delete failed.', { id: loadToast });
                }
            } catch (err) {
                toast.error('System failure.', { id: loadToast });
            }
        }
    };

    return (
        <div className="space-y-12 pb-20">
            {/* Action Bar */}
            <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-8 bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-soft">
                <div className="w-full xl:w-1/2">
                    <Input
                        placeholder="Search student directories by name, email or academic status..."
                        icon={Search}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="bg-slate-50 border-none rounded-2xl h-14"
                    />
                </div>
                <div className="flex items-center gap-4 w-full xl:w-auto">
                    <Button variant="outline" className="flex-1 xl:flex-none py-4 border-slate-100 text-xs tracking-widest uppercase text-slate-400">
                        <Filter size={18} className="mr-2" />
                        Filters
                    </Button>
                    <Button
                        variant="accent"
                        className="flex-1 xl:flex-none py-4 px-10 shadow-indigo-100"
                        onClick={() => setShowAddModal(true)}
                    >
                        <UserPlus size={20} className="mr-3" />
                        Onboard Student
                    </Button>
                </div>
            </div>

            {/* Content Display */}
            <Card hover={false} className="p-0 overflow-hidden border-slate-100 shadow-premium bg-white">
                <div className="overflow-x-auto">
                    <table className="w-full text-left min-w-[1000px]">
                        <thead>
                            <tr className="bg-slate-50 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 border-b border-slate-100">
                                <th className="px-10 py-6">Unique Identity</th>
                                <th className="px-10 py-6">Academic Program</th>
                                <th className="px-10 py-6">Grading Status</th>
                                <th className="px-10 py-6 text-right">Management</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            <AnimatePresence mode='popLayout'>
                                {isStudentsLoading ? (
                                    [...Array(5)].map((_, i) => (
                                        <tr key={`skeleton-${i}`} className="border-b border-slate-50">
                                            <td className="px-10 py-8">
                                                <div className="flex items-center gap-5">
                                                    <Skeleton variant="circle" width="56px" height="56px" />
                                                    <div className="space-y-2">
                                                        <Skeleton width="120px" height="20px" />
                                                        <Skeleton width="180px" height="12px" />
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-10 py-8"><Skeleton width="100px" height="24px" /></td>
                                            <td className="px-10 py-8">
                                                <div className="flex items-center gap-4">
                                                    <Skeleton width="40px" height="32px" />
                                                    <Skeleton className="flex-1" height="6px" />
                                                </div>
                                            </td>
                                            <td className="px-10 py-8 text-right"><Skeleton width="80px" height="40px" className="ml-auto" /></td>
                                        </tr>
                                    ))
                                ) : (
                                    students.map((student, index) => (
                                        <motion.tr
                                            key={student.id}
                                            initial={{ opacity: 0, y: 5 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, scale: 0.98 }}
                                            transition={{ delay: index * 0.03 }}
                                            className="hover:bg-slate-50/50 transition-colors group"
                                        >
                                            <td className="px-10 py-8">
                                                <div className="flex items-center gap-5">
                                                    <div className="w-14 h-14 rounded-2xl bg-slate-900 flex items-center justify-center text-white font-black text-xl shadow-lg ring-8 ring-slate-50 group-hover:ring-indigo-50 group-hover:bg-indigo-600 transition-all">
                                                        {student.name[0]}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-slate-900 text-lg group-hover:text-indigo-600 transition-colors tracking-tight leading-tight">{student.name}</p>
                                                        <p className="text-xs text-slate-400 font-medium mt-0.5">{student.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-10 py-8">
                                                <div className="flex flex-col">
                                                    <span className="text-slate-900 font-bold tracking-tight text-sm px-3 py-1 bg-slate-100 rounded-lg inline-block w-fit">
                                                        {student.major || 'Undeclared'}
                                                    </span>
                                                    <span className="text-[10px] font-black uppercase text-slate-300 tracking-[0.1em] mt-2">Bachelor of Science</span>
                                                </div>
                                            </td>
                                            <td className="px-10 py-8">
                                                <div className="flex items-center gap-4">
                                                    <div className={`text-sm font-black px-4 py-2 rounded-xl tabular-nums ${student.cgpa >= 8 ? 'bg-emerald-50 text-emerald-600' : 'bg-indigo-50 text-indigo-600'}`}>
                                                        {student.cgpa?.toFixed(2) || '0.00'}
                                                    </div>
                                                    <div className="flex-1 w-32 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                                        <motion.div
                                                            initial={{ width: 0 }}
                                                            animate={{ width: `${(student.cgpa / 10) * 100}%` }}
                                                            className={`h-full ${student.cgpa >= 8 ? 'bg-emerald-500' : 'bg-indigo-500'}`}
                                                        />
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-10 py-8 text-right">
                                                <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button className="p-3 text-slate-400 hover:text-slate-900 hover:bg-slate-200 rounded-xl transition-all"><Edit3 size={18} /></button>
                                                    <button onClick={() => handleDelete(student.id)} className="p-3 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"><Trash2 size={18} /></button>
                                                </div>
                                                <button className="p-3 text-slate-300 group-hover:hidden"><MoreVertical size={18} /></button>
                                            </td>
                                        </motion.tr>
                                    ))
                                )}
                            </AnimatePresence>
                        </tbody>
                    </table>
                </div>

                {!isStudentsLoading && students.length === 0 && (
                    <div className="p-24 text-center">
                        <p className="text-xl font-bold text-slate-900 tracking-tight">No Results Found</p>
                        <p className="text-sm text-slate-500 mt-2">We couldn't find any records for "{searchTerm}"</p>
                    </div>
                )}

                <div className="px-10 py-6 bg-slate-50 flex justify-between items-center border-t border-slate-100">
                    <p className="text-xs font-medium text-slate-500">Showing {students.length} results of 11,400</p>
                    <div className="flex gap-2">
                        <Button variant="outline" className="p-2 rounded-lg border-slate-200"><ChevronLeft size={16} /></Button>
                        <Button variant="outline" className="p-2 rounded-lg border-slate-200"><ChevronRight size={16} /></Button>
                    </div>
                </div>
            </Card>

            {/* Add Modal */}
            <AnimatePresence>
                {showAddModal && (
                    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] flex items-center justify-center p-6">
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="bg-white border border-white/20 w-full max-w-2xl p-12 rounded-[3.5rem] shadow-2xl relative overflow-hidden"
                        >
                            {/* Decorative blur */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full blur-[100px] -z-10 opacity-60"></div>

                            <div className="flex justify-between items-start mb-12">
                                <div>
                                    <h3 className="text-3xl font-black text-slate-900 tracking-tighter">Onboard New Talent</h3>
                                    <p className="text-slate-500 mt-2 font-medium italic">"The foundation of every state is the education of its youth."</p>
                                </div>
                                <button onClick={() => setShowAddModal(false)} className="p-3 bg-slate-50 text-slate-400 hover:text-slate-900 rounded-2xl transition-colors">
                                    <X size={24} />
                                </button>
                            </div>

                            <form onSubmit={handleAdd} className="space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <Input
                                        label="Personal Identity" placeholder="e.g. Marie Curie" required
                                        value={newStudent.name} onChange={e => setNewStudent({ ...newStudent, name: e.target.value })}
                                    />
                                    <Input
                                        label="Secure Communication" placeholder="e.g. marie@radium.com" type="email" required
                                        value={newStudent.email} onChange={e => setNewStudent({ ...newStudent, email: e.target.value })}
                                    />
                                    <Input
                                        label="Academic Major" placeholder="e.g. Nuclear Physics"
                                        value={newStudent.major} onChange={e => setNewStudent({ ...newStudent, major: e.target.value })}
                                    />
                                    <Input
                                        label="GPA Evaluation (0.0 - 10.0)" placeholder="0.00" type="number" step="0.01"
                                        value={newStudent.cgpa} onChange={e => setNewStudent({ ...newStudent, cgpa: e.target.value })}
                                    />
                                </div>
                                <div className="flex gap-4 pt-6">
                                    <Button variant="ghost" className="flex-1 py-4" type="button" onClick={() => setShowAddModal(false)}>Cancel Action</Button>
                                    <Button variant="accent" className="flex-[2] py-4 shadow-indigo-200" type="submit">Complete Onboarding</Button>
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
