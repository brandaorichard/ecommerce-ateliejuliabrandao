import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { motion as fmMotion } from "framer-motion";
import { removeImage } from "../../redux/adminCoursesSlice";

function formatCurrencyInput(value) {
  // Remove tudo que não é número
  let cleaned = value.replace(/\D/g, "");
  // Remove zeros à esquerda
  cleaned = cleaned.replace(/^0+/, "");
  // Se vazio, retorna vazio
  if (!cleaned) return "";
  // Limita a 8 dígitos (até 999.999,99)
  cleaned = cleaned.slice(0, 8);
  // Adiciona zeros à esquerda para garantir pelo menos 3 dígitos
  cleaned = cleaned.padStart(3, "0");
  // Insere vírgula antes dos dois últimos dígitos
  let intPart = cleaned.slice(0, -2);
  let decimalPart = cleaned.slice(-2);
  // Adiciona pontos a cada 3 dígitos do inteiro
  intPart = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return `${intPart},${decimalPart}`;
}

export default function CourseFormModal({ open, onClose, onSubmit, initial }) {
  const MotionDiv = fmMotion.div;
  const dispatch = useDispatch();
  const [form, setForm] = useState({
    name: "",
    slug: "",
    category: "cursos",
    price: "",
    oldPrice: "",
    discount: "",
    installment: "",
    buyUrl: "",
    isActive: true,
    images: [],
    oQueVoceVaiAprender: "",
    paraQuemE: ""
  });
  const [existingImages, setExistingImages] = useState([]);
  const [imagesToDelete, setImagesToDelete] = useState([]);
  const [newFiles, setNewFiles] = useState([]);
  const [newPreviews, setNewPreviews] = useState([]);

  useEffect(() => {
    return () => {
      newPreviews.forEach(url => URL.revokeObjectURL(url));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    newPreviews.forEach(url => URL.revokeObjectURL(url));
    if (initial) {
      // Ler do campo description e separar nos dois campos
      const description = initial.description || "";
      let oQueVoceVaiAprender = "";
      let paraQuemE = "";
      
      // Separar description nos dois campos usando marcadores
      // Primeiro, encontrar onde começa "O QUE VOCÊ VAI APRENDER:"
      const oQueIndex = description.search(/O\s+QUE\s+VOCÊ\s+VAI\s+APRENDER:\s*\n/i);
      const paraQuemIndex = description.search(/PARA\s+QUEM\s+É:\s*\n/i);
      
      if (oQueIndex !== -1) {
        // Encontrar o início do conteúdo (após o marcador e quebra de linha)
        const contentStart = description.indexOf('\n', oQueIndex) + 1;
        // Encontrar o fim do conteúdo (antes de "PARA QUEM É:" ou fim da string)
        const contentEnd = paraQuemIndex !== -1 ? paraQuemIndex : description.length;
        oQueVoceVaiAprender = description.substring(contentStart, contentEnd).trim();
      }
      
      if (paraQuemIndex !== -1) {
        // Encontrar o início do conteúdo (após o marcador e quebra de linha)
        const contentStart = description.indexOf('\n', paraQuemIndex) + 1;
        // O conteúdo vai até o fim da string
        paraQuemE = description.substring(contentStart).trim();
      }
      
      setForm({
        name: initial.name || "",
        slug: initial.slug || "",
        category: initial.category || "cursos",
        price: initial.price || "",
        oldPrice: initial.oldPrice || "",
        discount: initial.discount || "",
        installment: initial.installment || "",
        buyUrl: initial.buyUrl || "",
        isActive: initial.isActive !== undefined ? initial.isActive : true,
        images: [],
        oQueVoceVaiAprender,
        paraQuemE
      });
      const normalizeImage = (img) => typeof img === "string" ? img : (img?.original || img?.webp || "");
      setExistingImages((initial.images || []).map(normalizeImage).filter(Boolean));
      setNewFiles([]);
      setNewPreviews([]);
      setImagesToDelete([]);
    } else {
      setForm({
        name: "",
        slug: "",
        category: "cursos",
        price: "",
        oldPrice: "",
        discount: "",
        installment: "",
        buyUrl: "",
        isActive: true,
        images: [],
        oQueVoceVaiAprender: "",
        paraQuemE: ""
      });
      setExistingImages([]);
      setNewFiles([]);
      setNewPreviews([]);
      setImagesToDelete([]);
    }
  }, [initial?._id || initial?.id]);

  if (!open) return null;

  function handleChange(e) {
    const { name, value } = e.target;
    if (name === "price" || name === "oldPrice") {
      setForm(f => ({ ...f, [name]: formatCurrencyInput(value) }));
    } else if (name === "isActive") {
      setForm(f => ({ ...f, [name]: e.target.checked }));
    } else {
      setForm(f => ({ ...f, [name]: value }));
    }
  }

  function handleFiles(e) {
    const files = Array.from(e.target.files);
    newPreviews.forEach(url => URL.revokeObjectURL(url));
    setNewFiles(files);
    const urls = files.map(f => URL.createObjectURL(f));
    setNewPreviews(urls);
  }

  async function handleRemoveExisting(url) {
    if (!initial?._id && !initial?.id) {
      // Se não tem ID, apenas remove da lista local
      setExistingImages(prev => prev.filter(img => img !== url));
      setImagesToDelete(prev => [...prev, url]);
      return;
    }
    const id = initial._id || initial.id;
    try {
      await dispatch(removeImage({ id, imageUrl: url })).unwrap();
      setExistingImages(prev => prev.filter(img => img !== url));
      setImagesToDelete(prev => [...prev, url]);
    } catch (err) {
      console.error("Erro ao remover imagem:", err);
      // Se falhar, ainda remove localmente para edição
      setExistingImages(prev => prev.filter(img => img !== url));
      setImagesToDelete(prev => [...prev, url]);
    }
  }

  function handleRemoveNew(index) {
    setNewFiles(prev => prev.filter((_, i) => i !== index));
    const url = newPreviews[index];
    if (url) URL.revokeObjectURL(url);
    setNewPreviews(prev => prev.filter((_, i) => i !== index));
  }

  function handleSubmit(e) {
    e.preventDefault();
    // Concatenar os dois campos em description
    // IMPORTANTE: trim() remove espaços, mas garantimos que campos vazios não sejam incluídos
    const oQueVoceVaiAprenderText = form.oQueVoceVaiAprender.trim();
    const paraQuemEText = form.paraQuemE.trim();
    
    // Construir description apenas com campos que têm conteúdo
    let description = "";
    if (oQueVoceVaiAprenderText) {
      description += "O QUE VOCÊ VAI APRENDER:\n" + oQueVoceVaiAprenderText;
    }
    if (paraQuemEText) {
      if (description) {
        description += "\n\n";
      }
      description += "PARA QUEM É:\n" + paraQuemEText;
    }
    
    // Se ambos os campos estiverem vazios, description será string vazia
    // Enviar null se description estiver vazio para limpar o campo no banco
    const data = {
      name: form.name,
      slug: form.slug,
      category: form.category,
      price: form.price,
      oldPrice: form.oldPrice,
      discount: form.discount || null,
      installment: form.installment || null,
      description: description || null,
      buyUrl: form.buyUrl || null,
      isActive: form.isActive,
      images: newFiles,
      imagesToDelete: imagesToDelete.length > 0 ? imagesToDelete : undefined
    };
    onSubmit(data);
  }

  return (
    <MotionDiv
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-50 flex"
    >
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <MotionDiv
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 40 }}
        transition={{ duration: 0.3 }}
        className="relative ml-auto h-full w-full max-w-2xl bg-white text-neutral-900 p-6 overflow-y-auto border-l border-[#e0d6f7]"
      >
        <h2 className="text-lg font-medium mb-4">{initial ? "Editar Curso" : "Novo Curso"}</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-xs font-medium">Nome *</label>
            <input
              name="name"
              placeholder="Curso de Enraizamento"
              value={form.name}
              onChange={handleChange}
              className="w-full border border-[#e0d6f7] bg-[#f7f3fa] px-2 py-1 rounded text-sm text-neutral-900"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium">Slug *</label>
              <input
                name="slug"
                placeholder="curso-de-enraizamento"
                value={form.slug}
                onChange={handleChange}
                className="w-full border border-[#e0d6f7] bg-[#f7f3fa] px-2 py-1 rounded text-sm text-neutral-900"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium">Categoria</label>
              <input
                name="category"
                value={form.category}
                readOnly
                className="w-full border border-[#e0d6f7] bg-gray-100 px-2 py-1 rounded text-sm text-neutral-900"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium">Preço *</label>
              <input
                name="price"
                type="text"
                inputMode="numeric"
                pattern="[0-9.,]*"
                placeholder="ex: 9.999,99"
                value={form.price}
                onChange={handleChange}
                className="w-full border border-[#e0d6f7] bg-[#f7f3fa] px-2 py-1 rounded text-sm text-neutral-900"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium">Preço Antigo</label>
              <input
                name="oldPrice"
                type="text"
                inputMode="numeric"
                pattern="[0-9.,]*"
                placeholder="ex: 9.999,99"
                value={form.oldPrice}
                onChange={handleChange}
                className="w-full border border-[#e0d6f7] bg-[#f7f3fa] px-2 py-1 rounded text-sm text-neutral-900"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium">Desconto</label>
              <input
                name="discount"
                placeholder="20% OFF"
                value={form.discount}
                onChange={handleChange}
                className="w-full border border-[#e0d6f7] bg-[#f7f3fa] px-2 py-1 rounded text-sm text-neutral-900"
              />
            </div>
            <div>
              <label className="block text-xs font-medium">Parcelamento</label>
              <input
                name="installment"
                placeholder="Em até 4x de R$ 49,75 sem juros"
                value={form.installment}
                onChange={handleChange}
                className="w-full border border-[#e0d6f7] bg-[#f7f3fa] px-2 py-1 rounded text-sm text-neutral-900"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium">URL de Compra</label>
            <input
              name="buyUrl"
              type="url"
              placeholder="https://example.com/comprar"
              value={form.buyUrl}
              onChange={handleChange}
              className="w-full border border-[#e0d6f7] bg-[#f7f3fa] px-2 py-1 rounded text-sm text-neutral-900"
            />
          </div>

          {/* Sections */}
          <div>
            <label className="block text-xs font-bold mb-1">
              O que você vai aprender:
              <span className="text-[10px] text-gray-500 ml-2 font-normal">
                (Suporta quebras de linha - Enter para nova linha)
              </span>
            </label>
            <textarea
              name="oQueVoceVaiAprender"
              placeholder="Materiais e ferramentas essenciais
Preparação e organização do trabalho
Técnicas de base e acabamento
Dicas para evitar erros comuns

Você pode usar múltiplas linhas.
Pressione Enter para criar novas linhas."
              value={form.oQueVoceVaiAprender}
              onChange={handleChange}
              rows={8}
              className="w-full border border-[#e0d6f7] bg-[#f7f3fa] px-2 py-2 rounded text-sm text-neutral-900 resize-y min-h-[120px]"
              style={{
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
                lineHeight: "1.6",
                fontFamily: "inherit"
              }}
            />
            <p className="text-[10px] text-gray-500 mt-1">
              Dica: Pressione Enter para criar novas linhas. Espaços e parágrafos serão preservados.
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold mb-1">
              Para quem é:
              <span className="text-[10px] text-gray-500 ml-2 font-normal">
                (Suporta quebras de linha - Enter para nova linha)
              </span>
            </label>
            <textarea
              name="paraQuemE"
              placeholder="Iniciantes que querem começar com segurança
Quem deseja aprimorar técnica e acabamento
Artesãs(os) buscando um processo mais consistente

Você pode usar múltiplas linhas.
Pressione Enter para criar novas linhas."
              value={form.paraQuemE}
              onChange={handleChange}
              rows={8}
              className="w-full border border-[#e0d6f7] bg-[#f7f3fa] px-2 py-2 rounded text-sm text-neutral-900 resize-y min-h-[120px]"
              style={{
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
                lineHeight: "1.6",
                fontFamily: "inherit"
              }}
            />
            <p className="text-[10px] text-gray-500 mt-1">
              Dica: Pressione Enter para criar novas linhas. Espaços e parágrafos serão preservados.
            </p>
          </div>

          <div>
            <label className="block text-xs font-medium mb-2">
              Imagens (até 30)
            </label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFiles}
              className="text-sm"
            />
            <p className="text-[11px] text-neutral-600 mt-1">Novas imagens serão adicionadas às existentes.</p>
            <div className="flex flex-wrap gap-2 mt-2">
              {existingImages.map((src) => (
                <div key={src} className="relative group">
                  <img
                    src={src}
                    alt=""
                    className="w-16 h-16 object-cover rounded border border-[#e0d6f7]"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveExisting(src)}
                    className="absolute top-1 right-1 bg-white/80 rounded-full p-1 border border-[#e0d6f7] opacity-80 hover:opacity-100"
                  >
                    <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
                      <path d="M6 7h12M9 7v10m6-10v10M4 7h16l-1.5 12.5A2 2 0 0 1 16.5 21h-9a2 2 0 0 1-2-1.5L4 7z" stroke="#e53e3e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                </div>
              ))}
              {newPreviews.map((src, i) => (
                <div key={src} className="relative group">
                  <img
                    src={src}
                    alt=""
                    className="w-16 h-16 object-cover rounded border border-[#e0d6f7]"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveNew(i)}
                    className="absolute top-1 right-1 bg-white/80 rounded-full p-1 border border-[#e0d6f7] opacity-80 hover:opacity-100"
                  >
                    <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
                      <path d="M6 7h12M9 7v10m6-10v10M4 7h16l-1.5 12.5A2 2 0 0 1 16.5 21h-9a2 2 0 0 1-2-1.5L4 7z" stroke="#e53e3e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="isActive"
              checked={form.isActive}
              onChange={handleChange}
              className="rounded"
            />
            <label className="text-xs font-medium">Curso ativo (visível no site)</label>
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded border border-[#e0d6f7] text-sm text-neutral-900 bg-white"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded bg-[#7a4fcf] hover:bg-[#ae95d9] text-white text-sm"
            >
              {initial ? "Salvar" : "Criar"}
            </button>
          </div>
        </form>
      </MotionDiv>
    </MotionDiv>
  );
}
