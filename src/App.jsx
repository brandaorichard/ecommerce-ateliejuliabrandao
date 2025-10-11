import React from "react";
import { BrowserRouter, Routes, Route, Navigate, useParams } from "react-router-dom";
import Header from "./components/Header";
import SocialMediasSection from "./components/SocialMediasSection";
import ProductPage from "./components/ProductPage";
import ScrollToTop from "./components/ScrollToTop";
import ToastContainer from "./components/ToastContainer";
import CartDrawer from "./components/CartDrawer";
import Footer from "./components/Footer";

import HomePage from "./pages/HomePage";
import Category1Page from "./pages/Category1Page";
import Category2Page from "./pages/Category2Page";
import Category3Page from "./pages/Category3Page";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ConfirmEmailInstructionPage from "./pages/ConfirmEmailInstructionPage";
import OrdersPage from "./pages/OrdersPage";
import MinhaContaPage from "./pages/MinhaContaPage";
import OrderDetailPage from "./pages/OrderDetailPage";
import PedidoSucessoRedirect from "./pages/PedidoSucessoRedirect"; // importando o redirecionamento
import AdminBabiesPage from "./pages/admin/AdminBabiesPage";
import AdminLayout from "./components/admin/AdminLayout";
import AdminHeroPage from "./pages/admin/AdminHeroPage";
import { useSelector } from "react-redux";

import "./index.css";

import ConfirmEmailPage from "./pages/ConfirmEmailPage"; // importe o componente
import ConfirmEmailChangePage from "./pages/ConfirmEmailChangePage";

import AdminOrdersPage from "./pages/admin/AdminOrdersPage";
import AdminUsersPage from "./pages/admin/AdminUsersPage";
import MaintenancePage from "./components/MaintenancePage"; // Adicione este import

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

const maintenanceMode = true; // Troque para false para desfazer

function App() {
  const [cartOpen, setCartOpen] = React.useState(false);

  return (
    <BrowserRouter>
      {maintenanceMode ? (
        <MaintenancePage />
      ) : (
        <Routes>
          {/* Admin (layout próprio) */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminHeroPage />} />
            <Route path="produtos" element={<AdminBabiesPage />} />
            <Route path="pedidos" element={<AdminOrdersPage />} />
            <Route path="usuarios" element={<AdminUsersPage />} />
          </Route>

          {/* Site público (layout padrão) */}
          <Route
            path="/*"
            element={
              <SiteShell cartOpen={cartOpen} setCartOpen={setCartOpen} />
            }
          />
        </Routes>
      )}
    </BrowserRouter>
  );
}

function SiteShell({ cartOpen, setCartOpen }) {
  return (
    <>
      <ScrollToTop />
      <Header />
      <ToastContainer onViewCart={() => setCartOpen(true)} />
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/categoria1" element={<Category1Page />} />
        <Route path="/categoria2" element={<Category2Page />} />
        <Route path="/categoria3" element={<Category3Page />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        {/* Rota para confirmação de email */}
        <Route path="/confirm-email/:token" element={<ConfirmEmailPage />} />
        <Route path="/confirm-email" element={<ConfirmEmailInstructionPage />} />
        <Route path="/meus-pedidos" element={<OrdersPage />} />
        <Route path="/minha-conta" element={<MinhaContaPage />} />
        <Route path="/pedido/:id" element={<OrderDetailPage />} />
        <Route path="/produto/:slug" element={<ProductPage />} />
        <Route path="/pedido/:id/pendente" element={<PedidoSucessoRedirect />} />
        <Route path="/pedido/:id/sucesso" element={<PedidoSucessoRedirect />} />
        <Route path="/pedido/:id/erro" element={<PedidoSucessoRedirect />} />
        {/* Rota para confirmação de alteração de email */}
        <Route path="/confirm-email-change/:token" element={<ConfirmEmailChangePage />} />
      </Routes>
      <Footer />
      <SocialMediasSection />
    </>
  );
}

export default App;