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
