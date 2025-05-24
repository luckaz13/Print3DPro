import { Button } from "@/components/ui/button";
import { AnimatedElement, AnimatedList } from "@/components/ui/animated-element";
import { TooltipCard } from "@/components/ui/enhanced-hover-card";
import { Info } from "lucide-react";
import { getAssetPath } from "@/lib/utils";

export const QuoteSection = () => {
  return (
    <section id="orcamentos" className="py-20 bg-foreground text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedElement animation="fade-in" duration={800}>
          <div className="text-center mb-16">
            <h2 className="section-heading text-white">Orçamentos</h2>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Os orçamentos são exclusivos para projetos personalizados. Fale conosco para desenvolvermos a sua ideia sob medida.
            </p>
            <div className="section-divider"></div>
          </div>
        </AnimatedElement>
        
        <div className="flex flex-col md:flex-row items-center justify-center gap-10 max-w-4xl mx-auto">
          <AnimatedElement animation="slide-right" duration={800} delay={200} className="md:w-1/2">
            <img
              src={getAssetPath("/carossi1.png")}
              alt="Design 3D sendo modelado"
              className="rounded-lg shadow-xl w-full h-auto hover:shadow-2xl transition-shadow duration-300"
            />
          </AnimatedElement>
          
          <div className="md:w-1/2 space-y-8">
            <AnimatedElement animation="slide-left" duration={800} delay={400}>
              <div className="bg-gray-800 p-6 rounded-lg hover:bg-gray-750 transition-colors duration-300">
                <h3 className="font-montserrat font-semibold text-xl mb-4 flex items-center">
                  Como funciona
                  <TooltipCard 
                    tooltip="Processo simplificado para solicitar seu orçamento"
                    side="right"
                  >
                    <Info className="ml-2 h-4 w-4 text-primary/70 hover:text-primary transition-colors" />
                  </TooltipCard>
                </h3>
                <AnimatedList 
                  animation="slide-up" 
                  staggerDelay={150}
                  initialDelay={600}
                  duration={500}
                  className="space-y-4"
                >
                  {[
                    { num: 1, text: "Entre em contato conosco pelo WhatsApp ou Instagram" },
                    { num: 2, text: "Descreva seu projeto ou envie referências visuais" },
                    { num: 3, text: "Receba uma proposta com valores e prazos" },
                    { num: 4, text: "Acompanhe o desenvolvimento do seu projeto" }
                  ].map((item) => (
                    <li key={item.num} className="flex items-start group">
                      <span className="flex-shrink-0 bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 group-hover:scale-110 transition-transform duration-300">
                        {item.num}
                      </span>
                      <span className="group-hover:text-primary-foreground transition-colors duration-300">
                        {item.text}
                      </span>
                    </li>
                  ))}
                </AnimatedList>
              </div>
            </AnimatedElement>
            
            <AnimatedElement animation="fade-in" duration={800} delay={800}>
              <div className="flex flex-col gap-4">
                <TooltipCard tooltip="Resposta rápida em até 2 horas" side="right">
                  <Button
                    className="bg-green-600 hover:bg-green-700 text-white font-medium py-4 px-6 rounded-lg flex items-center justify-center min-h-[56px] w-full touch-target transform hover:scale-[1.02] active:scale-[0.98] transition-transform"
                    asChild
                  >
                    <a href="https://api.whatsapp.com/send?phone=5554991886962" target="_blank" rel="noopener noreferrer">
                      <i className="fab fa-whatsapp text-xl sm:text-2xl mr-2 sm:mr-3"></i>
                      <span className="text-sm sm:text-base">Solicitar orçamento via WhatsApp</span>
                    </a>
                  </Button>
                </TooltipCard>
                
                <TooltipCard tooltip="Veja nosso portfólio completo" side="right">
                  <Button
                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-medium py-4 px-6 rounded-lg flex items-center justify-center min-h-[56px] w-full touch-target transform hover:scale-[1.02] active:scale-[0.98] transition-transform"
                    asChild
                  >
                    <a href="https://www.instagram.com/carossiparts/" target="_blank" rel="noopener noreferrer">
                      <i className="fab fa-instagram text-xl sm:text-2xl mr-2 sm:mr-3"></i>
                      <span className="text-sm sm:text-base">Contato via Instagram</span>
                    </a>
                  </Button>
                </TooltipCard>
                
                <TooltipCard tooltip="Envie detalhes do seu projeto" side="right">
                  <Button
                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-4 px-6 rounded-lg flex items-center justify-center min-h-[56px] w-full touch-target transform hover:scale-[1.02] active:scale-[0.98] transition-transform"
                    asChild
                  >
                    <a href="mailto:luizgeronimo00@hotmail.com">
                      <i className="fas fa-envelope text-xl sm:text-2xl mr-2 sm:mr-3"></i>
                      <span className="text-sm sm:text-base">Solicitar orçamento via E-mail</span>
                    </a>
                  </Button>
                </TooltipCard>
              </div>
            </AnimatedElement>
          </div>
        </div>
      </div>
    </section>
  );
};
