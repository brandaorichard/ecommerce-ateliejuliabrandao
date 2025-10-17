import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateUser } from "../redux/authSlice";
import { normalizeDateToYMD, formatDateToBR } from "../utils/dateUtils";
import { motion } from "framer-motion";

// Funções de máscara
function onlyDigits(v = "") {
  return v.replace(/\D/g, "");
}
function formatCpf(v = "") {
  const d = onlyDigits(v).slice(0, 11);
  return d
    .replace(/^(\d{3})(\d)/, "$1.$2")
    .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/^(\d{3})\.(\d{3})\.(\d{3})(\d{1,2})$/, "$1.$2.$3-$4");
}
function formatPhone(v = "") {
  // Backend exige formato: (00) 0000-0000 ou (00) 9 0000-0000 (observe o espaço após o 9)
  const d = onlyDigits(v).slice(0, 11);
  if (!d) return "";
  if (d.length <= 2) return `(${d}`;
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length === 10) { // fixo
    return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  }
  if (d.length === 11) { // celular com separação exigida pelo backend
    return `(${d.slice(0, 2)}) ${d[2]} ${d.slice(3, 7)}-${d.slice(7)}`;
  }
  return v;
}

export default function DadosUsuario({
  perfil,
  isEditingPerfil,
  setIsEditingPerfil,
  setPerfil,
  show,
}) {
  const token = useSelector(state => state.auth.token);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");

  async function handleSavePerfil(e) {
    e.preventDefault();
    if (loading) return;
    setErro("");
    setLoading(true);

    try {
      const phoneFormatted = formatPhone(perfil.telefone || "");
      const payload = {
        nome: perfil.nome || "",
        telefone: phoneFormatted,
        cpf: perfil.cpf || "",
        dataNascimento: perfil.dataNascimento || undefined,
      };
      Object.keys(payload).forEach(k => payload[k] === undefined && delete payload[k]);

      // Validação front igual (ou próxima) da regex esperada no backend
      const regexFixo = /^\(\d{2}\)\s\d{4}-\d{4}$/;              // (67) 3322-1234
      const regexCel = /^\(\d{2}\)\s\d\s\d{4}-\d{4}$/;           // (67) 9 9610-1874
      if (!(regexFixo.test(payload.telefone) || regexCel.test(payload.telefone))) {
        throw new Error("Telefone inválido. Formatos aceitos: (00) 0000-0000 ou (00) 9 0000-0000.");
      }

      const resp = await fetch("https://atelie-juliabrandao-backend-production.up.railway.app/api/auth/user/dados", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        credentials: 'include',
        body: JSON.stringify(payload),
      });

      const data = await resp.json().catch(() => ({}));
      if (!resp.ok) {
        throw new Error(data.message || "Erro ao atualizar.");
      }

      // Atualiza estados local e global
      setPerfil(p => ({ ...p, ...data }));
      dispatch(updateUser(data));
      setIsEditingPerfil(false);
    } catch (err) {
      setErro(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="mb-10">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Meus dados</h2>
        {!isEditingPerfil && (
          <button
            onClick={() => setIsEditingPerfil(true)}
            className="text-sm text-[#7a4fcf] underline"
          >
            Editar informações
          </button>
        )}
      </div>
      {!isEditingPerfil ? (
        <ul className="text-sm space-y-1 mb-2">
          <li><b>Nome:</b> {show(perfil.nome)}</li>
          <li><b>E-mail:</b> {show(perfil.email)}</li>
          <li><b>Telefone:</b> {show(perfil.telefone)}</li>
          <li><b>CPF:</b> {show(perfil.cpf)}</li>
          <li><b>Data de nascimento:</b> {formatDateToBR(perfil.dataNascimento)}</li>
        </ul>
      ) : (
        <motion.form
          onSubmit={handleSavePerfil}
          className="grid gap-4 sm:grid-cols-2 text-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3 }}
        >
          {erro && (
            <div className="sm:col-span-2 text-xs text-red-600 bg-red-50 border border-red-200 px-3 py-2 rounded">
              {erro}
            </div>
          )}
          <div className="sm:col-span-2">
            <label className="block mb-1 font-medium">Nome completo *</label>
            <input
              className="w-full border rounded px-3 py-2"
              value={perfil.nome || ""}
              onChange={e => setPerfil({ ...perfil, nome: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">E-mail *</label>
            <input
              className="w-full border rounded px-3 py-2 bg-gray-100"
              value={perfil.email || ""}
              disabled
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Telefone *</label>
            <input
              className="w-full border rounded px-3 py-2"
              value={perfil.telefone || ""}
              onChange={e =>
                setPerfil({
                  ...perfil,
                  telefone: formatPhone(e.target.value),
                })
              }
              placeholder="(11) 9 0000-0000"
              inputMode="numeric"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">CPF *</label>
            <input
              className="w-full border rounded px-3 py-2"
              value={perfil.cpf || ""}
              onChange={e =>
                setPerfil({
                  ...perfil,
                  cpf: formatCpf(e.target.value),
                })
              }
              placeholder="000.000.000-00"
              inputMode="numeric"
              maxLength={14}
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Data de nascimento</label>
            <input
              type="date"
              className="w-full border rounded px-3 py-2"
              value={perfil.dataNascimento ? normalizeDateToYMD(perfil.dataNascimento) : ""}
              onChange={e => setPerfil({ ...perfil, dataNascimento: normalizeDateToYMD(e.target.value) })}
            />
          </div>
          <div className="sm:col-span-2 flex gap-3 pt-2">
            <button
              className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded text-sm disabled:opacity-60"
              disabled={loading}
            >
              {loading ? "Salvando..." : "Salvar alterações"}
            </button>
            <button
              type="button"
              onClick={() => { setIsEditingPerfil(false); setErro(""); }}
              className="text-sm underline text-gray-600"
              disabled={loading}
            >
              Cancelar
            </button>
          </div>
        </motion.form>
      )}
    </section>
  );
}