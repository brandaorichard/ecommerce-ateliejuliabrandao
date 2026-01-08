import { FaWhatsapp, FaInstagram, FaTiktok } from "react-icons/fa";
import coverImage from "../assets/cover.jpeg";

export default function SobreMim() {
  return (
    <div className="bg-[#f9e7f6] pb-4" style={{ paddingTop: '3.84rem' }}>
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-[1.2rem]">
          <h2 className="text-2xl md:text-3xl font-light text-gray-800 mb-2">
            Sobre mim
          </h2>
        </div>

        {/* Conteúdo Principal */}
        <div className="flex flex-col items-center gap-6">
          {/* Foto, Nome e Redes Sociais */}
          <div className="flex flex-col items-center gap-4">
            {/* Foto Circular */}
            <div className="flex-shrink-0">
              <img
                src={coverImage}
                alt="Júlia Brandão"
                className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-4 border-[#e5d3e9]"
              />
            </div>

            {/* Nome e Subtítulo */}
            <div className="flex flex-col items-center gap-2">
              <h3 className="text-xl md:text-2xl font-semibold text-gray-800">
                Júlia Brandão
              </h3>
              <p className="text-xs md:text-sm text-gray-600" style={{ fontSize: '0.65em' }}>
                Artista Reborn a mais de 5 anos
              </p>
            </div>
            
            {/* Ícones de Redes Sociais */}
            <div className="flex items-center gap-4">
              <a
                href="https://wa.me/5567992654151"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="text-2xl text-green-600 hover:text-green-700 transition-colors"
              >
                <FaWhatsapp />
              </a>
              <a
                href="https://instagram.com/ateliejuliabrandao/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="text-2xl text-pink-600 hover:text-pink-700 transition-colors"
              >
                <FaInstagram />
              </a>
              <a
                href="https://tiktok.com/@ateliejuliabrandao"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok"
                className="text-2xl text-gray-800 hover:text-gray-900 transition-colors"
              >
                <FaTiktok />
              </a>
            </div>
          </div>

          {/* Parágrafo Principal */}
          <div className="max-w-3xl">
            <p className="text-sm md:text-base text-gray-700 leading-relaxed text-center">
              Artista reborn desde 2020, especializada na criação de bebês reborn ultra-realistas com excelência em bebês por semelhança fotográfica. Desenvolvo cada boneca de forma totalmente artesanal, utilizando técnicas avançadas de pintura em camadas, enraizamento fio a fio, controle de densidade e acabamento profissional. Meu trabalho respeita proporções, tons de pele, expressões naturais e detalhes minuciosos, atendendo todos os públicos. Uno arte, sensibilidade e realismo extremo para transformar cada bebê em uma peça única, emocionante e cheia de identidade.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
