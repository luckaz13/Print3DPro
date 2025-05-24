import { CarossiLogo } from "@/assets/carossi-logo";
import { ScrollToSection } from "./ScrollToSection";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { AnimatedElement } from "@/components/ui/animated-element";

export const Footer = () => {
  // O hook useToast não é mais necessário, mas mantemos a importação
  // para evitar erros de compilação caso seja usado em outro lugar
  const { toast } = useToast();
  return (
    <footer className="bg-white text-foreground pt-16 pb-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          <div>
            <div className="w-48 sm:w-56 md:w-64 mb-6">
              <CarossiLogo />
            </div>
            <p className="text-gray-600 mb-6">
              Transformamos ideias em realidade com a mais alta tecnologia de impressão 3D.
            </p>
            <div className="flex gap-4">
              <a href="https://api.whatsapp.com/send?phone=5554991886962" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-primary p-2 touch-target min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors">
                <i className="fab fa-whatsapp text-xl"></i>
              </a>
              <a href="https://www.instagram.com/carossiparts/" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-primary p-2 touch-target min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors">
                <i className="fab fa-instagram text-xl"></i>
              </a>
              <a href="https://shopee.com.br/shop/637588572" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-primary p-2 touch-target min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors">
                <i className="fa-solid fa-shopping-bag text-xl"></i>
              </a>
              <a href="https://lista.mercadolivre.com.br/_CustId_192984959?item_id=MLB5161827074&category_id=MLB22655&seller_id=192984959&client=recoview-selleritems&recos_listing=true#origin=vip&component=sellerData&typeSeller=classic" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-primary p-2 touch-target min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors">
                <i className="fa-solid fa-store text-xl"></i>
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-montserrat font-semibold text-xl mb-6">Links Rápidos</h3>
            <ul className="space-y-3">
              <li>
                <ScrollToSection sectionId="quem-somos">
                  <span className="text-gray-600 hover:text-primary flex items-center cursor-pointer py-2 touch-target min-h-[44px]">
                    <i className="fas fa-chevron-right mr-2 text-xs"></i>
                    Quem somos
                  </span>
                </ScrollToSection>
              </li>
              <li>
                <ScrollToSection sectionId="trabalhos">
                  <span className="text-gray-600 hover:text-primary flex items-center cursor-pointer py-2 touch-target min-h-[44px]">
                    <i className="fas fa-chevron-right mr-2 text-xs"></i>
                    Trabalhos
                  </span>
                </ScrollToSection>
              </li>
              <li>
                <ScrollToSection sectionId="orcamentos">
                  <span className="text-gray-600 hover:text-primary flex items-center cursor-pointer py-2 touch-target min-h-[44px]">
                    <i className="fas fa-chevron-right mr-2 text-xs"></i>
                    Orçamentos
                  </span>
                </ScrollToSection>
              </li>
              <li>
                <ScrollToSection sectionId="onde-comprar">
                  <span className="text-gray-600 hover:text-primary flex items-center cursor-pointer py-2 touch-target min-h-[44px]">
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
              <li className="flex items-start py-2">
                <i className="fas fa-map-marker-alt mt-1 mr-3 text-primary flex-shrink-0"></i>
                <span className="text-gray-600 text-sm sm:text-base">Rua Ângelo Marcon, 1087, Bairro São Roque, Bento Gonçalves - RS</span>
              </li>
              <li className="flex items-center py-2">
                <i className="fas fa-phone mr-3 text-primary flex-shrink-0"></i>
                <a href="tel:+5554991886962" className="text-gray-600 hover:text-primary touch-target min-h-[44px] flex items-center">+55 54 9188-6962</a>
              </li>
              <li className="flex items-center py-2">
                <i className="fas fa-envelope mr-3 text-primary flex-shrink-0"></i>
                <a href="mailto:luizgeronimo00@hotmail.com" className="text-gray-600 hover:text-primary touch-target min-h-[44px] flex items-center text-sm sm:text-base break-all">luizgeronimo00@hotmail.com</a>
              </li>
              <li className="flex items-center py-2">
                <i className="fab fa-whatsapp mr-3 text-primary flex-shrink-0"></i>
                <a href="https://api.whatsapp.com/send?phone=5554991886962" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-primary touch-target min-h-[44px] flex items-center">+55 54 9188-6962</a>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Seção de notificações removida */}
        
        <div className="border-t border-gray-200 pt-8 text-center">
          <p className="text-gray-500">
            &copy; {new Date().getFullYear()} Carossi Parts - Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};
