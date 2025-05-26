import React, { useState, useEffect } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { CarossiLogo } from "@/assets/carossi-logo";
import { ScrollToSection } from "./ScrollToSection";
import { AnimatedElement, AnimatedList } from "@/components/ui/animated-element";
import { TooltipCard } from "@/components/ui/enhanced-hover-card";
import { useOptimizedScroll, useSmartCallback, usePerformanceOptimizations } from "@/hooks/use-performance";
import { useDeviceInfo, usePrefersReducedMotion } from "@/hooks/use-mobile";
import { Landmark, AccessibleButton, useFocusManagement, useKeyboardNavigation } from "@/components/ui/accessibility-helpers";
import { DarkModeToggle } from "@/components/ui/dark-mode-toggle";

export const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  
  const { isMobile, hasTouch } = useDeviceInfo();
  const prefersReducedMotion = usePrefersReducedMotion();
  const { reduceAnimations } = usePerformanceOptimizations();
  const { trapFocus, restoreFocus } = useFocusManagement();
  const isKeyboardUser = useKeyboardNavigation();

  // Callback otimizado para toggle do menu
  const toggleMobileMenu = React.useCallback(() => {
    setMobileMenuOpen(prev => {
      const newState = !prev;
      
      // Gerenciar foco para acessibilidade
      if (newState && isMobile) {
        // Quando abre o menu, focar no primeiro item
        setTimeout(() => {
          const firstMenuItem = document.querySelector('[data-menu-item="0"]') as HTMLElement;
          firstMenuItem?.focus();
        }, 100);
      }
      
      return newState;
    });
  }, [isMobile]);

  const closeMobileMenu = React.useCallback(() => {
    setMobileMenuOpen(false);
    
    // Retornar foco para o botão do menu
    if (isMobile) {
      const menuButton = document.getElementById('mobile-menu-button');
      menuButton?.focus();
    }
  }, [isMobile]);

  // Scroll otimizado para performance
  useOptimizedScroll((scrollY) => {
    setIsScrolled(scrollY > 50);
  });

  // Fechar menu com Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        closeMobileMenu();
      }
    };

    if (mobileMenuOpen) {
      document.addEventListener('keydown', handleKeyDown);
      // Prevenir scroll do body quando menu está aberto
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen, closeMobileMenu]);

  // Itens do menu com melhor estrutura para acessibilidade
  const menuItems = [
    { id: "quem-somos", label: "Quem somos", tooltip: "Conheça nossa história e missão" },
    { id: "trabalhos", label: "Trabalhos", tooltip: "Veja nosso portfólio de projetos" },
    { id: "orcamentos", label: "Orçamentos", tooltip: "Solicite um orçamento personalizado" },
    { id: "onde-comprar", label: "Onde comprar", tooltip: "Encontre nossas lojas online" }
  ];

  return (
    <Landmark role="banner" className="fixed w-full z-50">
      <div 
        className={`transition-all ${reduceAnimations ? 'duration-0' : 'duration-500'} ${
          isScrolled 
            ? "shadow-md bg-background/95 backdrop-blur-sm" 
            : "bg-background"
        }`}
      >
        <nav
          className="container mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center justify-between"
          aria-label="Navegação principal"
        >
          {/* Logo */}
          <div className="flex items-center">
            <Link
              href="/"
              className={`block w-32 sm:w-40 md:w-48 transition-transform ${
                reduceAnimations ? 'duration-0' : 'duration-300 hover:scale-105'
              } focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-md`}
              aria-label="CarossiParts - Página inicial"
            >
              <CarossiLogo />
            </Link>
          </div>
          
          {/* Controles do lado direito */}
          <div className="flex items-center gap-2">
            {/* Botão Dark Mode - sempre visível com contraste aprimorado */}
            <DarkModeToggle
              size={isMobile ? "md" : "lg"}
              variant="enhanced"
              showTooltip={!isMobile}
              className="order-1 md:order-2"
            />
            
            {/* Botão do menu mobile */}
            <AccessibleButton
              id="mobile-menu-button"
              className="md:hidden p-3 rounded-full hover:bg-muted transition-colors duration-300 order-2 md:order-1"
              onClick={toggleMobileMenu}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-menu"
              aria-label={mobileMenuOpen ? "Fechar menu" : "Abrir menu"}
              size="md"
            >
              <i
                className={`fa-solid ${mobileMenuOpen ? 'fa-times' : 'fa-bars'} text-2xl text-foreground transition-transform ${
                  reduceAnimations ? 'duration-0' : 'duration-300'
                } ${mobileMenuOpen ? 'rotate-90' : 'rotate-0'}`}
                aria-hidden="true"
              />
            </AccessibleButton>
          </div>
          
          {/* Menu de navegação */}
          <div
            id="mobile-menu"
            className={`${
              mobileMenuOpen
                ? `block ${reduceAnimations ? '' : 'animate-in slide-in-from-top duration-300'} min-h-[200px]`
                : 'hidden'
            } md:flex md:w-auto mt-4 md:mt-0`}
            role={isMobile ? "dialog" : undefined}
            aria-modal={isMobile && mobileMenuOpen ? "true" : undefined}
            aria-labelledby="mobile-menu-button"
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="font-montserrat font-medium" role="list">
                <AnimatedList
                  className="md:flex md:flex-row md:space-x-8"
                  itemClassName="md:max-w-max"
                  animation={reduceAnimations ? undefined : "fade-in"}
                  staggerDelay={reduceAnimations ? 0 : 100}
                  initialDelay={0}
                  duration={reduceAnimations ? 0 : 300}
                >
                {menuItems.map((item, index) => (
                  <div key={item.id} className="relative group" role="listitem">
                  {hasTouch ? (
                    // Em dispositivos touch, não usar tooltip
                    <div>
                      <ScrollToSection
                        sectionId={item.id}
                        onClick={closeMobileMenu}
                      >
                        <span
                          className={`block md:inline-block py-3 px-4 hover:text-primary transition-colors ${
                            reduceAnimations ? 'duration-0' : 'duration-300'
                          } relative min-h-[44px] flex items-center focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-md cursor-pointer`}
                          role="button"
                          tabIndex={0}
                          data-menu-item={index}
                          aria-label={`Navegar para seção ${item.label}`}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              closeMobileMenu();
                            }
                          }}
                        >
                          {item.label}
                          <span
                            className={`absolute bottom-1 left-4 right-4 h-0.5 bg-primary transform scale-x-0 group-hover:scale-x-100 transition-transform ${
                              reduceAnimations ? 'duration-0' : 'duration-300'
                            } origin-left`}
                            aria-hidden="true"
                          />
                        </span>
                      </ScrollToSection>
                    </div>
                  ) : (
                    <TooltipCard
                      tooltip={item.tooltip}
                      side="bottom"
                    >
                      <ScrollToSection
                        sectionId={item.id}
                        onClick={closeMobileMenu}
                      >
                        <span
                          className={`block md:inline-block py-3 px-4 hover:text-primary transition-colors ${
                            reduceAnimations ? 'duration-0' : 'duration-300'
                          } relative min-h-[44px] flex items-center focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-md cursor-pointer`}
                          role="button"
                          tabIndex={0}
                          data-menu-item={index}
                          aria-label={`Navegar para seção ${item.label}`}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              closeMobileMenu();
                            }
                          }}
                        >
                          {item.label}
                          <span
                            className={`absolute bottom-1 left-4 right-4 h-0.5 bg-primary transform scale-x-0 group-hover:scale-x-100 transition-transform ${
                              reduceAnimations ? 'duration-0' : 'duration-300'
                            } origin-left`}
                            aria-hidden="true"
                          />
                        </span>
                      </ScrollToSection>
                    </TooltipCard>
                  )}
                </div>
              ))}
                </AnimatedList>
              </div>
              
              {/* Seção adicional no menu mobile para Dark Mode */}
              {isMobile && mobileMenuOpen && (
                <div className="mt-6 pt-4 border-t border-border">
                  <div className="flex items-center justify-between px-4">
                    <span className="text-sm font-medium text-muted-foreground">
                      Tema
                    </span>
                    <DarkModeToggle
                      size="md"
                      variant="enhanced"
                      showTooltip={false}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </nav>
      </div>

      {/* Overlay para fechar menu em mobile */}
      {mobileMenuOpen && isMobile && (
        <div
          className="fixed inset-0 bg-black/20 z-40 md:hidden"
          onClick={closeMobileMenu}
          aria-hidden="true"
        />
      )}
    </Landmark>
  );
};
