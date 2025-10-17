const API_BASE = "https://atelie-juliabrandao-backend-production.up.railway.app/api";

function authHeader(token) {
  return { Authorization: `Bearer ${token}` };
}

export async function fetchOrdersAdmin(token) {
  const res = await fetch(`${API_BASE}/admin/orders`, { 
    headers: authHeader(token),
    credentials: 'include'
  });
  if (!res.ok) throw new Error("Falha ao listar pedidos");
  return res.json();
}

export async function fetchOrderAdmin(token, id) {
  const res = await fetch(`${API_BASE}/admin/orders/${id}`, { 
    headers: authHeader(token),
    credentials: 'include'
  });
  if (!res.ok) throw new Error("Falha ao buscar pedido");
  return res.json();
}

export async function updateOrderStatus(token, id, status) {
  const res = await fetch(`${API_BASE}/admin/orders/${id}/status`, {
    method: "PUT",
    headers: {
      ...authHeader(token),
      "Content-Type": "application/json"
    },
    credentials: 'include',
    body: JSON.stringify({ status })
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "Erro ao atualizar status");
  return json;
}