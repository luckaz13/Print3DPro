import { CarossiLogo } from "@/assets/carossi-logo";
import { ScrollToSection } from "./ScrollToSection";

export const Footer = () => {
  return (
    <footer className="bg-foreground text-white pt-16 pb-8">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          <div>
            <div className="w-48 mb-6">
              <CarossiLogo white />
            </div>
            <p className="text-gray-300 mb-6">
              Transformamos ideias em realidade com a mais alta tecnologia de impressão 3D.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-primary">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" className="text-gray-300 hover:text-primary">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="#" className="text-gray-300 hover:text-primary">
                <i className="fab fa-youtube"></i>
              </a>
              <a href="#" className="text-gray-300 hover:text-primary">
                <i className="fab fa-tiktok"></i>
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-montserrat font-semibold text-xl mb-6">Links Rápidos</h3>
            <ul className="space-y-3">
              <li>
                <ScrollToSection sectionId="quem-somos">
                  <span className="text-gray-300 hover:text-primary flex items-center cursor-pointer">
                    <i className="fas fa-chevron-right mr-2 text-xs"></i>
                    Quem somos
                  </span>
                </ScrollToSection>
              </li>
              <li>
                <ScrollToSection sectionId="trabalhos">
                  <span className="text-gray-300 hover:text-primary flex items-center cursor-pointer">
                    <i className="fas fa-chevron-right mr-2 text-xs"></i>
                    Trabalhos
                  </span>
                </ScrollToSection>
              </li>
              <li>
                <ScrollToSection sectionId="orcamentos">
                  <span className="text-gray-300 hover:text-primary flex items-center cursor-pointer">
                    <i className="fas fa-chevron-right mr-2 text-xs"></i>
                    Orçamentos
                  </span>
                </ScrollToSection>
              </li>
              <li>
                <ScrollToSection sectionId="onde-comprar">
                  <span className="text-gray-300 hover:text-primary flex items-center cursor-pointer">
                    <i className="fas fa-chevron-right mr-2 text-xs"></i>
                    Onde comprar
                  </span>
                </ScrollToSection>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-montserrat font-semibold text-xl mb-6">Contato</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <i className="fas fa-map-marker-alt mt-1 mr-3 text-primary"></i>
                <span>Av. Exemplo, 1234, Bairro - Cidade/UF</span>
              </li>
              <li className="flex items-center">
                <i className="fas fa-phone mr-3 text-primary"></i>
                <a href="tel:+5500000000000" className="hover:text-primary">(00) 00000-0000</a>
              </li>
              <li className="flex items-center">
                <i className="fas fa-envelope mr-3 text-primary"></i>
                <a href="mailto:contato@carossiparts.com.br" className="hover:text-primary">contato@carossiparts.com.br</a>
              </li>
              <li className="flex items-center">
                <i className="fab fa-whatsapp mr-3 text-primary"></i>
                <a href="https://wa.me/5500000000000" target="_blank" rel="noopener noreferrer" className="hover:text-primary">(00) 00000-0000</a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 pt-8 text-center">
          <p className="text-gray-400">
            &copy; {new Date().getFullYear()} Carossi Parts - Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};
