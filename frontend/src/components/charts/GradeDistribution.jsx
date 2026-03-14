import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

const COLORS = ["#3b82f6", "#6366f1", "#8b5cf6", "#a855f7", "#d946ef", "#f43f5e"];

function GradeDistribution({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white border border-slate-100 p-8 rounded-2xl flex items-center justify-center text-slate-500">
        No grade data available
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-xl h-[400px]">
      <h3 className="text-xl font-bold text-slate-900 mb-6">Grade Distribution</h3>
      <ResponsiveContainer width="100%" height="85%">
        <PieChart>
          <Pie
            data={data}
            dataKey="count"
            nameKey="grade"
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={5}
            stroke="none"
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
                className="hover:opacity-80 transition-opacity outline-none"
              />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', color: '#0f172a' }}
            itemStyle={{ color: '#f1f5f9' }}
          />
          <Legend 
            verticalAlign="bottom" 
            height={36} 
            formatter={(value) => <span className="text-slate-400 text-sm">{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export default GradeDistribution;