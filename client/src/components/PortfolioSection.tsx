import React, { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { GalleryModal } from "./GalleryModal";
import { LazyImage } from "@/components/ui/lazy-image";
import { CardGridSkeleton } from "@/components/ui/skeleton-loading";
import { getAssetPath } from "@/lib/utils";
import { useDeviceInfo, usePrefersReducedMotion } from "@/hooks/use-mobile";
import { useSmartCallback, useSmartMemo, usePerformanceOptimizations } from "@/hooks/use-performance";
import { Landmark, AccessibleButton, FocusIndicator } from "@/components/ui/accessibility-helpers";

type PortfolioCategory = "Todos" | "Peças Técnicas" | "Decorativos" | "Acessórios";

interface PortfolioItem {
  id: string;
  image: string;
  title: string;
  description: string;
  category: Exclude<PortfolioCategory, "Todos">;
}

const portfolioItems: PortfolioItem[] = [
  {
    id: "1",
    image: "/port1.jpg",
    title: "Vaso de flor estilizado",
    description: "Figura colecionável com acabamento artesanal e pintura detalhada.",
    category: "Decorativos"
  },
  {
    id: "2",
    image: "/port2.jpg",
    title: "Espigão",
    description: "Espigão para junção de mangueiras de 1\" ou 3/4\" em ângulos de 90º ou 135º. (modelos que possuo arquivo pronto para impressão em SOLIDWORKS). É possível fazer de tamanhos e ângulos diferentes a pedido do cliente.",
    category: "Peças Técnicas"
  },
  {
    id: "3",
    image: "/port3.jpg",
    title: "Porta copos para carros",
    description: "Porta copos tamanho padrão de várias marcas populares medindo 7 centímetros de diâmetro interno por 7 centímetros de altura. Furo central na parte inferior para fixação na lata do carro ou com velcro para fixação no carpete abaixo do freio de mão.",
    category: "Decorativos"
  },
  {
    id: "4",
    image: "/port4.jpg",
    title: "Suporte Customizado",
    description: "Acessório funcional desenvolvido sob medida para necessidades específicas.",
    category: "Acessórios"
  },
  {
    id: "5",
    image: "/port5.jpg",
    title: "BiCover",
    description: "\"Bic cover\". Esse suporte/cobertura para seu isqueiro tipo bic, além de ter um compartimento rosqueado pra você armazenar fumo, piteiras ou sedas, evita que você o perca por ser inconfundível.",
    category: "Peças Técnicas"
  },
  {
    id: "6",
    image: "/port6.jpg",
    title: "Cabide para capacetes",
    description: "Suporte para capacete, leve e de fácil instalação, apenas 2 parafusos e você não tem mais capacetes rolando pela casa!",
    category: "Acessórios"
  },
  {
    id: "7",
    image: "/port7.jpg",
    title: "Cornetas",
    description: "Corneta CarossiParts para moto, modelo plug & play. Instalação simples no sistema rosqueado. No modelo CG160, que possui TBI liso, é necessário usar parafusos (inclusos na compra, sem custo adicional). Ganho médio de 1,05 cavalos de potência, testado em dinamômetro. Disponível nos tamanhos de 3 cm e 6 cm de comprimento. Após a compra, informe no chat o tamanho e a cor desejados. Todas as cores estão disponíveis, mas podem ocorrer variações no prazo de entrega caso não haja matéria-prima da cor escolhida em estoque. Para modelos inéditos, será necessário envio das medidas com paquímetro. Fabricada em PLA biodegradável, resistente a combustíveis de posto (álcool e gasolina), testado e aprovado. Atenção: não suporta metanol nem nitrometano, que deformam o material. Em motores preparados, consulte seu preparador antes da instalação para avaliar se será necessário um novo acerto. As cores podem apresentar variações de tonalidade conforme o lote da matéria-prima. Garantia de 1 mês contra defeitos de fabricação. Não cobre mau uso, danos por combustível inadequado ou desgaste por instalação e remoção frequentes.",
    category: "Decorativos"
  },
  {
    id: "8",
    image: "/port8.jpg",
    title: "Cornetas aplicadas",
    description: "Exemplo da instalação de uma corneta em uma moto.",
    category: "Peças Técnicas"
  },
  {
    id: "9",
    image: "/port9.jpg",
    title: "Suporte Multifuncional",
    description: "Acessório versátil com múltiplas aplicações e design inteligente.",
    category: "Acessórios"
  },
  {
    id: "10",
    image: "/port10.jpg",
    title: "Chaveiros",
    description: "Uma forma de você agradar os seus clientes oferecendo um mimo ou agregando um pequeno valor com a venda do seu produto com um chaveiro personalizado com a marca ou nome da sua empresa.",
    category: "Decorativos"
  },
  {
    id: "11",
    image: "/port11.jpg",
    title: "Peças sob medida",
    description: "Muitos clientes necessitam de peças que não encontram no mercado para vender, e aqui, nós produzimos a peça com a maior fidelidade possível ao modelo original.",
    category: "Peças Técnicas"
  }
];

export const PortfolioSection = () => {
  const [activeCategory, setActiveCategory] = useState<PortfolioCategory>("Todos");
  const [modalItem, setModalItem] = useState<PortfolioItem | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState(false);

  const { isMobile, hasTouch } = useDeviceInfo();
  const prefersReducedMotion = usePrefersReducedMotion();
  const { reduceAnimations, imageQuality } = usePerformanceOptimizations();

  // Callback otimizado para mudança de categoria
  const handleCategoryClick = React.useCallback((category: PortfolioCategory) => {
    if (category === activeCategory) return;
    
    setIsLoading(true);
    setActiveCategory(category);
    
    // Simular pequeno delay para melhor UX
    setTimeout(() => {
      setIsLoading(false);
    }, 150);
  }, [activeCategory]);

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

  // Memoização inteligente dos itens filtrados
  const filteredItems = useSmartMemo(() => {
    return activeCategory === "Todos" 
      ? portfolioItems 
      : portfolioItems.filter(item => item.category === activeCategory);
  }, [activeCategory], true);

  // Categorias com contadores
  const categoriesWithCount = useSmartMemo(() => {
    const categories: PortfolioCategory[] = ["Todos", "Peças Técnicas", "Decorativos", "Acessórios"];
    return categories.map(category => ({
      name: category,
      count: category === "Todos" 
        ? portfolioItems.length 
        : portfolioItems.filter(item => item.category === category).length
    }));
  }, [], true);

  return (
    <Landmark role="main">
      <section id="trabalhos" className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="section-heading">Trabalhos</h2>
            <p className="section-description">
              Conheça alguns dos nossos projetos realizados, desde peças técnicas até objetos decorativos e acessórios personalizados.
            </p>
            <div className="section-divider"></div>
          </div>
          
          {/* Filtros de categoria */}
          <div className="flex justify-center mb-10 px-4">
            <div 
              className="flex flex-wrap justify-center gap-2 sm:inline-flex sm:rounded-md sm:shadow-sm sm:gap-0" 
              role="group"
              aria-label="Filtros de categoria do portfólio"
            >
              {categoriesWithCount.map((category, index) => (
                <AccessibleButton
                  key={category.name}
                  onClick={() => handleCategoryClick(category.name)}
                  className={`
                    px-4 py-3 text-sm font-medium transition-all ${
                      reduceAnimations ? 'duration-0' : 'duration-200'
                    }
                    ${activeCategory === category.name ? "bg-primary text-white" : "bg-muted hover:bg-muted/80"}
                    ${index === 0 ? "rounded-lg sm:rounded-l-lg sm:rounded-r-none" : ""}
                    ${index === categoriesWithCount.length - 1 ? "rounded-lg sm:rounded-r-lg sm:rounded-l-none" : ""}
                    ${index !== 0 && index !== categoriesWithCount.length - 1 ? "rounded-lg sm:rounded-none" : ""}
                  `}
                  aria-pressed={activeCategory === category.name}
                  aria-label={`Filtrar por ${category.name} (${category.count} itens)`}
                >
                  {category.name}
                  {!isMobile && (
                    <span className="ml-2 text-xs opacity-75">
                      ({category.count})
                    </span>
                  )}
                </AccessibleButton>
              ))}
            </div>
          </div>
          
          {/* Grid de itens */}
          {isLoading ? (
            <CardGridSkeleton 
              columns={isMobile ? 1 : 3} 
              rows={2}
              animate={!prefersReducedMotion}
            />
          ) : (
            <div 
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
              role="grid"
              aria-label={`Portfólio - ${activeCategory} (${filteredItems.length} itens)`}
            >
              {filteredItems.map((item, index) => (
                <FocusIndicator key={item.id} variant="card">
                  <div 
                    className={`gallery-item transition-transform ${
                      reduceAnimations ? 'duration-0' : 'duration-300 hover:scale-105'
                    } cursor-pointer`}
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
                      aspectRatio="landscape"
                      priority={index < 3} // Primeiras 3 imagens com prioridade
                      quality={imageQuality as 'low' | 'medium' | 'high'}
                      className="w-full h-64"
                    />
                    <div className="p-4 bg-background">
                      <h3 className="font-montserrat font-semibold text-lg mb-2">
                        {item.title}
                      </h3>
                      <p
                        className={`text-sm text-muted-foreground ${
                          item.title === "Cornetas" && !expandedItems[item.id] 
                            ? 'line-clamp-4' 
                            : item.title !== "Cornetas" 
                              ? 'line-clamp-4' 
                              : ''
                        }`}
                        onClick={(e) => item.title === "Cornetas" ? toggleDescription(e, item.id) : undefined}
                        style={{ cursor: item.title === "Cornetas" ? 'pointer' : 'default' }}
                      >
                        {item.description}
                      </p>
                      {item.title === "Cornetas" && (
                        <AccessibleButton
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleDescription(e, item.id);
                          }}
                          className="text-xs text-primary mt-2 hover:underline py-1 px-2"
                          variant="ghost"
                          size="sm"
                          aria-expanded={expandedItems[item.id]}
                          aria-controls={`description-${item.id}`}
                        >
                          {expandedItems[item.id] ? 'Mostrar menos' : 'Mostrar mais'}
                        </AccessibleButton>
                      )}
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
