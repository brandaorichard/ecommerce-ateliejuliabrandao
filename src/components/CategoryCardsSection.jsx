import React, { useState, useMemo } from "react";
import { FaFilter, FaSortAmountDown } from "react-icons/fa";
import FilterDrawer from "./FilterDrawer";
import SortDrawer from "./SortDrawer";
import RebornCard from "./RebornCard";
import Breadcrumb from "./Breadcrumb";

function parseBRL(value) {
  if (value === null || value === undefined || value === "") return null;
  if (typeof value === "number") return value;
  const cleaned = value
    .toString()
    .trim()
    .replace(/\s/g, "")
    .replace(/\./g, "")
    .replace(",", ".");
  const num = Number(cleaned);
  return isNaN(num) ? null : num;
}

const sortOptions = [
  { label: "Preço: Menor ao Maior", value: "price-asc" },
  { label: "Preço: Maior ao Menor", value: "price-desc" },
  { label: "A - Z", value: "az" },
  { label: "Z - A", value: "za" },
];

function getNumPrice(baby) {
  const p = parseBRL(baby.price);
  return typeof p === "number" ? p : null;
}

function sortBabies(babies, sort) {
  const arr = [...babies];
  switch (sort) {
    case "price-asc":
      return arr.sort((a, b) => {
        const pa = getNumPrice(a);
        const pb = getNumPrice(b);
        if (pa === null && pb === null) return 0;
        if (pa === null) return 1;
        if (pb === null) return -1;
        return pa - pb;
      });
    case "price-desc":
      return arr.sort((a, b) => {
        const pa = getNumPrice(a);
        const pb = getNumPrice(b);
        if (pa === null && pb === null) return 0;
        if (pa === null) return 1;
        if (pb === null) return -1;
        return pb - pa;
      });
    case "az":
      return arr.sort((a, b) => a.name.localeCompare(b.name));
    case "za":
      return arr.sort((a, b) => b.name.localeCompare(a.name));
    default:
      return arr;
  }
}

function filterBabies(babies, minValue, maxValue) {
  const min = parseBRL(minValue);
  const max = parseBRL(maxValue);
  return babies.filter((baby) => {
    const price = getNumPrice(baby);
    if (price === null) return false; // sem preço fica fora de filtros numéricos
    if (min !== null && price < min) return false;
    if (max !== null && price > max) return false;
    return true;
  });
}

export default function CategoryCardsSection({
  title,
  babies,
  onCardClick,
  showFilter = true,
  showSort = true,
  breadcrumbItems
}) {
  const [selectedSort, setSelectedSort] = useState("price-asc");
  const [minValue, setMinValue] = useState("");
  const [maxValue, setMaxValue] = useState("");
  const [showWarning, setShowWarning] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);

  const filteredBabies = useMemo(() => {
    let base = babies;
    // Se não há filtros de faixa aplicados, não filtra por preço (mantém cards com preço vazio)
    const hasRange = !!(minValue || maxValue);
    if (hasRange) {
      base = filterBabies(babies, minValue, maxValue);
      setShowWarning(base.length === 0);
    } else {
      setShowWarning(false);
    }
    return sortBabies(base, selectedSort);
  }, [babies, minValue, maxValue, selectedSort]);

  // Detecta se está na categoria 3 (por semelhança)
  const isCategory3 = title === "Por Semelhança";

  function resetFilter() {
    setMinValue("");
    setMaxValue("");
    setShowWarning(false);
  }

  return (
    <div className="max-w-6xl mx-auto px-4 pt-8 md:pt-10 pb-8">
      <Breadcrumb items={breadcrumbItems} />
      <h1 className="text-2xl font-light text-gray-800 mb-4">{title}</h1>

      {(showFilter || showSort) && (
        <div className="flex items-center gap-2 mb-4">
          {showFilter && (
            <button
              className="flex items-center gap-1 text-[#7a4fcf] text-sm font-medium hover:underline focus:outline-none cursor-pointer"
              onClick={() => setFilterOpen(true)}
            >
              <FaFilter className="text-base" />
              Filtrar
            </button>
          )}
          {showSort && (
            <button
              className="flex items-center gap-1 text-[#7a4fcf] text-sm font-medium hover:underline focus:outline-none cursor-pointer"
              onClick={() => setSortOpen(true)}
            >
              <FaSortAmountDown className="text-base" />
              Ordenar
            </button>
          )}
        </div>
      )}

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

      {showWarning && (
        <div className="mb-4 p-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 rounded flex items-center justify-between">
          <span className="text-sm text-yellow-800">Nenhum bebê encontrado para o valor informado.</span>
          <button
            className="ml-4 px-3 py-1 bg-yellow-300 text-yellow-900 rounded hover:bg-yellow-400"
            onClick={resetFilter}
          >
            Fechar
          </button>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {filteredBabies.map((baby) => (
          <RebornCard
            key={baby.id}
            baby={baby}
            onClick={() => onCardClick(baby)}
            context={isCategory3 ? "category3" : undefined} // <--- Passa context só na categoria3
          />
        ))}
      </div>
    </div>
  );
}