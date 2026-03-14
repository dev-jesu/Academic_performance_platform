import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Cell
} from "recharts";

function StudentPerformanceChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white border border-slate-100 p-8 rounded-2xl flex items-center justify-center text-slate-500">
        No performance data available
      </div>
    );
  }

  // Format data for the chart - we want to show marks for PT1, PT2, Semester
  // Our backend returns: { course, pt1, pt2, semester, grade }
  // Let's create a chart that shows these scores per course
  // Format and shorten names for better display
  const chartData = data.map(item => ({
    name: item.course.length > 20 ? item.course.substring(0, 18) + '...' : item.course,
    fullName: item.course,
    Marks: item.final_score || 0,
  }));

  return (
    <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-xl min-h-[500px]">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-xl font-black text-slate-800 tracking-tight uppercase">Performance Distribution</h3>
        <div className="flex items-center gap-2">
           <div className="w-3 h-3 bg-indigo-500 rounded-full" />
           <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Percentage %</span>
        </div>
      </div>
      
      <ResponsiveContainer width="100%" height={chartData.length * 45 + 100}>
        <BarChart 
          data={chartData} 
          layout="vertical" 
          margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={true} vertical={false} />
          <XAxis 
            type="number" 
            domain={[0, 100]} 
            hide 
          />
          <YAxis 
            dataKey="name" 
            type="category" 
            width={120}
            stroke="#94a3b8" 
            fontSize={10} 
            fontWeight="900"
            tickLine={false}
            axisLine={false}
            tick={{ fill: '#64748b' }}
          />
          <Tooltip 
            cursor={{ fill: '#f8fafc' }}
            contentStyle={{ backgroundColor: '#ffffff', border: 'none', borderRadius: '16px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', color: '#0f172a' }}
            formatter={(value, name, props) => [`${value}%`, `Subject: ${props.payload.fullName}`]}
            labelStyle={{ display: 'none' }}
          />
          <Bar 
            dataKey="Marks" 
            radius={[0, 10, 10, 0]} 
            barSize={24}
          >
            {chartData.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={entry.Marks >= 75 ? '#6366f1' : entry.Marks >= 50 ? '#818cf8' : '#94a3b8'} 
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default StudentPerformanceChart;