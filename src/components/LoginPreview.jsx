import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaTimes } from "react-icons/fa";

function formatCpf(cpf) {
  const digits = cpf.replace(/\D/g, "").slice(0, 11);
  if (digits.length !== 11) return cpf;
  return digits.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
}

export default function LoginPreview({ open, onClose, onLogin, onCreateAccount }) {
  const [identificador, setIdentificador] = useState(""); // email ou cpf
  const [senha, setSenha] = useState("");
  const [showSenha, setShowSenha] = useState(false);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");

  const handleIdentificadorChange = (e) => {
    let value = e.target.value;
    if (/^\d{11}$/.test(value)) {
      value = formatCpf(value);
    }
    setIdentificador(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro("");
    setLoading(true);

    let identificadorFormatado = identificador;
    if (/^\d{11}$/.test(identificador)) {
      identificadorFormatado = formatCpf(identificador);
    }

    try {
      const response = await fetch(
        "https://atelie-juliabrandao-backend-production.up.railway.app/api/auth/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: 'include',
          body: JSON.stringify({ identificador: identificadorFormatado, senha }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setErro(data.message || "Erro ao fazer login");
        setLoading(false);
        return;
      }

      onLogin({
        user: { nome: data.nome, email: data.email, _id: data._id, cpf: data.cpf, telefone: data.telefone },
        token: data.token,
      });

      setErro("");
      setLoading(false);
    } catch (err) {
      setErro("Erro de conexão com o servidor");
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "100%", opacity: 0 }}
          transition={{ type: "tween", duration: 0.35 }}
          className="fixed bottom-0 left-0 right-0 z-[100] bg-[#f9e7f6] shadow-[0_-16px_48px_0_rgba(174,149,217,0.38)] px-6 py-8 rounded-t-2xl"
        >
          {/* Botão de fechar no canto superior direito */}
          <button
            onClick={onClose}
            className="absolute top-4 right-6 text-[#ae95d9] hover:text-[#7a4fcf] text-xl transition"
            aria-label="Fechar"
            type="button"
          >
            <FaTimes />
          </button>
          <div className="max-w-md mx-auto relative">
            <h2 className="text-xl font-bold text-[#7a4fcf] mb-4 text-center">Faça login para continuar</h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {erro && (
                <div className="mb-2 text-red-600 text-sm text-center">{erro}</div>
              )}
              <input
                type="text"
                className="border border-[#ae95d9] rounded px-3 py-2 text-sm"
                placeholder="E-mail ou CPF"
                value={identificador}
                onChange={handleIdentificadorChange}
                required
                autoFocus
              />
              <div className="relative">
                <input
                  type={showSenha ? "text" : "password"}
                  className="border border-[#ae95d9] rounded px-3 py-2 text-sm pr-10 w-full"
                  placeholder="Senha"
                  value={senha}
                  onChange={e => setSenha(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-2 text-[#ae95d9] hover:text-[#7a4fcf] transition"
                  onClick={() => setShowSenha((s) => !s)}
                  tabIndex={-1}
                  aria-label={showSenha ? "Ocultar senha" : "Mostrar senha"}
                >
                  {showSenha ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10 0-1.657.336-3.236.938-4.675M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3l18 18" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-.274.832-.67 1.613-1.17 2.318M15.54 15.54A5.978 5.978 0 0112 17c-1.657 0-3.156-.672-4.24-1.76" />
                    </svg>
                  )}
                </button>
              </div>
              <button
                type="submit"
                className="w-full rounded-full py-3 font-medium bg-[#7a4fcf] hover:bg-[#ae95d9] text-white transition"
                disabled={loading}
              >
                {loading ? "Entrando..." : "Entrar"}
              </button>
            </form>
            <div className="flex justify-end mt-2">
              <button
                className="text-xs text-[#7a4fcf] underline"
                onClick={() => window.location.href = "/esqueci-senha"}
                type="button"
              >
                Esqueci minha senha
              </button>
            </div>
            <div className="flex items-center my-4">
              <div className="flex-1 h-px bg-[#ae95d9]" />
              <span className="mx-3 text-xs text-[#ae95d9]">ou</span>
              <div className="flex-1 h-px bg-[#ae95d9]" />
            </div>
            <button
              className="w-full rounded-full py-3 font-medium bg-[#7a4fcf] text-white transition"
              onClick={onCreateAccount}
              type="button"
            >
              Criar conta
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}