import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import BreadcrumbItensAdmin from "../../components/BreadcrumbItensAdmin";

export default function AdminUsersPage() {
  const token = useSelector(s => s.auth.token);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    async function fetchUsers() {
      setLoading(true);
      try {
        const res = await fetch("https://atelie-juliabrandao-backend-production.up.railway.app/api/admin/users", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          credentials: 'include'
        });
        if (!res.ok) throw new Error("Erro ao buscar usuários");
        const data = await res.json();
        setUsers(data);
      } catch (err) {
        setUsers([]);
      }
      setLoading(false);
    }
    if (token) fetchUsers();
  }, [token]);

  const breadcrumbItems = [
    { label: "Início", to: "/admin" },
    { label: "Usuários" }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-5 max-w-lg w-full mx-auto px-2"
    >
      <BreadcrumbItensAdmin items={breadcrumbItems} />
      <h1 className="text-lg md:text-xl font-light tracking-wide text-neutral-900">Usuários</h1>

      {loading ? (
        <div>Carregando...</div>
      ) : users.length === 0 ? (
        <p>Nenhum usuário encontrado.</p>
      ) : (
        <div className="flex flex-col gap-4">
          {users.map(user => (
            <motion.div
              key={user._id}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="border border-[#e0d6f7] rounded-xl bg-white shadow-sm p-4 flex flex-col gap-2 w-full"
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold text-base break-all text-neutral-900">{user.nome}</span>
                <button
                  onClick={() => setExpandedId(expandedId === user._id ? null : user._id)}
                  className="text-xs text-[#7a4fcf] underline font-medium"
                >
                  {expandedId === user._id ? "Fechar" : "Ver mais"}
                </button>
              </div>
              <div className="text-xs text-neutral-900 mb-1 break-all">Email: {user.email}</div>
              <div className="text-xs text-neutral-900 mb-1 break-all">CPF: {user.cpf}</div>
              <div className="text-xs text-neutral-900 mb-1 break-all">Telefone: {user.telefone}</div>
              {expandedId === user._id && (
                <div className="mt-2 text-xs text-neutral-900 space-y-1">
                  <div>
                    <span className="font-medium">Endereço:</span>{" "}
                    <span>
                      {user.endereco?.logradouro}, {user.endereco?.numero} {user.endereco?.complemento && `- ${user.endereco.complemento}`}, {user.endereco?.bairro}, {user.endereco?.cidade} - {user.endereco?.uf}, CEP: {user.endereco?.cep}
                    </span>
                  </div>
                  {user.dataNascimento && (
                    <div>
                      <span className="font-medium">Nascimento:</span>{" "}
                      <span>{new Date(user.dataNascimento).toLocaleDateString()}</span>
                    </div>
                  )}
                  {user.isConfirmed !== undefined && (
                    <div>
                      <span className="font-medium">Email confirmado:</span>{" "}
                      <span>{user.isConfirmed ? "Sim" : "Não"}</span>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}