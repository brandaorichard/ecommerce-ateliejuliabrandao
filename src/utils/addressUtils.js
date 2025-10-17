import { buscarEnderecoPorCep } from "./cepUtils";

export function initializeEndereco(endereco) {
  return {
    cep: endereco?.cep || "",
    logradouro: endereco?.logradouro || "",
    numero: endereco?.numero || "",
    complemento: endereco?.complemento || "",
    bairro: endereco?.bairro || "",
    cidade: endereco?.cidade || "",
    uf: endereco?.uf || "",
    referencia: endereco?.referencia || "",
  };
}

export async function handleSaveEndereco(e, endereco, token, dispatch, user, setEndereco, setIsEditingEndereco, showToast, login) {
  e.preventDefault();
  try {
    const res = await fetch(
      "https://atelie-juliabrandao-backend-production.up.railway.app/api/auth/user/endereco",
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        credentials: 'include',
        body: JSON.stringify(endereco),
      }
    );
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || data.message || "Erro ao salvar endereço");
    setEndereco(data.endereco);
    setIsEditingEndereco(false);
    dispatch(showToast({ message: "Endereço salvo com sucesso!", iconType: "success" }));
    dispatch(login({ user: { ...user, endereco: data.endereco }, token }));
  } catch (err) {
    dispatch(showToast({ message: err.message, iconType: "error" }));
  }
}

export async function handleCepChange(cep, endereco, setEndereco) {
  setEndereco({ ...endereco, cep });
  const dados = await buscarEnderecoPorCep(cep);
  if (dados) {
    setEndereco((end) => ({
      ...end,
      ...dados,
    }));
  }
}
