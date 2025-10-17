import { useEffect, useState, useCallback, useRef } from "react";

export function useBabies(options = {}) {
  const { type, customFilter, enabled = true } = options;
  const [babies, setBabies] = useState([]);
  const [loading, setLoading] = useState(enabled);
  const [error, setError] = useState(null);
  const controllerRef = useRef(null);

  const applyFilter = useCallback(
    (list) => {
      let out = list;
      
      // Se é tipo pronta_entrega, mostra apenas disponíveis por padrão
      // a menos que um customFilter seja fornecido (para override)
      if (type === "pronta_entrega" && !customFilter) {
        out = out.filter(b => b.category === type && b.status !== "indisponivel");
      } else if (type) {
        out = out.filter(b => b.category === type);
      }
      
      if (customFilter) out = out.filter(customFilter);
      return out;
    },
    [type, customFilter]
  );

  const fetchBabies = useCallback(async () => {
    if (!enabled) return;
    controllerRef.current?.abort();
    const ctrl = new AbortController();
    controllerRef.current = ctrl;
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("https://atelie-juliabrandao-backend-production.up.railway.app/api/babies", { 
        signal: ctrl.signal,
        credentials: 'include'
      });
      if (!res.ok) throw new Error("Erro ao buscar bebês");
      const data = await res.json();
      const mapped = data.map(b => {
        const normId = b.id ?? b._id ?? b.slug;
        return {
          ...b,
          id: normId,
          img: b.img || b.images?.[0] || "",
          price: typeof b.price === "string" ? Number(b.price) : b.price,
          oldPrice: typeof b.oldPrice === "string" ? Number(b.oldPrice) : b.oldPrice,
        };
      });
      setBabies(applyFilter(mapped));
    } catch (e) {
      if (e.name !== "AbortError") setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [applyFilter, enabled]);

  useEffect(() => {
    fetchBabies();
    return () => controllerRef.current?.abort();
  }, [fetchBabies]);

  return { babies, loading, error, refetch: fetchBabies };
}