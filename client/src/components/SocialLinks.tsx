import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export const SocialLinks = () => {
  const socialLinks = [
    {
      name: "Shopee",
      icon: "fa-solid fa-shopping-bag",
      url: "https://shopee.com.br",
      tooltip: "Loja na Shopee",
      bgColor: "bg-orange-500",
      hoverBgColor: "hover:bg-orange-600",
      textColor: "text-white"
    },
    {
      name: "Mercado Livre",
      icon: "fa-solid fa-store",
      url: "https://mercadolivre.com.br",
      tooltip: "Loja no Mercado Livre",
      bgColor: "bg-yellow-400",
      hoverBgColor: "hover:bg-yellow-500",
      textColor: "text-black"
    },
    {
      name: "WhatsApp",
      icon: "fab fa-whatsapp",
      url: "https://wa.me/5500000000000",
      tooltip: "Fale conosco",
      bgColor: "bg-green-600",
      hoverBgColor: "hover:bg-green-700",
      textColor: "text-white"
    },
    {
      name: "Localização",
      icon: "fa-solid fa-map-marker-alt",
      url: "https://maps.google.com",
      tooltip: "Nossa localização",
      bgColor: "bg-red-600",
      hoverBgColor: "hover:bg-red-700",
      textColor: "text-white"
    },
    {
      name: "Telefone",
      icon: "fa-solid fa-phone",
      url: "tel:+5500000000000",
      tooltip: "Ligar para nós",
      bgColor: "bg-blue-600",
      hoverBgColor: "hover:bg-blue-700",
      textColor: "text-white"
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
                className={`${link.bgColor} ${link.hoverBgColor} ${link.textColor} p-3 w-12 h-12 rounded-full transition-all border-0 shadow-md`}
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
