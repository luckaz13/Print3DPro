import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { AnimatedList } from "@/components/ui/animated-element";

export const SocialLinks = () => {
  const socialLinks = [
    {
      name: "Shopee",
      icon: "fa-solid fa-shopping-bag",
      url: "https://shopee.com.br/shop/637588572",
      tooltip: "Loja na Shopee",
      label: "Shopee",
      bgColor: "bg-orange-500",
      hoverBgColor: "hover:bg-orange-600",
      textColor: "text-white"
    },
    {
      name: "Mercado Livre",
      icon: "fa-solid fa-store",
      url: "https://lista.mercadolivre.com.br/_CustId_192984959?item_id=MLB5161827074&category_id=MLB22655&seller_id=192984959&client=recoview-selleritems&recos_listing=true#origin=vip&component=sellerData&typeSeller=classic",
      tooltip: "Loja no Mercado Livre",
      label: "ML",
      bgColor: "bg-yellow-400",
      hoverBgColor: "hover:bg-yellow-500",
      textColor: "text-black"
    },
    {
      name: "WhatsApp",
      icon: "fab fa-whatsapp",
      url: "https://api.whatsapp.com/send?phone=5554991886962",
      tooltip: "Fale conosco",
      label: "WhatsApp",
      bgColor: "bg-green-600",
      hoverBgColor: "hover:bg-green-700",
      textColor: "text-white"
    },
    {
      name: "Instagram",
      icon: "fab fa-instagram",
      url: "https://www.instagram.com/carossiparts/",
      tooltip: "Siga-nos no Instagram",
      label: "Instagram",
      bgColor: "bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500",
      hoverBgColor: "hover:from-purple-600 hover:via-pink-600 hover:to-orange-600",
      textColor: "text-white"
    }
  ];

  return (
    <AnimatedList
      animation="scale"
      staggerDelay={150}
      initialDelay={0}
      duration={500}
      className="flex gap-3 sm:gap-4"
    >
      {socialLinks.map((link) => (
        <div key={link.name} className="flex flex-col items-center">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className={`${link.bgColor} ${link.hoverBgColor} ${link.textColor} p-3 sm:p-4 w-12 h-12 sm:w-14 sm:h-14 rounded-full transition-all border-0 shadow-md mb-1 transform hover:scale-110 active:scale-95 hover:rotate-3 hover:shadow-lg min-w-[44px] min-h-[44px] flex items-center justify-center`}
                  asChild
                >
                  <a href={link.url} target="_blank" rel="noopener noreferrer" aria-label={link.name}>
                    <i className={link.icon + " text-base sm:text-lg"}></i>
                  </a>
                </Button>
              </TooltipTrigger>
              <TooltipContent
                side="bottom"
                className="animate-in zoom-in-50 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95"
              >
                <p>{link.tooltip}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <span className="text-white text-xs font-medium mt-1 opacity-80 group-hover:opacity-100 transition-opacity hidden sm:block">{link.label}</span>
        </div>
      ))}
    </AnimatedList>
  );
};
