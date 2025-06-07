import { useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { AboutSection } from "@/components/AboutSection";
import { PortfolioSection } from "@/components/PortfolioSection";
import { QuoteSection } from "@/components/QuoteSection";
import { ShopSection } from "@/components/ShopSection";
import { Footer } from "@/components/Footer";
import { usePageTracking, useSectionTracking } from "@/hooks/use-analytics";

const Home = () => {
  // Rastrear visualização da página
  usePageTracking('/', 'Print3DPro - Impressão 3D Profissional');

  // Rastrear tempo gasto em seções principais
  useSectionTracking('hero');
  useSectionTracking('about');
  useSectionTracking('portfolio');
  useSectionTracking('orcamentos');
  useSectionTracking('shop');

  useEffect(() => {
    // Intersection Observer for fade-in animation
    const sections = document.querySelectorAll('section[id]:not([id=""])');
    
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if(entry.isIntersecting) {
          entry.target.classList.add('opacity-100');
          entry.target.classList.remove('opacity-0', 'translate-y-10');
          sectionObserver.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px' // Trigger animation earlier
    });
    
    sections.forEach(section => {
      // Verificar se a seção já não tem classes de animação aplicadas
      if (!section.classList.contains('opacity-0')) {
        section.classList.add('transition-all', 'duration-700', 'opacity-0', 'translate-y-10');
      }
      sectionObserver.observe(section);
    });

    return () => {
      sectionObserver.disconnect();
    };
  }, []);

  return (
    <>
      <Navbar />
      <HeroSection />
      <AboutSection />
      <PortfolioSection />
      <QuoteSection />
      <ShopSection />
      <Footer />
    </>
  );
};

export default Home;
