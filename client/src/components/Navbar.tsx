import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { CarossiLogo } from "@/assets/carossi-logo";
import { ScrollToSection } from "./ScrollToSection";

export const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? "shadow-md" : ""} bg-background`}>
      <nav className="container mx-auto px-4 py-3 flex flex-wrap items-center justify-between">
        <div className="flex items-center">
          <Link href="/">
            <a className="block w-40 md:w-48">
              <CarossiLogo />
            </a>
          </Link>
        </div>
        
        <button 
          id="mobile-menu-button" 
          className="md:hidden focus:outline-none"
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
        >
          <i className={`fa-solid ${mobileMenuOpen ? 'fa-times' : 'fa-bars'} text-2xl text-foreground`}></i>
        </button>
        
        <div className={`${mobileMenuOpen ? 'block' : 'hidden'} md:flex w-full md:w-auto mt-4 md:mt-0`}>
          <ul className="flex flex-col md:flex-row md:space-x-8 font-montserrat font-medium">
            <li>
              <ScrollToSection sectionId="quem-somos" onClick={closeMobileMenu}>
                <span className="block py-2 px-3 hover:text-primary transition">Quem somos</span>
              </ScrollToSection>
            </li>
            <li>
              <ScrollToSection sectionId="trabalhos" onClick={closeMobileMenu}>
                <span className="block py-2 px-3 hover:text-primary transition">Trabalhos</span>
              </ScrollToSection>
            </li>
            <li>
              <ScrollToSection sectionId="orcamentos" onClick={closeMobileMenu}>
                <span className="block py-2 px-3 hover:text-primary transition">Orçamentos</span>
              </ScrollToSection>
            </li>
            <li>
              <ScrollToSection sectionId="onde-comprar" onClick={closeMobileMenu}>
                <span className="block py-2 px-3 hover:text-primary transition">Onde comprar</span>
              </ScrollToSection>
            </li>
            <li>
              <div className="relative mt-2 md:mt-0">
                <div className="relative">
                  <Input 
                    type="text" 
                    placeholder="Buscar..." 
                    className="py-1 px-3 pr-8 h-[34px] rounded-full text-sm"
                  />
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="absolute right-0 top-0 h-[34px] w-[34px] text-muted-foreground hover:text-primary"
                  >
                    <Search className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
};
