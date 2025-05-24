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
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    
    const section = document.getElementById(sectionId);
    
    if (section) {
      window.scrollTo({
        top: section.offsetTop - 80,
        behavior: "smooth"
      });
      
      if (onClick) onClick();
    }
  };
  
  return (
    <span onClick={handleClick} style={{ cursor: "pointer" }}>
      {children}
    </span>
  );
};
