const API_BASE = "https://atelie-juliabrandao-backend-production.up.railway.app/api";

function authHeader(token) {
  return { Authorization: `Bearer ${token}` };
}

export async function fetchBabiesAdmin(token) {
  const res = await fetch(`${API_BASE}/babies`, { 
    headers: authHeader(token),
    credentials: 'include'
  });
  if (!res.ok) throw new Error("Falha ao listar bebês");
  return res.json();
}

export async function createBaby(token, data) {
  const form = new FormData();
  Object.entries(data).forEach(([k, v]) => {
    if (v === undefined || v === null) return;
    if (k === "images") {
      v.forEach(file => form.append("images", file));
    } else {
      form.append(k, v);
    }
  });
  const res = await fetch(`${API_BASE}/admin/bebes`, {
    method: "POST",
    headers: authHeader(token),
    credentials: 'include',
    body: form
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "Erro ao criar");
  return json.bebe;
}

export async function updateBaby(token, id, data) {
  const form = new FormData();
  Object.entries(data).forEach(([k, v]) => {
    if (v === undefined || v === null) return;
    if (k === "images" && v?.length) {
      v.forEach(file => form.append("images", file));
    } else {
      form.append(k, v);
    }
  });
  const res = await fetch(`${API_BASE}/admin/bebes/${id}`, {
    method: "PUT",
    headers: authHeader(token),
    credentials: 'include',
    body: form
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "Erro ao atualizar");
  return json.bebe;
}

export async function deleteBaby(token, id) {
  const res = await fetch(`${API_BASE}/admin/bebes/${id}`, {
    method: "DELETE",
    headers: authHeader(token),
    credentials: 'include'
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "Erro ao remover");
  return true;
}