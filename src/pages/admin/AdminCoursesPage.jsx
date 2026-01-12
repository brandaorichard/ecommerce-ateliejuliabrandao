import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import BreadcrumbItensAdmin from "../../components/BreadcrumbItensAdmin";
import CourseFormModal from "../../components/admin/CourseFormModal";
import { loadCourses, addCourse, editCourse, removeCourse, toggleStatus } from "../../redux/adminCoursesSlice";

export default function AdminCoursesPage() {
  const dispatch = useDispatch();
  const { items, loading } = useSelector(s => s.adminCourses);
  const token = useSelector(s => s.auth.token);
  const [searchTerm, setSearchTerm] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  useEffect(() => {
    if (token) dispatch(loadCourses());
  }, [token, dispatch]);

  const filtrados = useMemo(() => {
    let result = items;
    if (searchTerm.trim()) {
      const normalizedSearchTerm = searchTerm
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase();
      result = result.filter(c => {
        const normalizedName = c.name
          ?.normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .toLowerCase() || "";
        return normalizedName.includes(normalizedSearchTerm);
      });
    }
    return result;
  }, [items, searchTerm]);

  function openCreate() {
    setEditing(null);
    setModalOpen(true);
  }

  function openEdit(course) {
    setEditing(course);
    setModalOpen(true);
  }

  function handleSubmit(data) {
    if (editing) {
      const id = editing._id || editing.id;
      dispatch(editCourse({ id, data }));
    } else {
      dispatch(addCourse(data));
    }
    setModalOpen(false);
  }

  function confirmRemove(course) {
    setConfirmDelete(course);
  }

  function doRemove() {
    if (confirmDelete) {
      const id = confirmDelete._id || confirmDelete.id;
      dispatch(removeCourse(id));
    }
    setConfirmDelete(null);
  }

  function handleToggleStatus(course) {
    const id = course._id || course.id;
    dispatch(toggleStatus(id));
  }

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
          { label: "Cursos" }
        ]}
      />

      {/* Header Premium */}
      <div className="bg-white rounded-xl p-5 sm:p-6 border border-[#e0d6f7] shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-light tracking-wide text-gray-800">Cursos</h1>
            <p className="text-sm text-gray-500 mt-1">
              Gerencie o catálogo de cursos disponíveis
            </p>
          </div>
          <button
            onClick={openCreate}
            className="px-4 py-2.5 sm:px-5 sm:py-3 bg-gradient-to-r from-[#7a4fcf] to-[#ae95d9] hover:from-[#6a3fbf] hover:to-[#9e85c9] text-white rounded-lg text-sm font-medium transition-all duration-300 shadow-md hover:shadow-lg flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span className="hidden sm:inline">Novo Curso</span>
            <span className="sm:hidden">Novo</span>
          </button>
        </div>

        {/* Barra de busca premium */}
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
              placeholder="Buscar cursos por nome..."
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

        {/* Indicador de resultados */}
        {searchTerm && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 px-4 py-2 bg-blue-50 border border-blue-200 rounded-lg"
          >
            <p className="text-sm text-blue-700">
              Buscando por: <strong>"{searchTerm}"</strong> - {filtrados.length} resultado(s) encontrado(s)
            </p>
          </motion.div>
        )}
      </div>

      {/* Grid de Cursos */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-[#7a4fcf]"></div>
            <p className="mt-4 text-sm text-gray-600">Carregando cursos...</p>
          </div>
        </div>
      ) : filtrados.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-xl p-12 border border-[#e0d6f7] shadow-sm text-center"
        >
          <div className="text-6xl mb-4">📚</div>
          <h3 className="text-lg font-medium text-gray-800 mb-2">
            {searchTerm ? "Nenhum curso encontrado" : "Nenhum curso cadastrado"}
          </h3>
          <p className="text-sm text-gray-500">
            {searchTerm 
              ? `Não encontramos cursos com "${searchTerm}"`
              : "Comece adicionando seu primeiro curso"}
          </p>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        >
          <AnimatePresence mode="popLayout">
            {filtrados.map((c, idx) => {
              const id = c._id || c.id;
              return (
                <motion.div
                  key={id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3, delay: idx * 0.02 }}
                  className={`group bg-white rounded-xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300 ${
                    !c.isActive ? 'opacity-75' : ''
                  }`}
                >
                  {/* Imagem do Curso */}
                  <div className="relative aspect-video bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
                    {c.images?.[0] || c.img ? (
                      <img
                        src={c.images?.[0] || c.img}
                        alt={c.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300 text-4xl">
                        📚
                      </div>
                    )}
                    
                    {/* Badge de Status */}
                    {!c.isActive && (
                      <div className="absolute top-2 right-2 px-3 py-1 bg-gray-500 text-white text-xs font-semibold rounded-full shadow-lg">
                        Inativo
                      </div>
                    )}
                  </div>

                  {/* Informações do Curso */}
                  <div className="p-4 space-y-3">
                    <div>
                      <h3 className="font-medium text-sm text-gray-800 line-clamp-2 leading-tight mb-1">
                        {c.name}
                      </h3>
                      <p className="text-xs text-gray-500">{c.slug}</p>
                    </div>

                    <div className="flex items-baseline gap-2">
                      <p className="text-lg font-semibold text-[#7a4fcf]">
                        {Number(c.price).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                      </p>
                    </div>

                    {/* Ações */}
                    <div className="flex gap-2 pt-2 border-t border-gray-100">
                      <button
                        onClick={() => openEdit(c)}
                        className="flex-1 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-1"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Editar
                      </button>
                      
                      <button
                        onClick={() => confirmRemove(c)}
                        className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors"
                        title="Remover curso"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>

                    {/* Toggle de Status */}
                    <button
                      onClick={() => handleToggleStatus(c)}
                      className={`w-full px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
                        c.isActive
                          ? 'bg-green-50 text-green-700 hover:bg-green-100 border border-green-200'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-200'
                      }`}
                    >
                      <div className={`w-2 h-2 rounded-full ${c.isActive ? 'bg-green-500' : 'bg-gray-400'}`} />
                      {c.isActive ? 'Ativo' : 'Inativo'}
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Modal de Formulário */}
      {modalOpen && (
        <CourseFormModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          onSubmit={handleSubmit}
          initial={editing}
        />
      )}

      {/* Modal de Confirmação de Delete */}
      <AnimatePresence>
        {confirmDelete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div 
              className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
              onClick={() => setConfirmDelete(null)} 
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              className="relative bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl"
            >
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </div>
                <h4 className="text-xl font-semibold mb-2 text-gray-800">Confirmar Remoção</h4>
                <p className="text-sm text-gray-600">
                  Tem certeza que deseja remover permanentemente o curso <strong className="text-gray-800">{confirmDelete.name}</strong>?
                </p>
                <p className="text-xs text-red-600 mt-2">
                  Esta ação não pode ser desfeita.
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setConfirmDelete(null)}
                  className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={doRemove}
                  className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 rounded-lg text-sm font-medium text-white transition-colors shadow-md"
                >
                  Remover
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
