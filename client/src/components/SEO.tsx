import { useEffect } from 'react';
import { seoConfig, generateMetaTags, generateStructuredData } from '@/lib/seo-config';
import { useSEO, useResourcePreload } from '@/hooks/use-seo';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
  pageType?: 'home' | 'portfolio' | 'services' | 'contact';
}

const SEO: React.FC<SEOProps> = ({
  title,
  description,
  keywords,
  image,
  url,
  type = "website",
  pageType = 'home'
}) => {
  // Generate meta tags using centralized config
  const metaTags = generateMetaTags({
    title,
    description,
    keywords,
    image,
    url,
    type
  });

  // Generate structured data for the page type
  const structuredData = generateStructuredData(pageType);

  // Use SEO hook with generated data
  useSEO({
    title: metaTags.title,
    description: metaTags.description,
    keywords: metaTags.keywords,
    image: metaTags.openGraph.image,
    url: metaTags.canonical,
    type: metaTags.openGraph.type,
    structuredData
  });

  // Preload critical resources
  useResourcePreload(seoConfig.criticalResources);

  useEffect(() => {
    // Additional SEO optimizations
    
    // Add hreflang for internationalization (if needed in the future)
    const addHreflang = (lang: string, href: string) => {
      let hreflang = document.querySelector(`link[hreflang="${lang}"]`) as HTMLLinkElement;
      if (!hreflang) {
        hreflang = document.createElement('link');
        hreflang.setAttribute('rel', 'alternate');
        hreflang.setAttribute('hreflang', lang);
        document.head.appendChild(hreflang);
      }
      hreflang.setAttribute('href', href);
    };

    // Add Portuguese as default language
    addHreflang('pt-BR', metaTags.canonical || seoConfig.siteUrl);
    addHreflang('x-default', metaTags.canonical || seoConfig.siteUrl);

    // Add breadcrumb structured data for better navigation
    const breadcrumbData = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": seoConfig.siteUrl
        }
      ]
    };

    // Add breadcrumb script if it doesn't exist
    let breadcrumbScript = document.querySelector('script[data-type="breadcrumb"]');
    if (!breadcrumbScript) {
      breadcrumbScript = document.createElement('script');
      breadcrumbScript.setAttribute('type', 'application/ld+json');
      breadcrumbScript.setAttribute('data-type', 'breadcrumb');
      document.head.appendChild(breadcrumbScript);
    }
    breadcrumbScript.textContent = JSON.stringify(breadcrumbData, null, 2);

    // Performance optimizations
    if (typeof window !== 'undefined') {
      // Prefetch DNS for external resources
      const prefetchDNS = (domain: string) => {
        const link = document.createElement('link');
        link.rel = 'dns-prefetch';
        link.href = domain;
        if (!document.querySelector(`link[rel="dns-prefetch"][href="${domain}"]`)) {
          document.head.appendChild(link);
        }
      };

      // Prefetch common external domains
      prefetchDNS('https://fonts.googleapis.com');
      prefetchDNS('https://fonts.gstatic.com');
      prefetchDNS('https://cdnjs.cloudflare.com');

      // Add viewport meta for mobile optimization if not present
      if (!document.querySelector('meta[name="viewport"]')) {
        const viewport = document.createElement('meta');
        viewport.name = 'viewport';
        viewport.content = 'width=device-width, initial-scale=1.0, user-scalable=yes, viewport-fit=cover';
        document.head.appendChild(viewport);
      }

      // Add theme-color meta if not present
      if (!document.querySelector('meta[name="theme-color"]')) {
        const themeColor = document.createElement('meta');
        themeColor.name = 'theme-color';
        themeColor.content = '#3b82f6';
        document.head.appendChild(themeColor);
      }
    }
  }, [metaTags.canonical, pageType]);

  return null;
};

export default SEO;