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
  
  // Log para monitorar mudanças no estado do menu
  React.useEffect(() => {
    console.log('📱 Menu state changed:', mobileMenuOpen);
  }, [mobileMenuOpen]);
  
  const { isMobile, hasTouch } = useDeviceInfo();
  const prefersReducedMotion = usePrefersReducedMotion();
  const { reduceAnimations } = usePerformanceOptimizations();
  const { trapFocus, restoreFocus } = useFocusManagement();
  const isKeyboardUser = useKeyboardNavigation();

  // Callback otimizado para toggle do menu
  const toggleMobileMenu = React.useCallback(() => {
    console.log('🔄 toggleMobileMenu called, current state:', mobileMenuOpen);
    setMobileMenuOpen(prev => {
      const newState = !prev;
      console.log('🔄 toggleMobileMenu changing state from', prev, 'to', newState);
      
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
  }, [isMobile, mobileMenuOpen]);

  const closeMobileMenu = React.useCallback(() => {
    console.log('❌ closeMobileMenu called');
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
            
            {/* Botão do menu mobile - Removido para dispositivos móveis */}
            {/*
            <button
              id="mobile-menu-button"
              className="md:hidden p-3 rounded-full hover:bg-muted/50 focus:bg-muted/50 active:bg-muted/70 transition-colors duration-300 order-2 md:order-1 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              onClick={(e) => {
                console.log('🍔 Hamburger button clicked, current state:', mobileMenuOpen);
                e.preventDefault();
                e.stopPropagation();
                toggleMobileMenu();
              }}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-menu"
              aria-label={mobileMenuOpen ? "Fechar menu" : "Abrir menu"}
              type="button"
            >
              <i
                className={`fa-solid ${mobileMenuOpen ? 'fa-times' : 'fa-bars'} text-2xl text-foreground transition-transform ${
                  reduceAnimations ? 'duration-0' : 'duration-300'
                } ${mobileMenuOpen ? 'rotate-90' : 'rotate-0'}`}
                aria-hidden="true"
              />
            </button>
            */}
          </div>
          
          {/* Menu de navegação */}
          {/* Menu de navegação simplificado - Removido para dispositivos móveis */}
          {/*
          {mobileMenuOpen && isMobile && (
            <div
              id="mobile-menu"
              className="block w-full bg-background border-t border-border mt-4 pt-4 relative z-50"
              role="dialog"
              aria-modal="true"
              aria-labelledby="mobile-menu-button"
            >
              <div className="flex flex-col space-y-2">
                {menuItems.map((item, index) => (
                  <div
                    key={item.id}
                    className="w-full py-3 px-4 hover:text-primary hover:bg-muted/30 transition-colors cursor-pointer min-h-[44px] flex items-center rounded-md"
                    data-menu-item={index}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      console.log('🎯 Menu item clicked:', item.label, 'Menu open:', mobileMenuOpen);
                      const section = document.getElementById(item.id);
                      if (section) {
                        console.log('📍 Section found, closing menu and scrolling to:', item.id);
                        closeMobileMenu();
                        setTimeout(() => {
                          console.log('⏰ Timeout executed, starting scroll');
                          const navbarHeight = 80;
                          const elementPosition = section.getBoundingClientRect().top;
                          const offsetPosition = elementPosition + window.pageYOffset - navbarHeight;
                          
                          window.scrollTo({
                            top: offsetPosition,
                            behavior: "smooth"
                          });
                          console.log('📜 Scroll initiated to position:', offsetPosition);
                        }, 100);
                      } else {
                        console.log('❌ Section not found:', item.id);
                      }
                    }}
                  >
                    {item.label}
                  </div>
                ))}
              </div>
              
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
            </div>
          )}
          */}
          
          {/* Menu desktop */}
          <div className="hidden md:flex md:w-auto md:order-1">
            <nav role="navigation" aria-label="Menu principal de navegação">
              <ul className="font-montserrat font-medium flex space-x-8" role="list">
                {menuItems.map((item, index) => (
                  <li key={item.id} role="listitem">
                    <button
                      className="py-3 px-4 hover:text-primary transition-colors duration-300 relative min-h-[44px] flex items-center focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-md"
                      onClick={() => {
                        const section = document.getElementById(item.id);
                        if (section) {
                          const navbarHeight = 80;
                          const elementPosition = section.getBoundingClientRect().top;
                          const offsetPosition = elementPosition + window.pageYOffset - navbarHeight;
                          
                          window.scrollTo({
                            top: offsetPosition,
                            behavior: "smooth"
                          });
                        }
                      }}
                      role="button"
                      aria-label={`Navegar para seção ${item.label}`}
                      type="button"
                    >
                      {item.label}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </nav>
      </div>

    </Landmark>
  );
};
