import React from 'react';
import { Helmet } from 'react-helmet-async';
import SEOHead from '../components/SEO/SEOHead';
import { FileText, CheckCircle, AlertCircle, ShoppingCart } from 'lucide-react';

export default function TermosUsoPage() {
  return (
    <>
      <SEOHead 
        title="Termos de Uso"
        description="Termos de uso e condições de compra do Ateliê Júlia Brandão"
        keywords="termos uso, condições compra, regras site"
      />
      
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <FileText className="w-8 h-8 text-[#7a4fcf]" />
              <h1 className="text-2xl font-bold text-gray-900">
                Termos de Uso
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
                <CheckCircle className="w-5 h-5 text-[#7a4fcf]" />
                1. Aceitação dos Termos
              </h2>
              <p className="text-gray-700 leading-relaxed">
                Ao acessar e utilizar o site do Ateliê Júlia Brandão, você concorda em cumprir 
                estes termos de uso. Se não concordar com qualquer parte destes termos, 
                não utilize nossos serviços.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-[#7a4fcf]" />
                2. Produtos e Serviços
              </h2>
              <div className="space-y-3">
                <p className="text-gray-700">Nossos produtos incluem:</p>
                <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                  <li>Bebês reborn sob encomenda</li>
                  <li>Bebês reborn pronta entrega</li>
                  <li>Acessórios e enxovais</li>
                  <li>Serviços de personalização</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-[#7a4fcf]" />
                3. Condições de Compra
              </h2>
              <div className="space-y-3">
                <p className="text-gray-700">Ao realizar uma compra, você concorda que:</p>
                <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                  <li>Os preços podem variar conforme personalização</li>
                  <li>Produtos sob encomenda têm prazo de produção</li>
                  <li>Pagamento deve ser confirmado antes da produção/envio</li>
                  <li>As imagens utilizadas são reais</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">
                4. Responsabilidades do Cliente
              </h2>
              <p className="text-gray-700 leading-relaxed">
                O cliente é responsável por fornecer informações corretas, manter a segurança 
                de sua conta e respeitar os direitos de propriedade intelectual dos produtos.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">
                5. Limitação de Responsabilidade
              </h2>
              <p className="text-gray-700 leading-relaxed">
                O Ateliê Júlia Brandão não se responsabiliza por danos indiretos, lucros cessantes 
                ou outros prejuízos decorrentes do uso dos produtos ou serviços.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">
                6. Modificações
              </h2>
              <p className="text-gray-700 leading-relaxed">
                Reservamo-nos o direito de modificar estes termos a qualquer momento. 
                As alterações entrarão em vigor imediatamente após a publicação no site.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">
                7. Contato
              </h2>
              <p className="text-gray-700 leading-relaxed">
                Para dúvidas sobre estes termos, entre em contato através do e-mail: 
                ju.artereborn@gmail.com ou WhatsApp: (67) 99265-4151
              </p>
            </section>
          </div>
        </div>
      </div>
    </>
  );
}
