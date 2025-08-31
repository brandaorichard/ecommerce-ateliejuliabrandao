import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { PiListLight } from "react-icons/pi";
import { FaTimes } from "react-icons/fa";
import { AnimatePresence, motion } from "framer-motion";
import AnimatedLogo from "./AnimatedLogo";
import CartButton from "./CartButton";
import CategoriesMenu from "./CategoriesMenu";
import CartDrawer from "./CartDrawer";
import { useSelector } from "react-redux";
import UserButton from "./UserButton";

export default function MobileHeader({
  menuOpen,
  setMenuOpen,
  scrolled,
  logoVariant,
  transition,
  categories,
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const [cartOpen, setCartOpen] = useState(false);

  const cartCount = useSelector((state) =>
    state.cart.items.reduce((sum, item) => sum + item.quantity, 0)
  );
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  const handleLogoClick = () => {
    if (location.pathname === "/") {
      window.location.reload();
    } else {
      navigate("/");
    }
    if (menuOpen) setMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-[#f9e7f6] md:hidden">
      {/* Faixa roxa só aparece se não estiver scrolled */}
      {!scrolled && (
        <div
          className="h-[30px] bg-[#c5adee] w-full transition-all duration-300 flex items-center justify-center px-2 pt-[env(safe-area-inset-top)]"
          style={{ paddingTop: "env(safe-area-inset-top)" }}
        >
          <span className="text-black text-[12px] font-extralight">
            ✈️ ENVIAMOS PARA TODO O BRASIL E EXTERIOR! ✈️
          </span>
        </div>
      )}

      <div className="relative flex items-center h-28 border-b border-[#e5d3e9] shadow-[0_2px_8px_0_rgba(174,149,217,0.08)] bg-[#f9e7f6] px-[20px] max-w-[1246px] mx-auto">
        {/* Menu hamburguer à esquerda */}
        <div className="flex-1 flex items-center">
          {!menuOpen && (
            <button
              className="mr-2"
              onClick={() => setMenuOpen(true)}
              aria-label="Abrir menu"
            >
              <PiListLight size={24} />
            </button>
          )}
        </div>

        {/* Logo centralizada absolutamente */}
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex justify-center items-center"
          style={{ minWidth: 80, minHeight: 40 }}
        >
          <div
            onClick={handleLogoClick}
            className="w-[150px] h-auto cursor-pointer"
            tabIndex={0}
            role="button"
            aria-label="Ir para a página inicial"
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") handleLogoClick();
            }}
          >
            <AnimatedLogo
              variants={logoVariant}
              animate={scrolled ? "scrolled" : "initial"}
              transition={transition}
              className="w-[150px] h-auto"
            />
          </div>
        </div>

        {/* UserButton + CartButton à direita em coluna */}
        <div
          className={`flex flex-col items-center gap-2 mt-2 w-[80px] justify-end ${
            isLoggedIn ? "-mr-0" : ""
          }`}
        >
          <CartButton
            size={24}
            className="text-gray-700"
            onClick={() => setCartOpen(true)}
            badge={cartCount}
          />
          <UserButton />
        </div>
      </div>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            key="dropdown"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="
              absolute left-1 top-[40px] z-50
              bg-[#f9e7f6]
              rounded-sm
              shadow-xl
              pb-10
              border border-[#f9e7f6]/80
              flex flex-col items-start
              min-w-[150px]
              max-w-[60vw]
            "
          >
            <div className="flex items-center w-full mb-2">
              <button
                onClick={() => setMenuOpen(false)}
                aria-label="Fechar menu"
                className="p-2"
              >
                <FaTimes className="text-[#616161] text-xl" />
              </button>
              <div className="flex-1" />
            </div>
            <CategoriesMenu
              categories={categories}
              animated
              onCategoryClick={(idx) => {
                if (idx === 0) navigate("/categoria1");
                if (idx === 1) navigate("/categoria2");
                if (idx === 2) navigate("/categoria3");
                setMenuOpen(false);
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
