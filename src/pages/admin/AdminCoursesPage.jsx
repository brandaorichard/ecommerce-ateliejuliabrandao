import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
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
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-5"
    >
      <BreadcrumbItensAdmin
        items={[
          { label: "Início", to: "/admin" },
          { label: "Cursos", to: "/admin/cursos" }
        ]}
      />

      <div className="flex items-center justify-between">
        <h1 className="text-lg md:text-xl font-light tracking-wide text-neutral-900">Cursos</h1>
        <button
          onClick={openCreate}
          className="px-3 py-1 text-xs md:text-xs font-medium bg-[#7a4fcf] hover:bg-[#ae95d9] text-white rounded md:px-4 md:py-2"
        >
          Novo
        </button>
      </div>

      <div className="relative">
        <div className="relative flex items-center">
          <input
            type="text"
            placeholder="Buscar por nome do curso..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-4 pr-10 py-2 border border-[#e0d6f7] rounded-lg bg-white text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#7a4fcf] focus:border-transparent transition-colors duration-200"
          />
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute inset-y-0 right-8 pr-1 flex items-center text-gray-400 hover:text-gray-600 transition-colors duration-200 hover:bg-gray-100 rounded-full p-1"
            >
              <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {loading && <div className="text-[11px] text-neutral-600">Carregando...</div>}
      {!loading && filtrados.length === 0 && (
        <div className="text-[11px] text-neutral-600">
          {searchTerm ? `Nenhum curso encontrado para "${searchTerm}".` : "Nenhum curso cadastrado."}
        </div>
      )}

      {searchTerm && !loading && (
        <div className="text-[11px] text-neutral-600 mb-2">
          Buscando por: <strong>"{searchTerm}"</strong> - {filtrados.length} resultado(s) encontrado(s)
        </div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="grid gap-2 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
      >
        {filtrados.map(c => {
          const id = c._id || c.id;
          return (
            <motion.div
              key={id}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className={`border border-[#e0d6f7] ${!c.isActive ? 'bg-gray-100 opacity-75' : 'bg-transparent'} rounded-xs p-1.5 sm:p-2 flex flex-col group shadow-sm hover:shadow-md transition-shadow min-h-[320px]`}
            >
              {!c.isActive && (
                <div className="absolute top-0 right-0 bg-gray-500 text-white text-[9px] py-0.5 px-1.5 rounded-bl font-medium z-10">
                  Inativo
                </div>
              )}
              <div className="aspect-video w-full mb-1.5 sm:mb-2 overflow-hidden rounded bg-[#f7f3fa] flex items-center justify-center">
                {c.images?.[0] || c.img ? (
                  <img
                    src={c.images?.[0] || c.img}
                    alt={c.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                ) : (
                  <div className="text-gray-400 text-xs">Sem imagem</div>
                )}
              </div>
              <h3 className="font-medium text-[10px] leading-tight line-clamp-2 text-neutral-900">{c.name}</h3>
              <p className="text-[10px] text-neutral-600">{c.slug}</p>
              <p className="text-[11px] font-semibold mt-1 text-neutral-900">
                {Number(c.price).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
              </p>
              <div className="flex gap-1 mt-1.5">
                <button
                  onClick={() => handleToggleStatus(c)}
                  className={`text-[10px] px-1.5 py-1 border rounded flex-1 ${
                    c.isActive
                      ? 'border-red-200 text-red-600 hover:bg-red-50'
                      : 'border-green-200 text-green-600 hover:bg-green-50'
                  }`}
                >
                  {c.isActive ? 'Desativar' : 'Ativar'}
                </button>
                <button
                  onClick={() => openEdit(c)}
                  className="flex-1 text-[10px] px-1.5 py-1 border border-[#e0d6f7] rounded hover:bg-[#f7f3fa] text-neutral-900 bg-transparent"
                >
                  Editar
                </button>
                <button
                  onClick={() => confirmRemove(c)}
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
          );
        })}
      </motion.div>

      {modalOpen && (
        <CourseFormModal
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
