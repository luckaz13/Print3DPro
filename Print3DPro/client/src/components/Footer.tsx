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
            <div className="w-72 sm:w-84 md:w-96 mb-6">
              <CarossiLogo />
            </div>
            <p className="text-gray-600 mb-6 text-center md:text-left">
              Transformamos ideias em realidade com a mais alta tecnologia de impressão 3D.
            </p>
            <div className="flex gap-4 justify-center md:justify-start">
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
            <ul className="space-y-3">
              <li>
                <ScrollToSection sectionId="quem-somos">
                  <span className="text-gray-600 hover:text-primary cursor-pointer py-2 touch-target min-h-[44px] block">
                    Quem somos
                  </span>
                </ScrollToSection>
              </li>
              <li>
                <ScrollToSection sectionId="trabalhos">
                  <span className="text-gray-600 hover:text-primary cursor-pointer py-2 touch-target min-h-[44px] block">
                    Trabalhos
                  </span>
                </ScrollToSection>
              </li>
              <li>
                <ScrollToSection sectionId="orcamentos">
                  <span className="text-gray-600 hover:text-primary cursor-pointer py-2 touch-target min-h-[44px] block">
                    Orçamentos
                  </span>
                </ScrollToSection>
              </li>
              <li>
                <ScrollToSection sectionId="onde-comprar">
                  <span className="text-gray-600 hover:text-primary cursor-pointer py-2 touch-target min-h-[44px] block">
                    Onde comprar
                  </span>
                </ScrollToSection>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-montserrat font-semibold text-xl mb-6 text-center md:text-left">Navegação</h3>
            <nav aria-label="Links de navegação do rodapé" role="navigation">
              <ul className="space-y-3" role="list">
                <li role="listitem">
                  <ScrollToSection sectionId="quem-somos">
                    <span className="text-gray-600 hover:text-primary cursor-pointer py-2 touch-target min-h-[44px] block"
                          role="button"
                          tabIndex={0}
                          aria-label="Navegar para seção Quem somos">
                      Quem somos
                    </span>
                  </ScrollToSection>
                </li>
                <li role="listitem">
                  <ScrollToSection sectionId="trabalhos">
                    <span className="text-gray-600 hover:text-primary cursor-pointer py-2 touch-target min-h-[44px] block"
                          role="button"
                          tabIndex={0}
                          aria-label="Navegar para seção Trabalhos">
                      Trabalhos
                    </span>
                  </ScrollToSection>
                </li>
                <li role="listitem">
                  <ScrollToSection sectionId="orcamentos">
                    <span className="text-gray-600 hover:text-primary cursor-pointer py-2 touch-target min-h-[44px] block"
                          role="button"
                          tabIndex={0}
                          aria-label="Navegar para seção Orçamentos">
                      Orçamentos
                    </span>
                  </ScrollToSection>
                </li>
                <li role="listitem">
                  <ScrollToSection sectionId="onde-comprar">
                    <span className="text-gray-600 hover:text-primary cursor-pointer py-2 touch-target min-h-[44px] block"
                          role="button"
                          tabIndex={0}
                          aria-label="Navegar para seção Onde comprar">
                      Onde comprar
                    </span>
                  </ScrollToSection>
                </li>
              </ul>
            </nav>
          </div>
          
          <div className="w-full flex flex-col items-center">
            <h3 className="font-montserrat font-semibold text-xl mb-6 text-center">Contato</h3>
            <address role="group" aria-label="Informações de contato" className="text-center">
              <ul className="space-y-4" role="list">
                <li className="flex flex-col items-center py-2" role="listitem">
                  <div className="flex items-center">
                    <i className="fas fa-map-marker-alt text-primary mr-2" aria-hidden="true"></i>
                    <span className="text-gray-600" role="text" aria-label="Endereço: Rua Ângelo Marcon, Bairro São Roque, Bento Gonçalves - RS">
                      Rua Ângelo Marcon, Bairro São Roque, Bento Gonçalves - RS
                    </span>
                  </div>
                </li>
                <li className="flex flex-col items-center py-2" role="listitem">
                  <div className="flex items-center">
                    <i className="fas fa-envelope text-primary mr-2" aria-hidden="true"></i>
                    <a href="mailto:carossiparts@gmail.com"
                       className="text-gray-600 hover:text-primary"
                       role="link"
                       aria-label="Enviar email para carossiparts@gmail.com">
                      carossiparts@gmail.com
                    </a>
                  </div>
                </li>
                <li className="flex flex-col items-center py-2" role="listitem">
                  <div className="flex items-center">
                    <i className="fab fa-whatsapp text-primary mr-2" aria-hidden="true"></i>
                    <a href="https://api.whatsapp.com/send?phone=5554991886962"
                       target="_blank"
                       rel="noopener noreferrer"
                       className="text-gray-600 hover:text-primary"
                       role="link"
                       aria-label="Entrar em contato via WhatsApp no número +55 54 9188-6962">
                      +55 54 9188-6962
                    </a>
                  </div>
                </li>
              </ul>
            </address>
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
