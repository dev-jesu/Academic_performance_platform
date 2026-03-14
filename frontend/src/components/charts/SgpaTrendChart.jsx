import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

const SgpaTrendChart = ({ semesters }) => {
  // Sort semesters in ascending order for trend
  const sortedData = [...semesters]
    .sort((a, b) => a.semester - b.semester)
    .map((s) => ({
      name: `Sem ${s.semester}`,
      SGPA: s.sgpa || 0,
    }));

  return (
    <div className="bg-slate-900 border border-slate-800 p-8 rounded-[2rem] shadow-2xl relative overflow-hidden h-[400px]">
      <div className="relative z-10 mb-8">
        <h3 className="text-xl font-black text-white tracking-tight uppercase">SGPA Progression Trend</h3>
        <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mt-1 italic">Historical Semester Performance</p>
      </div>

      <div className="h-[250px] relative z-10">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={sortedData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <XAxis 
              dataKey="name" 
              stroke="#64748b" 
              fontSize={10} 
              fontWeight="900"
              tickLine={false}
              axisLine={false}
              dy={10}
            />
            <YAxis 
              stroke="#64748b" 
              fontSize={10} 
              fontWeight="900"
              tickLine={false}
              axisLine={false}
              domain={[0, 10]}
            />
            <Tooltip 
              cursor={false}
              contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '16px', color: '#f8fafc' }}
              itemStyle={{ color: '#818cf8', fontWeight: '900' }}
            />
            <Bar 
              dataKey="SGPA" 
              radius={[10, 10, 0, 0]} 
              barSize={45}
              isAnimationActive={false}
            >
              {sortedData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.SGPA >= 8 ? '#6366f1' : '#818cf8'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SgpaTrendChart;
