import { Button } from "@/components/ui/button";

export const QuoteSection = () => {
  return (
    <section id="orcamentos" className="py-20 bg-foreground text-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="section-heading text-white">Orçamentos</h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Os orçamentos são exclusivos para projetos personalizados. Fale conosco para desenvolvermos a sua ideia sob medida.
          </p>
          <div className="section-divider"></div>
        </div>
        
        <div className="flex flex-col md:flex-row items-center justify-center gap-10 max-w-4xl mx-auto">
          <div className="md:w-1/2">
            <img 
              src="https://pixabay.com/get/gb267dbac8a5a16b33c96ed301573fe84e075da89af0b187c77452a4dbe60f7deb41daf10297741b08884678198d92063c47a0cc37ba82f73af345ff8cd0311f8_1280.jpg" 
              alt="Design 3D sendo modelado" 
              className="rounded-lg shadow-xl w-full h-auto"
            />
          </div>
          
          <div className="md:w-1/2 space-y-8">
            <div className="bg-gray-800 p-6 rounded-lg">
              <h3 className="font-montserrat font-semibold text-xl mb-4">Como funciona</h3>
              <ol className="space-y-4">
                <li className="flex items-start">
                  <span className="flex-shrink-0 bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center mr-3">1</span>
                  <span>Entre em contato conosco pelo WhatsApp ou Instagram</span>
                </li>
                <li className="flex items-start">
                  <span className="flex-shrink-0 bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center mr-3">2</span>
                  <span>Descreva seu projeto ou envie referências visuais</span>
                </li>
                <li className="flex items-start">
                  <span className="flex-shrink-0 bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center mr-3">3</span>
                  <span>Receba uma proposta com valores e prazos</span>
                </li>
                <li className="flex items-start">
                  <span className="flex-shrink-0 bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center mr-3">4</span>
                  <span>Acompanhe o desenvolvimento do seu projeto</span>
                </li>
              </ol>
            </div>
            
            <div className="flex flex-col gap-4">
              <Button 
                className="bg-green-600 hover:bg-green-700 text-white font-medium py-4 px-6 rounded-lg flex items-center justify-center h-auto"
                asChild
              >
                <a href="https://wa.me/5500000000000" target="_blank" rel="noopener noreferrer">
                  <i className="fab fa-whatsapp text-2xl mr-3"></i>
                  <span>Solicitar orçamento via WhatsApp</span>
                </a>
              </Button>
              
              <Button 
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-medium py-4 px-6 rounded-lg flex items-center justify-center h-auto"
                asChild
              >
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                  <i className="fab fa-instagram text-2xl mr-3"></i>
                  <span>Contato via Instagram</span>
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
