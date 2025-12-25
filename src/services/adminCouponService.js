const API_BASE = "https://atelie-juliabrandao-backend-production.up.railway.app/api";

function authHeader(token) {
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json"
  };
}

/**
 * Lista todos os cupons
 */
export async function fetchCoupons(token) {
  const res = await fetch(`${API_BASE}/admin/coupons`, {
    headers: authHeader(token),
    credentials: 'include'
  });
  if (!res.ok) {
    const json = await res.json().catch(() => ({}));
    throw new Error(json.message || "Falha ao listar cupons");
  }
  const json = await res.json();
  return json.data || [];
}

/**
 * Busca um cupom por ID
 */
export async function fetchCouponById(token, id) {
  const res = await fetch(`${API_BASE}/admin/coupons/${id}`, {
    headers: authHeader(token),
    credentials: 'include'
  });
  if (!res.ok) {
    const json = await res.json().catch(() => ({}));
    throw new Error(json.message || "Falha ao buscar cupom");
  }
  const json = await res.json();
  return json.data;
}

/**
 * Cria um novo cupom
 */
export async function createCoupon(token, couponData) {
  const res = await fetch(`${API_BASE}/admin/coupons`, {
    method: "POST",
    headers: authHeader(token),
    credentials: 'include',
    body: JSON.stringify({
      ...couponData,
      code: couponData.code?.toUpperCase().trim()
    })
  });
  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.message || "Erro ao criar cupom");
  }
  return json.data;
}

/**
 * Atualiza um cupom existente
 */
export async function updateCoupon(token, id, couponData) {
  const res = await fetch(`${API_BASE}/admin/coupons/${id}`, {
    method: "PUT",
    headers: authHeader(token),
    credentials: 'include',
    body: JSON.stringify({
      ...couponData,
      ...(couponData.code && { code: couponData.code.toUpperCase().trim() })
    })
  });
  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.message || "Erro ao atualizar cupom");
  }
  return json.data;
}

/**
 * Deleta um cupom
 */
export async function deleteCoupon(token, id) {
  const res = await fetch(`${API_BASE}/admin/coupons/${id}`, {
    method: "DELETE",
    headers: authHeader(token),
    credentials: 'include'
  });
  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.message || "Erro ao deletar cupom");
  }
  return json;
}

/**
 * Ativa ou desativa um cupom (toggle)
 */
export async function toggleCoupon(token, id) {
  const res = await fetch(`${API_BASE}/admin/coupons/${id}/toggle`, {
    method: "PUT",
    headers: authHeader(token),
    credentials: 'include'
  });
  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.message || "Erro ao alterar status do cupom");
  }
  return json.data;
}

