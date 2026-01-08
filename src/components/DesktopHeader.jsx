import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import AnimatedLogo from "./AnimatedLogo";
import CategoriesMenu from "./CategoriesMenu";
import CartDrawer from "./CartDrawer";
import SearchModal from "./SearchModal";
import UserAvatar from "./UserAvatar";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/authSlice";
import { showToast } from "../redux/toastSlice";
import { AnimatePresence, motion } from "framer-motion";
import { FaSearch, FaShoppingCart, FaUser } from "react-icons/fa";

export default function DesktopHeader({
  scrolled,
  logoVariant,
  transition,
  headerHeight = 160, // valor padrão caso não receba prop
  categories,
}) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [cartOpen, setCartOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const userDropdownRef = useRef(null);
  
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Fechar dropdown do usuário ao clicar fora
  useEffect(() => {
    function handleClickOutside(e) {
      if (userDropdownRef.current && !userDropdownRef.current.contains(e.target)) {
        setUserDropdownOpen(false);
      }
    }
    if (userDropdownOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [userDropdownOpen]);

  // Redux selectors
  const cartCount = useSelector(
    (state) => state.cart.items.reduce((sum, item) => sum + item.quantity, 0)
  );
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const user = useSelector((state) => state.auth.user);
  const isAdmin = user?.role === "admin";

  const handleLogoClick = () => {
    if (window.location.pathname === "/") {
      window.location.reload();
    } else {
      navigate("/");
    }
  };

  const handleUserClick = () => {
    if (isLoggedIn) {
      setUserDropdownOpen(!userDropdownOpen);
    } else {
      navigate("/login");
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    setUserDropdownOpen(false);
    dispatch(
      showToast({
        message: "Logout realizado com sucesso!",
        iconType: "logout",
      })
    );
    navigate("/login");
  };

  const handleMenuClick = (path) => {
    setUserDropdownOpen(false);
    navigate(path);
  };

  // Empilha ícones em coluna entre 768px e 930px
  const stackIcons = windowWidth < 930 && windowWidth >= 768;

  // Calcula escala entre 930 e 768 px para as categorias e logo
  const getScale = () => {
    if (windowWidth >= 950) return scrolled ? 0.8 : 1;
    if (windowWidth <= 768) return scrolled ? 0.64 : 0.8; // 0.8 * 0.8 = 0.64
    const baseScale = 0.8 + ((windowWidth - 768) / (950 - 768)) * 0.2;
    return scrolled ? baseScale * 0.8 : baseScale;
  };

  const scale = getScale();

  // Variants para AnimatedLogo com escala dinâmica e scroll
  const logoVariants = {
    initial: { scale: scale },
    scrolled: { scale: scale * 0.7 },
  };

  // Ajusta a altura do header em 20% quando scrolled
  const adjustedHeaderHeight = scrolled ? headerHeight * 0.8 : headerHeight;

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-[#f9e7f6] hidden md:block">
      {!scrolled && (
        <div className="h-[30px] bg-[#ae95d9] w-full transition-all duration-300 flex items-center justify-center">
          <span className="text-black text-[12px] font-light tracking-wide select-none">
            ✈️ ENVIAMOS PARA TODO O BRASIL E EXTERIOR! ✈️
          </span>
        </div>
      )}
      <div className="w-full border-b border-[#e5d3e9] shadow-[0_2px_8px_0_rgba(174,149,217,0.08)] bg-[#f9e7f6]">
        <div
          className="flex items-center justify-between max-w-[1246px] mx-auto px-[35px] transition-all duration-300"
          style={{ height: adjustedHeaderHeight }}
        >
          {/* Logo à esquerda */}
          <div className="flex-1 flex justify-start origin-center">
            <div
              onClick={handleLogoClick}
              className="w-[220px] h-auto cursor-pointer"
              tabIndex={0}
              role="button"
              aria-label="Ir para a página inicial"
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") handleLogoClick();
              }}
            >
              <AnimatedLogo
                variants={logoVariants}
                animate={scrolled ? "scrolled" : "initial"}
                transition={transition}
                className="w-[220px] h-auto"
              />
            </div>
          </div>

          {/* Categorias centralizadas com escala */}
          <nav
            className="flex-1 flex justify-center gap-8 text-large origin-center"
            style={{ transform: `scale(${scale})` }}
          >
            <CategoriesMenu
              categories={categories}
              onCategoryClick={(idx) => {
                if (idx === 0) navigate("/categoria1");
                if (idx === 1) navigate("/categoria2");
                if (idx === 2) navigate("/categoria3");
                if (idx === 3) navigate("/cursos");
              }}
            />
          </nav>

          {/* Ícones à direita (Search, Cart, User) */}
          <div
            className={`flex-1 flex justify-end items-center pr-6 gap-4`}
          >
            {/* Ícone de pesquisa */}
            <button
              onClick={() => setSearchModalOpen(true)}
              className="text-gray-700 hover:text-[#7a4fcf] transition-colors duration-200 cursor-pointer"
              aria-label="Pesquisar bebês"
              title="Pesquisar bebês"
            >
              <FaSearch size={24} />
            </button>
            
            {/* Ícone do carrinho */}
            <button
              onClick={() => setCartOpen(true)}
              className="relative text-gray-700 hover:text-[#7a4fcf] transition-colors duration-200 cursor-pointer"
              aria-label="Carrinho de compras"
              title="Carrinho de compras"
            >
              <FaShoppingCart size={24} />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#7a4fcf] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
            
            {/* Ícone do usuário */}
            <div className="relative" ref={userDropdownRef}>
              <button
                onClick={handleUserClick}
                className="relative text-gray-700 hover:text-[#7a4fcf] transition-colors duration-200 cursor-pointer"
                aria-label={isLoggedIn ? "Minha conta" : "Entrar"}
                title={isLoggedIn ? "Minha conta" : "Entrar"}
              >
                {isLoggedIn && user?.profilePicture ? (
                  <UserAvatar user={user} size={24} />
                ) : (
                  <FaUser size={24} />
                )}
                {isLoggedIn && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                )}
              </button>

              {/* Dropdown do usuário */}
              {isLoggedIn && userDropdownOpen && (
                <AnimatePresence>
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 top-8 z-50 bg-white rounded-lg shadow-xl border border-gray-200 min-w-[200px]"
                  >
                    {isAdmin ? (
                      <button
                        className="flex items-center gap-3 w-full text-left uppercase text-sm font-normal cursor-pointer text-[#616161] py-3 px-4 hover:bg-gray-50 transition-colors"
                        onClick={() => handleMenuClick("/admin")}
                      >
                        <span className="text-lg" aria-label="Painel Admin" role="img">
                          🛠️
                        </span>
                        PAINEL ADMIN
                      </button>
                    ) : (
                      <>
                        <button
                          className="flex items-center gap-3 w-full text-left uppercase text-sm font-normal cursor-pointer text-[#616161] py-3 px-4 hover:bg-gray-50 transition-colors"
                          onClick={() => handleMenuClick("/minha-conta")}
                        >
                          <span className="text-lg" aria-label="Perfil" role="img">
                            👤
                          </span>
                          MINHA CONTA
                        </button>
                        <button
                          className="flex items-center gap-3 w-full text-left uppercase text-sm cursor-pointer font-normal text-[#616161] py-3 px-4 hover:bg-gray-50 transition-colors"
                          onClick={() => handleMenuClick("/meus-pedidos")}
                        >
                          <span className="text-lg" aria-label="Pedidos" role="img">
                            📦
                          </span>
                          MEUS PEDIDOS
                        </button>
                      </>
                    )}
                    <hr className="border-gray-200" />
                    <button
                      className="flex items-center gap-3 w-full text-left uppercase text-sm cursor-pointer font-light text-red-600 py-3 px-4 hover:bg-red-50 transition-colors"
                      onClick={handleLogout}
                    >
                      <span className="text-lg" aria-label="Sair" role="img">
                        🚪
                      </span>
                      SAIR
                    </button>
                  </motion.div>
                </AnimatePresence>
              )}
            </div>
          </div>
        </div>
      </div>
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
      <SearchModal 
        isOpen={searchModalOpen} 
        onClose={() => setSearchModalOpen(false)} 
      />
    </header>
  );
}