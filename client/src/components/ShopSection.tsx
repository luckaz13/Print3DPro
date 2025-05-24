import { Button } from "@/components/ui/button";
import { AnimatedElement, AnimatedList } from "@/components/ui/animated-element";
import { TooltipCard } from "@/components/ui/enhanced-hover-card";
import { MapPin, ShoppingBag, Store } from "lucide-react";
import { getAssetPath } from "@/lib/utils";

export const ShopSection = () => {
  return (
    <section id="onde-comprar" className="py-20 bg-muted">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedElement animation="fade-in" duration={800}>
          <div className="text-center mb-16">
            <h2 className="section-heading">Onde comprar</h2>
            <p className="section-description">
              As fotos da galeria correspondem a projetos prontos que você encontra em nossas lojas virtuais.
            </p>
            <div className="section-divider"></div>
          </div>
        </AnimatedElement>
        
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <AnimatedElement animation="slide-up" duration={800} delay={200}>
              <div className="bg-background rounded-2xl shadow-lg p-8 text-center flex flex-col items-center hover:shadow-xl transition-shadow duration-300 group">
                <div className="h-24 mb-6 flex items-center justify-center">
                  <img
                    src="https://cdn.worldvectorlogo.com/logos/shopee-1.svg"
                    alt="Shopee Logo"
                    className="h-24 w-auto object-contain group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <h3 className="font-montserrat font-semibold text-xl mb-4">Shopee</h3>
                <p className="text-muted-foreground mb-6">
                  Encontre nossos produtos prontos para entrega com frete rápido e pagamento facilitado.
                </p>
                <TooltipCard tooltip="Produtos prontos para entrega" side="bottom">
                  <Button
                    className="bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-full mt-auto transform hover:scale-[1.02] active:scale-[0.98] transition-transform min-h-[48px] px-6 py-3 touch-target"
                    asChild
                  >
                    <a href="https://shopee.com.br/shop/637588572" target="_blank" rel="noopener noreferrer">
                      <ShoppingBag className="w-4 h-4 mr-2" />
                      Visitar loja
                    </a>
                  </Button>
                </TooltipCard>
              </div>
            </AnimatedElement>
            
            <AnimatedElement animation="slide-up" duration={800} delay={400}>
              <div className="bg-background rounded-2xl shadow-lg p-8 text-center flex flex-col items-center hover:shadow-xl transition-shadow duration-300 group">
                <div className="h-24 mb-6 flex items-center justify-center bg-white rounded-lg p-2">
                  <img
                    src={getAssetPath("/mercado.png")}
                    alt="Mercado Livre Logo"
                    className="h-24 w-auto object-contain group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <h3 className="font-montserrat font-semibold text-xl mb-4">Mercado Livre</h3>
                <p className="text-muted-foreground mb-6">
                  Compre com a segurança do Mercado Livre e aproveite o Mercado Pago e entregas rápidas.
                </p>
                <TooltipCard tooltip="Compre com segurança e garantia" side="bottom">
                  <Button
                    className="bg-yellow-500 hover:bg-yellow-600 text-foreground font-medium rounded-full mt-auto transform hover:scale-[1.02] active:scale-[0.98] transition-transform min-h-[48px] px-6 py-3 touch-target"
                    asChild
                  >
                    <a href="https://lista.mercadolivre.com.br/_CustId_192984959?item_id=MLB5161827074&category_id=MLB22655&seller_id=192984959&client=recoview-selleritems&recos_listing=true#origin=vip&component=sellerData&typeSeller=classic" target="_blank" rel="noopener noreferrer">
                      <Store className="w-4 h-4 mr-2" />
                      Visitar loja
                    </a>
                  </Button>
                </TooltipCard>
              </div>
            </AnimatedElement>
          </div>
          
          <AnimatedElement animation="fade-in" duration={800} delay={600}>
            <div className="mt-12 bg-background rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300">
              <div className="flex flex-col md:flex-row items-center">
                <div className="md:w-2/3 mb-6 md:mb-0 md:pr-6">
                  <h3 className="font-montserrat font-semibold text-xl mb-4">Para projetos personalizados</h3>
                  <p className="text-muted-foreground">
                    Para projetos novos, personalizados e sob demanda, fale conosco diretamente no WhatsApp. Nossos profissionais estão prontos para transformar sua ideia em realidade.
                  </p>
                </div>
                <div className="md:w-1/3 flex justify-center">
                  <TooltipCard tooltip="Atendimento personalizado" side="top">
                    <Button
                      className="bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transform hover:scale-[1.02] active:scale-[0.98] transition-transform min-h-[48px] px-6 py-3 touch-target"
                      asChild
                    >
                      <a href="https://api.whatsapp.com/send?phone=5554991886962" target="_blank" rel="noopener noreferrer">
                        <i className="fab fa-whatsapp text-xl mr-2"></i>
                        <span>Fale conosco</span>
                      </a>
                    </Button>
                  </TooltipCard>
                </div>
              </div>
            </div>
          </AnimatedElement>
        </div>
        
        {/* Seção de Localização */}
        <AnimatedElement animation="fade-in" duration={800} delay={800}>
          <div className="mt-16">
            <div className="text-center mb-12">
              <h2 className="section-heading">Localização</h2>
              <p className="section-description">
                Temos opção para retirada no local
              </p>
              <div className="section-divider"></div>
            </div>
            
            <div className="max-w-4xl mx-auto bg-foreground text-white rounded-2xl shadow-lg p-6 overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <div className="aspect-w-16 aspect-h-9 w-full">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d732.6025557686615!2d-51.5220583361642!3d-29.139181290831306!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x951c3b36244350bb%3A0x26ac9631cf19e0ef!2sR.%20%C3%82ngelo%20Marcon%2C%201087%20-%20S%C3%A3o%20Roque%2C%20Bento%20Gon%C3%A7alves%20-%20RS%2C%2095708-448!5e0!3m2!1spt-BR!2sbr!4v1748078472551!5m2!1spt-BR!2sbr"
                  width="100%"
                  height="450"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Localização da loja"
                  className="rounded-lg"
                ></iframe>
              </div>
              <div className="mt-4 text-center flex flex-col sm:flex-row items-center justify-center gap-2 px-4">
                <MapPin className="w-5 h-5 text-primary flex-shrink-0" />
                <p className="font-medium text-sm sm:text-base text-center">R. Ângelo Marcon, 1087 - São Roque, Bento Gonçalves - RS, 95708-448</p>
              </div>
            </div>
          </div>
        </AnimatedElement>
      </div>
    </section>
  );
};
