import { motion, AnimatePresence } from "framer-motion";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useSwipeable } from "react-swipeable";
import OptimizedImage from "./OptimizedImage";

export default function ProductCarousel({ images, current, setCurrent, name }) {
  const handlePrev = () => setCurrent(prev => (prev === 0 ? images.length - 1 : prev - 1));
  const handleNext = () => setCurrent(prev => (prev === images.length - 1 ? 0 : prev + 1));

  const swipeHandlers = useSwipeable({
    onSwipedLeft: handleNext,
    onSwipedRight: handlePrev,
    trackMouse: false,
  });

  return (
    <div className="w-full md:w-[420px] flex flex-col items-center">
      <div
        className="relative w-full h-[460px] md:h-[520px] flex items-center justify-center"
        {...swipeHandlers}
      >
        <button
          className="absolute left-2 top-1/2 -translate-y-1/2 z-10 rounded-full p-2 cursor-pointer shadow transition"
          onClick={handlePrev}
          aria-label="Imagem anterior"
        >
          <FaChevronLeft size={15} className="text-white" />
        </button>
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.3, type: "spring" }}
            className="w-full h-full"
          >
            <OptimizedImage
              image={images[current]}
              alt={name}
              className="object-cover w-full h-full rounded-lg shadow-lg bg-white"
              priority={true} // Imagem principal do produto
            />
          </motion.div>
        </AnimatePresence>
        <button
          className="absolute right-2 top-1/2 -translate-y-1/2 z-10 rounded-full p-2 shadow cursor-pointer transition"
          onClick={handleNext}
          aria-label="Próxima imagem"
        >
          <FaChevronRight size={15} className="text-white" />
        </button>
      </div>
      <div className="flex gap-2 mt-4 flex-wrap">
        {images.map((img, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            className={`object-cover border-2 rounded-md p-1 transition-all cursor-pointer ${
              idx === current ? "border-[#ae95d9]" : "border-transparent opacity-70"
            }`}
            aria-label={`Selecionar imagem ${idx + 1}`}
          >
            <OptimizedImage
              image={img}
              alt={`Miniatura ${idx + 1}`}
              className="w-14 h-14 object-cover"
              width={56}
              height={56}
              priority={false}
            />
          </button>
        ))}
      </div>
    </div>
  );
}