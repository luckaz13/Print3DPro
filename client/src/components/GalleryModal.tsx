import React, { useEffect } from "react";
import { getAssetPath } from "@/lib/utils";

interface PortfolioItem {
  id: string;
  image: string;
  title: string;
  description: string;
  category: string;
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
  useEffect(() => {
    const handleEscKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleEscKey);
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

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      <div className="max-w-4xl w-full mx-auto relative">
        <button
          className="absolute top-2 right-2 sm:top-4 sm:right-4 text-white text-2xl sm:text-3xl hover:text-primary z-10 p-2 touch-target min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full bg-black bg-opacity-50 hover:bg-opacity-70 transition-all"
          onClick={onClose}
          aria-label="Fechar modal"
        >
          <i className="fas fa-times"></i>
        </button>
        <img
          src={getAssetPath(item.image)}
          alt={item.title}
          className="w-full max-h-[70vh] sm:max-h-[80vh] object-contain rounded-lg"
        />
        <div className="mt-4 px-2">
          <h3 className="text-white text-lg sm:text-xl font-montserrat font-semibold">{item.title}</h3>
          <p className="text-gray-300 mt-2 text-sm sm:text-base leading-relaxed">{item.description}</p>
        </div>
      </div>
    </div>
  );
};
