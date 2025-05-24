import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export const SocialLinks = () => {
  const socialLinks = [
    {
      name: "Shopee",
      icon: "fa-solid fa-shopping-bag",
      url: "https://shopee.com.br",
      tooltip: "Loja na Shopee"
    },
    {
      name: "Mercado Livre",
      icon: "fa-solid fa-store",
      url: "https://mercadolivre.com.br",
      tooltip: "Loja no Mercado Livre"
    },
    {
      name: "WhatsApp",
      icon: "fab fa-whatsapp",
      url: "https://wa.me/5500000000000",
      tooltip: "Fale conosco"
    },
    {
      name: "Localização",
      icon: "fa-solid fa-map-marker-alt",
      url: "https://maps.google.com",
      tooltip: "Nossa localização"
    },
    {
      name: "Telefone",
      icon: "fa-solid fa-phone",
      url: "tel:+5500000000000",
      tooltip: "Ligar para nós"
    }
  ];

  return (
    <>
      {socialLinks.map((link) => (
        <TooltipProvider key={link.name}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="outline" 
                size="icon" 
                className="bg-white p-3 w-12 h-12 rounded-full text-foreground hover:bg-primary hover:text-white transition-all border-0 shadow-md"
                asChild
              >
                <a href={link.url} target="_blank" rel="noopener noreferrer" aria-label={link.name}>
                  <i className={link.icon + " text-lg"}></i>
                </a>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{link.tooltip}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ))}
    </>
  );
};
