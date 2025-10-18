import React from 'react';

export default function LoadingSpinner() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f9e7f6]">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7a4fcf] mx-auto mb-4"></div>
        <p className="text-[#7a4fcf] text-lg font-medium">Carregando...</p>
        <p className="text-gray-600 text-sm mt-2">Preparando sua experiência</p>
      </div>
    </div>
  );
}
