import React, { lazy, Suspense, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate, useParams, useLocation } from "react-router-dom";
import Header from "./components/Header";
import SocialMediasSection from "./components/SocialMediasSection";
import ProductPage from "./components/ProductPage";
import CourseProductPage from "./components/CourseProductPage";
import ScrollToTop from "./components/ScrollToTop";
import ToastContainer from "./components/ToastContainer";
import CartDrawer from "./components/CartDrawer";
import Footer from "./components/Footer";
import LoadingSpinner from "./components/LoadingSpinner";
import CookieConsent from "./components/CookieConsent";
import { trackPageView } from "./utils/analytics";

// Lazy loading das páginas
const HomePage = lazy(() => import("./pages/HomePage"));
const Category1Page = lazy(() => import("./pages/Category1Page"));
const Category2Page = lazy(() => import("./pages/Category2Page"));
const Category3Page = lazy(() => import("./pages/Category3Page"));
const CursosPage = lazy(() => import("./pages/CursosPage"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const RegisterPage = lazy(() => import("./pages/RegisterPage"));
const ConfirmEmailInstructionPage = lazy(() => import("./pages/ConfirmEmailInstructionPage"));
const OrdersPage = lazy(() => import("./pages/OrdersPage"));
const MinhaContaPage = lazy(() => import("./pages/MinhaContaPage"));
const OrderDetailPage = lazy(() => import("./pages/OrderDetailPage"));
const PedidoSucessoRedirect = lazy(() => import("./pages/PedidoSucessoRedirect"));
const ConfirmEmailPage = lazy(() => import("./pages/ConfirmEmailPage"));
const ConfirmEmailChangePage = lazy(() => import("./pages/ConfirmEmailChangePage"));
const PoliticaPrivacidadePage = lazy(() => import("./pages/PoliticaPrivacidadePage"));
const TermosUsoPage = lazy(() => import("./pages/TermosUsoPage"));
const PoliticaTrocasPage = lazy(() => import("./pages/PoliticaTrocasPage"));
const EvaluateOrderPage = lazy(() => import("./pages/EvaluateOrderPage"));
const ForgotPasswordPage = lazy(() => import("./pages/ForgotPasswordPage"));
const ResetPasswordPage = lazy(() => import("./pages/ResetPasswordPage"));

// Admin pages
const AdminBabiesPage = lazy(() => import("./pages/admin/AdminBabiesPage"));
const AdminOrdersPage = lazy(() => import("./pages/admin/AdminOrdersPage"));
const AdminUsersPage = lazy(() => import("./pages/admin/AdminUsersPage"));
const AdminCarouselPage = lazy(() => import("./pages/admin/AdminCarouselPage"));
const AdminFeaturedPage = lazy(() => import("./pages/admin/AdminFeaturedPage"));
const AdminAnalyticsPage = lazy(() => import("./pages/admin/AdminAnalyticsPage"));
const AdminReviewsPage = lazy(() => import("./pages/admin/AdminReviewsPage"));
const AdminCategoriesPage = lazy(() => import("./pages/admin/AdminCategoriesPage"));
const AdminCouponsPage = lazy(() => import("./pages/admin/AdminCouponsPage"));
const AdminCoursesPage = lazy(() => import("./pages/admin/AdminCoursesPage"));

import AdminLayout from "./components/admin/AdminLayout";
import AdminHeroPage from "./pages/admin/AdminHeroPage";
import { useSelector } from "react-redux";

import "./index.css";

// Página de redirecionamento
function PedidoRedirect() {
  const { id } = useParams();
  return <Navigate to={`/pedido/${id}`} replace />;
}

// Componente de rota protegida
function AdminRoute({ children }) {
  const user = useSelector(s => s.auth.user);
  const token = useSelector(s => s.auth.token);
  if (!token) return <Navigate to="/login" replace />;
  if (user?.role !== "admin") return <Navigate to="/" replace />;
  return children;
}

// Componente para rastrear mudanças de rota
function RouteTracker() {
  const location = useLocation();

  useEffect(() => {
    trackPageView(location.pathname);
  }, [location]);

  return null;
}

function App() {
  const [cartOpen, setCartOpen] = React.useState(false);
  // const user = useSelector(s => s.auth.user);
  // const isAdmin = user?.role === "admin";

  return (
    <BrowserRouter>
      <RouteTracker />
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          {/* Admin (layout próprio) */}
          <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
            <Route index element={<AdminHeroPage />} />
            <Route path="produtos" element={<AdminBabiesPage />} />
            <Route path="cursos" element={<AdminCoursesPage />} />
            <Route path="pedidos" element={<AdminOrdersPage />} />
            <Route path="usuarios" element={<AdminUsersPage />} />
            <Route path="carrossel" element={<AdminCarouselPage />} />
            <Route path="destaques" element={<AdminFeaturedPage />} />
            <Route path="analytics" element={<AdminAnalyticsPage />} />
            <Route path="avaliacoes" element={<AdminReviewsPage />} />
            <Route path="categorias" element={<AdminCategoriesPage />} />
            <Route path="cupons" element={<AdminCouponsPage />} />
          </Route>

          {/* Site público (layout padrão) */}
          <Route
            path="/*"
            element={
              <SiteShell cartOpen={cartOpen} setCartOpen={setCartOpen} />
            }
          />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

function SiteShell({ cartOpen, setCartOpen }) {
  const location = useLocation();
  const isLoginOrRegister = location.pathname === "/login" || location.pathname === "/register";
  
  return (
    <>
      <ScrollToTop />
      <Header />
      <ToastContainer onViewCart={() => setCartOpen(true)} />
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
      <main>
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/categoria1" element={<Category1Page />} />
          <Route path="/categoria2" element={<Category2Page />} />
          <Route path="/categoria3" element={<Category3Page />} />
          <Route path="/cursos" element={<CursosPage />} />
          <Route path="/cursos/:slug" element={<CourseProductPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          {/* Rota para confirmação de email */}
          <Route path="/confirm-email/:token" element={<ConfirmEmailPage />} />
          <Route path="/confirm-email" element={<ConfirmEmailInstructionPage />} />
          <Route path="/meus-pedidos" element={<OrdersPage />} />
          <Route path="/minha-conta" element={<MinhaContaPage />} />
          <Route path="/pedido/:id" element={<OrderDetailPage />} />
          <Route path="/produto/:slug" element={<ProductPage onOpenCart={() => setCartOpen(true)} />} />
          <Route path="/pedido/:id/pendente" element={<PedidoSucessoRedirect />} />
          <Route path="/pedido/:id/sucesso" element={<PedidoSucessoRedirect />} />
          <Route path="/pedido/:id/erro" element={<PedidoSucessoRedirect />} />
          {/* Rota para confirmação de alteração de email */}
          <Route path="/confirm-email-change/:token" element={<ConfirmEmailChangePage />} />
          {/* Rota de avaliação de produto */}
          <Route path="/avaliar/:orderId/:babyId" element={<EvaluateOrderPage />} />
          {/* Rotas de recuperação de senha */}
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
          {/* Rotas legais */}
          <Route path="/politica-privacidade" element={<PoliticaPrivacidadePage />} />
          <Route path="/termos-uso" element={<TermosUsoPage />} />
          <Route path="/politica-trocas" element={<PoliticaTrocasPage />} />
        </Routes>
        </Suspense>
      </main>
      {!isLoginOrRegister && <Footer />}
      <SocialMediasSection />
      <CookieConsent />
    </>
  );
}

export default App;