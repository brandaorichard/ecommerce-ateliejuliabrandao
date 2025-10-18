import React from 'react';
import { Helmet } from 'react-helmet-async';
import SEOHead from '../components/SEO/SEOHead';
import { RefreshCw, Package, Clock, CheckCircle } from 'lucide-react';

export default function PoliticaTrocasPage() {
  return (
    <>
      <SEOHead 
        title="Política de Trocas e Devoluções"
        description="Política de trocas, devoluções e garantias do Ateliê Júlia Brandão"
        keywords="política trocas, devoluções, garantia, troca produtos"
      />
      
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <RefreshCw className="w-8 h-8 text-[#7a4fcf]" />
              <h1 className="text-2xl font-bold text-gray-900">
                Política de Trocas e Devoluções
              </h1>
            </div>
            <p className="text-gray-600">
              Última atualização: {new Date().toLocaleDateString('pt-BR')}
            </p>
          </div>

          {/* Conteúdo */}
          <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Package className="w-5 h-5 text-[#7a4fcf]" />
                1. Prazo para Trocas
              </h2>
              <p className="text-gray-700 leading-relaxed">
                Você tem <strong>7 dias corridos</strong> a partir do recebimento do produto 
                para solicitar troca ou devolução, conforme o Código de Defesa do Consumidor.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-[#7a4fcf]" />
                2. Condições para Troca
              </h2>
              <div className="space-y-3">
                <p className="text-gray-700">O produto deve estar:</p>
                <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                  <li>Em perfeito estado de conservação</li>
                  <li>Com todas as etiquetas e embalagens originais</li>
                  <li>Sem sinais de uso ou danos</li>
                  <li>Acompanhado da nota fiscal</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Clock className="w-5 h-5 text-[#7a4fcf]" />
                3. Produtos Sob Encomenda
              </h2>
              <p className="text-gray-700 leading-relaxed">
                Produtos personalizados sob encomenda não podem ser trocados ou devolvidos, 
                exceto em casos de defeito de fabricação ou não conformidade com o pedido.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">
                4. Processo de Troca
              </h2>
              <div className="space-y-3">
                <p className="text-gray-700">Para solicitar troca:</p>
                <ol className="list-decimal list-inside space-y-2 text-gray-700 ml-4">
                  <li>Entre em contato via WhatsApp: (67) 99265-4151</li>
                  <li>Informe o motivo da troca</li>
                  <li>Envie fotos do produto (se necessário)</li>
                  <li>Aguarde nossa análise</li>
                  <li>Receba instruções para envio</li>
                </ol>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">
                5. Custos de Envio
              </h2>
              <p className="text-gray-700 leading-relaxed">
                Em caso de troca por defeito ou erro nosso, os custos de envio são por nossa conta. 
                Para troca por arrependimento, o cliente arca com os custos de envio.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">
                6. Reembolso
              </h2>
              <p className="text-gray-700 leading-relaxed">
                O reembolso será processado em até 5 dias úteis após o recebimento do produto 
                e confirmação das condições. O valor será creditado na mesma forma de pagamento utilizada.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">
                7. Garantia
              </h2>
              <p className="text-gray-700 leading-relaxed">
                Todos os produtos têm garantia de 30 dias contra defeitos de fabricação. 
                Para produtos sob encomenda, a garantia é de 90 dias.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">
                8. Contato
              </h2>
              <p className="text-gray-700 leading-relaxed">
                Para dúvidas sobre trocas e devoluções, entre em contato através do WhatsApp: 
                (67) 99265-4151 ou e-mail: ju.artereborn@gmail.com
              </p>
            </section>
          </div>
        </div>
      </div>
    </>
  );
}
