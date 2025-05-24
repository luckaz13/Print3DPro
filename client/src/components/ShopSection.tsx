import { Button } from "@/components/ui/button";

export const ShopSection = () => {
  return (
    <section id="onde-comprar" className="py-20 bg-muted">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="section-heading">Onde comprar</h2>
          <p className="section-description">
            As fotos da galeria correspondem a projetos prontos que você encontra em nossas lojas virtuais.
          </p>
          <div className="section-divider"></div>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-background rounded-xl shadow-lg p-8 text-center flex flex-col items-center">
              <img 
                src="https://i.imgur.com/aFsrtcI.png" 
                alt="Shopee Logo" 
                className="h-16 mb-6"
              />
              <h3 className="font-montserrat font-semibold text-xl mb-4">Shopee</h3>
              <p className="text-muted-foreground mb-6">
                Encontre nossos produtos prontos para entrega com frete rápido e pagamento facilitado.
              </p>
              <Button 
                className="bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-full mt-auto"
                asChild
              >
                <a href="https://shopee.com.br" target="_blank" rel="noopener noreferrer">
                  <i className="fa-solid fa-shopping-bag mr-2"></i>
                  Visitar loja
                </a>
              </Button>
            </div>
            
            <div className="bg-background rounded-xl shadow-lg p-8 text-center flex flex-col items-center">
              <img 
                src="https://i.imgur.com/lXdAaS9.png" 
                alt="Mercado Livre Logo" 
                className="h-16 mb-6"
              />
              <h3 className="font-montserrat font-semibold text-xl mb-4">Mercado Livre</h3>
              <p className="text-muted-foreground mb-6">
                Compre com a segurança do Mercado Livre e aproveite o Mercado Pago e entregas rápidas.
              </p>
              <Button 
                className="bg-yellow-500 hover:bg-yellow-600 text-foreground font-medium rounded-full mt-auto"
                asChild
              >
                <a href="https://mercadolivre.com.br" target="_blank" rel="noopener noreferrer">
                  <i className="fa-solid fa-store mr-2"></i>
                  Visitar loja
                </a>
              </Button>
            </div>
          </div>
          
          <div className="mt-12 bg-background rounded-xl shadow-lg p-8">
            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-2/3 mb-6 md:mb-0 md:pr-6">
                <h3 className="font-montserrat font-semibold text-xl mb-4">Para projetos personalizados</h3>
                <p className="text-muted-foreground">
                  Para projetos novos, personalizados e sob demanda, fale conosco diretamente no WhatsApp. Nossos profissionais estão prontos para transformar sua ideia em realidade.
                </p>
              </div>
              <div className="md:w-1/3 flex justify-center">
                <Button 
                  className="bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg"
                  asChild
                >
                  <a href="https://wa.me/5500000000000" target="_blank" rel="noopener noreferrer">
                    <i className="fab fa-whatsapp text-xl mr-2"></i>
                    <span>Fale conosco</span>
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
