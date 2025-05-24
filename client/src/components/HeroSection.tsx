import { Button } from "@/components/ui/button";
import { ScrollToSection } from "./ScrollToSection";
import { SocialLinks } from "./SocialLinks";

export const HeroSection = () => {
  return (
    <section className="pt-20 relative h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080&q=80" 
          alt="3D printer in action" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-60"></div>
      </div>
      
      <div className="container mx-auto px-6 relative z-10 text-center">
        <h1 className="text-white font-montserrat font-bold text-4xl md:text-5xl lg:text-6xl mb-8 leading-tight">
          A fábrica das suas ideias começa aqui
        </h1>
        
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <ScrollToSection sectionId="orcamentos">
            <Button variant="default" size="lg" className="btn-primary">
              <i className="fa-solid fa-lightbulb mr-2"></i>
              Comece seu projeto
            </Button>
          </ScrollToSection>
          
          <ScrollToSection sectionId="trabalhos">
            <Button variant="outline" size="lg" className="rounded-full border-2 border-white text-white hover:bg-white hover:text-foreground">
              <i className="fa-solid fa-images mr-2"></i>
              Ver trabalhos
            </Button>
          </ScrollToSection>
        </div>
        
        <div className="absolute bottom-8 left-0 right-0 mx-auto flex justify-center space-x-6">
          <SocialLinks />
        </div>
      </div>
    </section>
  );
};
