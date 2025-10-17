import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

export default function DeviceChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white border border-[#e0d6f7] rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">📱 Dispositivos</h3>
        <p className="text-gray-500 text-center">Nenhum dado disponível</p>
      </div>
    );
  }

  const total = data.reduce((sum, item) => sum + item.count, 0);
  
  const chartData = data.map(item => ({
    name: item._id === 'desktop' ? 'Desktop' :
          item._id === 'mobile' ? 'Mobile' :
          item._id === 'tablet' ? 'Tablet' : item._id,
    value: item.count,
    percentage: Math.round((item.count / total) * 100)
  }));

  const COLORS = ['#7a4fcf', '#ae95d9', '#d4c2f0'];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="bg-white p-3 border border-gray-200 rounded shadow-lg">
          <p className="font-medium">{data.name}</p>
          <p className="text-sm text-gray-600">
            {data.value} visitantes ({data.payload.percentage}%)
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white border border-[#e0d6f7] rounded-lg p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">📱 Dispositivos</h3>
      
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percentage }) => `${name} ${percentage}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-4 space-y-2">
        {chartData.map((item, index) => (
          <div key={item.name} className="flex items-center justify-between text-sm">
            <div className="flex items-center">
              <div 
                className="w-3 h-3 rounded-full mr-2" 
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              />
              <span className="text-gray-700">{item.name}</span>
            </div>
            <span className="font-medium text-gray-800">
              {item.value} ({item.percentage}%)
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
