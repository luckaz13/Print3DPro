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
      className="fixed inset-0 bg-black bg-opacity-90 z-50 flex flex-col items-center justify-center p-4"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <div className="max-w-4xl w-full mx-auto relative flex-grow flex flex-col justify-center">
        <button
          className="absolute top-2 right-2 sm:top-4 sm:right-4 text-white text-2xl sm:text-3xl hover:text-primary z-[51] p-2 touch-target min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full bg-black bg-opacity-50 hover:bg-opacity-70 transition-all"
          onClick={onClose}
          aria-label="Fechar modal da galeria"
          role="button"
          type="button"
        >
          <i className="fas fa-times" aria-hidden="true"></i>
        </button>

        {allImages.length > 0 ? (
          <Carousel
            opts={{
              align: "start",
              loop: allImages.length > 1,
            }}
            className="w-full flex-grow flex items-center"
            role="region"
            aria-label="Galeria de imagens do projeto"
          >
            <CarouselContent className="h-full" role="list">
              {allImages.map((imgSrc, idx) => (
                <CarouselItem key={idx} className="flex items-center justify-center h-full" role="listitem">
                  {imgSrc.includes('.mp4') ? (
                    <video
                      src={getAssetPath(imgSrc)}
                      className="max-w-full max-h-[70vh] sm:max-h-[80vh] object-contain rounded-lg"
                      controls
                      muted
                      playsInline
                      preload="metadata"
                      aria-label={`Vídeo ${idx + 1} de ${allImages.length} do projeto ${item.title}`}
                    />
                  ) : (
                    <img
                      src={getAssetPath(imgSrc)}
                      alt={`Imagem ${idx + 1} de ${allImages.length} do projeto ${item.title}`}
                      className="max-w-full max-h-[70vh] sm:max-h-[80vh] object-contain rounded-lg"
                      role="img"
                    />
                  )}
                </CarouselItem>
              ))}
            </CarouselContent>
            {allImages.length > 1 && (
              <>
                <CarouselPrevious 
                  className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-10 bg-black/30 hover:bg-black/60 text-white" 
                  aria-label="Imagem anterior"
                  role="button"
                />
                <CarouselNext 
                  className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-10 bg-black/30 hover:bg-black/60 text-white" 
                  aria-label="Próxima imagem"
                  role="button"
                />
              </>
            )}
          </Carousel>
        ) : (
          <p className="text-white text-center" role="status" aria-live="polite">Nenhuma imagem para exibir.</p>
        )}
        
        <div className="mt-4 px-2 text-center max-w-3xl mx-auto">
          <h3 
            id="modal-title"
            className="text-white text-lg sm:text-xl font-montserrat font-semibold"
            role="heading"
            aria-level={2}
          >
            {item.title}
          </h3>
          <p id="modal-description" className="sr-only">
            Modal da galeria exibindo imagens do projeto {item.title}
          </p>
        </div>
      </div>
    </div>
  );
};
