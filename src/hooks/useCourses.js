import { useEffect, useState, useCallback, useRef } from "react";
import { fetchWithRetry } from "../utils/fetchWithRetry";

const API_BASE_URL = "https://atelie-juliabrandao-backend-production.up.railway.app/api";

export function useCourses(options = {}) {
  const { enabled = true } = options;
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(enabled);
  const [error, setError] = useState(null);
  const controllerRef = useRef(null);

  const fetchCourses = useCallback(async () => {
    if (!enabled) return;
    controllerRef.current?.abort();
    const ctrl = new AbortController();
    controllerRef.current = ctrl;
    
    try {
      setLoading(true);
      setError(null);
      
      // Usar fetchWithRetry para lidar com 429 e cache
      const data = await fetchWithRetry(
        `${API_BASE_URL}/courses`,
        {
          signal: ctrl.signal,
          credentials: 'include'
        },
        1, // Apenas 1 retry (2 tentativas total)
        true // usar cache
      );
      
      // Mapear e normalizar dados dos cursos
      const mapped = data.map(c => {
        const normId = c.id ?? c._id ?? c.slug;
        return {
          ...c,
          id: normId,
          // Normalizar imagens: usar img ou primeiro item de images array
          images: Array.isArray(c.images) && c.images.length > 0 
            ? c.images.filter(img => img && typeof img === "string")
            : c.img 
              ? [c.img] 
              : [],
          img: c.img || (Array.isArray(c.images) && c.images[0]) || "",
          price: typeof c.price === "string" ? Number(c.price) : c.price,
          oldPrice: typeof c.oldPrice === "string" ? Number(c.oldPrice) : c.oldPrice,
        };
      });
      
      setCourses(mapped);
    } catch (e) {
      if (e.name !== "AbortError") {
        setError(e.message);
        console.error("Erro ao buscar cursos:", e);
      }
    } finally {
      setLoading(false);
    }
  }, [enabled]);

  useEffect(() => {
    fetchCourses();
    return () => controllerRef.current?.abort();
  }, [fetchCourses]);

  return { courses, loading, error, refetch: fetchCourses };
}

/**
 * Hook para buscar um curso específico por slug
 */
export function useCourseBySlug(slug) {
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!slug) {
      setCourse(null);
      setLoading(false);
      return;
    }

    async function fetchCourse() {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(
          `${API_BASE_URL}/courses/slug/${slug}`,
          { credentials: 'include' }
        );

        if (!response.ok) {
          if (response.status === 404) {
            setCourse(null);
            setError(null); // 404 não é um erro crítico, apenas curso não encontrado
          } else {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
          }
        } else {
          const data = await response.json();
          
          // Normalizar dados do curso
          const normId = data.id ?? data._id ?? data.slug;
          const normalizedCourse = {
            ...data,
            id: normId,
            // Normalizar imagens: usar img ou primeiro item de images array
            images: Array.isArray(data.images) && data.images.length > 0 
              ? data.images.filter(img => img && typeof img === "string")
              : data.img 
                ? [data.img] 
                : [],
            img: data.img || (Array.isArray(data.images) && data.images[0]) || "",
            price: typeof data.price === "string" ? Number(data.price) : data.price,
            oldPrice: typeof data.oldPrice === "string" ? Number(data.oldPrice) : data.oldPrice,
          };
          
          setCourse(normalizedCourse);
        }
      } catch (e) {
        console.error("Erro ao buscar curso:", e);
        setError(e.message);
        setCourse(null);
      } finally {
        setLoading(false);
      }
    }

    fetchCourse();
  }, [slug]);

  return { course, loading, error };
}
