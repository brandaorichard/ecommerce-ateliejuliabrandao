import { useSelector, useDispatch } from "react-redux";
import { Navigate, Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { logout } from "../../redux/authSlice";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import logo from "../../assets/logo.png";

const NAV_ITEMS = [
  { icon: '👶', label: 'Produtos', path: '/admin/produtos' },
  { icon: '📚', label: 'Cursos', path: '/admin/cursos' },
  { icon: '📦', label: 'Pedidos', path: '/admin/pedidos' },
  { icon: '👥', label: 'Usuários', path: '/admin/usuarios' },
  { icon: '🎠', label: 'Carrossel', path: '/admin/carrossel' },
  { icon: '🖼️', label: 'Categorias', path: '/admin/categorias' },
  { icon: '🎯', label: 'Destaques', path: '/admin/destaques' },
  { icon: '📊', label: 'Analytics', path: '/admin/analytics' },
  { icon: '⭐', label: 'Avaliações', path: '/admin/avaliacoes' },
  { icon: '🎟️', label: 'Cupons', path: '/admin/cupons' },
];

export default function AdminLayout() {
  const token = useSelector(s => s.auth.token);
  const user = useSelector(s => s.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenu, setUserMenu] = useState(false);

  if (!token || user?.role !== "admin") {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  function doLogout() {
    dispatch(logout());
    navigate("/login");
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-white via-[#f7f3fa] to-[#eae6f7] text-neutral-900">
      {/* Header */}
      <header className="sticky top-0 z-40 flex items-center justify-between px-4 md:px-6 h-16 border-b border-[#e0d6f7] bg-white/90 backdrop-blur-md shadow-sm">
        <div className="flex items-center gap-4">
          {/* Botão Hamburger */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-lg hover:bg-[#f7f3fa] transition-colors"
            aria-label="Abrir menu"
          >
            <svg
              className="w-6 h-6 text-[#7a4fcf]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>

          {/* Logo e Título */}
          <Link to="/admin" className="flex items-center gap-3">
            <img src={logo} alt="Logo" className="h-10 w-auto" />
            <span className="hidden sm:block text-lg font-semibold tracking-wide text-[#7a4fcf]">
              Painel Admin
            </span>
          </Link>
        </div>

        {/* User Menu */}
        <div className="relative">
          <button
            onClick={() => setUserMenu(m => !m)}
            className="flex items-center gap-2 px-3 py-2 bg-[#f7f3fa] hover:bg-[#eae6f7] rounded-lg border border-[#e0d6f7] transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#7a4fcf] to-[#ae95d9] flex items-center justify-center text-white font-medium text-sm">
              {user?.nome?.[0]?.toUpperCase() || "A"}
            </div>
            <span className="hidden sm:inline text-sm font-medium text-[#7a4fcf]">
              {user?.nome?.split(" ")[0] || "Admin"}
            </span>
            <svg
              className={`w-4 h-4 text-[#7a4fcf] transition-transform ${userMenu ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          <AnimatePresence>
            {userMenu && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 mt-2 w-48 bg-white border border-[#e0d6f7] rounded-lg shadow-xl overflow-hidden"
              >
                <button
                  onClick={() => { setUserMenu(false); navigate("/"); }}
                  className="w-full text-left px-4 py-3 text-sm hover:bg-[#f7f3fa] text-[#7a4fcf] flex items-center gap-2 transition-colors"
                >
                  <span className="text-lg">🏠</span>
                  Ir ao Site
                </button>
                <div className="border-t border-[#e0d6f7]" />
                <button
                  onClick={doLogout}
                  className="w-full text-left px-4 py-3 text-sm hover:bg-red-50 text-red-600 flex items-center gap-2 transition-colors"
                >
                  <span className="text-lg">🚪</span>
                  Logout
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>

      {/* Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
              onClick={() => setSidebarOpen(false)}
            />

            {/* Sidebar */}
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed left-0 top-0 bottom-0 w-full sm:w-96 bg-white shadow-2xl z-50 overflow-y-auto"
            >
              {/* Sidebar Header */}
              <div className="sticky top-0 bg-gradient-to-r from-[#7a4fcf] to-[#ae95d9] p-6 text-white">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <img src={logo} alt="Logo" className="h-12 w-auto" />
                    <div>
                      <h2 className="text-xl font-semibold">Ateliê Julia Brandão</h2>
                      <p className="text-sm text-white/80">Painel Administrativo</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSidebarOpen(false)}
                    className="p-2 rounded-lg hover:bg-white/20 transition-colors"
                    aria-label="Fechar menu"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>

                {/* User Info in Sidebar */}
                <div className="flex items-center gap-3 p-3 bg-white/10 rounded-lg backdrop-blur-sm">
                  <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-white font-semibold text-lg">
                    {user?.nome?.[0]?.toUpperCase() || "A"}
                  </div>
                  <div>
                    <p className="font-medium">{user?.nome || "Administrador"}</p>
                    <p className="text-xs text-white/70">{user?.email}</p>
                  </div>
                </div>
              </div>

              {/* Navigation Links */}
              <nav className="p-4 space-y-2">
                <Link
                  to="/admin"
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    location.pathname === '/admin'
                      ? 'bg-gradient-to-r from-[#7a4fcf] to-[#ae95d9] text-white shadow-lg'
                      : 'hover:bg-[#f7f3fa] text-gray-700'
                  }`}
                >
                  <span className="text-2xl">🏠</span>
                  <span className="font-medium">Início</span>
                </Link>

                <div className="pt-4 pb-2">
                  <h3 className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Gerenciamento
                  </h3>
                </div>

                {NAV_ITEMS.map((item) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                        isActive
                          ? 'bg-gradient-to-r from-[#7a4fcf] to-[#ae95d9] text-white shadow-lg'
                          : 'hover:bg-[#f7f3fa] text-gray-700'
                      }`}
                    >
                      <span className="text-2xl">{item.icon}</span>
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  );
                })}
              </nav>

              {/* Sidebar Footer */}
              <div className="sticky bottom-0 p-4 bg-gray-50 border-t border-gray-200">
                <button
                  onClick={() => { setSidebarOpen(false); navigate("/"); }}
                  className="w-full mb-2 px-4 py-3 bg-white hover:bg-gray-100 text-[#7a4fcf] rounded-lg border border-[#e0d6f7] transition-colors font-medium flex items-center justify-center gap-2"
                >
                  <span>🏠</span>
                  Voltar ao Site
                </button>
                <button
                  onClick={doLogout}
                  className="w-full px-4 py-3 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg border border-red-200 transition-colors font-medium flex items-center justify-center gap-2"
                >
                  <span>🚪</span>
                  Sair do Painel
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
