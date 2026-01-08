import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";

import Breadcrumb from "./Breadcrumb";
import ProductCarousel from "./ProductCarousel";
import ProductTitlePrice from "./ProductTitlePrice";
import ProductSection from "./ProductSection";
import SEOHead from "./SEO/SEOHead";
import LoadingSpinner from "./LoadingSpinner";
import FormattedDescription from "./FormattedDescription";

import { showToast } from "../redux/toastSlice";
import { trackViewItem } from "../utils/analytics";
import { getCourseBySlug } from "../mocks/coursesMock";
import { useCourseBySlug } from "../hooks/useCourses";

export default function CourseProductPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [current, setCurrent] = useState(0);

  // Buscar curso do backend
  const { course: courseFromBackend, loading } = useCourseBySlug(slug);
  
  // Fallback para mock se não encontrar no backend
  const mockCourse = useMemo(() => getCourseBySlug(slug), [slug]);
  
  // Usar curso do backend se disponível, senão usar mock
  const course = courseFromBackend || mockCourse;

  useEffect(() => {
    if (course) {
      trackViewItem(course.slug, course.name, course.category || "cursos", course.price);
    }
  }, [course]);

  // Mostrar loading enquanto busca do backend (mas não bloqueia se tiver mock)
  if (loading && !mockCourse && !courseFromBackend) {
    return (
      <section className="w-full bg-[#f9e7f6] min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </section>
    );
  }

  if (!course) {
    return (
      <section className="w-full bg-[#f9e7f6] min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-light text-gray-800 mb-4">Curso não encontrado</h2>
          <button onClick={() => navigate("/cursos")} className="text-[#7a4fcf] underline">
            Voltar para Cursos
          </button>
        </div>
      </section>
    );
  }

  const breadcrumbItems = [
    { label: "Início", to: "/" },
    { label: "Cursos", to: "/cursos" },
    { label: course.name },
  ];

  const handleBuy = () => {
    if (course.buyUrl) {
      window.open(course.buyUrl, "_blank", "noopener,noreferrer");
      return;
    }
    dispatch(
      showToast({
        message: "Disponível em breve",
        iconType: "success",
      })
    );
  };

  return (
    <>
      <SEOHead
        title={course.name}
        description={course.description}
        keywords={`curso, ${course.name}, ateliê, enraizamento`}
        image={course.images?.[0] || course.img}
        url={`https://www.juliabrandao.com.br/cursos/${course.slug}`}
        type="product"
      />

      <section className="w-full bg-[#f9e7f6] min-h-screen py-6 px-2">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-8">
          <ProductCarousel
            images={course.images || (course.img ? [course.img] : [])}
            current={current}
            setCurrent={setCurrent}
            name={course.name}
          />

          <div className="flex-1 flex flex-col justify-start mt-2 md:mt-0">
            <Breadcrumb items={breadcrumbItems} />
            <ProductTitlePrice
              name={course.name}
              price={course.price}
              oldPrice={course.oldPrice}
              discount={course.discount}
              installment={course.installment}
              productUrl={`https://www.juliabrandao.com.br/cursos/${course.slug}`}
              productName={course.name}
              isCourse={true}
            />

            <div className="flex flex-col gap-2 mb-4">
              <button
                className="text-white text-lg font-medium w-fit rounded-full px-10 py-2 transition bg-[#7a4fcf] hover:bg-[#ae95d9] cursor-pointer"
                onClick={handleBuy}
              >
                Comprar
              </button>
              {!course.buyUrl && (
                <span className="text-xs text-[#616161] text-center">
                  Link de compra em configuração. Em breve você poderá finalizar pelo checkout.
                </span>
              )}
            </div>

            {course.description && course.description.trim() && (
              <div className="mt-6">
                <h2 className="text-lg font-medium text-gray-800 mb-2">Informações</h2>
                <FormattedDescription text={course.description} className="mb-4" />
              </div>
            )}

            <ProductSection
              title="O que você vai aprender"
              items={course.sections?.oQueVoceVaiAprender}
            />
            <ProductSection title="Para quem é" items={course.sections?.paraQuemE} />
          </div>
        </div>
      </section>
    </>
  );
}


