import React, { useState, useMemo } from "react"; // useState will be further reduced
import portfolioItemsData from "@/data/portfolioItems.json";
import { Button } from "@/components/ui/button";
import { GalleryModal } from "./GalleryModal";
import { LazyImage } from "@/components/ui/lazy-image";
// import { CardGridSkeleton } from "@/components/ui/skeleton-loading"; // Parece não estar mais em uso direto aqui
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { getAssetPath } from "@/lib/utils";
import { useDeviceInfo, usePrefersReducedMotion } from "@/hooks/use-mobile";
import { useSmartCallback, useSmartMemo, usePerformanceOptimizations } from "@/hooks/use-performance";
import { Landmark, AccessibleButton, FocusIndicator } from "@/components/ui/accessibility-helpers";
import { Maximize2 } from "lucide-react";

type PortfolioCategory = "Todos" | "Peças Técnicas" | "Decorativos" | "Acessórios";

interface PortfolioItem {
  id: string;
  image: string;
  title: string;
  description: string;
  category: Exclude<PortfolioCategory, "Todos">;
  galleryImages?: string[];
}

// Atribuir os dados importados à constante portfolioItems com a tipagem correta
const portfolioItems: PortfolioItem[] = portfolioItemsData as PortfolioItem[];

export const PortfolioSection = () => {
  const [modalItem, setModalItem] = useState<PortfolioItem | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});

  // Removed: activeCategory, setActiveCategory, isLoading, setIsLoading
  // Removed: handleCategoryClick

  const { hasTouch } = useDeviceInfo(); // Removed isMobile as it's no longer used
  const prefersReducedMotion = usePrefersReducedMotion(); // This might become unused if CardGridSkeleton is fully removed
  const { reduceAnimations, imageQuality } = usePerformanceOptimizations();

  // Callback otimizado para abrir modal
  const handleItemClick = React.useCallback((item: PortfolioItem) => {
    setModalItem(item);
    setModalOpen(true);
  }, []);
  
  // Callback otimizado para expandir descrição
  const toggleDescription = React.useCallback((event: React.MouseEvent, itemId: string) => {
    event.stopPropagation();
    setExpandedItems(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  }, []);

  // Callback otimizado para fechar modal
  const handleCloseModal = React.useCallback(() => {
    setModalOpen(false);
  }, []);

  // Itens do portfólio são agora diretamente portfolioItems, pois não há filtro.
  // const filteredItems = portfolioItems; // Simplified, useSmartMemo might be overkill if portfolioItems is static

  const cornetasItem = useMemo(() => portfolioItems.find(item => item.id === "7"), []); // Alterado para buscar por ID para maior robustez
  const otherItems = useMemo(() => portfolioItems.filter(item => item.id !== "7" && item.title !== "Cornetas aplicadas"), []); // Ajustado para usar ID

  // Removed: categoriesWithCount

  return (
    <Landmark role="main">
      <section id="trabalhos" className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12"> {/* Reduced mb from 16 to 12 */}
            <h2 className="section-heading">Trabalhos</h2>
            <p className="section-description">
              Conheça alguns dos nossos projetos realizados, desde peças técnicas até objetos decorativos e acessórios personalizados.
            </p>
            <div className="section-divider"></div>
          </div>

          {/* Item "Cornetas" em destaque */}
          {cornetasItem && (
            // <FocusIndicator key={cornetasItem.id} variant="card" className="mb-12"> // FocusIndicator removido para este item específico
              <div
                key={cornetasItem.id} // Adicionado key diretamente ao div
                className={`gallery-item transition-transform rounded-lg mb-12 ${ // Adicionado mb-12 aqui
                  reduceAnimations ? 'duration-0' : 'duration-300 hover:scale-105'
                } bg-primary/10 shadow-xl overflow-hidden`} // Removido border-2 border-primary
                role="article" // Changed role to article for semantic meaning
                // tabIndex={0} // Removido, pois o foco será gerenciado pelos elementos internos clicáveis
                aria-label={`Ver detalhes de ${cornetasItem.title}`}
                // onKeyDown removido, pois o div principal não é mais o alvo primário de interação para abrir modal
              >
                <div className="md:flex"> {/* Flex layout for larger screens */}
                  <div className="md:w-7/12 relative"> {/* Image container - Largura aumentada e Adicionado relative para botões do carrossel */}
                    <Carousel
                      opts={{
                        align: "start",
                        loop: true,
                      }}
                      className="w-full" // Removido h-full
                    >
                      <CarouselContent>
                        <CarouselItem className="relative group">
                          <LazyImage
                            src={getAssetPath(cornetasItem.image)}
                            alt={`${cornetasItem.title} - Imagem principal`}
                            // aspectRatio="landscape" // Removido
                            priority
                            quality={imageQuality as 'low' | 'medium' | 'high'}
                            className="w-full object-cover" // Removido h-64 md:h-full
                          />
                           <Button
                            variant="ghost"
                            size="icon"
                            className="absolute top-2 right-2 z-20 bg-background/50 hover:bg-background/80 text-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={(e) => {
                              e.stopPropagation(); // Impede que o clique no botão propague para outros elementos
                              handleItemClick(cornetasItem);
                            }}
                            aria-label="Expandir imagem"
                          >
                            <Maximize2 className="h-5 w-5" />
                          </Button>
                        </CarouselItem>
                        {cornetasItem.galleryImages?.map((imgSrc, idx) => (
                          <CarouselItem key={idx} className="relative group">
                            <LazyImage
                              src={getAssetPath(imgSrc)}
                              alt={`${cornetasItem.title} - Imagem ${idx + 2}`}
                              // aspectRatio="landscape" // Removido
                              quality={imageQuality as 'low' | 'medium' | 'high'}
                              className="w-full object-cover" // Removido h-64 md:h-full
                            />
                            <Button
                              variant="ghost"
                              size="icon"
                              className="absolute top-2 right-2 z-20 bg-background/50 hover:bg-background/80 text-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleItemClick(cornetasItem);
                              }}
                              aria-label="Expandir imagem"
                            >
                              <Maximize2 className="h-5 w-5" />
                            </Button>
                          </CarouselItem>
                        ))}
                      </CarouselContent>
                      {(cornetasItem.galleryImages?.length ?? 0) > 0 && (
                        <>
                          <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-background/50 hover:bg-background/80 text-foreground" />
                          <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-background/50 hover:bg-background/80 text-foreground" />
                        </>
                      )}
                    </Carousel>
                  </div>
                  <div
                    className="md:w-5/12 p-6 md:p-8 flex flex-col justify-center bg-background cursor-pointer text-center" // Added cursor-pointer here and adjusted width, Added text-center
                    onClick={(e) => { // Added onClick here to open modal when text area is clicked
                      e.stopPropagation();
                      handleItemClick(cornetasItem);
                    }}
                    onKeyDown={(e) => { // Adicionado onKeyDown para acessibilidade na área de texto
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleItemClick(cornetasItem);
                      }
                    }}
                    tabIndex={0} // Adicionado tabIndex para tornar a área de texto focável
                  > {/* Text container */}
                    <h3
                      className="font-montserrat font-extrabold text-3xl sm:text-4xl text-primary mb-4" // Increased size and margin
                    >
                      {cornetasItem.title}
                    </h3>
                    <p
                      className={`text-base text-muted-foreground md:text-justify ${ // Increased text size and added text-justify for md screens
                        !expandedItems[cornetasItem.id] ? 'line-clamp-5' : '' // Increased line-clamp
                      }`}
                      onClick={(e) => toggleDescription(e, cornetasItem.id)}
                      style={{ cursor: 'pointer' }}
                    >
                      {cornetasItem.description}
                    </p>
                    <AccessibleButton
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleDescription(e, cornetasItem.id);
                      }}
                      className="text-sm text-primary mt-3 hover:underline py-1 px-2 self-start" // Adjusted margin and self-start
                      variant="ghost"
                      size="sm"
                      aria-expanded={expandedItems[cornetasItem.id]}
                      aria-controls={`description-${cornetasItem.id}`}
                    >
                      {expandedItems[cornetasItem.id] ? 'Mostrar menos' : 'Mostrar mais'}
                    </AccessibleButton>
                  </div>
                </div>
              </div>
            // </FocusIndicator> // FocusIndicator removido para este item específico
          )}
          
          {/* Grid dos outros itens */}
          {otherItems.length > 0 && (
            <div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
              role="grid"
              aria-label={`Outros projetos (${otherItems.length} itens)`}
            >
              {otherItems.map((item, index) => (
                <FocusIndicator key={item.id} variant="card">
                  <div
                    className={`gallery-item transition-transform rounded-lg ${
                      reduceAnimations ? 'duration-0' : 'duration-300 hover:scale-105'
                    } cursor-pointer shadow-md overflow-hidden bg-background`} // Added overflow-hidden and bg-background
                    onClick={() => handleItemClick(item)}
                    role="gridcell"
                    tabIndex={0}
                    aria-label={`Ver detalhes de ${item.title}`}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleItemClick(item);
                      }
                    }}
                  >
                    <LazyImage
                      src={getAssetPath(item.image)}
                      alt={item.title}
                      // aspectRatio="landscape" // Removido
                      priority={index < 2} // Prioridade para os dois primeiros itens da grade
                      quality={imageQuality as 'low' | 'medium' | 'high'}
                      className="w-full object-cover rounded-t-lg" // Removido h-64
                    />
                    <div className="p-4 text-center"> {/* Removed conditional padding, Added text-center */}
                      <h3
                        className="font-montserrat font-semibold text-lg mb-2" // Standard style for other items
                      >
                        {item.title}
                      </h3>
                      <p
                        className="text-sm text-muted-foreground line-clamp-4" // Standard line-clamp
                      >
                        {item.description}
                      </p>
                      {/* Botão "Mostrar mais/menos" removido para itens não-Cornetas, conforme lógica anterior */}
                    </div>
                  </div>
                </FocusIndicator>
              ))}
            </div>
          )}
        </div>

        {/* Modal da galeria */}
        {modalOpen && modalItem && (
          <GalleryModal 
            item={modalItem} 
            isOpen={modalOpen} 
            onClose={handleCloseModal} 
          />
        )}
      </section>
    </Landmark>
  );
};
