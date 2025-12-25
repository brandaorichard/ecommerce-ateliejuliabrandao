// Serviço responsável apenas por criar o pedido.
// Mantém deliveryAddress como String (schema atual).
import { showToast } from "../redux/toastSlice";
import { trackBeginCheckout, trackPurchaseComplete } from "../utils/analytics";

// Renomeado de createOrderAndCheckout -> createOrder
export async function createOrder({
  token,
  items,
  freteSelecionado,
  subtotal,
  dispatch,
  address,                 // { cep, logradouro, bairro, cidade, uf, numero, complemento }
  paymentMethod = "mercadopago",
  clientRequestId,         // opcional para idempotência (enviar também userId no backend para validar)
  couponCode,              // código do cupom de desconto (opcional)
}) {
  if (!token) {
    dispatch(showToast({ type: "error", message: "É necessário estar logado." }));
    return { ok: false };
  }
  if (!items?.length) {
    dispatch(showToast({ type: "error", message: "Carrinho vazio." }));
    return { ok: false };
  }
  if (!freteSelecionado) {
    dispatch(showToast({ type: "error", message: "Selecione um frete." }));
    return { ok: false };
  }
  if (!address || !address.numero?.trim()) {
    dispatch(showToast({ type: "error", message: "Insira o número da casa." }));
    return { ok: false };
  }

  const freteValor = Number(
    freteSelecionado.price ??
    freteSelecionado.valor ??
    0
  );
  
  // NOTA DE SEGURANÇA: O total calculado aqui é apenas para UX e analytics.
  // O backend DEVE recalcular o total baseado nos itens reais e no cupom validado.
  // Nunca confie no total enviado pelo frontend para cálculos críticos.
  const estimatedTotal = +(subtotal + freteValor).toFixed(2);

  const freteServico = freteSelecionado.name || freteSelecionado.nome || "Frete";
  const prazo =
    freteSelecionado.prazoTexto ||
    (freteSelecionado.deadline && `${freteSelecionado.deadline} dias úteis`) ||
    "Prazo não informado";

  const deliveryAddressString =
    `${address.logradouro}, ${address.numero} - ${address.bairro} - ` +
    `${address.cidade}/${address.uf} - CEP: ${address.cep} - ` +
    `Compl.: ${address.complemento || ""} | Frete: ${freteServico} (${prazo}) ` +
    `Valor Frete: ${freteValor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}`;

  // IMPORTANTE: O backend deve recalcular o total baseado nos itens e cupom.
  // Enviamos apenas os dados necessários, não valores calculados que podem ser manipulados.
  const orderPayload = {
    items: items.map(i => ({
      slug: i.slug,
      quantity: i.quantity,
      price: i.price, // Preço também deve ser validado no backend
    })),
    // Não enviamos 'total' calculado - o backend deve calcular
    paymentMethod,
    deliveryAddress: deliveryAddressString,
    clientRequestId, // backend deve ignorar duplicado (userId + clientRequestId)
    ...(couponCode && { couponCode: couponCode.toUpperCase().trim() }), // Incluir cupom se fornecido
  };

  // Track begin checkout event (usando estimativa apenas para analytics)
  trackBeginCheckout(estimatedTotal, orderPayload.items);

  try {
    const res = await fetch(
      "https://atelie-juliabrandao-backend-production.up.railway.app/api/orders",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: 'include',
        body: JSON.stringify(orderPayload),
      }
    );

    const json = await res.json().catch(() => ({}));

    if (!res.ok) {
      console.error("ORDER ERROR:", res.status, json);
      dispatch(showToast({
        type: "error",
        message: json.message || "Erro ao criar pedido.",
      }));
      return { ok: false, error: json };
    }

    dispatch(showToast({ type: "success", message: "Pedido criado!" }));
    
    // Track purchase complete event (usando valores do backend, não do frontend)
    trackPurchaseComplete({
      id: json._id,
      total: json.total || estimatedTotal, // Usar total do backend se disponível
      shipping: freteValor,
      items: orderPayload.items
    });
    
    return { ok: true, order: json };
  } catch (e) {
    console.error("ORDER FETCH FAIL:", e);
    dispatch(showToast({
      type: "error",
      message: "Falha de conexão com servidor.",
    }));
    return { ok: false, error: e };
  }
}