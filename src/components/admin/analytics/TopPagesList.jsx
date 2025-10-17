import React from 'react';

export default function TopPagesList({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white border border-[#e0d6f7] rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">📄 Páginas Mais Visitadas</h3>
        <p className="text-gray-500 text-center">Nenhum dado disponível</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-[#e0d6f7] rounded-lg p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">📄 Páginas Mais Visitadas</h3>
      
      <div className="space-y-3">
        {data.map((page, index) => (
          <div key={page._id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
            <div className="flex items-center">
              <span className="w-6 h-6 bg-[#7a4fcf] text-white text-xs font-bold rounded-full flex items-center justify-center mr-3">
                {index + 1}
              </span>
              <span className="font-mono text-sm text-gray-700 truncate">
                {page._id}
              </span>
            </div>
            <span className="text-sm font-medium text-[#7a4fcf] ml-2">
              {page.views} views
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
