import { useEffect, useState, useMemo } from "react";
import { useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import BreadcrumbItensAdmin from "../../components/BreadcrumbItensAdmin";

export default function AdminUsersPage() {
  const token = useSelector(s => s.auth.token);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

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

  const filteredUsers = useMemo(() => {
    if (!searchTerm.trim()) return users;
    
    const normalized = searchTerm.toLowerCase();
    return users.filter(user => 
      user.nome?.toLowerCase().includes(normalized) ||
      user.email?.toLowerCase().includes(normalized) ||
      user.cpf?.includes(normalized)
    );
  }, [users, searchTerm]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <BreadcrumbItensAdmin
        items={[
          { label: "Início", to: "/admin" },
          { label: "Usuários" }
        ]}
      />

      {/* Header Premium */}
      <div className="bg-white rounded-xl p-5 sm:p-6 border border-[#e0d6f7] shadow-sm">
        <div className="mb-4">
          <h1 className="text-2xl sm:text-3xl font-light tracking-wide text-gray-800">Usuários</h1>
          <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
            <span>{users.length} usuários cadastrados</span>
            {users.some(u => u.isConfirmed) && (
              <>
                <span className="text-gray-300">•</span>
                <span className="text-green-600">{users.filter(u => u.isConfirmed).length} verificados</span>
              </>
            )}
          </p>
        </div>

        {/* Barra de busca */}
        <div className="relative">
          <div className="relative flex items-center">
            <svg
              className="absolute left-4 h-5 w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              placeholder="Buscar por nome, email ou CPF..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-12 py-3 border border-gray-200 rounded-lg bg-gray-50 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#7a4fcf] focus:border-transparent focus:bg-white transition-all duration-200"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Limpar busca"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {searchTerm && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 px-4 py-2 bg-blue-50 border border-blue-200 rounded-lg"
          >
            <p className="text-sm text-blue-700">
              Buscando por: <strong>"{searchTerm}"</strong> - {filteredUsers.length} resultado(s) encontrado(s)
            </p>
          </motion.div>
        )}
      </div>

      {/* Lista de Usuários */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-[#7a4fcf]"></div>
            <p className="mt-4 text-sm text-gray-600">Carregando usuários...</p>
          </div>
        </div>
      ) : filteredUsers.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-xl p-12 border border-[#e0d6f7] shadow-sm text-center"
        >
          <div className="text-6xl mb-4">👥</div>
          <h3 className="text-lg font-medium text-gray-800 mb-2">
            {searchTerm ? "Nenhum usuário encontrado" : "Nenhum usuário cadastrado"}
          </h3>
          <p className="text-sm text-gray-500">
            {searchTerm 
              ? `Não encontramos usuários com "${searchTerm}"`
              : "Os usuários aparecerão aqui quando se cadastrarem"}
          </p>
        </motion.div>
      ) : (
        <div className="grid gap-4">
          <AnimatePresence mode="popLayout">
            {filteredUsers.map((user, idx) => (
              <motion.div
                key={user._id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, delay: idx * 0.02 }}
                className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
              >
                <div className="p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-4 flex-1">
                      {/* Avatar */}
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#7a4fcf] to-[#ae95d9] flex items-center justify-center text-white font-semibold text-lg flex-shrink-0">
                        {user.nome?.[0]?.toUpperCase() || "U"}
                      </div>
                      
                      {/* Info Principal */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-gray-800 truncate">{user.nome}</h3>
                          {user.isConfirmed && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                              </svg>
                              Verificado
                            </span>
                          )}
                        </div>
                        <div className="space-y-1 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            <span className="truncate">{user.email}</span>
                          </div>
                          {user.cpf && (
                            <div className="flex items-center gap-2">
                              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                              </svg>
                              <span>{user.cpf}</span>
                            </div>
                          )}
                          {user.telefone && (
                            <div className="flex items-center gap-2">
                              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                              </svg>
                              <span>{user.telefone}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Botão Ver Mais */}
                    <button
                      onClick={() => setExpandedId(expandedId === user._id ? null : user._id)}
                      className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs font-medium transition-colors flex items-center gap-1 flex-shrink-0"
                    >
                      {expandedId === user._id ? (
                        <>
                          <span>Ocultar</span>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                          </svg>
                        </>
                      ) : (
                        <>
                          <span>Ver Mais</span>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Informações Expandidas */}
                  <AnimatePresence>
                    {expandedId === user._id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="pt-4 border-t border-gray-200 space-y-3">
                          {/* Endereço */}
                          {user.endereco && (
                            <div className="bg-gray-50 rounded-lg p-4">
                              <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                Endereço
                              </h4>
                              <p className="text-sm text-gray-700">
                                {user.endereco.logradouro}, {user.endereco.numero}
                                {user.endereco.complemento && ` - ${user.endereco.complemento}`}
                                <br />
                                {user.endereco.bairro}, {user.endereco.cidade} - {user.endereco.uf}
                                <br />
                                CEP: {user.endereco.cep}
                              </p>
                            </div>
                          )}

                          {/* Outras Informações */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {user.dataNascimento && (
                              <div className="bg-blue-50 rounded-lg p-3">
                                <label className="text-xs font-medium text-blue-800 uppercase tracking-wider">Data de Nascimento</label>
                                <p className="text-sm font-medium text-blue-900 mt-1">
                                  {new Date(user.dataNascimento).toLocaleDateString('pt-BR')}
                                </p>
                              </div>
                            )}
                            
                            {user.isConfirmed !== undefined && (
                              <div className={`${user.isConfirmed ? 'bg-green-50' : 'bg-yellow-50'} rounded-lg p-3`}>
                                <label className={`text-xs font-medium ${user.isConfirmed ? 'text-green-800' : 'text-yellow-800'} uppercase tracking-wider`}>
                                  Status do Email
                                </label>
                                <p className={`text-sm font-medium ${user.isConfirmed ? 'text-green-900' : 'text-yellow-900'} mt-1`}>
                                  {user.isConfirmed ? "✓ Confirmado" : "⏳ Pendente"}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
}
