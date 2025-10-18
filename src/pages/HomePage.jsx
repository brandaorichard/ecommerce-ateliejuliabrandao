import Hero from "../components/Hero";
import Category1Preview from "../components/Category1Preview";
import Category2Preview from "../components/Category2Preview";
import Category3Preview from "../components/Category3Preview";
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
        <Category2Preview />
        <Category3Preview />
      </div>
    </>
  );
}

// Path: src/components/Hero.jsx