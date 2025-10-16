import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useParams, Navigate, useLocation } from "react-router-dom";
import { clearCart } from "../redux/cartSlice";

export default function PedidoSucessoRedirect() {
  const dispatch = useDispatch();
  const { id } = useParams();
  const location = useLocation();

  useEffect(() => {
    // Only clear cart on successful or pending payment
    // Keep items on failed payment
    const pathname = location.pathname;
    if (pathname.includes('/sucesso') || pathname.includes('/pendente')) {
      dispatch(clearCart());
    }
    // Do nothing if pathname includes '/erro'
  }, [dispatch, location.pathname]);

  // Redireciona para o detalhe do pedido
  return <Navigate to={`/pedido/${id}`} replace />;
}