const API_BASE = "https://atelie-juliabrandao-backend-production.up.railway.app/api";

function authHeader(token) {
  return { Authorization: `Bearer ${token}` };
}

/**
 * Lista todos os cursos (admin - inclui inativos)
 */
export async function fetchCoursesAdmin(token) {
  const res = await fetch(`${API_BASE}/admin/courses`, {
    headers: authHeader(token),
    credentials: 'include'
  });
  if (!res.ok) {
    const json = await res.json().catch(() => ({}));
    throw new Error(json.message || "Falha ao listar cursos");
  }
  const json = await res.json();
  return json.data || json; // Retorna data se existir, senão retorna o JSON direto
}

/**
 * Cria um novo curso
 */
export async function createCourse(token, data) {
  const form = new FormData();
  
  // Campos básicos
  if (data.name) form.append('name', data.name);
  if (data.slug) form.append('slug', data.slug);
  if (data.category) form.append('category', data.category);
  if (data.price !== undefined && data.price !== null) {
    form.append('price', data.price);
  }
  if (data.oldPrice !== undefined && data.oldPrice !== null && data.oldPrice !== '') {
    form.append('oldPrice', data.oldPrice);
  }
  if (data.discount) form.append('discount', data.discount);
  if (data.installment) form.append('installment', data.installment);
  if (data.description) form.append('description', data.description);
  if (data.buyUrl) form.append('buyUrl', data.buyUrl);
  if (data.isActive !== undefined) {
    form.append('isActive', String(data.isActive));
  }
  
  // Imagens
  if (data.images && Array.isArray(data.images) && data.images.length > 0) {
    data.images.forEach(file => {
      if (file instanceof File) {
        form.append('images', file);
      }
    });
  }
  
  // Sections (enviar como JSON string)
  if (data.oQueVoceVaiAprender && Array.isArray(data.oQueVoceVaiAprender) && data.oQueVoceVaiAprender.length > 0) {
    form.append('oQueVoceVaiAprender', JSON.stringify(data.oQueVoceVaiAprender));
  }
  if (data.paraQuemE && Array.isArray(data.paraQuemE) && data.paraQuemE.length > 0) {
    form.append('paraQuemE', JSON.stringify(data.paraQuemE));
  }
  
  const res = await fetch(`${API_BASE}/admin/courses`, {
    method: "POST",
    headers: authHeader(token),
    credentials: 'include',
    body: form
  });
  
  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.message || "Erro ao criar curso");
  }
  return json.data || json;
}

/**
 * Atualiza um curso existente
 */
export async function updateCourse(token, id, data) {
  const form = new FormData();
  
  // Campos básicos (apenas enviar se definidos)
  if (data.name !== undefined) form.append('name', data.name);
  if (data.slug !== undefined) form.append('slug', data.slug);
  if (data.category !== undefined) form.append('category', data.category);
  if (data.price !== undefined && data.price !== null) {
    form.append('price', data.price);
  }
  if (data.oldPrice !== undefined) {
    if (data.oldPrice === null || data.oldPrice === '') {
      form.append('oldPrice', '');
    } else {
      form.append('oldPrice', data.oldPrice);
    }
  }
  if (data.discount !== undefined) {
    form.append('discount', data.discount || '');
  }
  if (data.installment !== undefined) {
    form.append('installment', data.installment || '');
  }
  if (data.description !== undefined) {
    form.append('description', data.description || '');
  }
  if (data.buyUrl !== undefined) {
    form.append('buyUrl', data.buyUrl || '');
  }
  if (data.isActive !== undefined) {
    form.append('isActive', String(data.isActive));
  }
  
  // Novas imagens para adicionar
  if (data.images && Array.isArray(data.images) && data.images.length > 0) {
    data.images.forEach(file => {
      if (file instanceof File) {
        form.append('images', file);
      }
    });
  }
  
  // Imagens para deletar
  if (data.imagesToDelete && Array.isArray(data.imagesToDelete) && data.imagesToDelete.length > 0) {
    form.append('imagesToDelete', JSON.stringify(data.imagesToDelete));
  }
  
  // Sections
  if (data.oQueVoceVaiAprender !== undefined) {
    if (Array.isArray(data.oQueVoceVaiAprender) && data.oQueVoceVaiAprender.length > 0) {
      form.append('oQueVoceVaiAprender', JSON.stringify(data.oQueVoceVaiAprender));
    } else {
      form.append('oQueVoceVaiAprender', JSON.stringify([]));
    }
  }
  if (data.paraQuemE !== undefined) {
    if (Array.isArray(data.paraQuemE) && data.paraQuemE.length > 0) {
      form.append('paraQuemE', JSON.stringify(data.paraQuemE));
    } else {
      form.append('paraQuemE', JSON.stringify([]));
    }
  }
  
  const res = await fetch(`${API_BASE}/admin/courses/${id}`, {
    method: "PUT",
    headers: authHeader(token),
    credentials: 'include',
    body: form
  });
  
  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.message || "Erro ao atualizar curso");
  }
  return json.data || json;
}

/**
 * Remove um curso permanentemente
 */
export async function deleteCourse(token, id) {
  const res = await fetch(`${API_BASE}/admin/courses/${id}`, {
    method: "DELETE",
    headers: authHeader(token),
    credentials: 'include'
  });
  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.message || "Erro ao remover curso");
  }
  return true;
}

/**
 * Remove uma imagem específica de um curso
 */
export async function removeCourseImage(token, id, imageUrl) {
  const res = await fetch(`${API_BASE}/admin/courses/${id}/remove-image`, {
    method: "PUT",
    headers: { ...authHeader(token), "Content-Type": "application/json" },
    credentials: 'include',
    body: JSON.stringify({ imageUrl })
  });
  if (!res.ok) {
    const json = await res.json().catch(() => ({}));
    throw new Error(json.message || "Erro ao remover imagem");
  }
  const json = await res.json();
  return json.data || json;
}

/**
 * Alterna o status do curso (ativa/desativa)
 */
export async function toggleCourseStatus(token, id) {
  const res = await fetch(`${API_BASE}/admin/courses/${id}/toggle-status`, {
    method: "PUT",
    headers: authHeader(token),
    credentials: 'include'
  });
  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.message || "Erro ao alternar status do curso");
  }
  return json.data || json;
}
