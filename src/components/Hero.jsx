import React, { useEffect, useState, useRef } from "react";
import { useSwipeable } from "react-swipeable";
import { motion } from "framer-motion";
import { useCarousel } from "../hooks/useCarousel";

function useImagesPerSlide() {
  const [imagesPerSlide, setImagesPerSlide] = useState(window.innerWidth >= 768 ? 2 : 1);

  useEffect(() => {
    const handleResize = () => {
      setImagesPerSlide(window.innerWidth >= 768 ? 2 : 1);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return imagesPerSlide;
}

export default function Hero() {
  // TODOS OS HOOKS DEVEM SER CHAMADOS AQUI, NO TOPO DO COMPONENTE, INCONDICIONALMENTE
  const { carouselItems, loading } = useCarousel();
  const imagesPerSlide = useImagesPerSlide();
  const [current, setCurrent] = useState(0);
  const intervalRef = useRef();

  // Swipe only on mobile (<1000px)
  const isMobile = window.innerWidth < 1000;
  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => isMobile && next(),
    onSwipedRight: () => isMobile && prev(),
    trackMouse: true,
  });

  // Transform carousel items to match component structure
  const transformedItems = carouselItems.map(item => ({
    id: item._id,
    title: item.title,
    description: item.description,
    images: item.images.map((imageUrl, index) => ({
      src: imageUrl,
      alt: item.imageAlt || `${item.title} - Imagem ${index + 1}`
    })),
    link: item.link,
    linkText: item.linkText || "Saiba mais",
    order: item.order
  }));

  // Flatten all images from all carousel items
  const allImages = transformedItems.reduce((acc, item) => {
    return [...acc, ...item.images];
  }, []);

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

  if (carouselItems.length === 0) {
    return (
      <div className="w-full h-[46vh] md:h-[50vh] bg-gray-100 flex items-center justify-center">
        <p className="text-gray-500 text-center">
          Nenhuma imagem disponível
        </p>
      </div>
    );
  }

  return (
    <div>
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
            text-[#616161]
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
              {slide.map((img, idx) => (
                <img
                  key={`${img.alt}-${idx}`}
                  src={img.src}
                  alt={img.alt}
                  className="w-full h-full object-cover"
                  style={{ flex: 1 }}
                />
              ))}
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