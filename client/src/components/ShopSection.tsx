import { Button } from "@/components/ui/button";
import { AnimatedElement } from "@/components/ui/animated-element";
import { MapPin, MessageCircle } from "lucide-react";
import { getAssetPath } from "@/lib/utils";
import { useState } from "react";

export const ShopSection = () => {
  const [isCustomProjectsExpanded, setIsCustomProjectsExpanded] = useState(false);
  return (
    <section id="onde-comprar" className="py-20 bg-muted">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedElement animation="fade-in" duration={800}>
          <div className="text-center mb-16">
            <h2 className="section-heading">Onde comprar nossos produtos</h2>
            <p className="section-description">
              As fotos da galeria correspondem a projetos prontos que você encontra em nossas lojas virtuais.
            </p>
            <div className="section-divider"></div>
          </div>
        </AnimatedElement>
        
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Shopee */}
            {/* Removido AnimatedElement para garantir visibilidade e acessibilidade dos botões */}
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
              <Button
                className="bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg py-3 px-6 transition-all duration-200 hover:scale-105 active:scale-95"
                asChild
              >
                <a
                  href="https://shopee.com.br/carossiparts"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center"
                >
                  Visite a loja
                </a>
              </Button>
            </div>
            
            {/* Mercado Livre */}
            {/* Removido AnimatedElement para garantir visibilidade e acessibilidade dos botões */}
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
              <Button
                className="bg-yellow-500 hover:bg-yellow-600 text-white font-medium rounded-lg py-3 px-6 transition-all duration-200 hover:scale-105 active:scale-95"
                asChild
              >
                <a
                  href="https://lista.mercadolivre.com.br/_CustId_192984959?item_id=MLB5161827074&category_id=MLB22655&seller_id=192984959&client=recoview-selleritems&recos_listing=true#origin=vip&component=sellerData&typeSeller=classic"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center"
                >
                  Visite a loja
                </a>
              </Button>
            </div>
          </div>
          
          {/* Projetos Personalizados */}
          <AnimatedElement animation="fade-in" duration={800} delay={600}>
            <div className="mt-12 bg-background rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300">
              <div className="flex flex-col md:flex-row items-center">
                <div className="md:w-2/3 mb-6 md:mb-0 md:pr-6">
                  <h3 className="font-montserrat font-semibold text-xl mb-4">Para projetos personalizados</h3>
                  <p className={`text-muted-foreground ${isCustomProjectsExpanded ? '' : 'line-clamp-3'}`}>
                    Para projetos novos, personalizados e sob demanda, fale conosco diretamente no WhatsApp. Nossos profissionais estão prontos para transformar sua ideia em realidade. Oferecemos uma vasta gama de possibilidades, desde pequenas peças de reposição até protótipos complexos e itens de decoração exclusivos. Se você tem um arquivo 3D, podemos imprimi-lo. Se tem apenas uma ideia, nossa equipe de design pode ajudar a modelá-la.
                  </p>
                  <Button
                    variant="link"
                    className="text-primary hover:text-primary/80 px-0 mt-2"
                    onClick={() => setIsCustomProjectsExpanded(!isCustomProjectsExpanded)}
                  >
                    {isCustomProjectsExpanded ? "Mostrar menos" : "Mostrar mais"}
                  </Button>
                </div>
                <div className="md:w-1/3 flex justify-center">
                  <Button
                    className="bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg py-3 px-6 transition-all duration-200 hover:scale-105 active:scale-95"
                    asChild
                  >
                    <a 
                      href="https://api.whatsapp.com/send?phone=5554991886962" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center justify-center"
                    >
                      <MessageCircle className="w-5 h-5 mr-2" />
                      Fale Conosco
                    </a>
                  </Button>
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
