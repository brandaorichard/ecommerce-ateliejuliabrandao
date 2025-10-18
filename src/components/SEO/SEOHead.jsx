import { Helmet } from 'react-helmet-async';

export default function SEOHead({ 
  title, 
  description, 
  keywords, 
  image, 
  url,
  type = 'website'
}) {
  const siteTitle = 'Ateliê Júlia Brandão';
  const fullTitle = title ? `${title} | ${siteTitle}` : siteTitle;
  const defaultDescription = 'Bebês Reborn personalizados artesanais únicos. Confira nossa coleção exclusiva de bebês feitos com carinho e atenção aos detalhes.';
  const defaultImage = 'https://www.juliabrandao.com.br/og-image.jpg';
  const baseUrl = 'https://www.juliabrandao.com.br';

  return (
    <Helmet>
      {/* Meta Tags Básicas */}
      <title>{fullTitle}</title>
      <meta name="description" content={description || defaultDescription} />
      {keywords && <meta name="keywords" content={keywords} />}
      
      {/* Open Graph (Facebook/WhatsApp) */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description || defaultDescription} />
      <meta property="og:image" content={image || defaultImage} />
      <meta property="og:url" content={url || baseUrl} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={siteTitle} />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description || defaultDescription} />
      <meta name="twitter:image" content={image || defaultImage} />
      
      {/* Canonical URL */}
      <link rel="canonical" href={url || baseUrl} />
      
      {/* Meta tags adicionais para SEO */}
      <meta name="robots" content="index, follow" />
      <meta name="author" content="Ateliê Júlia Brandão" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      
      {/* Meta tags específicas para produtos */}
      {type === 'product' && (
        <>
          <meta property="og:type" content="product" />
          <meta property="product:brand" content="Ateliê Júlia Brandão" />
          <meta property="product:availability" content="in stock" />
          <meta property="product:condition" content="new" />
        </>
      )}
    </Helmet>
  );
}
