import React from 'react';
import { ExternalLink, BarChart3, TrendingUp, Users, ShoppingCart } from 'lucide-react';

export default function GA4SimpleAnalytics() {
  const GA4_PROPERTY_ID = 'G-HVR2YHYHKZ';
  
  const dashboardLinks = [
    {
      title: 'Dashboard Principal',
      description: 'Visão geral de visitantes, sessões e comportamento',
      icon: <BarChart3 className="w-8 h-8" />,
      url: `https://analytics.google.com/analytics/web/#/p${GA4_PROPERTY_ID}/reports/intelligenthome`,
      color: 'bg-blue-50 border-blue-200 text-blue-600'
    },
    {
      title: 'Tempo Real',
      description: 'Usuários ativos agora e páginas sendo visualizadas',
      icon: <TrendingUp className="w-8 h-8" />,
      url: `https://analytics.google.com/analytics/web/#/p${GA4_PROPERTY_ID}/reports/reportinghub?params=_u..nav%3Dmaui`,
      color: 'bg-green-50 border-green-200 text-green-600'
    },
    {
      title: 'Dados Demográficos',
      description: 'Localização, dispositivos e dados dos usuários',
      icon: <Users className="w-8 h-8" />,
      url: `https://analytics.google.com/analytics/web/#/p${GA4_PROPERTY_ID}/reports/reportinghub?params=_u..nav%3Dmaui`,
      color: 'bg-purple-50 border-purple-200 text-purple-600'
    },
    {
      title: 'E-commerce',
      description: 'Transações, receita e produtos mais vendidos',
      icon: <ShoppingCart className="w-8 h-8" />,
      url: `https://analytics.google.com/analytics/web/#/p${GA4_PROPERTY_ID}/reports/reportinghub?params=_u..nav%3Dmaui`,
      color: 'bg-orange-50 border-orange-200 text-orange-600'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#7a4fcf] to-[#ae95d9] rounded-lg p-6 text-white">
        <h2 className="text-2xl font-semibold mb-2">Google Analytics 4</h2>
        <p className="text-sm opacity-90">
          Acesse dados completos de visitantes, comportamento e vendas diretamente no Google Analytics
        </p>
      </div>

      {/* Quick Stats Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-900 mb-2">📊 Métricas Disponíveis</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Visitantes únicos por IP/dispositivo</li>
          <li>• Localização (país, cidade, região)</li>
          <li>• Dispositivos (mobile, desktop, tablet)</li>
          <li>• Páginas mais visitadas</li>
          <li>• Funil de conversão completo</li>
          <li>• Transações e receita em tempo real</li>
        </ul>
      </div>

      {/* Dashboard Links */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {dashboardLinks.map((link, index) => (
          <a
            key={index}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`${link.color} border-2 rounded-lg p-6 hover:shadow-lg transition-all duration-200 hover:scale-105 cursor-pointer group`}
          >
            <div className="flex items-start gap-4">
              <div className={`${link.color} p-3 rounded-lg group-hover:scale-110 transition-transform`}>
                {link.icon}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg mb-1 flex items-center gap-2">
                  {link.title}
                  <ExternalLink className="w-4 h-4 opacity-50" />
                </h3>
                <p className="text-sm opacity-80">{link.description}</p>
              </div>
            </div>
          </a>
        ))}
      </div>

      {/* Instructions */}
      <div className="bg-[#f7f3fa] border border-[#e0d6f7] rounded-lg p-6">
        <h3 className="font-semibold text-gray-800 mb-3">💡 Como usar</h3>
        <ol className="text-sm text-gray-700 space-y-2 list-decimal ml-4">
          <li>Clique em qualquer card acima para abrir o Google Analytics</li>
          <li>Faça login com a conta Google configurada</li>
          <li>Explore os relatórios em tempo real</li>
          <li>Configure alertas e relatórios personalizados no GA4</li>
        </ol>
      </div>

      {/* Property Info */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-sm">
        <p className="text-gray-600">
          <strong>Property ID:</strong> {GA4_PROPERTY_ID}
        </p>
        <p className="text-gray-600 mt-1">
          <strong>Tracking Status:</strong> <span className="text-green-600 font-semibold">Ativo ✓</span>
        </p>
      </div>
    </div>
  );
}
