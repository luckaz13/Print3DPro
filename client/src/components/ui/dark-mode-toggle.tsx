import React from 'react';
import { useDarkMode } from '@/hooks/use-dark-mode';
import { useDeviceInfo, usePrefersReducedMotion } from '@/hooks/use-mobile';
import { AccessibleButton } from '@/components/ui/accessibility-helpers';
import { TooltipCard } from '@/components/ui/enhanced-hover-card';

interface DarkModeToggleProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'minimal' | 'floating' | 'enhanced';
  showTooltip?: boolean;
}

export function DarkModeToggle({
  className = '',
  size = 'md',
  variant = 'enhanced',
  showTooltip = true
}: DarkModeToggleProps) {
  const { isDark, toggle, isSystemMode } = useDarkMode();
  const { isMobile, hasTouch } = useDeviceInfo();
  const prefersReducedMotion = usePrefersReducedMotion();

  // Configurações de tamanho
  const sizeClasses = {
    sm: 'w-8 h-8 p-1.5',
    md: 'w-10 h-10 p-2',
    lg: 'w-12 h-12 p-2.5'
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  // Configurações de variante com contraste aprimorado
  const variantClasses = {
    default: 'bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600 shadow-md',
    minimal: 'bg-white/80 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-600 shadow-sm',
    floating: 'bg-white dark:bg-gray-800 backdrop-blur-sm shadow-lg hover:shadow-xl border border-gray-200 dark:border-gray-600',
    enhanced: `
      bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900
      border-2 border-gray-300/60 dark:border-gray-600/60
      shadow-lg shadow-black/5 dark:shadow-black/20
      hover:shadow-xl hover:shadow-black/10 dark:hover:shadow-black/30
      hover:border-gray-400/80 dark:hover:border-gray-500/80
      hover:from-gray-50 hover:to-gray-100 dark:hover:from-gray-700 dark:hover:to-gray-800
      ring-1 ring-black/5 dark:ring-white/5
      backdrop-blur-sm
    `
  };

  // Classes base do botão com contraste melhorado
  const baseClasses = `
    relative rounded-full transition-all duration-300 ease-in-out
    focus:outline-none focus:ring-2 focus:ring-primary/70 focus:ring-offset-2 focus:ring-offset-background
    active:scale-95 touch-target group
    dark-mode-toggle-enhanced
    ${sizeClasses[size]}
    ${variantClasses[variant]}
    ${prefersReducedMotion ? 'transition-none' : ''}
    ${className}
    z-10 cursor-pointer
    transform-gpu will-change-transform
  `;

  // Tamanhos dos ícones Font Awesome
  const iconFAClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };

  // Ícone do sol aprimorado com melhor contraste
  const SunIcon = () => (
    <i
      className={`fa-solid fa-sun ${iconFAClasses[size]} transition-all duration-300 ${
        isDark
          ? 'rotate-90 scale-0 opacity-0'
          : 'rotate-0 scale-100 opacity-100 text-amber-500 dark:text-amber-400'
      } drop-shadow-sm group-hover:drop-shadow-md`}
      aria-hidden="true"
      style={{
        filter: isDark
          ? 'none'
          : 'drop-shadow(0 1px 2px rgba(0,0,0,0.15)) drop-shadow(0 0 4px rgba(245,158,11,0.3))'
      }}
    />
  );

  // Ícone da lua aprimorado com melhor contraste
  const MoonIcon = () => (
    <i
      className={`fa-solid fa-moon ${iconFAClasses[size]} transition-all duration-300 ${
        isDark
          ? 'rotate-0 scale-100 opacity-100 text-blue-300 dark:text-blue-200'
          : '-rotate-90 scale-0 opacity-0'
      } drop-shadow-sm group-hover:drop-shadow-md`}
      aria-hidden="true"
      style={{
        filter: isDark
          ? 'drop-shadow(0 1px 2px rgba(0,0,0,0.2)) drop-shadow(0 0 4px rgba(147,197,253,0.4))'
          : 'none'
      }}
    />
  );

  // Indicador de modo sistema aprimorado
  const SystemIndicator = () => (
    isSystemMode && (
      <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full border-2 border-background shadow-sm">
        <div className="absolute inset-0 bg-primary rounded-full animate-pulse opacity-75" />
        <span className="sr-only">Usando preferência do sistema</span>
      </div>
    )
  );

  // Efeito de brilho no hover
  const GlowEffect = () => (
    <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
      <div className={`absolute inset-0 rounded-full ${
        isDark
          ? 'bg-gradient-to-r from-blue-400/10 to-purple-400/10'
          : 'bg-gradient-to-r from-amber-400/10 to-orange-400/10'
      }`} />
    </div>
  );

  const buttonContent = (
    <AccessibleButton
      className={baseClasses}
      onClick={toggle}
      aria-label={
        isDark
          ? 'Alternar para modo claro - Atualmente no modo escuro'
          : 'Alternar para modo escuro - Atualmente no modo claro'
      }
      aria-pressed={isDark}
      aria-describedby={isSystemMode ? 'dark-mode-system-indicator' : undefined}
      role="switch"
      size={size}
    >
      {/* Efeito de brilho */}
      <GlowEffect />
      
      {/* Container dos ícones com posicionamento absoluto para transição suave */}
      <div className="relative flex items-center justify-center z-10">
        <div className="absolute inset-0 flex items-center justify-center">
          <SunIcon />
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <MoonIcon />
        </div>
      </div>
      
      {/* Indicador de modo sistema */}
      <SystemIndicator />
      
      {/* Efeito de ripple aprimorado para feedback visual */}
      <div className="absolute inset-0 rounded-full overflow-hidden">
        <div className={`absolute inset-0 scale-0 rounded-full transition-transform duration-300 group-active:scale-100 ${
          isDark
            ? 'bg-blue-400/20'
            : 'bg-amber-400/20'
        }`} />
      </div>
      
      {/* Borda interna sutil para melhor definição */}
      <div className="absolute inset-0 rounded-full border border-white/20 dark:border-black/20 pointer-events-none" />
    </AccessibleButton>
  );

  // Se for dispositivo touch ou tooltip desabilitado, retornar apenas o botão
  if (hasTouch || !showTooltip) {
    return buttonContent;
  }

  // Para dispositivos não-touch, envolver com tooltip aprimorado
  return (
    <TooltipCard
      tooltip={
        <div className="text-center space-y-1">
          <div className="font-semibold text-sm">
            {isDark ? '🌙 Modo Escuro Ativo' : '☀️ Modo Claro Ativo'}
          </div>
          {isSystemMode && (
            <div className="text-xs text-muted-foreground">
              🔄 Seguindo preferência do sistema
            </div>
          )}
          <div className="text-xs text-muted-foreground border-t border-border/50 pt-1 mt-2">
            Clique para alternar tema
          </div>
        </div>
      }
      side="bottom"
      sideOffset={8}
    >
      {buttonContent}
    </TooltipCard>
  );
}

// Componente para uso em posição fixa (floating)
export function FloatingDarkModeToggle({ className = '' }: { className?: string }) {
  return (
    <div className={`fixed top-4 right-4 z-50 ${className}`}>
      <DarkModeToggle 
        variant="floating" 
        size="lg"
        showTooltip={true}
      />
    </div>
  );
}