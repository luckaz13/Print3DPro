import { useState } from "react";
import { Button } from "@/components/ui/button";
import { GalleryModal } from "./GalleryModal";

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
    image: "https://images.unsplash.com/photo-1581091226033-d5c48150dbaa?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80",
    title: "Modelo Arquitetônico",
    description: "Maquete para apresentação de projetos imobiliários com detalhes precisos.",
    category: "Peças Técnicas"
  },
  {
    id: "2",
    image: "https://images.unsplash.com/photo-1559830772-73d4ede5bcac?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80",
    title: "Vaso Geométrico",
    description: "Peça decorativa com padrões complexos impossíveis de criar por métodos tradicionais.",
    category: "Decorativos"
  },
  {
    id: "3",
    image: "https://pixabay.com/get/gde781aff696bf8ce072265e0ce924d30b9baee286f80d7da322f4ac12409a4a8f915f73f12fe42e209fc8be36a4b26f525e00671bfab0b4e59ff56d177d23ad6_1280.jpg",
    title: "Protótipo Funcional",
    description: "Componente mecânico com peças móveis para validação de design industrial.",
    category: "Peças Técnicas"
  },
  {
    id: "4",
    image: "https://pixabay.com/get/g02cf9ddd5c8bb5151554bfde1d3b16a7033963ebd9e5b22faceeec0046300ceab3fdddc8148f493f161d32ced0e677fe9bc9e63b925198a35d41b498504c09b0_1280.jpg",
    title: "Suporte para Celular",
    description: "Design customizado para escritório ou casa com ajustes de ângulo.",
    category: "Acessórios"
  },
  {
    id: "5",
    image: "https://images.unsplash.com/photo-1592492152545-9695d3f473f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80",
    title: "Item para Cosplay",
    description: "Peça personalizada com acabamento profissional para colecionadores.",
    category: "Acessórios"
  },
  {
    id: "6",
    image: "https://images.unsplash.com/photo-1576502200916-3808e07386a5?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80",
    title: "Miniatura Colecionável",
    description: "Peça decorativa com detalhes minuciosos para colecionadores e entusiastas.",
    category: "Decorativos"
  }
];

export const PortfolioSection = () => {
  const [activeCategory, setActiveCategory] = useState<PortfolioCategory>("Todos");
  const [modalItem, setModalItem] = useState<PortfolioItem | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleCategoryClick = (category: PortfolioCategory) => {
    setActiveCategory(category);
  };

  const handleItemClick = (item: PortfolioItem) => {
    setModalItem(item);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const filteredItems = activeCategory === "Todos" 
    ? portfolioItems 
    : portfolioItems.filter(item => item.category === activeCategory);

  return (
    <section id="trabalhos" className="py-20">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="section-heading">Trabalhos</h2>
          <p className="section-description">
            Conheça alguns dos nossos projetos realizados, desde peças técnicas até objetos decorativos e acessórios personalizados.
          </p>
          <div className="section-divider"></div>
        </div>
        
        <div className="flex justify-center mb-10">
          <div className="inline-flex rounded-md shadow-sm" role="group">
            {(["Todos", "Peças Técnicas", "Decorativos", "Acessórios"] as PortfolioCategory[]).map((category, index) => (
              <button
                key={category}
                type="button"
                onClick={() => handleCategoryClick(category)}
                className={`
                  px-5 py-2.5 text-sm font-medium 
                  ${activeCategory === category ? "bg-primary text-white" : "bg-muted hover:bg-muted/80"} 
                  ${index === 0 ? "rounded-l-lg" : ""} 
                  ${index === 3 ? "rounded-r-lg" : ""}
                `}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItems.map((item) => (
            <div 
              key={item.id}
              className="gallery-item"
              onClick={() => handleItemClick(item)}
            >
              <img 
                src={item.image} 
                alt={item.title} 
                className="w-full h-64 object-cover"
              />
              <div className="p-4 bg-background">
                <h3 className="font-montserrat font-semibold text-lg mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <Button className="btn-primary" size="lg">
            <i className="fa-solid fa-th-large mr-2"></i>
            Ver mais trabalhos
          </Button>
        </div>
      </div>

      {modalOpen && modalItem && (
        <GalleryModal 
          item={modalItem} 
          isOpen={modalOpen} 
          onClose={handleCloseModal} 
        />
      )}
    </section>
  );
};
