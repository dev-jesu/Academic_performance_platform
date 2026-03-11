import React, { useEffect } from 'react';
import { TrendingUp, Award, Clock, Star, ArrowUpRight, ChevronRight, Activity } from 'lucide-react';
import { motion } from 'framer-motion';
import useStore from '../store/useStore';
import Card from './ui/Card';
import Button from './ui/Button';
import Skeleton from './ui/Skeleton';

const Dashboard = () => {
    const { fetchStudents, students, isStudentsLoading, user } = useStore();

    useEffect(() => {
        if ((user?.role === 'admin' || user?.role === 'mentor') && students.length === 0 && !isStudentsLoading) {
            fetchStudents();
        }
    }, [fetchStudents, user, students.length, isStudentsLoading]);

    const stats = {
        admin: [
            { title: 'Avg CGPA', value: '8.4', subtitle: 'Global Average', icon: Award, color: 'text-indigo-600', bg: 'bg-indigo-50' },
            { title: 'Total Students', value: students.length.toString(), subtitle: 'Live Enrollment', icon: Users, color: 'text-emerald-600', bg: 'bg-emerald-50' },
            { title: 'Staff Active', value: '24', subtitle: 'Mentors Online', icon: Activity, color: 'text-blue-600', bg: 'bg-blue-50' },
            { title: 'System Alerts', value: '2', subtitle: 'Action Required', icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
        ],
        mentor: [
            { title: 'Mentees', value: '12', subtitle: 'Direct Assign', icon: Award, color: 'text-indigo-600', bg: 'bg-indigo-50' },
            { title: 'Avg Performance', value: '8.9', subtitle: 'Mentee Avg', icon: Users, color: 'text-emerald-600', bg: 'bg-emerald-50' },
            { title: 'Meetings', value: '4', subtitle: 'Next 3 Days', icon: Activity, color: 'text-blue-600', bg: 'bg-blue-50' },
            { title: 'Pending Tasks', value: '5', subtitle: 'Reports Due', icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
        ],
        student: [
            { title: 'Your CGPA', value: '8.2', subtitle: 'Latest Result', icon: Award, color: 'text-indigo-600', bg: 'bg-indigo-50' },
            { title: 'Courses', value: '6', subtitle: 'Current Sem', icon: BookOpen, color: 'text-emerald-600', bg: 'bg-emerald-50' },
            { title: 'Attendance', value: '94%', subtitle: 'Present Days', icon: Activity, color: 'text-blue-600', bg: 'bg-blue-50' },
            { title: 'Deadlines', value: '3', subtitle: 'Active Tasks', icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
        ]
    };

    const currentStats = stats[user?.role || 'student'];

    return (
        <div className="space-y-12">
            {/* Header Content */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div>
                    <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                        {user?.role === 'admin' ? 'Administrative Control' : (user?.role === 'mentor' ? 'Mentorship Dashboard' : 'Academic Pulse')}
                    </h2>
                    <p className="text-slate-500 mt-1 font-medium italic">"Education is the most powerful weapon which you can use to change the world."</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="text-xs">Download Report</Button>
                    <Button variant="accent" className="text-xs">Update Records</Button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {currentStats.map((stat, i) => (
                    <Card key={i} className="flex flex-col justify-between group overflow-hidden relative">
                        {/* Decorative circle */}
                        <div className={`absolute -right-6 -top-6 w-24 h-24 ${stat.bg} rounded-full opacity-50 group-hover:scale-110 transition-transform duration-500`} />

                        <div className="flex justify-between items-start mb-6 relative z-10">
                            <div className={`p-4 rounded-2xl ${stat.bg} ${stat.color}`}>
                                <stat.icon size={24} />
                            </div>
                            <div className="flex items-center text-[10px] font-black uppercase text-slate-400 tracking-widest bg-slate-50 px-2 py-1 rounded-md">
                                Updated
                            </div>
                        </div>

                        <div className="relative z-10">
                            <h3 className="text-4xl font-extrabold text-slate-900 tracking-tighter">
                                {isStudentsLoading ? <Skeleton width="60px" height="40px" /> : stat.value}
                            </h3>
                            <p className="text-sm font-bold text-slate-900 mt-1">{stat.title}</p>
                            <p className="text-xs text-slate-500 font-medium">{stat.subtitle}</p>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Main Visuals Section */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
                {/* Performance Chart Placeholder */}
                <Card hover={false} className="xl:col-span-2 p-10 min-h-[450px] flex flex-col">
                    <div className="flex justify-between items-center mb-12">
                        <div>
                            <h4 className="text-xl font-bold text-slate-900 tracking-tight">Semester Progress</h4>
                            <p className="text-xs text-slate-500 font-medium">Average Grade Distribution 2024</p>
                        </div>
                        <select className="bg-slate-50 border-none text-xs font-bold text-slate-700 py-2 px-4 rounded-xl outline-none ring-1 ring-slate-100">
                            <option>Last 6 Months</option>
                            <option>Last Academic Year</option>
                        </select>
                    </div>

                    <div className="flex-1 flex items-end justify-between px-10 gap-6">
                        {[65, 40, 85, 70, 50, 95, 60].map((h, i) => (
                            <div key={i} className="flex-1 flex flex-col items-center gap-4 group">
                                <motion.div
                                    initial={{ height: 0 }}
                                    animate={{ height: `${h}%` }}
                                    transition={{ duration: 1, delay: i * 0.1 }}
                                    className={`w-full max-w-[40px] rounded-2xl ${i === 5 ? 'bg-indigo-600' : 'bg-slate-100 group-hover:bg-slate-200'} transition-colors relative`}
                                >
                                    <div className={`absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 rounded text-[10px] font-bold ${i === 5 ? 'bg-slate-900 text-white' : 'bg-white border border-slate-100 text-slate-400 shadow-sm'} opacity-0 group-hover:opacity-100 transition-opacity`}>
                                        {h}
                                    </div>
                                </motion.div>
                                <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest leading-none">{['M', 'T', 'W', 'T', 'F', 'S', 'S'][i]}</span>
                            </div>
                        ))}
                    </div>
                </Card>

                {/* Notifications / Feed */}
                <div className="space-y-8">
                    <div className="flex justify-between items-center">
                        <h4 className="text-sm font-black uppercase tracking-[0.2em] text-slate-400">Activity Stream</h4>
                        <button className="text-xs font-bold text-indigo-600 hover:underline">Clear</button>
                    </div>

                    <div className="space-y-1">
                        {[
                            { title: 'Assignment Graded', time: '10m', type: 'Physics', icon: '📝' },
                            { title: 'Meeting Scheduled', time: '1h', type: 'Mentorship', icon: '📅' },
                            { title: 'New Course Enrollment', time: '3h', type: 'Computer Science', icon: '🎓' },
                            { title: 'System Security Patch', time: '1d', type: 'IT Ops', icon: '🛡️' }
                        ].map((act, i) => (
                            <div key={i} className="flex items-center gap-5 p-4 rounded-2xl hover:bg-white hover:border-slate-200 border border-transparent transition-all group">
                                <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
                                    {act.icon}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h5 className="text-sm font-bold text-slate-900 truncate tracking-tight">{act.title}</h5>
                                    <p className="text-[11px] text-slate-500 font-medium truncate italic">{act.type} • {act.time} ago</p>
                                </div>
                                <ChevronRight className="text-slate-300 group-hover:text-indigo-600 transition-colors" size={16} />
                            </div>
                        ))}
                    </div>

                    <Button variant="ghost" className="w-full text-slate-400 text-xs font-bold tracking-widest uppercase">
                        Expand Feed
                    </Button>
                </div>
            </div>
        </div>
    );
};

const Users = ({ size, className }) => <UsersIcon size={size} className={className} />;
import { Users as UsersIcon } from 'lucide-react';

export default Dashboard;
