import { FaWhatsapp, FaInstagram, FaTiktok } from "react-icons/fa";

export default function SocialMediasSection() {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-center gap-4">
      <a
        href="https://wa.me/5567992654151"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="WhatsApp"
        className="bg-green-500 rounded-full shadow-lg p-3 hover:scale-110 transition-transform"
      >
        <FaWhatsapp className="text-white text-md" />
      </a>
      {/* <a
        href="https://instagram.com/seuusuario"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Instagram"
        className="bg-pink-600 rounded-full shadow-lg p-3 hover:scale-110 transition-transform"
      >
        <FaInstagram className="text-white text-md" />
      </a>
      <a
        href="https://instagram.com/seuusuario"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="TikTok"
        className="bg-black rounded-full shadow-lg p-3 hover:scale-110 transition-transform"
      >
        <FaTiktok className="text-white text-md" />
      </a> */}
    </div>
  );
}