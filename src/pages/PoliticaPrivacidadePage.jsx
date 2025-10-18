import React from 'react';
import { Helmet } from 'react-helmet-async';
import SEOHead from '../components/SEO/SEOHead';
import { Shield, Lock, FileText, Users } from 'lucide-react';

export default function PoliticaPrivacidadePage() {
  return (
    <>
      <SEOHead 
        title="Política de Privacidade"
        description="Política de privacidade e proteção de dados do Ateliê Júlia Brandão"
        keywords="política privacidade, LGPD, proteção dados, segurança"
      />
      
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-8 h-8 text-[#7a4fcf]" />
              <h1 className="text-2xl font-bold text-gray-900">
                Política de Privacidade
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
                <Lock className="w-5 h-5 text-[#7a4fcf]" />
                1. Informações Gerais
              </h2>
              <p className="text-gray-700 leading-relaxed">
                O Ateliê Júlia Brandão, pessoa jurídica de direito privado, inscrita no CNPJ sob o nº 56.107.418/0001-57, 
                com sede na Rua Ana Queiroz Dutra, Ipe 4, Três Lagoas - MS, compromete-se a proteger a privacidade 
                e os dados pessoais de seus clientes e visitantes do site.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Users className="w-5 h-5 text-[#7a4fcf]" />
                2. Dados Coletados
              </h2>
              <div className="space-y-3">
                <p className="text-gray-700">Coletamos os seguintes dados pessoais:</p>
                <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                  <li>Nome completo</li>
                  <li>E-mail</li>
                  <li>Telefone</li>
                  <li>Endereço de entrega</li>
                  <li>CPF (para emissão de notas fiscais)</li>
                  <li>Dados de navegação (cookies)</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#7a4fcf]" />
                3. Finalidade do Tratamento
              </h2>
              <p className="text-gray-700 leading-relaxed">
                Os dados coletados são utilizados para processar pedidos, enviar comunicações sobre produtos, 
                melhorar a experiência do usuário e cumprir obrigações legais.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">
                4. Compartilhamento de Dados
              </h2>
              <p className="text-gray-700 leading-relaxed">
                Seus dados não são compartilhados com terceiros, exceto com o Mercado Pago para processamento 
                de pagamentos e empresas de entrega para envio dos produtos.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">
                5. Seus Direitos
              </h2>
              <p className="text-gray-700 leading-relaxed mb-3">
                Você tem direito a:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                <li>Acessar seus dados pessoais</li>
                <li>Corrigir dados incorretos</li>
                <li>Solicitar a exclusão dos dados</li>
                <li>Revogar o consentimento</li>
                <li>Portabilidade dos dados</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">
                6. Contato
              </h2>
              <p className="text-gray-700 leading-relaxed">
                Para exercer seus direitos ou esclarecer dúvidas sobre esta política, 
                entre em contato através do e-mail: ju.artereborn@gmail.com
              </p>
            </section>
          </div>
        </div>
      </div>
    </>
  );
}
