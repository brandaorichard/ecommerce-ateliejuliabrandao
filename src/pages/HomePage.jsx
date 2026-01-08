import Hero from "../components/Hero";
import Category1Preview from "../components/Category1Preview";
import CategoriesSection from "../components/CategoriesSection";
import WhyBuyWithUs from "../components/WhyBuyWithUs";
import SobreMim from "../components/SobreMim";
import SEOHead from "../components/SEO/SEOHead";
import { OrganizationStructuredData } from "../components/SEO/StructuredData";

export default function HomePage() {
  return (
    <>
      <SEOHead 
        description="Bebês Reborn personalizados artesanais únicos. Confira nossa coleção exclusiva de bebês feitos com carinho e atenção aos detalhes."
        keywords="bebês reborn, artesanato, bebês artesanais, presente personalizado, bebê único"
        url="https://www.juliabrandao.com.br"
      />
      <OrganizationStructuredData />
      <div>
        <Hero />
        <Category1Preview />
        <CategoriesSection />
        <SobreMim />
        <WhyBuyWithUs />
      </div>
    </>
  );
}

// Path: src/components/Hero.jsx