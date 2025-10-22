import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import img1 from "../assets/categorias/encomenda.jpg";
import img2 from "../assets/categorias/prontaentrega.png";
import img3 from "../assets/categorias/semelhanca.png";

function useWindowWidth() {
  const [width, setWidth] = useState(typeof window !== "undefined" ? window.innerWidth : 1024);
  useEffect(() => {
    function handleResize() {
      setWidth(window.innerWidth);
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return width;
}

export default function CategoriesSection() {
  const navigate = useNavigate();
  const width = useWindowWidth();
  const isMobile = width < 768;

  const categories = [
    { title: "Sob Encomenda", route: "/categoria1", image: img1 },
    { title: "A Pronta Entrega", route: "/categoria2", image: img2 },
    { title: "Por Semelhança", route: "/categoria3", image: img3 }
  ];

  const handleCategoryClick = (route) => {
    navigate(route);
  };

  return (
    <div className="mt-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-semibold text-gray-800 text-center mb-8">
          CATEGORIAS
        </h2>
      </div>

      {/* ========== VERSÃO MOBILE (NÃO MEXER) ========== */}
      {isMobile && (
        <div className="grid grid-rows-3 gap-0 w-full">
          {categories.map((category, index) => (
            <div
              key={index}
              onClick={() => handleCategoryClick(category.route)}
              className="
                relative cursor-pointer group transition-all duration-300
                w-full h-48
                bg-gray-200 flex items-center justify-center
                hover:opacity-90 overflow-hidden
              "
              style={{
                aspectRatio: "16/9"
              }}
            >
              <img
                src={category.image}
                alt={category.title}
                className="absolute inset-0 w-full h-full object-cover z-0"
                draggable={false}
                loading="lazy"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-all duration-300 z-10" />
              <div className="absolute inset-0 bg-black/30 transition-all duration-300 z-10" />
              <div className="relative z-20 text-center px-4">
                <h3 className="
                  text-[#f9e7f6] text-lg md:text-xl font-semibold tracking-wide
                  transition-all duration-300
                  group-hover:scale-105
                  drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]
                ">
                  {category.title}
                </h3>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ========== VERSÃO DESKTOP (PODE MODIFICAR) ========== */}
      {!isMobile && (
        <div className="flex w-full">
          {categories.map((category, index) => (
            <div
              key={index}
              onClick={() => handleCategoryClick(category.route)}
              className="
                relative cursor-pointer group transition-all duration-300
                flex-1 h-64
                bg-gray-200 flex items-center justify-center
                hover:opacity-90 overflow-hidden
              "
              style={{
                aspectRatio: "1/1"
              }}
            >
              <img
                src={category.image}
                alt={category.title}
                className="absolute inset-0 w-full h-full object-cover z-0"
                draggable={false}
                loading="lazy"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-all duration-300 z-10" />
              <div className="absolute inset-0 bg-black/30 transition-all duration-300 z-10" />
              <div className="relative z-20 text-center px-4">
                <h3 className="
                  text-[#f9e7f6] text-lg md:text-xl font-semibold tracking-wide
                  transition-all duration-300
                  group-hover:scale-105
                  drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]
                ">
                  {category.title}
                </h3>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}