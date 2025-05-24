import { useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { AboutSection } from "@/components/AboutSection";
import { PortfolioSection } from "@/components/PortfolioSection";
import { QuoteSection } from "@/components/QuoteSection";
import { ShopSection } from "@/components/ShopSection";
import { Footer } from "@/components/Footer";

const Home = () => {
  useEffect(() => {
    // Add Font Awesome script dynamically
    const fontAwesomeScript = document.createElement("script");
    fontAwesomeScript.src = "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/js/all.min.js";
    fontAwesomeScript.crossOrigin = "anonymous";
    document.body.appendChild(fontAwesomeScript);

    // Intersection Observer for fade-in animation
    const sections = document.querySelectorAll('section');
    
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
      threshold: 0.1
    });
    
    sections.forEach(section => {
      if (section.id !== "") {
        section.classList.add('transition-all', 'duration-700', 'opacity-0', 'translate-y-10');
        sectionObserver.observe(section);
      }
    });

    return () => {
      // Cleanup
      document.body.removeChild(fontAwesomeScript);
      sections.forEach(section => {
        if (section.id !== "") {
          sectionObserver.unobserve(section);
        }
      });
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
