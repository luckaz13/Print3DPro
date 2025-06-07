import React, { useEffect, useState, useMemo } from "react";
import { getAssetPath } from "@/lib/utils";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"; // Supondo que este é o caminho correto
import { Button } from "@/components/ui/button"; // Para os botões de navegação se não forem do carrossel
import { ChevronLeft, ChevronRight } from "lucide-react"; // Para ícones de navegação

interface PortfolioItem {
  id: string;
  image: string;
  title: string;
  description: string;
  category: string;
  galleryImages?: string[]; // Adicionado para consistência
}

interface GalleryModalProps {
  item: PortfolioItem;
  isOpen: boolean;
  onClose: () => void;
}

export const GalleryModal: React.FC<GalleryModalProps> = ({ 
  item, 
  isOpen, 
  onClose
}) => {
  const allImages = useMemo(() => {
    const images = [item.image];
    if (item.galleryImages) {
      images.push(...item.galleryImages);
    }
    return images;
  }, [item.image, item.galleryImages]);

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const handleEscKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleEscKey);
      setCurrentIndex(0); // Resetar para a primeira imagem ao abrir
    }

    return () => {
      document.body.style.overflow = 'auto';
      window.removeEventListener('keydown', handleEscKey);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? allImages.length - 1 : prevIndex - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex === allImages.length - 1 ? 0 : prevIndex + 1));
  };
  
  // Para uso com o componente Carousel de shadcn/ui
  // Se for usar botões manuais, a lógica de setCurrentIndex já está acima.
  // O componente Carousel de shadcn/ui gerencia seu próprio estado interno de índice
  // após ser inicializado com `opts={{ startIndex: currentIndex }}` se necessário,
  // ou simplesmente renderizando os CarouselItems.

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-90 z-50 flex flex-col items-center justify-center p-4" // Alterado para flex-col
      onClick={handleBackdropClick}
    >
      <div className="max-w-4xl w-full mx-auto relative flex-grow flex flex-col justify-center"> {/* Permitir que o conteúdo cresça */}
        <button
          className="absolute top-2 right-2 sm:top-4 sm:right-4 text-white text-2xl sm:text-3xl hover:text-primary z-[51] p-2 touch-target min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full bg-black bg-opacity-50 hover:bg-opacity-70 transition-all"
          onClick={onClose}
          aria-label="Fechar modal"
        >
          <i className="fas fa-times"></i> {/* Considere usar um ícone de lucide-react aqui também para consistência */}
        </button>

        {allImages.length > 0 ? (
          <Carousel
            opts={{
              align: "start",
              loop: allImages.length > 1, // Loop apenas se houver mais de uma imagem
              // startIndex: currentIndex, // O Carousel gerencia seu próprio índice após a montagem
            }}
            // onValueChange pode ser usado para sincronizar com o estado externo se necessário, mas não é obrigatório para a funcionalidade básica.
            // api={setApi} // Para controle programático se necessário
            className="w-full flex-grow flex items-center" // Permitir que o carrossel cresça e centralize
          >
            <CarouselContent className="h-full">
              {allImages.map((imgSrc, idx) => (
                <CarouselItem key={idx} className="flex items-center justify-center h-full">
                  <img
                    src={getAssetPath(imgSrc)}
                    alt={`${item.title} - Imagem ${idx + 1}`}
                    className="max-w-full max-h-[70vh] sm:max-h-[80vh] object-contain rounded-lg"
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
            {allImages.length > 1 && (
              <>
                <CarouselPrevious className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-10 bg-black/30 hover:bg-black/60 text-white" />
                <CarouselNext className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-10 bg-black/30 hover:bg-black/60 text-white" />
              </>
            )}
          </Carousel>
        ) : (
          <p className="text-white text-center">Nenhuma imagem para exibir.</p>
        )}
        
        <div className="mt-4 px-2 text-center max-w-3xl mx-auto"> {/* Centralizar texto abaixo */}
          <h3 className="text-white text-lg sm:text-xl font-montserrat font-semibold">{item.title}</h3>
          {/* A descrição completa pode ser muito longa para o modal, considere truncar ou mostrar apenas o título */}
          {/* <p className="text-gray-300 mt-2 text-sm sm:text-base leading-relaxed line-clamp-3">{item.description}</p> */}
        </div>
      </div>
    </div>
  );
};
