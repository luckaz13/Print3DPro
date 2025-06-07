import { useState, useEffect, useCallback } from 'react';

export interface DarkModeState {
  isDark: boolean;
  toggle: () => void;
  setDark: (dark: boolean) => void;
  systemPreference: boolean;
  isSystemMode: boolean;
}

export function useDarkMode(): DarkModeState {
  // Detectar preferência do sistema
  const [systemPreference, setSystemPreference] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Estado do dark mode - iniciar com Dark Mode por padrão
  const [isDark, setIsDarkState] = useState(() => {
    if (typeof window === 'undefined') return false; // Light mode por padrão no SSR
    
    const savedMode = localStorage.getItem('darkMode');
    
    // Se não há preferência salva, usar Light Mode por padrão
    if (savedMode === null) {
      return false; // Light mode por padrão
    }
    
    // Se há preferência salva, usar ela
    return savedMode === 'true';
  });

  // Verificar se está usando modo do sistema
  const [isSystemMode, setIsSystemMode] = useState(() => {
    if (typeof window === 'undefined') return false; // Não usar modo sistema por padrão
    return localStorage.getItem('darkMode') === null;
  });

  // Aplicar o tema ao documento
  const applyTheme = useCallback((dark: boolean) => {
    if (typeof document === 'undefined') return;
    
    const root = document.documentElement;
    
    if (dark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    
    // Adicionar transição suave para mudanças de tema
    root.style.transition = 'background-color 0.3s ease, color 0.3s ease';
    
    // Remover a transição após a animação
    setTimeout(() => {
      root.style.transition = '';
    }, 300);
  }, []);

  // Escutar mudanças na preferência do sistema
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e: MediaQueryListEvent) => {
      setSystemPreference(e.matches);
      
      // Se estiver no modo sistema, atualizar o tema
      if (isSystemMode) {
        setIsDarkState(e.matches);
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, [isSystemMode]);

  // Aplicar tema quando o estado mudar
  useEffect(() => {
    applyTheme(isDark);
  }, [isDark, applyTheme]);

  // Função para alternar o modo
  const toggle = useCallback(() => {
    const newMode = !isDark;
    setIsDarkState(newMode);
    setIsSystemMode(false);
    localStorage.setItem('darkMode', newMode.toString());
  }, [isDark]);

  // Função para definir modo específico
  const setDark = useCallback((dark: boolean) => {
    setIsDarkState(dark);
    setIsSystemMode(false);
    localStorage.setItem('darkMode', dark.toString());
  }, []);

  // Função para voltar ao modo do sistema
  const useSystemMode = useCallback(() => {
    setIsSystemMode(true);
    setIsDarkState(systemPreference);
    localStorage.removeItem('darkMode');
  }, [systemPreference]);

  return {
    isDark,
    toggle,
    setDark,
    systemPreference,
    isSystemMode,
  };
}