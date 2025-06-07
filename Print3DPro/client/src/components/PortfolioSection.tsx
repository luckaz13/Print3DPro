// Forçando atualização do HMR - 26/05/2025 18:24
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

  const { hasTouch } = useDeviceInfo();
  const prefersReducedMotion = usePrefersReducedMotion();
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

  const cornetasCarossiItem = useMemo(() => portfolioItems.find(item => item.id === "12"), []); // Item Corneta CarossiParts em destaque
  const otherItems = useMemo(() => portfolioItems.filter(item => item.id !== "12"), []); // Excluir o item em destaque

  // Removed: categoriesWithCount

  // Verificação de segurança para garantir que os dados estão carregados
  if (!portfolioItems || portfolioItems.length === 0) {
    return (
      <Landmark role="main">
        <section id="trabalhos" className="py-12 sm:py-16 md:py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8 sm:mb-10 md:mb-12">
              <h2 className="section-heading">Trabalhos</h2>
              <p className="section-description">
                Carregando nossos projetos...
              </p>
              <div className="section-divider"></div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-muted rounded-lg h-80 mb-4"></div>
                  <div className="bg-muted rounded h-4 mb-2"></div>
                  <div className="bg-muted rounded h-3"></div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </Landmark>
    )
  }

  return (
    <Landmark role="main">
      <section id="trabalhos" className="py-12 sm:py-16 md:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-10 md:mb-12">
            <h2 className="section-heading">Trabalhos</h2>
            <p className="section-description">
              Conheça alguns dos nossos projetos realizados, desde peças técnicas até objetos decorativos e acessórios personalizados.
            </p>
            <div className="section-divider"></div>
          </div>

          {/* Item "Corneta CarossiParts" em destaque */}
          {cornetasCarossiItem && (
            <div
              key={cornetasCarossiItem.id}
              className={`gallery-item transition-transform rounded-lg mb-8 sm:mb-10 md:mb-12 ${
                reduceAnimations ? 'duration-0' : 'duration-300 hover:scale-105'
              } bg-primary/10 shadow-xl overflow-hidden`}
              role="article"
              aria-label={`Ver detalhes de ${cornetasCarossiItem.title}`}
            >
              <div className="md:flex">
                <div className="md:w-7/12 relative">
                  <Carousel
                    opts={{
                      align: "start",
                      loop: true,
                    }}
                    className="w-full"
                  >
                    <CarouselContent>
                      <CarouselItem className="relative group">
                        <div className="relative w-full h-[38rem] md:h-[45rem] overflow-hidden">
                          <LazyImage
                            src={getAssetPath(cornetasCarossiItem.image)}
                            alt={`${cornetasCarossiItem.title} - Imagem principal`}
                            priority
                            quality={imageQuality as 'low' | 'medium' | 'high'}
                            className="absolute inset-0 w-full h-full object-cover object-center"
                          />
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute top-2 right-2 z-20 bg-background/50 hover:bg-background/80 text-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleItemClick(cornetasCarossiItem);
                          }}
                          aria-label="Expandir imagem"
                        >
                          <Maximize2 className="h-5 w-5" />
                        </Button>
                      </CarouselItem>
                      {cornetasCarossiItem.galleryImages?.map((mediaSrc, idx) => (
                        <CarouselItem key={idx} className="relative group">
                          {mediaSrc.includes('.mp4') ? (
                            <video
                              src={getAssetPath(mediaSrc)}
                              className="w-full h-[38rem] md:h-[45rem] object-contain bg-black"
                              controls
                              muted
                              playsInline
                              preload="metadata"
                            />
                          ) : (
                            <div className="relative w-full h-[38rem] md:h-[45rem] overflow-hidden">
                              <LazyImage
                                src={getAssetPath(mediaSrc)}
                                alt={`${cornetasCarossiItem.title} - Imagem ${idx + 2}`}
                                quality={imageQuality as 'low' | 'medium' | 'high'}
                                className="absolute inset-0 w-full h-full object-cover object-center"
                              />
                            </div>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="absolute top-2 right-2 z-20 bg-background/50 hover:bg-background/80 text-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleItemClick(cornetasCarossiItem);
                            }}
                            aria-label="Expandir mídia"
                          >
                            <Maximize2 className="h-5 w-5" />
                          </Button>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    {/* Botões do carrossel sempre visíveis quando há múltiplas imagens */}
                    {((cornetasCarossiItem.galleryImages?.length ?? 0) > 0 || true) && (
                      <>
                        <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-background/50 hover:bg-background/80 text-foreground" />
                        <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-background/50 hover:bg-background/80 text-foreground" />
                      </>
                    )}
                  </Carousel>
                </div>
                <div
                  className="md:w-5/12 p-6 md:p-8 flex flex-col justify-center bg-background cursor-pointer text-center"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleItemClick(cornetasCarossiItem);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleItemClick(cornetasCarossiItem);
                    }
                  }}
                  tabIndex={0}
                >
                  <h3
                    className="font-montserrat font-extrabold text-3xl sm:text-4xl text-primary mb-4"
                  >
                    {cornetasCarossiItem.title}
                  </h3>
                  <p
                    className={`text-base text-muted-foreground md:text-justify ${
                      !expandedItems[cornetasCarossiItem.id] ? 'line-clamp-5' : ''
                    }`}
                    onClick={(e) => toggleDescription(e, cornetasCarossiItem.id)}
                    style={{ cursor: 'pointer' }}
                  >
                    {cornetasCarossiItem.description}
                  </p>
                  <AccessibleButton
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleDescription(e, cornetasCarossiItem.id);
                    }}
                    className="text-sm text-primary mt-3 hover:underline py-1 px-2 self-start"
                    variant="ghost"
                    size="sm"
                    aria-expanded={expandedItems[cornetasCarossiItem.id]}
                    aria-controls={`description-${cornetasCarossiItem.id}`}
                  >
                    {expandedItems[cornetasCarossiItem.id] ? 'Mostrar menos' : 'Mostrar mais'}
                  </AccessibleButton>
                </div>
              </div>
            </div>
          )}
          
          {/* Grid dos outros itens */}
          {otherItems.length > 0 && (
            <section aria-label="Galeria de projetos" role="region">
              <ul
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 list-none"
                role="list"
                aria-label={`Outros projetos (${otherItems.length} itens)`}
              >
                {otherItems.map((item, index) => (
                  <li key={item.id} role="listitem">
                    <FocusIndicator variant="card">
                      <article
                        className={`gallery-item transition-transform rounded-lg ${
                          reduceAnimations ? 'duration-0' : 'duration-300 hover:scale-105'
                        } cursor-pointer shadow-md overflow-hidden bg-background`}
                        onClick={() => handleItemClick(item)}
                        tabIndex={0}
                        role="button"
                        aria-label={`Ver detalhes do projeto ${item.title}`}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            handleItemClick(item);
                          }
                        }}
                      >
                        <div className="relative w-full h-80 overflow-hidden rounded-t-lg">
                          <LazyImage
                            src={getAssetPath(item.image)}
                            alt={`Imagem do projeto ${item.title}`}
                            priority={index < 2}
                            quality={imageQuality as 'low' | 'medium' | 'high'}
                            className="absolute inset-0 w-full h-full object-cover object-center"
                          />
                        </div>
                        <div className="p-4 text-center min-h-[12rem] flex flex-col">
                          <h3
                            className="font-montserrat font-semibold text-lg mb-2"
                            role="heading"
                            aria-level={3}
                          >
                            {item.title}
                          </h3>
                          <div className="flex-1 flex flex-col">
                            <p
                              className={`text-sm text-muted-foreground flex-1 ${
                                !expandedItems[item.id] ? 'line-clamp-4' : ''
                              }`}
                              role="text"
                              aria-describedby={`description-${item.id}`}
                              id={`description-${item.id}`}
                              onClick={(e) => {
                                if ((item.id === "13" || item.id === "14" || item.id === "15" || item.id === "16" || item.id === "17" || item.id === "18" || item.id === "19" || item.id === "20")) {
                                  toggleDescription(e, item.id);
                                }
                              }}
                              style={{
                                cursor: (item.id === "13" || item.id === "14" || item.id === "15" || item.id === "16" || item.id === "17" || item.id === "18" || item.id === "19" || item.id === "20") ? 'pointer' : 'default'
                              }}
                            >
                              {item.description}
                            </p>
                          </div>
                        </div>
                      </article>
                    </FocusIndicator>
                  </li>
                ))}
              </ul>
            </section>
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
