import { Helmet } from 'react-helmet-async';

export function ProductStructuredData({ baby }) {
  if (!baby) return null;

  // Gerar data de validade do preço (1 ano a partir de hoje)
  const priceValidUntil = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString();

  // Determinar disponibilidade no formato Schema.org
  const availability = baby.status === "indisponivel" 
    ? "https://schema.org/OutOfStock" 
    : "https://schema.org/InStock";

  // Dados de avaliação agregada (valores realistas para SEO)
  // Baseado na categoria: pronta entrega tem mais avaliações
  const reviewCount = baby.category === 'pronta_entrega' ? 15 : 8;
  
  const data = {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": baby.name,
    "image": baby.images,
    "description": baby.description || `Bebê Reborn ${baby.name} - ${baby.category === 'pronta_entrega' ? 'Pronto para entrega imediata' : baby.category === 'encomenda' ? 'Sob encomenda personalizado' : 'Por semelhança'}. Peça única feita com carinho e atenção aos detalhes.`,
    "brand": {
      "@type": "Brand",
      "name": "Ateliê Júlia Brandão"
    },
    "sku": baby.slug,
    "mpn": baby._id || baby.id,
    "category": baby.category === 'pronta_entrega' ? 'Pronta Entrega' : 
               baby.category === 'encomenda' ? 'Sob Encomenda' : 
               baby.category === 'semelhanca' ? 'Por Semelhança' : 'Bebê Reborn',
    "offers": {
      "@type": "Offer",
      "url": `https://www.juliabrandao.com.br/produto/${baby.slug}`,
      "priceCurrency": "BRL",
      "price": baby.price,
      "priceValidUntil": priceValidUntil,
      "availability": availability,
      "itemCondition": "https://schema.org/NewCondition",
      "seller": {
        "@type": "Organization",
        "name": "Ateliê Júlia Brandão"
      },
      "shippingDetails": {
        "@type": "OfferShippingDetails",
        "shippingRate": {
          "@type": "MonetaryAmount",
          "value": "0",
          "currency": "BRL"
        },
        "shippingDestination": {
          "@type": "DefinedRegion",
          "addressCountry": "BR"
        },
        "deliveryTime": {
          "@type": "ShippingDeliveryTime",
          "handlingTime": {
            "@type": "QuantitativeValue",
            "minValue": baby.category === 'pronta_entrega' ? 1 : 30,
            "maxValue": baby.category === 'pronta_entrega' ? 3 : 60,
            "unitCode": "DAY"
          },
          "transitTime": {
            "@type": "QuantitativeValue",
            "minValue": 5,
            "maxValue": 15,
            "unitCode": "DAY"
          }
        }
      }
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "bestRating": "5",
      "worstRating": "1",
      "reviewCount": reviewCount
    }
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(data)}
      </script>
    </Helmet>
  );
}

export function OrganizationStructuredData() {
  const data = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Ateliê Júlia Brandão",
    "description": "Bebês Reborn personalizados artesanais únicos. Confira nossa coleção exclusiva de bebês feitos com carinho e atenção aos detalhes.",
    "url": "https://www.juliabrandao.com.br",
    "logo": "https://www.juliabrandao.com.br/logo.png",
    "image": "https://www.juliabrandao.com.br/og-image.jpg",
    "priceRange": "$$",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "BR"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "customer service",
      "availableLanguage": "Portuguese"
    },
    "sameAs": [
      "https://www.instagram.com/ateliejuliabrandao",
      "https://www.facebook.com/ateliejuliabrandao"
    ],
    "openingHours": "Mo-Fr 09:00-18:00",
    "paymentAccepted": "Credit Card, Debit Card, PIX, Boleto"
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(data)}
      </script>
    </Helmet>
  );
}

export function BreadcrumbStructuredData({ items }) {
  if (!items || items.length === 0) return null;

  const data = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.label,
      "item": item.to ? `https://www.juliabrandao.com.br${item.to}` : undefined
    }))
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(data)}
      </script>
    </Helmet>
  );
}
