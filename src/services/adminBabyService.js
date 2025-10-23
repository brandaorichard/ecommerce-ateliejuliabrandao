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

export async function clearBabyImages(token, id) {
  // Tenta endpoint principal
  let res = await fetch(`${API_BASE}/admin/bebes/${id}/images`, {
    method: "DELETE",
    headers: authHeader(token),
    credentials: 'include'
  });
  // Fallback: alguns backends usam caminho alternativo
  if (res.status === 404) {
    res = await fetch(`${API_BASE}/admin/bebes/${id}/remove-images`, {
      method: "DELETE",
      headers: authHeader(token),
      credentials: 'include'
    });
  }
  if (!res.ok) {
    let msg = "Erro ao limpar imagens";
    try { const j = await res.json(); msg = j.message || msg; } catch (e) { void e; }
    throw new Error(msg);
  }
  return true;
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
  // Se novas imagens forem enviadas (objetos File), limpa todas as atuais antes de enviar as novas
  const hasNewFiles = Array.isArray(data.images) && data.images.length > 0 &&
    data.images.some(f => f && typeof f === 'object' && Object.prototype.hasOwnProperty.call(f, 'name'));
  if (hasNewFiles) {
    try {
      await clearBabyImages(token, id);
    } catch (e) { void e; }
  }
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

export async function removeBabyImage(token, id, url) {
  // Backend espera a URL exatamente como salva no array de strings
  const res = await fetch(`${API_BASE}/admin/bebes/${id}/remove-image`, {
    method: "PUT",
    headers: { ...authHeader(token), "Content-Type": "application/json" },
    credentials: 'include',
    body: JSON.stringify({ url })
  });
  if (!res.ok) {
    let msg = "Erro ao remover imagem";
    try { const j = await res.json(); msg = j.message || msg; } catch (e) { void e; }
    throw new Error(msg);
  }
  return true;
}