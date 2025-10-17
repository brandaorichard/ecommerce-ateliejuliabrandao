import React from 'react';

export default function PeriodSelector({ period, onPeriodChange }) {
  const periods = [
    { value: 'day', label: 'Hoje' },
    { value: 'week', label: 'Semana' },
    { value: 'month', label: 'Mês' },
    { value: 'year', label: 'Ano' }
  ];

  return (
    <div className="flex gap-2 mb-6">
      {periods.map(p => (
        <button
          key={p.value}
          className={`px-4 py-2 rounded text-sm font-medium transition-all duration-200 ${
            period === p.value 
              ? 'bg-[#7a4fcf] text-white' 
              : 'bg-white text-gray-700 border border-[#e0d6f7] hover:bg-[#f7f3fa]'
          }`}
          onClick={() => onPeriodChange(p.value)}
        >
          {p.label}
        </button>
      ))}
    </div>
  );
}
