import {
  FaWhatsapp,
  FaInstagram,
  FaTiktok,
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
} from "react-icons/fa";
import PaymentMethods from "./PaymentMethodsFooter";

export default function Footer({ logoVariant, scrolled, transition }) {
  return (
    <footer className="bg-white">
      {/* Seção Superior: Por que comprar conosco */}
      <div className="bg-white py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-light text-gray-800 mb-2">
              Por que comprar conosco
            </h2>
          </div>

          {/* Cards de Benefícios */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="flex flex-col items-center text-center p-4 bg-[#f9e7f6] rounded-lg border border-[#e5d3e9] hover:shadow-md transition-shadow">
              <div className="mb-3">
                <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-sm font-semibold text-gray-800 mb-1">Site Seguro</h3>
              <p className="text-xs text-gray-600">Certificado SSL</p>
            </div>
            
            <div className="flex flex-col items-center text-center p-4 bg-[#f9e7f6] rounded-lg border border-[#e5d3e9] hover:shadow-md transition-shadow">
              <div className="mb-3">
                <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-sm font-semibold text-gray-800 mb-1">Dados Protegidos</h3>
              <p className="text-xs text-gray-600">LGPD Compliant</p>
            </div>
            
            <div className="flex flex-col items-center text-center p-4 bg-[#f9e7f6] rounded-lg border border-[#e5d3e9] hover:shadow-md transition-shadow">
              <div className="mb-3">
                <svg className="w-8 h-8 text-[#C5ADEE]" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4zM18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" />
                </svg>
              </div>
              <h3 className="text-sm font-semibold text-gray-800 mb-1">Pagamento Seguro</h3>
              <p className="text-xs text-gray-600">Mercado Pago</p>
            </div>
            
            <div className="flex flex-col items-center text-center p-4 bg-[#f9e7f6] rounded-lg border border-[#e5d3e9] hover:shadow-md transition-shadow">
              <div className="mb-3">
                <svg className="w-8 h-8 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                  <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1V8a1 1 0 00-1-1h-3z" />
                </svg>
              </div>
              <h3 className="text-sm font-semibold text-gray-800 mb-1">Entrega Garantida</h3>
              <p className="text-xs text-gray-600">Rastreamento</p>
            </div>
          </div>
        </div>
      </div>

      {/* Barra de Segurança */}
      <div className="bg-[#C5ADEE] py-4">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-wrap justify-center items-center gap-6 md:gap-8">
            <div className="flex items-center gap-2 text-gray-600">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-sm font-medium">SSL Certificado</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-sm font-medium">LGPD Compliant</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4zM18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" />
              </svg>
              <span className="text-sm font-medium">Mercado Pago</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Principal */}
      <div className="bg-[#C5ADEE] py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-8 mb-6">
            {/* Contato */}
            <div>
              <h4 className="text-sm font-semibold mb-4 text-gray-700">Contato</h4>
              <div className="space-y-2 text-xs text-gray-600">
                <a
                  href="https://wa.me/5567992654151"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-gray-800 transition-colors"
                >
                  <FaWhatsapp className="text-base" />
                  <span>+55 (67) 99265-4151</span>
                </a>
                <a
                  href="mailto:ju.artereborn@gmail.com"
                  className="flex items-center gap-2 hover:text-gray-800 transition-colors"
                >
                  <FaEnvelope className="text-base" />
                  <span>ju.artereborn@gmail.com</span>
                </a>
                <div className="flex items-center gap-2">
                  <FaMapMarkerAlt className="text-base" />
                  <span>Três Lagoas - MS</span>
                </div>
              </div>
            </div>

            {/* Redes Sociais */}
            <div>
              <h4 className="text-sm font-semibold mb-4 text-gray-700">Redes Sociais</h4>
              <div className="flex gap-4">
                <a
                  href="https://instagram.com/ateliejuliabrandao/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="text-2xl text-gray-600 hover:text-gray-800 transition-colors"
                >
                  <FaInstagram />
                </a>
                <a
                  href="https://tiktok.com/ateliejuliabrandao/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="TikTok"
                  className="text-2xl text-gray-600 hover:text-gray-800 transition-colors"
                >
                  <FaTiktok />
                </a>
                <a
                  href="https://wa.me/5567992654151"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="WhatsApp"
                  className="text-2xl text-gray-600 hover:text-gray-800 transition-colors"
                >
                  <FaWhatsapp />
                </a>
              </div>
            </div>

            {/* Formas de Pagamento */}
            <div>
              <h4 className="text-sm font-semibold mb-4 text-gray-700">Formas de Pagamento</h4>
              <div className="flex flex-wrap items-center gap-2">
                <PaymentMethods />
              </div>
            </div>

            {/* Informações Legais */}
            <div>
              <h4 className="text-sm font-semibold mb-4 text-gray-700">Informações Legais</h4>
              <div className="space-y-2 text-xs text-gray-600">
                <a
                  href="/politica-privacidade"
                  className="block hover:text-gray-800 transition-colors"
                >
                  Política de Privacidade
                </a>
                <a
                  href="/termos-uso"
                  className="block hover:text-gray-800 transition-colors"
                >
                  Termos de Uso
                </a>
                <a
                  href="/politica-trocas"
                  className="block hover:text-gray-800 transition-colors"
                >
                  Política de Troca
                </a>
              </div>
            </div>
          </div>

          {/* Copyright e CNPJ */}
          <div className="border-t border-gray-400/30 pt-6 text-center">
            <p className="text-xs text-gray-600 mb-2">
              <span className="font-medium">Ateliê Júlia Brandão</span> - CNPJ: 56.107.418/0001-57
            </p>
            <p className="text-xs text-gray-600">
              © {new Date().getFullYear()} Ateliê Júlia Brandão. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
