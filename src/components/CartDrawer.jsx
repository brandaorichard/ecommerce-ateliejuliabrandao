import { AnimatePresence, motion } from "framer-motion";
import React, { useCallback, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { removeFromCart, setQuantity, clearCart } from "../redux/cartSlice";
import { showToast } from "../redux/toastSlice";
import { CartHeader } from "./cart/CartHeader";
import { CartItems } from "./cart/CartItems";
import { FreightSection } from "./cart/FreightSection";
import { CartSummary } from "./cart/CartSummary";
import { useCartImages } from "../hooks/useCartImages";
import { useFrete } from "../hooks/useFrete";
import { createOrder } from "../services/orderCheckout"; // substituir import antigo
import { useNavigate } from "react-router-dom";
import MercadoPagoIcon from "../assets/icons/mercadopago2.png"
import LoginPreview from "./LoginPreview"; // importe o componente
import { login } from "../redux/authSlice"; // ajuste o caminho se necessário
import { initMercadoPago, Wallet } from "@mercadopago/sdk-react";

initMercadoPago(import.meta.env.VITE_MP_PUBLIC_KEY, { locale: 'pt-BR' });

export default function CartDrawer({ open, onClose }) {
  const dispatch = useDispatch();
  const items = useSelector((s) => s.cart.items);
  const token = useSelector((s) => s.auth.token);
  const user = useSelector((s) => s.auth.user);
  const navigate = useNavigate();

  const [numeroCasa, setNumeroCasa] = useState("");
  const [complemento, setComplemento] = useState("");
  const [touched, setTouched] = useState(false);
  const [showLoginPreview, setShowLoginPreview] = useState(false);
  const [preferenceId, setPreferenceId] = useState(null);
  const [loadingCheckout, setLoadingCheckout] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const [clientRequestId] = useState(() => crypto.randomUUID());
  const [lastOrderId, setLastOrderId] = useState(null);
  const [freteAviso, setFreteAviso] = useState(false);
  const [numeroCasaAviso, setNumeroCasaAviso] = useState(false);

  const images = useCartImages(items);
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  const {
    cep,
    fretes,
    freteSelecionado,
    cepInput,
    loadingFrete,
    erroFrete,
    handleCepInputChange,
    calcularFrete,
    handleFreteChange,
    enderecoCep,
  } = useFrete(items);

  const numeroCasaRef = useRef(null);

  const canCheckout =
    !!freteSelecionado &&
    numeroCasa.trim().length > 0; // complemento agora opcional

  const handleQuantity = useCallback(
    (id, quantity) => {
      dispatch(setQuantity({ id, quantity }));
    },
    [dispatch]
  );

  const handleRemoveOne = useCallback(
    (item) => {
      if (item.quantity > 1) {
        dispatch(setQuantity({ id: item.id, quantity: item.quantity - 1 }));
      } else {
        dispatch(removeFromCart(item.id));
      }
      dispatch(
        showToast({
          type: "cart",
          data: {
            product: { ...item, img: images[item.slug] },
            quantity: item.quantity,
            total: subtotal,
            totalQuantity: items.reduce((sum, i) => sum + i.quantity, 0),
          },
        })
      );
    },
    [dispatch, images, subtotal, items]
  );

  const handleStartCheckout = useCallback(async () => {
    if (loadingCheckout || orderId || preferenceId) return;

    setTouched(true);

    if (!freteSelecionado) {
      setFreteAviso(true);
      setTimeout(() => setFreteAviso(false), 3000);
      return;
    }
    if (!canCheckout) {
      setNumeroCasaAviso(true);
      numeroCasaRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      setTimeout(() => setNumeroCasaAviso(false), 3000);
      return;
    }
    if (!token) {
      dispatch(showToast({ type: "error", message: "Você precisa estar logado para finalizar a compra." }));
      setShowLoginPreview(true);
      return;
    }

    try {
      setLoadingCheckout(true);

      // 1. Cria pedido
      const orderResult = await createOrder({
        token,
        items,
        freteSelecionado,
        subtotal,
        address: {
          cep: enderecoCep?.cep || cepInput || cep,
          logradouro: enderecoCep?.logradouro || "",
          bairro: enderecoCep?.bairro || "",
          cidade: enderecoCep?.localidade || "",
          uf: enderecoCep?.uf || "",
          numero: numeroCasa,
          complemento,
        },
        dispatch,
        clientRequestId,
      });

      if (!orderResult.ok || !orderResult.order?._id) {
        setLoadingCheckout(false);
        return;
      }

      const createdOrder = orderResult.order;
      setOrderId(createdOrder._id);

      // 2. Gera preference usando somente orderId + buyer (ajuste backend)
      const buyerEmail = createdOrder.payer?.email || createdOrder.userEmail || user?.email;
      const prefRes = await fetch(
        "https://atelie-juliabrandao-backend-production.up.railway.app/api/checkout/preference",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: 'include',
          body: JSON.stringify({
            orderId: createdOrder._id,
            buyer: { email: buyerEmail },
          }),
        }
      );

      const prefData = await prefRes.json().catch(() => ({}));
      if (!prefRes.ok || !prefData.preferenceId) {
        dispatch(showToast({ type: "error", message: "Erro ao gerar preferência de pagamento." }));
        setLoadingCheckout(false);
        return;
      }

      setPreferenceId(prefData.preferenceId);
    } catch (err) {
      console.error(err);
      dispatch(showToast({ type: "error", message: "Falha ao iniciar checkout." }));
    } finally {
      setLoadingCheckout(false);
    }
  }, [
    loadingCheckout,
    orderId,
    preferenceId,
    freteSelecionado,
    canCheckout,
    token,
    items,
    subtotal,
    enderecoCep,
    cepInput,
    cep,
    numeroCasa,
    complemento,
    dispatch,
    clientRequestId,
    user
  ]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-50 bg-black"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            aria-label="Fechar carrinho"
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.25 }}
            className="fixed top-0 right-0 h-full z-60 cart-drawer-custom bg-[#f9e7f6] shadow-[ -4px_0_16px_0_rgba(174,149,217,0.18)]"
          >
            <style>
              {`
              .cart-drawer-custom { width:100vw;max-width:100vw;}
              @media (min-width:768px){
                .cart-drawer-custom { width:30vw!important;min-width:320px!important;max-width:420px!important;}
              }
              `}
            </style>
            <div className="h-full flex flex-col">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <CartHeader onClose={onClose} />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.3 }}
                className="flex-1 overflow-y-auto px-3 md:px-6 py-4"
              >
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.3 }}
                >
                  <CartItems
                    items={items}
                    images={images}
                    onDec={(item) =>
                      handleQuantity(item.id, Math.max(1, item.quantity - 1))
                    }
                    onInc={(item) => handleQuantity(item.id, item.quantity + 1)}
                    onRemove={handleRemoveOne}
                  />
                </motion.div>
                {items.length > 0 && (
                  <motion.div
                    id="frete-card"
                    className="mt-4"
                  >
                    <div className="relative">
                      <FreightSection
                        fullWidth
                        cepInput={cepInput}
                        onCepChange={handleCepInputChange}
                        onCalcular={calcularFrete}
                        loadingFrete={loadingFrete}
                        erroFrete={erroFrete}
                        opcoesFrete={fretes || []}
                        freteSelecionado={freteSelecionado}
                        onSelectFrete={(frete) => {
                          handleFreteChange(frete);
                          setFreteAviso(false);
                        }}
                        endereco={enderecoCep}
                        showCepInput={!cep || cep.length !== 8}
                      />
                      {freteAviso && (
                        <p
                          className="text-xs text-red-600 mt-2 transition-opacity duration-300"
                          style={{ opacity: freteAviso ? 1 : 0 }}
                        >
                          Selecione uma opção de frete para continuar.
                        </p>
                      )}
                    </div>
                  </motion.div>
                )}

                {items.length > 0 && enderecoCep && (
                  <motion.section
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.3 }}
                    className="mt-6"
                  >
                    <h3 className="text-sm font-semibold mb-2">
                      Dados da entrega
                    </h3>
                    <div className="border border-gray-300 rounded bg-[#f9e7f6] px-3 py-2 text-xs mb-3 leading-snug">
                      <div>{enderecoCep.logradouro}</div>
                      <div>
                        {enderecoCep.bairro} - {enderecoCep.localidade}/{enderecoCep.uf}
                      </div>
                      <div>CEP: {enderecoCep.cep}</div>
                    </div>
                    {/* inputs de número e complemento */}
                    <div className="grid gap-3">
                      <div>
                        <label className="block text-xs font-medium mb-1">
                          Número *
                        </label>
                        <input
                          ref={numeroCasaRef}
                          className={`w-full border rounded px-3 py-2 text-xs transition-all duration-300 ${
                            numeroCasaAviso ? "border-2 border-red-500" : "border-gray-300"
                          }`}
                          value={numeroCasa}
                          onChange={(e) => setNumeroCasa(e.target.value)}
                          placeholder="Ex: 123"
                        />
                        {numeroCasaAviso && (
                          <p
                            className="text-[11px] text-red-600 mt-2 transition-opacity duration-300"
                            style={{ opacity: numeroCasaAviso ? 1 : 0 }}
                          >
                            Preencha o número da casa.
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="block text-xs font-medium mb-1">
                          Complemento
                        </label>
                        <input
                          className="w-full border border-gray-300 rounded px-3 py-2 text-xs"
                          value={complemento}
                          onChange={(e) => setComplemento(e.target.value)}
                          placeholder="Ex: Apto 01 / Bloco B"
                        />
                        {/* Nenhum aviso de erro aqui! */}
                      </div>
                    </div>
                  </motion.section>
                )}
              </motion.div>

              {items.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.3 }}
                  className="sticky bottom-0 left-0 right-0 bg-[#f9e7f6] px-3 md:px-6 py-4 z-10"
                >
                  {/* Bloco do total */}
                  <div className="mb-3">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Subtotal</span>
                      <span>
                        {subtotal.toLocaleString("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        })}
                      </span>
                    </div>
                    {freteSelecionado && (
                      <div className="flex justify-between text-sm mb-1">
                        <span>Frete</span>
                        <span>
                          {freteSelecionado.isNegotiation 
                            ? "A combinar"
                            : Number(freteSelecionado.price).toLocaleString("pt-BR", {
                              style: "currency",
                              currency: "BRL",
                            })
                          }
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between font-semibold text-base mt-2">
                      <span>Total</span>
                      <span>
                        {freteSelecionado?.isNegotiation 
                          ? `${subtotal.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })} + frete a combinar`
                          : (subtotal + (freteSelecionado ? Number(freteSelecionado.price) : 0)).toLocaleString("pt-BR", {
                              style: "currency",
                              currency: "BRL",
                            })
                        }
                      </span>
                    </div>
                  </div>
                  {/* Bloco fixo Mercado Pago */}
                  <div className="flex items-center gap-2 border border-[#1c70df] bg-[#f9e7f6] rounded px-3 py-2 mb-3">
                    <img
                      src={MercadoPagoIcon}
                      alt="Mercado Pago"
                      className="h-12 w-auto"
                      style={{
                        background: "transparent",
                        display: "inline-block",
                        verticalAlign: "middle",
                      }}
                    />
                    <div>
                      {!preferenceId ? (
                        <div className="">
                          <div className="text-sm text-gray-700">
                            O pagamento é realizado pelo Mercado Pago, ambiente seguro.
                          </div>
                          {/* <div className="text-xs text-gray-500">
                            Você será direcionado para o Mercado Pago após iniciar a compra.
                          </div> */}
                        </div>
                      ) : (
                        <div className="">
                          <div className="text-sm text-gray-700">
                            Clique abaixo para prosseguir com o pagamento via Mercado Pago.
                          </div>
                          <div className="text-xs text-gray-500">
                            Se não tiver conta Mercado Pago, use seu e-mail.
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  {/* Botão de ação */}
                  {!preferenceId ? (
                    <button
                      className="w-full rounded-full py-3 font-medium transition flex items-center justify-center gap-2 bg-[#7a4fcf] hover:bg-[#ae95d9] text-white disabled:opacity-60"
                      onClick={handleStartCheckout}
                      disabled={loadingCheckout || !!orderId}
                    >
                      {loadingCheckout
                        ? "Processando..."
                        : orderId
                          ? "Gerando pagamento..."
                          : "Iniciar compra"}
                    </button>
                  ) : (
                    <div style={{ width: "100%", maxWidth: 395, margin: "0 auto" }}>
                      <Wallet initialization={{ preferenceId }} />
                    </div>
                  )}
                </motion.div>
              )}
            </div>
          </motion.div>
          <LoginPreview
            open={showLoginPreview}
            onClose={() => setShowLoginPreview(false)}
            onLogin={async ({ user, token }) => {
              dispatch(login({ user, token }));
              setShowLoginPreview(false);
              dispatch(
                showToast({
                  message: "Login realizado com sucesso!",
                  iconType: "success",
                })
              );
            }}
            onCreateAccount={() => {
              setShowLoginPreview(false); // fecha o preview de login
              onClose?.(); // minimiza/retrai o carrinho
              navigate("/register"); // mostra a página de cadastro
            }}
          />
        </>
      )}
    </AnimatePresence>
  );
}
