import React from 'react';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const COLORS = ['#10b981', '#f59e0b', '#ef4444', '#3b82f6']; // Emerald, Amber, Red, Blue

const AnalyticsChart = ({ type, data, title, height = 300 }) => {

  const renderChart = () => {
    // Show a message if no data is available
    if (!data || data.length === 0 || data.every(item => item.value === 0)) {
      return <div className="text-white/40 flex items-center justify-center h-full">No data available to display chart.</div>;
    }

    if (type === 'area') {
      return (
        <ResponsiveContainer width="100%" height={height} minWidth={100} minHeight={100}>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
            <YAxis stroke="#94a3b8" fontSize={12} />
            <Tooltip
              contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#fff' }}
              itemStyle={{ color: '#10b981' }}
            />
            <Area type="monotone" dataKey="value" stroke="#10b981" fillOpacity={1} fill="url(#colorValue)" />
          </AreaChart>
        </ResponsiveContainer>
      );
    }

    if (type === 'bar') {
      return (
        <ResponsiveContainer width="100%" height={height} minWidth={100} minHeight={100}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
            <YAxis stroke="#94a3b8" fontSize={12} />
            <Tooltip
              cursor={{ fill: '#334155', opacity: 0.4 }}
              contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#fff' }}
            />
            <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      );
    }

    if (type === 'pie') {
      return (
        <ResponsiveContainer width="100%" height={height} minWidth={100} minHeight={100}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
              nameKey="name"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#fff' }} />
            <Legend verticalAlign="bottom" height={36} wrapperStyle={{ color: '#94a3b8' }} />
          </PieChart>
        </ResponsiveContainer>
      );
    }
  };

  return (
    <div className="flex flex-col h-full w-full">
      <h3 className="text-lg font-semibold text-white/90 mb-4">{title}</h3>
      <div style={{ width: '100%', height: height, minHeight: 200 }} className="flex-1">
        {renderChart()}
      </div>
    </div>
  );
};

export default AnalyticsChart;