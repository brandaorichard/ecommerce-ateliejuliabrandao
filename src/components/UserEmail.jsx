import React, { useState } from "react";

export default function UserEmail({ user, token, dispatch, showToast }) {
  const [newEmail, setNewEmail] = useState("");
  const [isRequesting, setIsRequesting] = useState(false);

  async function handleRequestEmailChange(e) {
    e.preventDefault();
    setIsRequesting(true);
    try {
      const res = await fetch(
        "https://atelie-juliabrandao-backend-production.up.railway.app/api/user/email-change",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          credentials: 'include',
          body: JSON.stringify({ newEmail }),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Erro ao solicitar alteração de email");
      dispatch(showToast({ message: "Email de confirmação enviado!", iconType: "success" }));
      setNewEmail("");
    } catch (err) {
      dispatch(showToast({ message: err.message, iconType: "error" }));
    } finally {
      setIsRequesting(false);
    }
  }

  return (
    <section className="mb-10">
      <h2 className="text-lg font-semibold mb-4">Alteração de Email</h2>
      <div className="text-sm mb-4">
        <p><b>Email atual:</b> {user.email}</p>
        {user.newEmail && (
          <p className="text-yellow-600">
            <b>Novo email:</b> {user.newEmail} (aguardando confirmação)
          </p>
        )}
        {!user.isConfirmed && (
          <p className="text-red-600">Seu email ainda não foi confirmado.</p>
        )}
      </div>
      <form onSubmit={handleRequestEmailChange} className="grid gap-4 sm:grid-cols-2 text-sm">
        <div className="sm:col-span-2">
          <label className="block mb-1 font-medium">Novo email *</label>
          <input
            type="email"
            className="w-full border rounded px-3 py-2"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            required
          />
        </div>
        <div className="sm:col-span-2 flex gap-3 pt-2">
          <button
            type="submit"
            className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded text-sm"
            disabled={isRequesting}
          >
            {isRequesting ? "Enviando..." : "Solicitar alteração"}
          </button>
        </div>
      </form>
    </section>
  );
}
