import { Button } from "@/components/ui/button";
import { ScrollToSection } from "./ScrollToSection";
import { SocialLinks } from "./SocialLinks";

export const HeroSection = () => {
  return (
    <section className="pt-20 relative h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1679678691006-0ad24fecb769?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080&q=80" 
          alt="3D printer in action" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-60"></div>
      </div>
      
      <div className="container mx-auto px-6 relative z-10 text-center">
        <h1 className="text-white font-montserrat font-bold text-4xl md:text-5xl lg:text-6xl mb-12 leading-tight">
          A fábrica das suas ideias<br />começa aqui
        </h1>
        
        <div className="flex justify-center mb-10">
          <div className="flex gap-4 justify-center">
            <SocialLinks />
          </div>
        </div>
        
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <ScrollToSection sectionId="orcamentos">
            <Button variant="default" size="lg" className="btn-primary min-w-[200px]">
              <i className="fa-solid fa-lightbulb mr-2"></i>
              Comece seu projeto
            </Button>
          </ScrollToSection>
          
          <ScrollToSection sectionId="trabalhos">
            <Button variant="outline" size="lg" className="rounded-full border-2 border-white bg-white/20 text-white hover:bg-white hover:text-foreground min-w-[200px]">
              <i className="fa-solid fa-images mr-2"></i>
              Ver trabalhos
            </Button>
          </ScrollToSection>
        </div>
      </div>
    </section>
  );
};
