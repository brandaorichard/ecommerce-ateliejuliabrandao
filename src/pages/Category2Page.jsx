import React, { useState, useEffect } from "react";
import { FaFilter, FaSortAmountDown } from "react-icons/fa";
import FilterDrawer from "../components/FilterDrawer";
import SortDrawer from "../components/SortDrawer";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useBabies } from "../hooks/useBabies";
import CategoryCardsSection from "../components/CategoryCardsSection";
import SEOHead from "../components/SEO/SEOHead";
import { trackViewItemList } from "../utils/analytics";

const sortOptions = [
  { label: "Preço: Menor ao Maior", value: "price-asc" },
  { label: "Preço: Maior ao Menor", value: "price-desc" },
  { label: "A - Z", value: "az" },
  { label: "Z - A", value: "za" },
];

export default function Category2Page() {
  const [selectedSort, setSelectedSort] = useState("price-asc");
  const [minValue, setMinValue] = useState("");
  const [maxValue, setMaxValue] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);

  // Categoria "pronta_entrega" (deve casar exatamente com o enum salvo no backend)
  const { babies, loading, error } = useBabies({ type: "pronta_entrega" });
  const navigate = useNavigate();

  const breadcrumbItems = [
    { label: "Início", to: "/" },
    { label: "Bebes Reborn a Pronta Entrega" }
  ];

  // Track view item list when babies load
  useEffect(() => {
    if (babies && babies.length > 0) {
      trackViewItemList(
        babies.map(baby => ({
          item_id: baby.slug,
          item_name: baby.name,
          item_category: baby.category,
          price: baby.price
        })),
        'categoria_pronta_entrega'
      );
    }
  }, [babies]);

  return (
    <>
      <SEOHead 
        title="Pronta Entrega"
        description="Bebês Reborn prontos para entrega imediata. Peças únicas disponíveis em estoque para envio rápido."
        keywords="bebês reborn pronta entrega, disponível, estoque, imediato, envio rápido"
        url="https://www.juliabrandao.com.br/categoria2"
      />
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <div className="max-w-6xl mx-auto px-4 py-8 -mt-15">
        {/* <h1 className="text-2xl font-light text-[#616161] mb-6 mt-6">A pronta entrega</h1> */}
        {/* Filtro e Ordenar */}
        {/* <div className="flex items-center gap-2 mb-4">
          <button
            className="flex items-center gap-1 text-[#7a4fcf] text-sm font-medium hover:underline focus:outline-none cursor-pointer"
            onClick={() => setFilterOpen(true)}
          >
            <FaFilter className="text-base" />
            Filtrar
          </button>
          <button
            className="flex items-center gap-1 text-[#7a4fcf] text-sm font-medium hover:underline focus:outline-none cursor-pointer"
            onClick={() => setSortOpen(true)}
          >
            <FaSortAmountDown className="text-base" />
            Ordenar
          </button>
        </div> */}
        {/* Drawers */}
        <FilterDrawer
          open={filterOpen}
          onClose={() => setFilterOpen(false)}
          onApply={(min, max) => {
            setMinValue(min);
            setMaxValue(max);
          }}
          minValue={minValue}
          maxValue={maxValue}
        />
        <SortDrawer
          open={sortOpen}
          onClose={() => setSortOpen(false)}
          options={sortOptions}
          selected={selectedSort}
          onSelect={setSelectedSort}
        />
      </div>
      {loading && <div className="py-10 text-center text-[#7a4fcf]">Carregando bebês...</div>}
      {error && <div className="py-10 text-center text-red-600">Erro: {error}</div>}
      {!loading && !error && babies.length === 0 && (
        <div className="py-16 text-center text-[#7a4fcf] text-sm">
          No momento, todos os bebês a pronta entrega estão esgotados.
        </div>
      )}
      {!loading && !error && babies.length > 0 && (
        <CategoryCardsSection
          title="A Pronta Entrega"
          babies={babies}
          onCardClick={(baby) => navigate(`/produto/${baby.slug}`)}
          showFilter
          showSort
          breadcrumbItems={breadcrumbItems}
        />
        )}
      </motion.div>
    </>
  );
}