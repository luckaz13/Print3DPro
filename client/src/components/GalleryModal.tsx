import React, { useEffect } from "react";

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
      className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center"
      onClick={handleBackdropClick}
    >
      <div className="max-w-4xl mx-auto p-4 relative">
        <button 
          className="absolute top-4 right-4 text-white text-3xl hover:text-primary z-10"
          onClick={onClose}
          aria-label="Fechar modal"
        >
          <i className="fas fa-times"></i>
        </button>
        <img 
          src={item.image} 
          alt={item.title} 
          className="max-w-full max-h-[80vh] object-contain"
        />
        <h3 className="text-white text-xl font-montserrat font-semibold mt-4">{item.title}</h3>
        <p className="text-gray-300 mt-2">{item.description}</p>
      </div>
    </div>
  );
};
