import React, { useEffect, useState, useRef } from "react";
import { useSwipeable } from "react-swipeable";
import { motion } from "framer-motion";
import { useCarousel } from "../hooks/useCarousel";

function useImagesPerSlide() {
  const [imagesPerSlide, setImagesPerSlide] = useState(
    typeof window !== 'undefined' && window.innerWidth >= 768 ? 3 : 1
  );

  useEffect(() => {
    // Usar ResizeObserver para evitar reflow forçado
    const updateImagesPerSlide = () => {
      const isMdOrLarger = window.matchMedia('(min-width: 768px)').matches;
      setImagesPerSlide(isMdOrLarger ? 3 : 1);
    };

    // Criar media query listener (mais performático que resize event)
    const mediaQuery = window.matchMedia('(min-width: 768px)');
    
    // Moderna API (Safari 14+)
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', updateImagesPerSlide);
      return () => mediaQuery.removeEventListener('change', updateImagesPerSlide);
    } else {
      // Fallback para navegadores antigos
      mediaQuery.addListener(updateImagesPerSlide);
      return () => mediaQuery.removeListener(updateImagesPerSlide);
    }
  }, []);

  return imagesPerSlide;
}

export default function Hero() {
  // TODOS OS HOOKS DEVEM SER CHAMADOS AQUI, NO TOPO DO COMPONENTE, INCONDICIONALMENTE
  const { carouselItems, loading, error } = useCarousel();
  const imagesPerSlide = useImagesPerSlide();
  const [current, setCurrent] = useState(0);
  const intervalRef = useRef();

  // Flatten all images from all carousel items - usar diretamente as URLs
  const allImages = carouselItems.reduce((acc, item) => {
    if (item.images && Array.isArray(item.images)) {
      return [...acc, ...item.images];
    }
    return acc;
  }, []);

  // Detectar mobile usando media query ao invés de window.innerWidth
  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' && window.matchMedia('(max-width: 999px)').matches
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 999px)');
    const handleChange = (e) => setIsMobile(e.matches);
    
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    } else {
      mediaQuery.addListener(handleChange);
      return () => mediaQuery.removeListener(handleChange);
    }
  }, []);

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => isMobile && next(),
    onSwipedRight: () => isMobile && prev(),
    trackMouse: true,
  });

  // Group images into slides based on imagesPerSlide
  const slides = [];
  for (let i = 0; i < allImages.length; i += imagesPerSlide) {
    slides.push(allImages.slice(i, i + imagesPerSlide));
  }

  const totalSlides = slides.length;


  const goTo = (idx) => {
    setCurrent(idx);
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % totalSlides);
    }, 5000);
  };

  const prev = () => goTo((current - 1 + totalSlides) % totalSlides);
  const next = () => goTo((current + 1) % totalSlides);

  useEffect(() => {
    if (totalSlides > 0) {
      intervalRef.current = setInterval(() => {
        setCurrent((prev) => (prev + 1) % totalSlides);
      }, 5000);

      return () => clearInterval(intervalRef.current);
    }
  }, [totalSlides]);

  // AGORA, A LÓGICA CONDICIONAL PODE VIR AQUI, DEPOIS DE TODOS OS HOOKS
  if (loading) {
    return (
      <div className="w-full h-[46vh] md:h-[50vh] bg-gray-200 flex items-center justify-center">
        <p className="text-gray-500">Carregando...</p>
      </div>
    );
  }

  if (carouselItems.length === 0 && !loading) {
    return (
      <div className="w-full h-[46vh] md:h-[50vh] bg-gray-100 flex items-center justify-center">
        <p className="text-gray-500 text-center">
          Nenhuma imagem disponível
        </p>
      </div>
    );
  }

  if (allImages.length === 0) {
    return (
      <div className="w-full h-[46vh] md:h-[50vh] bg-gray-100 flex items-center justify-center">
        <p className="text-gray-500 text-center">
          Nenhuma imagem processada
        </p>
      </div>
    );
  }
  
  return (
    <div className="mt-1">
      {/* Título acima do carousel */}
      <motion.div
        className="w-full flex flex-col items-center mb-5 -mt-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <h1
          className="
            text-2xl
            md:text-4xl
            font-light
            text-gray-800
            font-['Lexend']
            text-center
            tracking-[0.02em]
            md:tracking-wide
            flex items-center
            gap-2
          "
        >
          {/* Título acima do carousel */}
        </h1>
      </motion.div>
      <motion.section
        {...(isMobile ? swipeHandlers : {})}
        className="w-full h-[46vh] md:h-[50vh] bg-no-repeat bg-cover bg-center relative overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.1, ease: "easeOut" }}
      >
        {/* Slides container */}
        <motion.div
          className="flex h-full w-full"
          style={{
            width: `${totalSlides * 100}%`,
            height: "100%",
            position: "absolute",
            top: 0,
            left: 0,
          }}
          animate={{ x: `-${current * (100 / totalSlides)}%` }}
          transition={{
            x: { type: "spring", stiffness: 300, damping: 60 },
          }}
        >
          {slides.map((slide, slideIdx) => (
            <div
              key={slideIdx}
              className="flex w-full h-full"
              style={{ width: `${100 / totalSlides}%` }}
            >
              {slide.map((imageUrl, idx) => {
                // Primeira imagem do primeiro slide é o LCP - priorizar
                const isFirstImage = slideIdx === 0 && idx === 0;
                return (
                  <img
                    key={`${imageUrl}-${idx}`}
                    src={imageUrl}
                    alt={`Carousel image ${idx + 1}`}
                    className="w-full h-full object-cover"
                    style={{ flex: 1 }}
                    loading={isFirstImage ? "eager" : "lazy"}
                    fetchpriority={isFirstImage ? "high" : "auto"}
                    decoding="async"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                );
              })}
            </div>
          ))}
        </motion.div>

        {/* Bolinhas */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => goTo(idx)}
              className={`w-1 h-1 rounded-full border border-[#ae95d9] transition
                ${current === idx ? "bg-[#ae95d9]" : "bg-white"}
              `}
              aria-label={`Ir para slide ${idx + 1}`}
            />
          ))}
        </div>
      </motion.section>
    </div>
  );
}