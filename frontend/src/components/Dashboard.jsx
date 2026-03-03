import React, { useEffect } from 'react';
import { TrendingUp, Award, Clock, Star } from 'lucide-react';
import useStore from '../store/useStore';

const Dashboard = () => {
    const { fetchStudents, students } = useStore();

    useEffect(() => {
        fetchStudents();
    }, [fetchStudents]);

    const cards = [
        { title: 'Overall CGPA', value: '8.4', icon: Award, color: '#00bfa5' },
        { title: 'Total Students', value: students.length.toString(), icon: TrendingUp, color: '#ffb300' },
        { title: 'Upcoming Exams', value: '3', icon: Clock, color: '#3d5afe' },
        { title: 'Mentee Rating', value: '4.9', icon: Star, color: '#f50057' },
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {cards.map((card) => (
                    <div key={card.title} className="bg-[#1e1e1e]/60 backdrop-blur-lg border border-[#333] p-6 rounded-2xl shadow-lg hover:border-[#00bfa5]/50 transition-all duration-300">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-[#a0a0a0] text-sm font-medium">{card.title}</p>
                                <h3 className="text-3xl font-bold mt-2">{card.value}</h3>
                            </div>
                            <div className="p-3 rounded-xl bg-[#333]/50" style={{ color: card.color }}>
                                <card.icon size={24} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Performance Chart Placeholder */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-[#1e1e1e]/60 backdrop-blur-lg border border-[#333] p-8 rounded-2xl shadow-lg h-[400px] flex items-center justify-center">
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
                </div>
                <div className="bg-[#1e1e1e]/60 backdrop-blur-lg border border-[#333] p-8 rounded-2xl shadow-lg">
                    <h4 className="text-xl font-semibold mb-6">Recent Activities</h4>
                    <div className="space-y-6">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="flex space-x-4">
                                <div className="w-2 h-2 rounded-full bg-[#00bfa5] mt-2"></div>
                                <div>
                                    <p className="font-medium">New Assessment added</p>
                                    <p className="text-sm text-[#a0a0a0]">Mathematics - 2h ago</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
