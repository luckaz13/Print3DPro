export const seoConfig = {
  defaultTitle: "Print3DPro - Impressão 3D Profissional | Protótipos e Peças Personalizadas",
  titleTemplate: "%s | Print3DPro",
  defaultDescription: "Serviços profissionais de impressão 3D com alta qualidade e precisão. Protótipos, peças personalizadas e projetos sob medida em São Paulo.",
  siteUrl: "https://luckaz13.github.io/Print3DPro/",
  defaultImage: "https://luckaz13.github.io/Print3DPro/3d-printer.jpg",
  twitterHandle: "@print3dpro",
  
  // Structured data padrão
  defaultStructuredData: {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Print3DPro",
    "description": "Serviços profissionais de impressão 3D com alta qualidade e precisão",
    "url": "https://luckaz13.github.io/Print3DPro/",
    "logo": "https://luckaz13.github.io/Print3DPro/generated-icon.png",
    "image": "https://luckaz13.github.io/Print3DPro/3d-printer.jpg",
    "telephone": "+55-11-99999-9999",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "São Paulo",
      "addressRegion": "SP",
      "addressCountry": "BR"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": -23.5505,
      "longitude": -46.6333
    },
    "openingHours": "Mo-Fr 08:00-18:00",
    "priceRange": "$$",
    "serviceArea": {
      "@type": "GeoCircle",
      "geoMidpoint": {
        "@type": "GeoCoordinates",
        "latitude": -23.5505,
        "longitude": -46.6333
      },
      "geoRadius": "50000"
    }
  },

  // Keywords por página
  keywords: {
    home: "impressão 3D, prototipagem, peças personalizadas, impressão 3D São Paulo, serviços 3D, modelagem 3D, fabricação digital, protótipos funcionais",
    portfolio: "portfólio impressão 3D, projetos 3D, casos de sucesso, exemplos impressão 3D, trabalhos realizados",
    services: "serviços impressão 3D, prototipagem rápida, peças sob medida, consultoria 3D, modelagem CAD",
    contact: "contato impressão 3D, orçamento 3D, solicitar serviço, Print3DPro contato"
  },

  // Configurações de Open Graph por tipo de página
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    site_name: 'Print3DPro',
  },

  // Configurações do Twitter Card
  twitter: {
    cardType: 'summary_large_image',
    site: '@print3dpro',
  },

  // Recursos críticos para preload
  criticalResources: [
    {
      href: '/3d-printer.jpg',
      as: 'image',
      type: 'image/jpeg'
    },
    {
      href: '/1.jpg',
      as: 'image',
      type: 'image/jpeg'
    },
    {
      href: '/2.jpg',
      as: 'image',
      type: 'image/jpeg'
    }
  ],

  // Configurações de performance
  performance: {
    // Lazy loading threshold
    lazyLoadingThreshold: '50px',
    
    // Image optimization settings
    imageOptimization: {
      quality: 85,
      format: 'webp',
      fallback: 'jpg'
    },

    // Bundle optimization
    bundleOptimization: {
      chunkSizeWarning: 800,
      assetInlineLimit: 2048
    }
  }
};

// Função para gerar meta tags dinamicamente
export const generateMetaTags = (pageConfig: {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
}) => {
  const {
    title = seoConfig.defaultTitle,
    description = seoConfig.defaultDescription,
    keywords = seoConfig.keywords.home,
    image = seoConfig.defaultImage,
    url = seoConfig.siteUrl,
    type = 'website'
  } = pageConfig;

  return {
    title,
    description,
    keywords,
    canonical: url,
    openGraph: {
      ...seoConfig.openGraph,
      title,
      description,
      image,
      url,
      type
    },
    twitter: {
      ...seoConfig.twitter,
      title,
      description,
      image
    }
  };
};

// Função para gerar dados estruturados específicos da página
export const generateStructuredData = (pageType: 'home' | 'portfolio' | 'services' | 'contact', additionalData?: Record<string, any>) => {
  const baseData = { ...seoConfig.defaultStructuredData };

  switch (pageType) {
    case 'portfolio':
      return {
        ...baseData,
        "@type": "CreativeWork",
        "workExample": [
          {
            "@type": "CreativeWork",
            "name": "Protótipo Funcional",
            "description": "Desenvolvimento de protótipo funcional para validação de conceito"
          },
          {
            "@type": "CreativeWork", 
            "name": "Peça Personalizada",
            "description": "Fabricação de peça sob medida para aplicação específica"
          }
        ],
        ...additionalData
      };

    case 'services':
      return {
        ...baseData,
        "hasOfferCatalog": {
          "@type": "OfferCatalog",
          "name": "Serviços de Impressão 3D",
          "itemListElement": [
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "Impressão 3D de Protótipos",
                "description": "Criação de protótipos funcionais com alta precisão"
              }
            },
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "Peças Personalizadas",
                "description": "Fabricação de peças sob medida para diversos setores"
              }
            }
          ]
        },
        ...additionalData
      };

    case 'contact':
      return {
        ...baseData,
        "@type": "ContactPage",
        "mainEntity": {
          "@type": "LocalBusiness",
          "name": "Print3DPro",
          "contactPoint": {
            "@type": "ContactPoint",
            "telephone": "+55-11-99999-9999",
            "contactType": "customer service",
            "availableLanguage": "Portuguese"
          }
        },
        ...additionalData
      };

    default:
      return {
        ...baseData,
        ...additionalData
      };
  }
};