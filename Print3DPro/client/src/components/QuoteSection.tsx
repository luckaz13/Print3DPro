import { AnimatedElement, AnimatedList } from "@/components/ui/animated-element";
import { LazyImage } from "@/components/ui/lazy-image";
import { TooltipCard } from "@/components/ui/enhanced-hover-card";
import { Button } from "@/components/ui/button";
import { Info, MessageCircle, Instagram, Mail } from "lucide-react";
import { getAssetPath } from "@/lib/utils";

export const QuoteSection = () => {
  return (
    <section id="orcamentos" className="py-12 sm:py-16 md:py-20 bg-card text-card-foreground">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedElement animation="fade-in" duration={800}>
          <div className="text-center mb-8 sm:mb-12 md:mb-16">
            <h2 className="section-heading text-card-foreground">Orçamentos</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-center">
              Os orçamentos são exclusivos para projetos personalizados. Fale conosco para desenvolvermos a sua ideia sob medida.
            </p>
            <div className="section-divider"></div>
          </div>
        </AnimatedElement>
        
        <div className="text-center">
          <div className="flex justify-center mb-8">
            <img
              src={getAssetPath("/carossi1.png")}
              alt="CarossiParts - Impressão 3D"
              className="max-w-full max-h-96 object-contain rounded-lg shadow-lg border"
              style={{ background: '#fff' }}
            />
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Para orçamentos de projetos personalizados, entre em contato conosco.
          </p>
          <div className="mt-8 flex justify-center">
            <Button
              asChild
              size="lg"
              className="text-lg px-8 py-4"
            >
              <a
                href="https://api.whatsapp.com/send?phone=5554991886962"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Entre em contato via WhatsApp"
              >
                Entre em Contato
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
