import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { PiListLight } from "react-icons/pi";
import { FaTimes, FaUser, FaUserPlus, FaShoppingCart } from "react-icons/fa";
import { AnimatePresence, motion } from "framer-motion";
import AnimatedLogo from "./AnimatedLogo";
import CategoriesMenu from "./CategoriesMenu";
import CartDrawer from "./CartDrawer";
import MobileSearchBar from "./MobileSearchBar";
import UserAvatar from "./UserAvatar";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/authSlice";
import { showToast } from "../redux/toastSlice";

export default function MobileHeader({
  menuOpen,
  setMenuOpen,
  scrolled,
  logoVariant,
  transition,
  categories,
}) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const [cartOpen, setCartOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const userDropdownRef = useRef(null);

  const cartCount = useSelector((state) =>
    state.cart.items.reduce((sum, item) => sum + item.quantity, 0)
  );
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const user = useSelector((state) => state.auth.user);
  const isAdmin = user?.role === "admin";

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

  const handleLogoClick = () => {
    if (location.pathname === "/") {
      window.location.reload();
    } else {
      navigate("/");
    }
    if (menuOpen) setMenuOpen(false);
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

      <div className="border-b border-[#e5d3e9] shadow-[0_2px_8px_0_rgba(174,149,217,0.08)] bg-[#f9e7f6]">
        {/* SEÇÃO 1: Header original - altura h-28 */}
        <div className="relative flex items-center h-28 px-[20px] max-w-[1246px] mx-auto">
          {/* Menu à esquerda */}
          <div className="flex-1 flex items-center justify-start">
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

          {/* Usuário + Carrinho à direita */}
          <div className="flex-1 flex items-center justify-end">
            <div
              className={`flex items-center gap-3 ${
                isLoggedIn ? "-mr-0" : ""
              }`}
            >
              {/* Ícone do usuário */}
              <div className="relative flex items-center" ref={userDropdownRef}>
                <button
                  onClick={handleUserClick}
                  className="relative flex items-center justify-center text-gray-700 hover:text-[#7a4fcf] transition-colors duration-200"
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

              {/* Ícone do carrinho */}
              <button
                onClick={() => setCartOpen(true)}
                className="relative flex items-center justify-center text-gray-700 hover:text-[#7a4fcf] transition-colors duration-200"
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
            </div>
          </div>
        </div>

        {/* SEÇÃO 2: Barra de pesquisa - nova seção independente */}
        <AnimatePresence>
          {!scrolled && (
            <motion.div
              key="search-section"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="px-[20px] py-2 max-w-[1246px] mx-auto"
            >
              <MobileSearchBar />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            key="menu-fullscreen"
            initial={{ opacity: 0, x: -300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -300 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 bg-[#f9e7f6] overflow-y-auto flex flex-col"
          >
            {/* Header do menu com título e botão fechar */}
            <div className="flex items-center justify-between p-5 border-b border-[#e5d3e9]">
              <h2 className="text-lg font-light text-neutral-900">Menu</h2>
              <button
                onClick={() => setMenuOpen(false)}
                aria-label="Fechar menu"
                className="p-2 hover:bg-[#e0d6f7] rounded-full transition-colors"
              >
                <FaTimes className="text-[#616161] text-xl" />
              </button>
            </div>

            {/* Input de pesquisa */}
            <div className="p-5 border-b border-[#e5d3e9]">
              <MobileSearchBar onClose={() => setMenuOpen(false)} />
            </div>

            {/* Categorias */}
            <div className="flex-1 p-5">
              <CategoriesMenu
                categories={categories}
                animated
                onCategoryClick={(idx) => {
                  if (idx === 0) navigate("/categoria1");
                  if (idx === 1) navigate("/categoria2");
                  if (idx === 2) navigate("/categoria3");
                  if (idx === 3) navigate("/cursos");
                  setMenuOpen(false);
                }}
              />
            </div>

            {/* Rodapé com login/cadastro */}
            <div className="border-t border-[#e5d3e9] p-5 bg-[#f9e7f6]">
              {isLoggedIn ? (
                // Se já logado, mostrar "Minha Conta"
                <Link
                  to="/minha-conta"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 text-neutral-900 hover:text-[#7a4fcf] transition-colors"
                >
                  <FaUser size={20} />
                  <span className="text-sm font-medium">Minha Conta</span>
                </Link>
              ) : (
                // Se não logado, mostrar Login e Criar Conta lado a lado
                <div className="flex gap-3">
                  <Link
                    to="/login"
                    onClick={() => setMenuOpen(false)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 
                               border border-[#7a4fcf] rounded text-[#7a4fcf] hover:bg-[#f7f3fa] 
                               transition-colors text-sm font-medium"
                  >
                    <FaUser size={16} />
                    <span>Entrar</span>
                  </Link>
                  <Link
                    to="/cadastro"
                    onClick={() => setMenuOpen(false)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 
                               bg-[#7a4fcf] hover:bg-[#ae95d9] rounded text-white 
                               transition-colors text-sm font-medium"
                  >
                    <FaUserPlus size={16} />
                    <span>Cadastrar</span>
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
