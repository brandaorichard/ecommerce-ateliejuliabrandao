import { useSelector, useDispatch } from "react-redux";
import { Navigate, Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { logout } from "../../redux/authSlice";
import { useState } from "react";

export default function AdminLayout() {
  const token = useSelector(s => s.auth.token);
  const user = useSelector(s => s.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [navOpen, setNavOpen] = useState(false);
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
      <header className="flex items-center justify-between px-4 md:px-6 h-12 md:h-14 border-b border-[#e0d6f7] bg-white/80 backdrop-blur">
        <div className="flex items-center gap-4 md:gap-6">
          <Link to="/admin" className="text-base md:text-lg font-semibold tracking-wide text-[#7a4fcf]">
            Ateliê Admin
          </Link>
          <div className="relative">
            <button
              onClick={() => setNavOpen(o => !o)}
              className="
                px-2 py-1 text-[11px]
                bg-[#f7f3fa] hover:bg-[#eae6f7] rounded
                border border-[#e0d6f7]
                md:px-3 md:py-1.5 md:text-sm
              "
            >
              Navegar ▾
            </button>
            {navOpen && (
              <div className="absolute mt-1 md:mt-2 w-40 md:w-48 bg-white border border-[#e0d6f7] rounded shadow-lg z-20">
                <Link
                  to="/admin/produtos"
                  onClick={() => setNavOpen(false)}
                  className="block px-3 py-2 text-xs md:text-sm hover:bg-[#f7f3fa] text-[#7a4fcf]"
                >
                  Produtos
                </Link>
                <Link
                  to="/admin/pedidos"
                  onClick={() => setNavOpen(false)}
                  className="block px-3 py-2 text-xs md:text-sm hover:bg-[#f7f3fa] text-[#7a4fcf]"
                >
                  Pedidos
                </Link>
                <Link
                  to="/admin/usuarios"
                  onClick={() => setNavOpen(false)}
                  className="block px-3 py-2 text-xs md:text-sm hover:bg-[#f7f3fa] text-[#7a4fcf]"
                >
                  Usuários
                </Link>
                <Link
                  to="/admin/carrossel"
                  onClick={() => setNavOpen(false)}
                  className="block px-3 py-2 text-xs md:text-sm hover:bg-[#f7f3fa] text-[#7a4fcf]"
                >
                  Carrossel
                </Link>
                <Link
                  to="/admin/analytics"
                  onClick={() => setNavOpen(false)}
                  className="block px-3 py-2 text-xs md:text-sm hover:bg-[#f7f3fa] text-[#7a4fcf]"
                >
                  📊 Analytics
                </Link>
              </div>
            )}
          </div>
        </div>

        <div className="relative">
          <button
            onClick={() => setUserMenu(m => !m)}
            className="
              flex items-center gap-1 md:gap-2
              px-2 py-1 text-[11px]
              bg-[#f7f3fa] hover:bg-[#eae6f7] rounded
              border border-[#e0d6f7]
              md:px-3 md:py-1.5 md:text-sm
            "
          >
            <span className="w-6 h-6 rounded-full bg-gradient-to-br from-[#7a4fcf] to-[#ae95d9] text-[11px] md:text-xs flex items-center justify-center text-white">
              {user?.nome?.[0]?.toUpperCase() || "A"}
            </span>
            <span className="hidden sm:inline text-[#7a4fcf]">{user?.nome?.split(" ")[0] || "Admin"}</span>
            ▾
          </button>
          {userMenu && (
            <div className="absolute right-0 mt-1 md:mt-2 w-40 md:w-44 bg-white border border-[#e0d6f7] rounded shadow-lg z-20">
              <button
                onClick={() => { setUserMenu(false); navigate("/"); }}
                className="w-full text-left px-3 py-2 text-xs md:text-sm hover:bg-[#f7f3fa] text-[#7a4fcf]"
              >
                Ir ao Site
              </button>
              <button
                onClick={doLogout}
                className="w-full text-left px-3 py-2 text-xs md:text-sm hover:bg-[#f7f3fa] text-red-500"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </header>
      <main className="flex-1 p-4 md:p-6 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}