import { useNavigate } from "react-router-dom";
import CategoryCardsSection from "../components/CategoryCardsSection";
import { motion } from "framer-motion";
import { useBabies } from "../hooks/useBabies";
import SEOHead from "../components/SEO/SEOHead";
import { trackViewItemList } from "../utils/analytics";
import { useEffect } from "react";

function Category1Page() {
  const navigate = useNavigate();
  const { babies, loading, error } = useBabies({ type: "encomenda" });

  const breadcrumbItems = [
    { label: "Início", to: "/" },
    { label: "Bebes Reborn Por Encomenda" }
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
        'categoria_encomenda'
      );
    }
  }, [babies]);

  return (
    <>
      <SEOHead 
        title="Sob Encomenda"
        description="Bebês Reborn personalizados sob encomenda. Crie o bebê dos seus sonhos com características únicas e especiais."
        keywords="bebês reborn sob encomenda, personalizado, customizado, bebê único"
        url="https://www.juliabrandao.com.br/categoria1"
      />
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {loading && <div className="py-10 text-center text-[#7a4fcf]">Carregando bebês...</div>}
        {error && <div className="py-10 text-center text-red-600">Erro: {error}</div>}
        {!loading && !error && (
          <CategoryCardsSection
            title="Por Encomenda"
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
export default Category1Page;