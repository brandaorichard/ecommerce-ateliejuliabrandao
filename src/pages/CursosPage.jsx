import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useEffect, useMemo } from "react";

import CategoryCardsSection from "../components/CategoryCardsSection";
import SEOHead from "../components/SEO/SEOHead";
import { trackViewItemList } from "../utils/analytics";
import { coursesMock } from "../mocks/coursesMock";
import { useCourses } from "../hooks/useCourses";
import LoadingSpinner from "../components/LoadingSpinner";

export default function CursosPage() {
  const navigate = useNavigate();
  const { courses, loading } = useCourses();

  const breadcrumbItems = [{ label: "Início", to: "/" }, { label: "Cursos" }];

  // Usar cursos do backend se disponível, senão usar mock como fallback/exemplo
  const displayCourses = useMemo(() => {
    // Se tem cursos do backend e não é erro de rede/API, usar eles
    if (courses && courses.length > 0) {
      return courses;
    }
    // Caso contrário, usar mock (para exemplo/desenvolvimento)
    return coursesMock;
  }, [courses]);

  useEffect(() => {
    if (displayCourses && displayCourses.length > 0) {
      trackViewItemList(
        displayCourses.map((course) => ({
          item_id: course.slug,
          item_name: course.name,
          item_category: course.category || "cursos",
          price: course.price,
        })),
        "cursos"
      );
    }
  }, [displayCourses]);

  // Se estiver carregando e não tem fallback, mostrar loading
  if (loading && (!courses || courses.length === 0)) {
    return (
      <>
        <SEOHead
          title="Cursos"
          description="Cursos do Ateliê Júlia Brandão. Aprenda técnicas e processos com aulas práticas e diretas ao ponto."
          keywords="cursos, ateliê, reborn, enraizamento, artesanato, aulas"
          url="https://www.juliabrandao.com.br/cursos"
        />
        <div className="w-full min-h-screen flex items-center justify-center bg-[#f9e7f6]">
          <LoadingSpinner />
        </div>
      </>
    );
  }

  return (
    <>
      <SEOHead
        title="Cursos"
        description="Cursos do Ateliê Júlia Brandão. Aprenda técnicas e processos com aulas práticas e diretas ao ponto."
        keywords="cursos, ateliê, reborn, enraizamento, artesanato, aulas"
        url="https://www.juliabrandao.com.br/cursos"
      />
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <CategoryCardsSection
          title="Cursos"
          babies={displayCourses}
          onCardClick={(course) => navigate(`/cursos/${course.slug}`)}
          showFilter
          showSort
          breadcrumbItems={breadcrumbItems}
        />
      </motion.div>
    </>
  );
}


