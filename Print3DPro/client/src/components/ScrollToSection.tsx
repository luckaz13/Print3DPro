import React from "react";

interface ScrollToSectionProps {
  sectionId: string;
  children: React.ReactNode;
  onClick?: () => void;
}

export const ScrollToSection: React.FC<ScrollToSectionProps> = ({
  sectionId,
  children,
  onClick
}) => {
  const handleClick = (e: React.MouseEvent | React.KeyboardEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Executar callback primeiro (para fechar menu)
    if (onClick) {
      onClick();
    }
    
    // Aguardar um pouco para o menu fechar antes de fazer scroll
    setTimeout(() => {
      const section = document.getElementById(sectionId);
      
      if (section) {
        const navbarHeight = 80;
        const elementPosition = section.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - navbarHeight;
        
        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth"
        });
      }
    }, 100);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      handleClick(e);
    }
  };
  
  return (
    <div
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      style={{ cursor: "pointer", display: "inline-block" }}
      role="button"
      tabIndex={0}
    >
      {children}
    </div>
  );
};
