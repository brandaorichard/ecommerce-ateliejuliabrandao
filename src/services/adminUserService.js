// Serviço para buscar dados completos do usuário pelo ID (admin)
export async function fetchUserById(token, userId) {
  // Garante que userId é string (caso venha como objeto do pedido)
  const id = typeof userId === "string" ? userId : userId._id;
  const res = await fetch(
    `https://atelie-juliabrandao-backend-production.up.railway.app/api/admin/users/${id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      credentials: 'include'
    }
  );
  if (!res.ok) throw new Error("Usuário não encontrado");
  return await res.json();
}