import { AnimatedElement, AnimatedList } from "@/components/ui/animated-element";
import { TooltipCard } from "@/components/ui/enhanced-hover-card";
import { Button } from "@/components/ui/button";
import { Info, MessageCircle, Instagram, Mail } from "lucide-react";
import { getAssetPath } from "@/lib/utils";
import { BudgetForm } from "@/components/BudgetForm";

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
                    { num: 1, text: "Entre em contato conosco pelo WhatsApp, Instagram, E-mail ou preencha o formulário abaixo" },
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
            
            {/* Botões de Contato */}
            <AnimatedElement animation="slide-left" duration={800} delay={600}>
              <div className="bg-gray-800 p-6 rounded-lg hover:bg-gray-750 transition-colors duration-300">
                <h3 className="font-montserrat font-semibold text-xl mb-6 text-center">
                  Entre em contato conosco
                </h3>
                <div className="flex flex-col gap-3">
                  <Button
                    className="bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg py-3 px-6 transition-all duration-200 hover:scale-105 active:scale-95 w-full"
                    asChild
                  >
                    <a
                      href="https://api.whatsapp.com/send?phone=5554991886962"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center"
                    >
                      <MessageCircle className="w-5 h-5 mr-2" />
                      Solicitar orçamento via WhatsApp
                    </a>
                  </Button>
                  
                  <Button
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium rounded-lg py-3 px-6 transition-all duration-200 hover:scale-105 active:scale-95 w-full"
                    asChild
                  >
                    <a
                      href="https://www.instagram.com/carossiparts/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center"
                    >
                      <Instagram className="w-5 h-5 mr-2" />
                      Contato via Instagram
                    </a>
                  </Button>
                  
                  <Button
                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg py-3 px-6 transition-all duration-200 hover:scale-105 active:scale-95 w-full"
                    asChild
                  >
                    <a
                      href="mailto:luizgeronimo00@hotmail.com"
                      className="flex items-center justify-center"
                    >
                      <Mail className="w-5 h-5 mr-2" />
                      Solicitar orçamento via e-mail
                    </a>
                  </Button>
                </div>
              </div>
            </AnimatedElement>
            
          </div>
        </div>
        
        {/* Formulário de Orçamento Online */}
        <div className="mt-20">
          <AnimatedElement animation="fade-in" duration={800} delay={800}>
            <div className="text-center mb-12">
              <h3 className="text-3xl font-bold text-white mb-4">
                Formulário Online de Orçamento
              </h3>
              <p className="text-lg text-gray-300 max-w-2xl mx-auto">
                Preencha o formulário abaixo para receber uma proposta personalizada diretamente em seu email
              </p>
            </div>
          </AnimatedElement>
          
          <BudgetForm />
        </div>
      </div>
    </section>
  );
};
