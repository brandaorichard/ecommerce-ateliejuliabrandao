import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import {
  fetchCoupons,
  createCoupon,
  updateCoupon,
  deleteCoupon,
  toggleCoupon
} from "../../services/adminCouponService";
import BreadcrumbItensAdmin from "../../components/BreadcrumbItensAdmin";

export default function AdminCouponsPage() {
  const token = useSelector(s => s.auth.token);
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [filterActive, setFilterActive] = useState("all"); // 'all', 'active', 'inactive'
  const [searchCode, setSearchCode] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(null);

  const [formData, setFormData] = useState({
    code: "",
    discountPercentage: 10,
    description: "",
    validFrom: "",
    validUntil: "",
    isActive: true,
    maxUses: "",
    maxUsesPerUser: 1,
    minOrderValue: ""
  });

  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    if (token) loadCoupons();
  }, [token]);

  async function loadCoupons() {
    setLoading(true);
    try {
      const data = await fetchCoupons(token);
      setCoupons(data);
    } catch (err) {
      console.error("Erro ao carregar cupons:", err);
      alert(err.message || "Erro ao carregar cupons");
      setCoupons([]);
    } finally {
      setLoading(false);
    }
  }

  function openCreateModal() {
    setEditingCoupon(null);
    setFormData({
      code: "",
      discountPercentage: 10,
      description: "",
      validFrom: "",
      validUntil: "",
      isActive: true,
      maxUses: "",
      maxUsesPerUser: 1,
      minOrderValue: ""
    });
    setFormErrors({});
    setShowModal(true);
  }

  function openEditModal(coupon) {
    setEditingCoupon(coupon);
    setFormData({
      code: coupon.code,
      discountPercentage: coupon.discountPercentage,
      description: coupon.description || "",
      validFrom: coupon.validFrom ? new Date(coupon.validFrom).toISOString().slice(0, 16) : "",
      validUntil: coupon.validUntil ? new Date(coupon.validUntil).toISOString().slice(0, 16) : "",
      isActive: coupon.isActive,
      maxUses: coupon.maxUses || "",
      maxUsesPerUser: coupon.maxUsesPerUser || 1,
      minOrderValue: coupon.minOrderValue || ""
    });
    setFormErrors({});
    setShowModal(true);
  }

  function validateForm() {
    const errors = {};
    
    if (!formData.code.trim()) {
      errors.code = "Código é obrigatório";
    }
    
    if (formData.discountPercentage < 0 || formData.discountPercentage > 100) {
      errors.discountPercentage = "Percentual deve estar entre 0 e 100";
    }
    
    if (!formData.validFrom) {
      errors.validFrom = "Data de início é obrigatória";
    }
    
    if (!formData.validUntil) {
      errors.validUntil = "Data de término é obrigatória";
    }
    
    if (formData.validFrom && formData.validUntil) {
      if (new Date(formData.validUntil) <= new Date(formData.validFrom)) {
        errors.validUntil = "Data de término deve ser posterior à data de início";
      }
    }
    
    if (formData.maxUses && formData.maxUses < 1) {
      errors.maxUses = "Limite de usos deve ser maior que 0";
    }
    
    if (formData.maxUsesPerUser < 1) {
      errors.maxUsesPerUser = "Limite por usuário deve ser maior que 0";
    }
    
    if (formData.minOrderValue && formData.minOrderValue < 0) {
      errors.minOrderValue = "Valor mínimo deve ser maior ou igual a 0";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      const payload = {
        ...formData,
        validFrom: new Date(formData.validFrom).toISOString(),
        validUntil: new Date(formData.validUntil).toISOString(),
        maxUses: formData.maxUses ? Number(formData.maxUses) : undefined,
        minOrderValue: formData.minOrderValue ? Number(formData.minOrderValue) : undefined,
        maxUsesPerUser: Number(formData.maxUsesPerUser)
      };

      if (editingCoupon) {
        await updateCoupon(token, editingCoupon._id, payload);
        alert("Cupom atualizado com sucesso!");
      } else {
        await createCoupon(token, payload);
        alert("Cupom criado com sucesso!");
      }
      
      setShowModal(false);
      loadCoupons();
    } catch (err) {
      alert(err.message || "Erro ao salvar cupom");
    }
  }

  async function handleToggle(coupon) {
    try {
      await toggleCoupon(token, coupon._id);
      loadCoupons();
    } catch (err) {
      alert(err.message || "Erro ao alterar status");
    }
  }

  async function handleDelete(id) {
    try {
      await deleteCoupon(token, id);
      setConfirmDelete(null);
      loadCoupons();
    } catch (err) {
      alert(err.message || "Erro ao deletar cupom");
    }
  }

  const filteredCoupons = coupons.filter(coupon => {
    const matchesFilter = 
      filterActive === "all" ||
      (filterActive === "active" && coupon.isActive) ||
      (filterActive === "inactive" && !coupon.isActive);
    
    const matchesSearch = !searchCode || 
      coupon.code.toUpperCase().includes(searchCode.toUpperCase());
    
    return matchesFilter && matchesSearch;
  });

  const breadcrumbItems = [
    { label: "Início", to: "/admin" },
    { label: "Cupons" }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-5 max-w-6xl w-full mx-auto px-2"
    >
      <BreadcrumbItensAdmin items={breadcrumbItems} />
      <div className="flex items-center justify-between">
        <h1 className="text-lg md:text-xl font-light tracking-wide text-neutral-900">
          Cupons de Desconto
        </h1>
        <button
          onClick={openCreateModal}
          className="px-4 py-2 bg-[#7a4fcf] hover:bg-[#ae95d9] text-white rounded text-sm font-medium transition"
        >
          + Novo Cupom
        </button>
      </div>

      {/* Filtros */}
      <div className="flex gap-3 flex-wrap items-center">
        <div className="flex gap-2">
          <button
            onClick={() => setFilterActive("all")}
            className={`px-3 py-1 rounded text-xs border ${
              filterActive === "all"
                ? "bg-[#7a4fcf] text-white border-[#7a4fcf]"
                : "bg-white border-[#e0d6f7] text-neutral-900"
            }`}
          >
            Todos
          </button>
          <button
            onClick={() => setFilterActive("active")}
            className={`px-3 py-1 rounded text-xs border ${
              filterActive === "active"
                ? "bg-[#7a4fcf] text-white border-[#7a4fcf]"
                : "bg-white border-[#e0d6f7] text-neutral-900"
            }`}
          >
            Ativos
          </button>
          <button
            onClick={() => setFilterActive("inactive")}
            className={`px-3 py-1 rounded text-xs border ${
              filterActive === "inactive"
                ? "bg-[#7a4fcf] text-white border-[#7a4fcf]"
                : "bg-white border-[#e0d6f7] text-neutral-900"
            }`}
          >
            Inativos
          </button>
        </div>
        <input
          type="text"
          placeholder="Buscar por código..."
          value={searchCode}
          onChange={(e) => setSearchCode(e.target.value)}
          className="px-3 py-1 border border-[#e0d6f7] rounded text-xs"
        />
      </div>

      {loading ? (
        <div>Carregando...</div>
      ) : filteredCoupons.length === 0 ? (
        <p className="text-neutral-600">Nenhum cupom encontrado.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse bg-white border border-[#e0d6f7] rounded">
            <thead>
              <tr className="bg-[#f7f3fa]">
                <th className="border border-[#e0d6f7] px-3 py-2 text-left text-xs font-semibold">Código</th>
                <th className="border border-[#e0d6f7] px-3 py-2 text-left text-xs font-semibold">Desconto</th>
                <th className="border border-[#e0d6f7] px-3 py-2 text-left text-xs font-semibold">Válido até</th>
                <th className="border border-[#e0d6f7] px-3 py-2 text-left text-xs font-semibold">Usos</th>
                <th className="border border-[#e0d6f7] px-3 py-2 text-left text-xs font-semibold">Status</th>
                <th className="border border-[#e0d6f7] px-3 py-2 text-left text-xs font-semibold">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredCoupons.map(coupon => (
                <tr key={coupon._id} className="hover:bg-[#f7f3fa]">
                  <td className="border border-[#e0d6f7] px-3 py-2 text-xs font-medium">
                    {coupon.code}
                  </td>
                  <td className="border border-[#e0d6f7] px-3 py-2 text-xs">
                    {coupon.discountPercentage}%
                  </td>
                  <td className="border border-[#e0d6f7] px-3 py-2 text-xs">
                    {new Date(coupon.validUntil).toLocaleDateString("pt-BR")}
                  </td>
                  <td className="border border-[#e0d6f7] px-3 py-2 text-xs">
                    {coupon.usedCount || 0}
                    {coupon.maxUses && ` / ${coupon.maxUses}`}
                  </td>
                  <td className="border border-[#e0d6f7] px-3 py-2 text-xs">
                    <span className={`px-2 py-1 rounded text-[10px] ${
                      coupon.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                    }`}>
                      {coupon.isActive ? "Ativo" : "Inativo"}
                    </span>
                  </td>
                  <td className="border border-[#e0d6f7] px-3 py-2 text-xs">
                    <div className="flex gap-1">
                      <button
                        onClick={() => openEditModal(coupon)}
                        className="px-2 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded text-[10px]"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleToggle(coupon)}
                        className={`px-2 py-1 rounded text-[10px] ${
                          coupon.isActive
                            ? "bg-yellow-500 hover:bg-yellow-600 text-white"
                            : "bg-green-500 hover:bg-green-600 text-white"
                        }`}
                      >
                        {coupon.isActive ? "Desativar" : "Ativar"}
                      </button>
                      <button
                        onClick={() => setConfirmDelete(coupon._id)}
                        className="px-2 py-1 bg-red-500 hover:bg-red-600 text-white rounded text-[10px]"
                      >
                        Deletar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal de criar/editar */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <h2 className="text-xl font-semibold mb-4">
                {editingCoupon ? "Editar Cupom" : "Novo Cupom"}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Código *
                  </label>
                  <input
                    type="text"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                    className={`w-full border rounded px-3 py-2 text-sm ${
                      formErrors.code ? "border-red-500" : "border-gray-300"
                    }`}
                    disabled={!!editingCoupon}
                  />
                  {formErrors.code && (
                    <p className="text-xs text-red-600 mt-1">{formErrors.code}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Percentual de Desconto (0-100) *
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.01"
                    value={formData.discountPercentage}
                    onChange={(e) => setFormData({ ...formData, discountPercentage: Number(e.target.value) })}
                    className={`w-full border rounded px-3 py-2 text-sm ${
                      formErrors.discountPercentage ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {formErrors.discountPercentage && (
                    <p className="text-xs text-red-600 mt-1">{formErrors.discountPercentage}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Descrição
                  </label>
                  <input
                    type="text"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Data de Início *
                    </label>
                    <input
                      type="datetime-local"
                      value={formData.validFrom}
                      onChange={(e) => setFormData({ ...formData, validFrom: e.target.value })}
                      className={`w-full border rounded px-3 py-2 text-sm ${
                        formErrors.validFrom ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                    {formErrors.validFrom && (
                      <p className="text-xs text-red-600 mt-1">{formErrors.validFrom}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Data de Término *
                    </label>
                    <input
                      type="datetime-local"
                      value={formData.validUntil}
                      onChange={(e) => setFormData({ ...formData, validUntil: e.target.value })}
                      className={`w-full border rounded px-3 py-2 text-sm ${
                        formErrors.validUntil ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                    {formErrors.validUntil && (
                      <p className="text-xs text-red-600 mt-1">{formErrors.validUntil}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Limite de Usos Total
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={formData.maxUses}
                      onChange={(e) => setFormData({ ...formData, maxUses: e.target.value })}
                      className={`w-full border rounded px-3 py-2 text-sm ${
                        formErrors.maxUses ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="Ilimitado"
                    />
                    {formErrors.maxUses && (
                      <p className="text-xs text-red-600 mt-1">{formErrors.maxUses}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Limite por Usuário *
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={formData.maxUsesPerUser}
                      onChange={(e) => setFormData({ ...formData, maxUsesPerUser: Number(e.target.value) })}
                      className={`w-full border rounded px-3 py-2 text-sm ${
                        formErrors.maxUsesPerUser ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                    {formErrors.maxUsesPerUser && (
                      <p className="text-xs text-red-600 mt-1">{formErrors.maxUsesPerUser}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Valor Mínimo (R$)
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.minOrderValue}
                      onChange={(e) => setFormData({ ...formData, minOrderValue: e.target.value })}
                      className={`w-full border rounded px-3 py-2 text-sm ${
                        formErrors.minOrderValue ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="Sem mínimo"
                    />
                    {formErrors.minOrderValue && (
                      <p className="text-xs text-red-600 mt-1">{formErrors.minOrderValue}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <label htmlFor="isActive" className="text-sm font-medium">
                    Cupom ativo
                  </label>
                </div>

                <div className="flex gap-3 justify-end pt-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded text-sm hover:bg-gray-50"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#7a4fcf] hover:bg-[#ae95d9] text-white rounded text-sm font-medium"
                  >
                    {editingCoupon ? "Atualizar" : "Criar"}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal de confirmação de deleção */}
      <AnimatePresence>
        {confirmDelete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            onClick={() => setConfirmDelete(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-lg p-6 max-w-md w-full"
            >
              <h3 className="text-lg font-semibold mb-2">Confirmar exclusão</h3>
              <p className="text-sm text-gray-600 mb-4">
                Tem certeza que deseja deletar este cupom? Esta ação não pode ser desfeita.
              </p>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setConfirmDelete(null)}
                  className="px-4 py-2 border border-gray-300 rounded text-sm hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => handleDelete(confirmDelete)}
                  className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded text-sm font-medium"
                >
                  Deletar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

