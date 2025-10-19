import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import BreadcrumbItensAdmin from "../../components/BreadcrumbItensAdmin";
import BabyFormModal from "../../components/admin/BabyFormModal";
import { loadBabies, addBaby, editBaby, removeBaby, updateStatus, setItemLoading } from "../../redux/adminBabiesSlice";
import { showToast } from "../../redux/toastSlice";
import { motion } from "framer-motion";

export default function AdminBabiesPage() {
  const dispatch = useDispatch();
  const { items, loading } = useSelector(s => s.adminBabies);
  const token = useSelector(s => s.auth.token);
  const [tab, setTab] = useState("todos");
  const [statusFilter, setStatusFilter] = useState("todos"); // Novo estado
  const [searchTerm, setSearchTerm] = useState(""); // Estado para busca
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  useEffect(() => {
    if (token) dispatch(loadBabies());
  }, [token, dispatch]);

  const categorias = useMemo(() => {
    const set = new Set(items.map(b => b.category).filter(Boolean));
    return Array.from(set);
  }, [items]);

  const filtrados = useMemo(() => {
    let result = items;
    
    // Filtro por busca (nome)
    if (searchTerm.trim()) {
      const normalizedSearchTerm = searchTerm
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase();
      
      result = result.filter(b => {
        const normalizedName = b.name
          ?.normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .toLowerCase() || "";
        return normalizedName.includes(normalizedSearchTerm);
      });
    }
    
    // Filtro por categoria
    if (tab !== "todos") {
      result = result.filter(b => b.category === tab);
    }
    
    // Filtro por status
    if (statusFilter === "disponivel") {
      result = result.filter(b => b.status !== "indisponivel");
    } else if (statusFilter === "vendido") {
      result = result.filter(b => b.status === "indisponivel");
    }
    
    return result;
  }, [items, tab, statusFilter, searchTerm]);

  const categoriaCounts = useMemo(() => {
    const counts = {};
    categorias.forEach(cat => {
      counts[cat] = items.filter(b => b.category === cat).length;
    });
    counts["todos"] = items.length;
    return counts;
  }, [categorias, items]);

  function openCreate() {
    setEditing(null);
    setModalOpen(true);
  }
  function openEdit(bebe) {
    setEditing(bebe);
    setModalOpen(true);
  }
  function handleSubmit(form) {
    const payload = {
      nome: form.nome,
      slug: form.slug,
      category: form.category,
      price: form.price,
      installment: form.installment,
      description: form.description,
      boxType: form.boxType,
      status: form.category === "pronta_entrega" ? form.status : "disponivel", // Incluir status
      images: form.images
    };
    if (editing) {
      dispatch(editBaby({ id: editing._id, data: payload }));
    } else {
      dispatch(addBaby(payload));
    }
    setModalOpen(false);
  }
  function confirmRemove(bebe) {
    setConfirmDelete(bebe);
  }
  function doRemove() {
    if (confirmDelete) dispatch(removeBaby(confirmDelete._id));
    setConfirmDelete(null);
  }

  // Modificar a função toggleStatus
  function toggleStatus(bebe) {
    if (bebe.category !== "pronta_entrega") return;
    
    const novoStatus = bebe.status === "disponivel" ? "indisponivel" : "disponivel";
    
    // Marcar como loading
    dispatch(setItemLoading({ id: bebe._id, loading: true }));
    
    fetch(`https://atelie-juliabrandao-backend-production.up.railway.app/api/admin/bebes/${bebe._id}/status`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ status: novoStatus })
    })
    .then(res => {
      if (!res.ok) throw new Error("Falha ao atualizar status");
      return res.json();
    })
    .then(() => {
      // Atualiza estado local usando o action
      dispatch(updateStatus({ id: bebe._id, status: novoStatus }));
      
      dispatch(showToast({
        type: "success",
        message: `Bebê marcado como ${novoStatus === "disponivel" ? "disponível" : "indisponível"}`
      }));
    })
    .catch(err => {
      console.error(err);
      dispatch(showToast({ type: "error", message: "Erro ao atualizar status" }));
    })
    .finally(() => {
      dispatch(setItemLoading({ id: bebe._id, loading: false }));
    });
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-5"
    >
      <BreadcrumbItensAdmin
        items={[
          { label: "Início", to: "/admin" },
          { label: "Produtos", to: "/admin/produtos" }
        ]}
      />

      <div className="flex items-center justify-between">
        <h1 className="text-lg md:text-xl font-light tracking-wide text-neutral-900">Produtos</h1>
        <button
          onClick={openCreate}
          className="
            px-3 py-1 text-xs md:text-xs font-medium
            bg-[#7a4fcf] hover:bg-[#ae95d9] text-white rounded
            md:px-4 md:py-2
          "
        >
          Novo
        </button>
      </div>

      {/* Barra de busca */}
      <div className="relative">
        <div className="relative flex items-center">
          <input
            type="text"
            placeholder="Buscar por nome do bebê..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-4 pr-10 py-2 border border-[#e0d6f7] rounded-lg
                       bg-white text-sm text-gray-900 placeholder-gray-500
                       focus:outline-none focus:ring-2 focus:ring-[#7a4fcf] focus:border-transparent
                       transition-colors duration-200"
            aria-label="Buscar bebês por nome"
          />
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <svg
              className="h-4 w-4 text-gray-400"
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
          </div>
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute inset-y-0 right-8 pr-1 flex items-center
                         text-gray-400 hover:text-gray-600 transition-colors duration-200
                         hover:bg-gray-100 rounded-full p-1"
              aria-label="Limpar busca"
            >
              <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => setTab("todos")}
          className={`px-2.5 py-1 rounded text-[11px] border border-[#e0d6f7] ${
            tab === "todos" ? "bg-[#7a4fcf] text-white" : "bg-white text-neutral-900"
          }`}
        >
          Todos <span className="ml-1 text-[11px] font-semibold">({String(categoriaCounts["todos"]).padStart(2, "0")})</span>
        </button>
        {categorias.map(cat => (
          <button
            key={cat}
            onClick={() => setTab(cat)}
            className={`px-2.5 py-1 rounded text-[11px] border border-[#e0d6f7] ${
              tab === cat ? "bg-[#7a4fcf] text-white" : "bg-white text-neutral-900"
            }`}
          >
            {cat} <span className="ml-1 text-[11px] font-semibold">({String(categoriaCounts[cat]).padStart(2, "0")})</span>
          </button>
        ))}
      </div>

      {/* Filtros de status (novos) */}
      <div className="flex gap-2 flex-wrap mt-2">
        <span className="text-[11px] text-neutral-600 mr-1 self-center">Status:</span>
        <button
          onClick={() => setStatusFilter("todos")}
          className={`px-2.5 py-1 rounded text-[11px] border border-[#e0d6f7] ${
            statusFilter === "todos" ? "bg-[#7a4fcf] text-white" : "bg-white text-neutral-900"
          }`}
        >
          Todos
        </button>
        <button
          onClick={() => setStatusFilter("disponivel")}
          className={`px-2.5 py-1 rounded text-[11px] border border-[#e0d6f7] ${
            statusFilter === "disponivel" ? "bg-[#7a4fcf] text-white" : "bg-white text-neutral-900"
          }`}
        >
          Disponíveis
        </button>
        <button
          onClick={() => setStatusFilter("vendido")}
          className={`px-2.5 py-1 rounded text-[11px] border border-[#e0d6f7] ${
            statusFilter === "vendido" ? "bg-[#7a4fcf] text-white" : "bg-white text-neutral-900"
          }`}
        >
          Vendidos
        </button>
      </div>

      {loading && <div className="text-[11px] text-neutral-600">Carregando...</div>}
      {!loading && filtrados.length === 0 && (
        <div className="text-[11px] text-neutral-600">
          {searchTerm ? `Nenhum bebê encontrado para "${searchTerm}".` : "Nenhum item."}
        </div>
      )}
      
      {/* Indicador de busca ativa */}
      {searchTerm && !loading && (
        <div className="text-[11px] text-neutral-600 mb-2">
          Buscando por: <strong>"{searchTerm}"</strong> - {filtrados.length} resultado(s) encontrado(s)
        </div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="
          grid gap-2
          grid-cols-2
          sm:gap-3
          sm:grid-cols-3
          md:grid-cols-4
          lg:grid-cols-5
          xl:grid-cols-6
        "
      >
        {filtrados.map(b => (
          <motion.div
            key={b._id}
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className={`
              border border-[#e0d6f7] ${b.status === 'indisponivel' ? 'bg-gray-100' : 'bg-transparent'} rounded-xs
              p-1.5 sm:p-2 flex flex-col group
              shadow-sm hover:shadow-md transition-shadow
              min-h-[265px] sm:min-h-[285px]
              ${b.status === 'indisponivel' ? 'relative' : ''}
            `}
          >
            {b.status === 'indisponivel' && b.category === 'pronta_entrega' && (
              <div className="absolute top-0 right-0 bg-red-500 text-white text-[9px] py-0.5 px-1.5 rounded-bl font-medium z-10">
                Vendido
              </div>
            )}
            <div className={`aspect-[1/1.15] w-full mb-1.5 sm:mb-2 overflow-hidden rounded bg-[#f7f3fa] flex items-center justify-center ${b.status === 'indisponivel' ? 'opacity-70' : ''}`}>
              {b.images?.[0] && (
                <img
                  src={b.images[0]}
                  alt={b.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
              )}
            </div>
            <h3 className="font-medium text-[10px] leading-tight line-clamp-2 text-neutral-900">{b.name}</h3>
            <p className="text-[10px] text-neutral-600">{b.slug}</p>
            <p className="text-[11px] font-semibold mt-1 text-neutral-900">
              {Number(b.price).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
            </p>
            <div className="flex gap-1 mt-1.5">
              {/* Botão de status apenas para produtos pronta_entrega */}
              {b.category === 'pronta_entrega' && (
                <button
                  onClick={() => toggleStatus(b)}
                  disabled={b.loading}
                  className={`
                    text-[10px] px-1.5 py-1 border rounded flex-1
                    ${b.status === 'disponivel' 
                      ? 'border-red-200 text-red-600 hover:bg-red-50' 
                      : 'border-green-200 text-green-600 hover:bg-green-50'}
                    ${b.loading ? 'opacity-50 cursor-wait' : ''}
                  `}
                >
                  {b.loading ? '...' : b.status === 'disponivel' ? 'Marcar Indisponível' : 'Marcar Disponível'}
                </button>
              )}
              
              {/* Botão de editar sempre presente */}
              <button
                onClick={() => openEdit(b)}
                className="flex-1 text-[10px] px-1.5 py-1 border border-[#e0d6f7] rounded hover:bg-[#f7f3fa] text-neutral-900 bg-transparent"
              >
                Editar
              </button>
              
              {/* Botão de remover como ícone para todos os cards */}
              <button
                onClick={() => confirmRemove(b)}
                className="w-8 flex items-center justify-center text-red-500 hover:text-red-700"
                title="Remover"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 6h18"></path>
                  <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                  <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                </svg>
              </button>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {modalOpen && (
        <BabyFormModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          onSubmit={handleSubmit}
          initial={editing}
        />
      )}

      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setConfirmDelete(null)} />
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="relative bg-white border border-[#e0d6f7] rounded p-6 w-full max-w-sm"
          >
            <h4 className="font-semibold mb-3 text-sm text-neutral-900">Confirmar remoção</h4>
            <p className="text-xs mb-4 text-neutral-600">
              Remover definitivamente <strong>{confirmDelete.name}</strong>?
            </p>
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setConfirmDelete(null)}
                className="px-3 py-1 text-xs border border-[#e0d6f7] rounded text-neutral-900"
              >
                Cancelar
              </button>
              <button
                onClick={doRemove}
                className="px-3 py-1 text-xs rounded bg-red-500 text-white"
              >
                Remover
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}