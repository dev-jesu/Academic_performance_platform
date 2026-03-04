import React, { useEffect } from 'react';
import { TrendingUp, Award, Clock, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import useStore from '../store/useStore';

const Dashboard = () => {
    const { fetchStudents, students, loading } = useStore();

    useEffect(() => {
        fetchStudents();
    }, [fetchStudents]);

    const cards = [
        { title: 'Overall CGPA', value: '8.4', icon: Award, color: '#00bfa5' },
        { title: 'Total Students', value: students.length.toString(), icon: TrendingUp, color: '#ffb300' },
        { title: 'Upcoming Exams', value: '3', icon: Clock, color: '#3d5afe' },
        { title: 'Mentee Rating', value: '4.9', icon: Star, color: '#f50057' },
    ];

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const item = {
        hidden: { y: 20, opacity: 0 },
        show: { y: 0, opacity: 1 }
    };

    return (
        <div className="space-y-8">
            {/* Summary Cards */}
            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            >
                {cards.map((card) => (
                    <motion.div
                        key={card.title}
                        variants={item}
                        whileHover={{ scale: 1.02, translateY: -5 }}
                        className="bg-[#1e1e1e]/60 backdrop-blur-lg border border-[#333] p-6 rounded-2xl shadow-lg hover:border-[#00bfa5]/40 transition-all duration-300 relative overflow-hidden group"
                    >
                        <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b" style={{ backgroundImage: `linear-gradient(to bottom, ${card.color}, transparent)` }}></div>
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-[#a0a0a0] text-sm font-medium">{card.title}</p>
                                {loading ? (
                                    <div className="h-9 w-16 bg-[#333] animate-pulse rounded-md mt-2"></div>
                                ) : (
                                    <h3 className="text-3xl font-bold mt-2">{card.value}</h3>
                                )}
                            </div>
                            <div className="p-3 rounded-xl bg-[#333]/30 group-hover:bg-[#333]/50 transition-colors" style={{ color: card.color }}>
                                <card.icon size={24} />
                            </div>
                        </div>
                    </motion.div>
                ))}
            </motion.div>

            {/* Performance Chart Placeholder */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="lg:col-span-2 bg-[#1e1e1e]/60 backdrop-blur-lg border border-[#333] p-8 rounded-2xl shadow-lg h-[400px] flex items-center justify-center relative"
                >
                    <div className="text-center">
                        <p className="text-[#a0a0a0]">Performance Distribution Chart</p>
                        <div className="mt-4 flex items-end space-x-4 h-32">
                            <div className="w-8 bg-[#00bfa5] h-full rounded-t-md opacity-20"></div>
                            <div className="w-8 bg-[#00bfa5] h-3/4 rounded-t-md opacity-40"></div>
                            <div className="w-8 bg-[#00bfa5] h-5/6 rounded-t-md opacity-60"></div>
                            <div className="w-8 bg-[#00bfa5] h-2/3 rounded-t-md opacity-80"></div>
                            <div className="w-8 bg-[#00bfa5] h-full rounded-t-md"></div>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="bg-[#1e1e1e]/60 backdrop-blur-lg border border-[#333] p-8 rounded-2xl shadow-lg"
                >
                    <h4 className="text-xl font-semibold mb-6">Recent Activities</h4>
                    <div className="space-y-6">
                        {loading ? (
                            [1, 2, 3, 4].map(i => (
                                <div key={i} className="flex space-x-4 animate-pulse">
                                    <div className="w-2 h-2 rounded-full bg-[#333] mt-2"></div>
                                    <div className="flex-1 space-y-2">
                                        <div className="h-4 bg-[#333] rounded w-3/4"></div>
                                        <div className="h-3 bg-[#333] rounded w-1/2"></div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            [1, 2, 3, 4].map(i => (
                                <div key={i} className="flex space-x-4 group cursor-default">
                                    <div className="w-2 h-2 rounded-full bg-[#00bfa5] mt-2 group-hover:scale-150 transition-transform"></div>
                                    <div>
                                        <p className="font-medium group-hover:text-[#00bfa5] transition-colors">New Assessment added</p>
                                        <p className="text-sm text-[#a0a0a0]">Mathematics - 2h ago</p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Dashboard;
