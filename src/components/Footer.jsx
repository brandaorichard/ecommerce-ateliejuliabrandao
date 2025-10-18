import {
  FaWhatsapp,
  FaInstagram,
  FaTiktok,
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
} from "react-icons/fa";
import PaymentMethods from "./PaymentMethodsFooter";
import AnimatedLogo from "./AnimatedLogo";

export default function Footer({ logoVariant, scrolled, transition }) {
  return (
    <footer className="bg-[#f9e7f6] border-t border-[#e5d3e9] pt-8 pb-4 mt-12">
      <div className="max-w-6xl mx-auto px-4 flex flex-col gap-8 md:grid md:grid-cols-4 md:gap-12">
        {/* Redes sociais */}
        <div className="flex flex-col items-start gap-3 order-1 md:order-2">
          <span className="text-[#616161] text-base font-light mb-1">
            Redes sociais
          </span>
          <div className="flex gap-4">
            <a
              href="https://wa.me/5567992654151"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
              className="text-green-500 text-4xl transition"
            >
              <FaWhatsapp />
            </a>
            <a
              href="https://instagram.com/ateliejuliabrandao/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="text-[#C13584] text-4xl transition"
            >
              <FaInstagram />
            </a>
            <a
              href="https://tiktok.com/ateliejuliabrandao/"
              aria-label="tiktok"
              className="text-3xl transition mt-0.5"
            >
              <FaTiktok />
            </a>
          </div>
        </div>

        {/* Contato */}
        <div className="flex flex-col items-start order-2 md:order-1">
          <h2 className="text-base font-light text-[#616161] mb-3">
            Entre em contato
          </h2>
          <div className="flex flex-col gap-2 text-[#616161] font-light">
            <span className="flex items-center gap-2">
              <FaPhoneAlt className="text-[#7a4fcf]" />
              +55 (67) 99265-4151
            </span>
            <span className="flex items-center gap-2">
              <FaEnvelope className="text-[#7a4fcf]" />
              <a
                href="mailto:ju.artereborn@gmail.com"
                className="hover:underline break-all"
              >
                ju.artereborn@gmail.com
              </a>
            </span>
            <span className="flex items-center gap-2">
              <FaMapMarkerAlt className="text-[#7a4fcf]" />
              Rua Ana Queiroz Dutra, ipe 4 Três Lagoas -<br />
              Mato Grosso do Sul
            </span>
          </div>
        </div>

        {/* Formas de pagamento */}
        <div className="flex flex-col items-start md:items-center order-3 md:order-3">
          <PaymentMethods />
        </div>

        {/* Logo */}
        <div className="hidden md:flex justify-center md:justify-start items-center md:items-start order-4 md:order-4 opacity-90">
          <AnimatedLogo
            variants={logoVariant}
            animate={scrolled ? "scrolled" : "initial"}
            transition={transition}
            className="w-[250px] h-auto"
          />
        </div>
      </div>

      {/* Seção de Segurança Integrada */}
      <div className="bg-[#f9e7f6] border-t border-[#e5d3e9] py-6 mt-8">
        <div className="max-w-6xl mx-auto px-4">
          {/* Título */}
          <div className="text-center mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Ambiente Seguro e Confiável
            </h3>
            <p className="text-sm text-gray-600">
              Sua segurança e privacidade são nossas prioridades
            </p>
          </div>

          {/* Features de Segurança */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="flex flex-col items-center text-center p-3 bg-white/70 rounded-lg hover:bg-white/90 transition-colors">
              <div className="mb-2">
                <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
              </div>
              <h4 className="text-sm font-medium text-green-600 mb-1">Site Seguro</h4>
              <p className="text-xs text-gray-600">Certificado SSL</p>
            </div>
            
            <div className="flex flex-col items-center text-center p-3 bg-white/70 rounded-lg hover:bg-white/90 transition-colors">
              <div className="mb-2">
                <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <h4 className="text-sm font-medium text-blue-600 mb-1">Dados Protegidos</h4>
              <p className="text-xs text-gray-600">LGPD Compliant</p>
            </div>
            
            <div className="flex flex-col items-center text-center p-3 bg-white/70 rounded-lg hover:bg-white/90 transition-colors">
              <div className="mb-2">
                <svg className="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4zM18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" />
                </svg>
              </div>
              <h4 className="text-sm font-medium text-purple-600 mb-1">Pagamento Seguro</h4>
              <p className="text-xs text-gray-600">Mercado Pago</p>
            </div>
            
            <div className="flex flex-col items-center text-center p-3 bg-white/70 rounded-lg hover:bg-white/90 transition-colors">
              <div className="mb-2">
                <svg className="w-5 h-5 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                  <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1V8a1 1 0 00-1-1h-3z" />
                </svg>
              </div>
              <h4 className="text-sm font-medium text-orange-600 mb-1">Entrega Garantida</h4>
              <p className="text-xs text-gray-600">Rastreamento</p>
            </div>
          </div>

          {/* Certificações */}
          <div className="flex flex-wrap justify-center items-center gap-6 mb-4">
            <div className="flex items-center gap-2 px-3 py-2 bg-white/70 rounded-lg hover:bg-white/90 transition-colors">
              <span className="text-lg">🔒</span>
              <div className="text-left">
                <div className="text-sm font-medium text-gray-800">SSL Certificate</div>
                <div className="text-xs text-gray-600">Conexão Segura</div>
              </div>
            </div>
            
            <div className="flex items-center gap-2 px-3 py-2 bg-white/70 rounded-lg hover:bg-white/90 transition-colors">
              <span className="text-lg">🛡️</span>
              <div className="text-left">
                <div className="text-sm font-medium text-gray-800">LGPD</div>
                <div className="text-xs text-gray-600">Proteção de Dados</div>
              </div>
            </div>
            
            <div className="flex items-center gap-2 px-3 py-2 bg-white/70 rounded-lg hover:bg-white/90 transition-colors">
              <span className="text-lg">💳</span>
              <div className="text-left">
                <div className="text-sm font-medium text-gray-800">Mercado Pago</div>
                <div className="text-xs text-gray-600">Pagamentos Seguros</div>
              </div>
            </div>
            
            <div className="flex items-center gap-2 px-3 py-2 bg-white/70 rounded-lg hover:bg-white/90 transition-colors">
              <span className="text-lg">📊</span>
              <div className="text-left">
                <div className="text-sm font-medium text-gray-800">Google Analytics</div>
                <div className="text-xs text-gray-600">Site Monitorado</div>
              </div>
            </div>
          </div>

          {/* Informações Legais */}
          <div className="text-center text-xs text-gray-500 space-y-1 mb-4">
            <p>
              <span className="font-medium">Ateliê Júlia Brandão</span> - 
              CNPJ: 56.107.418/0001-57 | 
              <span className="text-green-600 font-medium"> Site Seguro</span>
            </p>
            <p>
              Todos os dados são protegidos pela LGPD | 
              Pagamentos processados pelo Mercado Pago
            </p>
            <div className="flex justify-center gap-4 mt-2">
              <a 
                href="/politica-privacidade" 
                className="hover:text-[#7a4fcf] transition-colors"
              >
                Política de Privacidade
              </a>
              <span>•</span>
              <a 
                href="/termos-uso" 
                className="hover:text-[#7a4fcf] transition-colors"
              >
                Termos de Uso
              </a>
            </div>
          </div>

          {/* Indicador de Status */}
          <div className="flex justify-center items-center gap-2 mb-4">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs text-gray-600">Site Online</span>
            </div>
            <span className="text-gray-300">•</span>
            <div className="flex items-center gap-1">
              <svg className="w-3 h-3 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span className="text-xs text-gray-600">SSL Ativo</span>
            </div>
            <span className="text-gray-300">•</span>
            <div className="flex items-center gap-1">
              <svg className="w-3 h-3 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="text-xs text-gray-600">Certificado</span>
            </div>
          </div>

          {/* Copyright */}
          <div className="text-center text-xs text-[#ae95d9] border-t border-[#e5d3e9] pt-4">
            © {new Date().getFullYear()} Ateliê Júlia Brandão. Todos os direitos reservados.
          </div>
        </div>
      </div>
    </footer>
  );
}