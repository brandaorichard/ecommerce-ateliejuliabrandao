import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/authSlice";
import { showToast } from "../redux/toastSlice"; // <-- IMPORTANTE
import { useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import UserAvatar from "./UserAvatar";

export default function UserButton({ mobileFaixa = false }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const user = useSelector((state) => state.auth.user);
  const isAdmin = user?.role === "admin";
  const [open, setOpen] = useState(false);
  const ref = useRef();

  // Determinar se o usuário tem foto do Google
  const hasGooglePhoto = isLoggedIn && user?.profilePicture;
  
  // Tamanho do avatar baseado no contexto (mobile/desktop)
  const avatarSize = mobileFaixa ? 28 : 36; // Desktop: 36px, Mobile: 28px (aumentado)

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const handleLogout = () => {
    dispatch(logout());
    setOpen(false);
    dispatch(
      showToast({
        message: "Logout realizado com sucesso!",
        iconType: "logout",
      })
    );
    navigate("/login");
  };

  const handleMenu = (path) => {
    setOpen(false);
    navigate(path);
  };

  return (
    <div className={`relative ${mobileFaixa ? "h-[25px]" : ""}`} ref={ref}>
      <button
        className={`flex items-center justify-center transition cursor-pointer focus:outline-none
          ${mobileFaixa ? "bg-transparent text-gray-700" : "text-gray-700 hover:text-[#7a4fcf]"}
        `}
        style={mobileFaixa ? { height: 22, minHeight: 0 } : {}}
        onClick={() => (isLoggedIn ? setOpen((o) => !o) : navigate("/login"))}
        type="button"
      >
        {/* Se tem foto do Google, mostrar apenas a foto */}
        {hasGooglePhoto ? (
          <div className="relative">
            <UserAvatar user={user} size={avatarSize} />
            {/* Indicador verde quando logado */}
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
          </div>
        ) : (
          /* Comportamento padrão para usuários sem Google */
          <div className="relative">
            {/* Ícone de usuário */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`${mobileFaixa ? "h-4 w-4" : "h-5 w-5"}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 2.3-5 5 2.3 5 5 5zm0 2c-3.3 0-10 1.7-10 5v3h20v-3c0-3.3-6.7-5-10-5z"
              />
            </svg>
            {/* Indicador verde quando logado */}
            {isLoggedIn && (
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
            )}
          </div>
        )}
      </button>
      {isLoggedIn && open && (
        <AnimatePresence>
          <motion.div
            key="user-dropdown"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="
        absolute right-2 top-6.5 z-50
        bg-[#f9e7f6]
        rounded-sm
        shadow-xl
        border border-[#f9e7f6]/80
        flex flex-col items-start
        min-w-[200px]
        max-w-[40vw]
        md:min-w-[200px] md:max-w-[48vw]
      "
          >
            {isAdmin ? (
              <button
                className="flex items-center gap-3 w-full text-left uppercase text-md font-normal cursor-pointer text-[#616161] py-5 px-8 rounded-t-sm"
                onClick={() => handleMenu("/admin")}
              >
                <span className="text-xl" aria-label="Painel Admin" role="img">
                  🛠️
                </span>
                PAINEL ADMIN
              </button>
            ) : (
              <>
                <button
                  className="flex items-center gap-3 w-full text-left uppercase text-md font-normal cursor-pointer text-[#616161] py-5 px-8 rounded-t-sm"
                  onClick={() => handleMenu("/minha-conta")}
                >
                  <span className="text-xl" aria-label="Perfil" role="img">
                    👤
                  </span>
                  MINHA CONTA
                </button>
                <button
                  className="flex items-center gap-3 w-full text-left uppercase text-md cursor-pointer font-normal text-[#616161] py-5 px-8"
                  onClick={() => handleMenu("/meus-pedidos")}
                >
                  <span className="text-xl" aria-label="Pedidos" role="img">
                    📦
                  </span>
                  MEUS PEDIDOS
                </button>
              </>
            )}
            <button
              className="flex items-center gap-3 w-full text-left uppercase text-md cursor-pointer font-light text-red-600 py-5 px-8"
              onClick={handleLogout}
            >
              <span
                className="inline-flex items-center justify-center rounded-full bg-white"
                style={{ width: "1.5em", height: "1.5em" }}
              >
                {/* SVG logout */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-[1em] w-[1em]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="black"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1"
                  />
                </svg>
              </span>
              SAIR
            </button>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}
