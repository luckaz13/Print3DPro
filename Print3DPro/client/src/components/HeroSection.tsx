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
          <div className="flex justify-center -mb-8">
            <img
              src={getAssetPath("/herologo2.png")}
              alt="CarossiParts - Impressões 3D - Logo da empresa especializada em impressão 3D e fabricação de peças personalizadas"
              className="w-auto h-auto max-w-full max-h-[300px] sm:max-h-[375px] md:max-h-[450px] lg:max-h-[525px] xl:max-h-[600px] object-contain transition-transform duration-300 hover:scale-105"
              style={{
                filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3)) drop-shadow(0 0 16px rgba(255,255,255,0.2))',
                minHeight: '180px'
              }}
            />
          </div>
        </AnimatedElement>
        
        <AnimatedElement
          animation="fade-in"
          duration={1000}
          delay={500}
          animateOnMount={isVisible}
        >
          <h3
            className="text-white font-montserrat font-bold mb-12 leading-tight tracking-wide max-w-2xl mx-auto"
            style={{
              fontSize: 'clamp(1rem, 2.5vw, 1.5rem)',
              lineHeight: 'clamp(1.1rem, 2.2vw, 1.6rem)',
              letterSpacing: 'clamp(0.01em, 0.005vw, 0.02em)',
              textShadow: '0 2px 4px rgba(0,0,0,0.8), 0 0 8px rgba(0,0,0,0.3)',
              marginTop: '-3.5rem'
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
          <div className="flex flex-col sm:flex-row flex-wrap justify-center items-center gap-4 sm:gap-6" style={{ marginTop: 'clamp(2rem, 4vw, 3rem)' }}>
            <div className="flex justify-center">
              <ScrollToSection sectionId="para-projetos-personalizados">
                <Button
                  variant="default"
                  size="lg"
                  className="btn-primary min-w-[200px] sm:min-w-[240px] md:min-w-[260px] min-h-[56px] text-base sm:text-lg py-4 sm:py-7 px-6 sm:px-8 rounded-2xl transform hover:scale-105 active:scale-95 transition-transform duration-300 touch-target"
                >
                  <i className="fa-solid fa-lightbulb mr-2 text-lg sm:text-xl"></i>
                  Comece seu projeto
                </Button>
              </ScrollToSection>
            </div>
            
            <div className="flex justify-center">
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
          </div>
        </AnimatedElement>
      </div>
    </section>
  );
};
