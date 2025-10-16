import React from 'react';

const paymentStatusConfig = {
  'pagamento_pendente': {
    label: 'Pagamento Pendente',
    bgColor: 'bg-yellow-100',
    textColor: 'text-yellow-800',
    borderColor: 'border-yellow-300',
    icon: '⏱'
  },
  'pago': {
    label: 'Pagamento Aprovado',
    bgColor: 'bg-green-100',
    textColor: 'text-green-800',
    borderColor: 'border-green-300',
    icon: '✓'
  },
  'pagamento_rejeitado': {
    label: 'Pagamento Recusado',
    bgColor: 'bg-red-100',
    textColor: 'text-red-800',
    borderColor: 'border-red-300',
    icon: '✕'
  },
  'cancelado': {
    label: 'Cancelado',
    bgColor: 'bg-gray-100',
    textColor: 'text-gray-800',
    borderColor: 'border-gray-300',
    icon: '⊘'
  }
};

export default function PaymentStatusBadge({ paymentStatus, size = 'normal' }) {
  const config = paymentStatusConfig[paymentStatus] || paymentStatusConfig['pagamento_pendente'];
  
  const sizeClasses = {
    small: 'px-1.5 py-0.5 text-[10px] md:px-2 md:py-1 md:text-xs',
    normal: 'px-2 py-1 text-xs md:px-3 md:py-1.5 md:text-sm',
    large: 'px-3 py-1.5 text-sm md:px-4 md:py-2 md:text-base'
  };

  return (
    <span
      className={`
        inline-flex items-center gap-0.5 md:gap-1 rounded-full border font-medium
        ${config.bgColor} ${config.textColor} ${config.borderColor}
        ${sizeClasses[size]}
      `}
    >
      <span className="text-[10px] md:text-xs">{config.icon}</span>
      {config.label}
    </span>
  );
}
