import React from 'react';

export default function OverviewCards({ data }) {
  if (!data) return null;

  const cards = [
    {
      title: 'Visitantes Únicos',
      subtitle: 'Por IP por dia',
      value: data.totalVisitors || 0,
      icon: '👥',
      color: 'text-[#7a4fcf]'
    },
    {
      title: 'Conversões',
      subtitle: 'Pedidos aprovados',
      value: data.convertedVisitors || 0,
      icon: '💰',
      color: 'text-[#7a4fcf]'
    },
    {
      title: 'Taxa Conversão',
      subtitle: 'Eficiência de vendas',
      value: `${data.conversionRate || 0}%`,
      icon: '📈',
      color: 'text-[#7a4fcf]'
    },
    {
      title: 'Dispositivos',
      subtitle: 'Distribuição',
      value: `${data.deviceStats?.length || 0} tipos`,
      icon: '📱',
      color: 'text-[#7a4fcf]'
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {cards.map((card, index) => (
        <div 
          key={index}
          className="bg-white border border-[#e0d6f7] rounded-lg p-4 text-center"
        >
          <div className="text-2xl mb-2">{card.icon}</div>
          <h3 className="text-sm font-medium text-gray-600 mb-1">{card.title}</h3>
          <span className={`text-2xl font-bold ${card.color}`}>
            {card.value}
          </span>
          <small className="block text-[10px] text-gray-500 mt-1">
            {card.subtitle}
          </small>
        </div>
      ))}
    </div>
  );
}
