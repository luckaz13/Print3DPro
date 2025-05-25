import { Button } from "@/components/ui/button";
import { ScrollToSection } from "./ScrollToSection";
import { SocialLinks } from "./SocialLinks";
import { AnimatedElement } from "@/components/ui/animated-element";
import { useEffect, useState } from "react";
import { getAssetPath } from "@/lib/utils";

export const HeroSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    // Adiciona um pequeno atraso para a animação começar após o carregamento da página
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);
  return (
    <section className="pt-20 relative h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img
          src={getAssetPath("/1.jpg")}
          alt="3D printer in action"
          className="w-full h-full object-cover scale-[1.02] transition-transform duration-10000 hover:scale-[1.05]"
        />
        <div className="absolute inset-0 bg-black bg-opacity-60"></div>
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <AnimatedElement
          animation="slide-down"
          duration={800}
          delay={100}
          animateOnMount={isVisible}
        >
          <h1
            className="text-primary font-montserrat font-bold mb-4 leading-tight tracking-tight"
            style={{
              fontSize: 'clamp(2.5rem, 8vw, 6rem)',
              lineHeight: 'clamp(2.8rem, 8.5vw, 6.5rem)',
              letterSpacing: 'clamp(-0.02em, -0.01vw, -0.04em)',
              textShadow: '-2px -2px 0 #fff, 2px -2px 0 #fff, -2px 2px 0 #fff, 2px 2px 0 #fff, 0 0 8px rgba(255,255,255,0.3)'
            }}
          >
            Carossi Parts
          </h1>
        </AnimatedElement>
        
        <AnimatedElement
          animation="slide-down"
          duration={800}
          delay={300}
          animateOnMount={isVisible}
        >
          <h2
            className="text-primary font-montserrat font-bold mb-8 leading-tight tracking-wide"
            style={{
              fontSize: 'clamp(1.5rem, 4vw, 3rem)',
              lineHeight: 'clamp(1.8rem, 4.5vw, 3.5rem)',
              letterSpacing: 'clamp(0.02em, 0.01vw, 0.05em)',
              textShadow: '-1.5px -1.5px 0 #fff, 1.5px -1.5px 0 #fff, -1.5px 1.5px 0 #fff, 1.5px 1.5px 0 #fff, 0 0 6px rgba(255,255,255,0.2)'
            }}
          >
            Impressões 3D
          </h2>
        </AnimatedElement>
        
        <AnimatedElement
          animation="fade-in"
          duration={1000}
          delay={500}
          animateOnMount={isVisible}
        >
          <h3
            className="text-white font-montserrat font-bold mb-12 leading-relaxed tracking-wide max-w-2xl mx-auto"
            style={{
              fontSize: 'clamp(1rem, 2.5vw, 1.5rem)',
              lineHeight: 'clamp(1.4rem, 3vw, 2rem)',
              letterSpacing: 'clamp(0.01em, 0.005vw, 0.02em)',
              textShadow: '0 2px 4px rgba(0,0,0,0.8), 0 0 8px rgba(0,0,0,0.3)'
            }}
          >
            A fábrica das suas ideias<br />começa aqui
          </h3>
        </AnimatedElement>
        
        <AnimatedElement
          animation="slide-up"
          duration={800}
          delay={700}
          animateOnMount={isVisible}
        >
          <div className="flex justify-center" style={{ marginBottom: 'clamp(2rem, 4vw, 3rem)' }}>
            <div className="flex gap-4 justify-center scale-100 sm:scale-125 md:scale-150 lg:scale-169">
              <SocialLinks />
            </div>
          </div>
        </AnimatedElement>
        
        <AnimatedElement
          animation="slide-up"
          duration={800}
          delay={900}
          animateOnMount={isVisible}
        >
          <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-4 sm:gap-6" style={{ marginTop: 'clamp(2rem, 4vw, 3rem)' }}>
            <ScrollToSection sectionId="orcamentos">
              <Button
                variant="default"
                size="lg"
                className="btn-primary min-w-[200px] sm:min-w-[240px] md:min-w-[260px] min-h-[56px] text-base sm:text-lg py-4 sm:py-7 px-6 sm:px-8 rounded-2xl transform hover:scale-105 active:scale-95 transition-transform duration-300 touch-target"
              >
                <i className="fa-solid fa-lightbulb mr-2 text-lg sm:text-xl"></i>
                Comece seu projeto
              </Button>
            </ScrollToSection>
            
            <ScrollToSection sectionId="trabalhos">
              <Button
                variant="default"
                size="lg"
                className="btn-primary min-w-[200px] sm:min-w-[240px] md:min-w-[260px] min-h-[56px] text-base sm:text-lg py-4 sm:py-7 px-6 sm:px-8 rounded-2xl transform hover:scale-105 active:scale-95 transition-transform duration-300 touch-target"
              >
                <i className="fa-solid fa-images mr-2 text-lg sm:text-xl"></i>
                Ver trabalhos
              </Button>
            </ScrollToSection>
          </div>
        </AnimatedElement>
      </div>
    </section>
  );
};
