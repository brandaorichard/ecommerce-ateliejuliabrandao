import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { showToast } from "../redux/toastSlice";
import { login } from "../redux/authSlice";
import { motion, AnimatePresence } from "framer-motion";

function CheckIcon({ color = "green" }) {
  return (
    <span
      style={{
        display: "inline-block",
        verticalAlign: "middle",
        marginLeft: 6,
      }}
    >
      <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
        <circle
          cx="10"
          cy="10"
          r="9"
          stroke={color}
          strokeWidth="2"
          fill="none"
        />
        <path
          d="M6 10.5L9 13.5L14 8.5"
          stroke={color}
          strokeWidth="2"
          fill="none"
        />
      </svg>
    </span>
  );
}

export default function UserSecurity({
  showPasswordForm,
  setShowPasswordForm,
  currentEmail,
  pendingEmail,
}) {
  const dispatch = useDispatch();
  const token = useSelector((s) => s.auth.token);
  const user = useSelector((s) => s.auth.user) || {};

  // Email
  const [newEmail, setNewEmail] = useState("");
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [isRequesting, setIsRequesting] = useState(false);

  // Senha
  const [senhaAtual, setSenhaAtual] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarNovaSenha, setConfirmarNovaSenha] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  async function handleRequestEmailChange(e) {
    e.preventDefault();
    setIsRequesting(true);
    try {
      const res = await fetch(
        "https://atelie-juliabrandao-backend-production.up.railway.app/api/auth/user/email-change",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          credentials: 'include',
          body: JSON.stringify({ newEmail }),
        }
      );
      const data = await res.json();
      if (!res.ok)
        throw new Error(data.message || "Erro ao solicitar alteração de email");
      dispatch(
        showToast({
          message: "Email de confirmação enviado!",
          iconType: "success",
        })
      );
      dispatch(login({ user: { ...user, pendingEmail: newEmail }, token }));
      setNewEmail("");
      setShowEmailForm(false);
    } catch (err) {
      dispatch(showToast({ message: err.message, iconType: "error" }));
    } finally {
      setIsRequesting(false);
    }
  }

  // Troca de senha
  async function handleChangePassword(e) {
    e.preventDefault();
    if (!senhaAtual || !novaSenha || !confirmarNovaSenha) {
      dispatch(
        showToast({ message: "Preencha todos os campos.", iconType: "error" })
      );
      return;
    }
    if (novaSenha !== confirmarNovaSenha) {
      dispatch(
        showToast({ message: "As senhas não coincidem.", iconType: "error" })
      );
      return;
    }
    setIsChangingPassword(true);
    try {
      const res = await fetch(
        "https://atelie-juliabrandao-backend-production.up.railway.app/api/auth/user/senha",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          credentials: 'include',
          body: JSON.stringify({
            senhaAtual,
            novaSenha,
            confirmarNovaSenha,
          }),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Erro ao alterar a senha.");
      dispatch(
        showToast({
          message: "Senha alterada com sucesso!",
          iconType: "success",
        })
      );
      setShowPasswordForm(false);
      setSenhaAtual("");
      setNovaSenha("");
      setConfirmarNovaSenha("");
    } catch (err) {
      dispatch(showToast({ message: err.message, iconType: "error" }));
    } finally {
      setIsChangingPassword(false);
    }
  }

  const showPendingEmail = pendingEmail && pendingEmail !== currentEmail;

  // Visuais para inputs de senha
  const senhasIguais =
    novaSenha && confirmarNovaSenha && novaSenha === confirmarNovaSenha;

  return (
    <section>
      <h2 className="text-lg font-semibold mb-6 mt-15">Segurança</h2>
      <div className="mb-10">
        {showPendingEmail && (
          <div className="mb-3">
            <span className="text-yellow-600 italic">
              {pendingEmail}{" "}
              <span className="text-xs">(aguardando confirmação)</span>
            </span>
          </div>
        )}
        <AnimatePresence mode="wait">
          {!showEmailForm && (
            <motion.button
              className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded text-sm"
              onClick={() => setShowEmailForm(true)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
            >
              Alterar email
            </motion.button>
          )}
          {showEmailForm && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
            >
              <form
                onSubmit={handleRequestEmailChange}
                className="max-w-sm"
              >
                <label className="block text-sm font-medium mb-1">
                  Novo email *
                </label>
                <div className="flex gap-2">
                  <input
                    type="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    required
                    className="flex-1 border rounded px-3 py-2 text-sm"
                    placeholder="seu-novo-email@exemplo.com"
                  />
                  <motion.button
                    type="submit"
                    disabled={
                      isRequesting || !newEmail || newEmail === currentEmail
                    }
                    className={`bg-purple-600 hover:bg-purple-700 disabled:opacity-60 disabled:cursor-not-allowed text-white px-5 py-2 rounded text-sm whitespace-nowrap`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ duration: 0.3 }}
                  >
                    {isRequesting ? "Enviando..." : "Solicitar"}
                  </motion.button>
                  <motion.button
                    type="button"
                    onClick={() => setShowEmailForm(false)}
                    className="text-purple-700 hover:underline"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ duration: 0.3 }}
                  >
                    Cancelar
                  </motion.button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Alteração de Senha */}
      <AnimatePresence mode="wait">
        {!showPasswordForm && (
          <motion.button
            className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded text-sm mb-4"
            onClick={() => setShowPasswordForm(true)}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
          >
            Alterar senha
          </motion.button>
        )}
        {showPasswordForm && (
          <motion.form
            onSubmit={handleChangePassword}
            className="grid gap-2 max-w-xs"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
          >
            <label className="block text-sm font-medium ">Senha atual *</label>
            <input
              type="password"
              value={senhaAtual}
              onChange={(e) => setSenhaAtual(e.target.value)}
              className="border rounded px-3 py-2"
              required
            />
            <div style={{ position: "relative" }}>
              <label className="block text-sm font-medium mb-1">
                Nova senha *
              </label>
              <input
                type="password"
                value={novaSenha}
                onChange={(e) => setNovaSenha(e.target.value)}
                className="border rounded px-3 py-2 w-full"
                required
              />
              {senhasIguais && novaSenha && confirmarNovaSenha && (
                <span
                  style={{
                    position: "absolute",
                    right: 12,
                    top: 0,
                    bottom: 0,
                    display: "flex",
                    alignItems: "center",
                    height: "100%",
                    pointerEvents: "none",
                  }}
                >
                  <CheckIcon color="green" />
                </span>
              )}
            </div>
            <div style={{ position: "relative" }}>
              <label className="block text-sm font-medium mb-1">
                Confirmar nova senha *
              </label>
              <input
                type="password"
                value={confirmarNovaSenha}
                onChange={(e) => setConfirmarNovaSenha(e.target.value)}
                className={`border rounded px-3 py-2 w-full ${
                  novaSenha && confirmarNovaSenha && !senhasIguais
                    ? "border-red-500"
                    : senhasIguais
                    ? "border-green-500"
                    : ""
                }`}
                required
              />
              {senhasIguais && novaSenha && confirmarNovaSenha && (
                <span
                  style={{
                    position: "absolute",
                    right: 12,
                    top: 0,
                    bottom: 0,
                    display: "flex",
                    alignItems: "center",
                    height: "100%",
                    pointerEvents: "none",
                  }}
                >
                  <CheckIcon color="green" />
                </span>
              )}
            </div>
            <div className="flex gap-3">
              <motion.button
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded"
                type="submit"
                disabled={isChangingPassword}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.3 }}
              >
                {isChangingPassword ? "Salvando..." : "Salvar senha"}
              </motion.button>
              <motion.button
                type="button"
                onClick={() => setShowPasswordForm(false)}
                className="text-purple-700 hover:underline"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.3 }}
              >
                Cancelar
              </motion.button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </section>
  );
}
