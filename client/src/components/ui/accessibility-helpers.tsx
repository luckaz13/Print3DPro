import * as React from "react"
import { cn } from "@/lib/utils"
import { useDeviceInfo, usePrefersReducedMotion, usePrefersDarkMode } from "@/hooks/use-mobile"

// Componente para skip links (navegação por teclado)
interface SkipLinkProps {
  href: string
  children: React.ReactNode
  className?: string
}

export const SkipLink: React.FC<SkipLinkProps> = ({ href, children, className }) => {
  return (
    <a
      href={href}
      className={cn(
        "sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4",
        "bg-primary text-primary-foreground px-4 py-2 rounded-md",
        "z-50 font-medium transition-all duration-200",
        "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        className
      )}
    >
      {children}
    </a>
  )
}

// Componente para indicador de foco visível
interface FocusIndicatorProps {
  children: React.ReactNode
  className?: string
  variant?: 'default' | 'button' | 'input' | 'card'
}

export const FocusIndicator = React.forwardRef<HTMLDivElement, FocusIndicatorProps>(
  ({ children, className, variant = 'default', ...props }, ref) => {
    const variantClasses = {
      default: "focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
      button: "focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2",
      input: "focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500",
      card: "focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-4"
    }

    return (
      <div
        ref={ref}
        className={cn(
          "transition-all duration-200 rounded-md",
          variantClasses[variant],
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)

FocusIndicator.displayName = "FocusIndicator"

// Componente para texto alternativo em imagens
interface AccessibleImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string
  alt: string
  decorative?: boolean
  longDescription?: string
  className?: string
}

export const AccessibleImage = React.forwardRef<HTMLImageElement, AccessibleImageProps>(
  ({ src, alt, decorative = false, longDescription, className, ...props }, ref) => {
    const { hasTouch } = useDeviceInfo()

    return (
      <div className="relative">
        <img
          ref={ref}
          src={src}
          alt={decorative ? "" : alt}
          role={decorative ? "presentation" : undefined}
          aria-describedby={longDescription ? `desc-${src}` : undefined}
          className={cn(
            "transition-all duration-200",
            hasTouch && "touch-manipulation",
            className
          )}
          {...props}
        />
        {longDescription && (
          <div id={`desc-${src}`} className="sr-only">
            {longDescription}
          </div>
        )}
      </div>
    )
  }
)

AccessibleImage.displayName = "AccessibleImage"

// Componente para botões acessíveis
interface AccessibleButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  variant?: 'primary' | 'secondary' | 'ghost' | 'destructive'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  loadingText?: string
  className?: string
}

export const AccessibleButton = React.forwardRef<HTMLButtonElement, AccessibleButtonProps>(
  ({ 
    children, 
    variant = 'primary', 
    size = 'md', 
    loading = false, 
    loadingText = "Carregando...",
    className, 
    disabled,
    ...props 
  }, ref) => {
    const { hasTouch } = useDeviceInfo()
    const prefersReducedMotion = usePrefersReducedMotion()

    const variantClasses = {
      primary: "bg-primary text-primary-foreground hover:bg-primary/90",
      secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
      ghost: "hover:bg-accent hover:text-accent-foreground",
      destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90"
    }

    const sizeClasses = {
      sm: "h-9 px-3 text-sm",
      md: "h-10 px-4 py-2",
      lg: "h-11 px-8 text-lg"
    }

    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        aria-busy={loading}
        aria-label={loading ? loadingText : undefined}
        className={cn(
          "inline-flex items-center justify-center rounded-md font-medium",
          "transition-colors duration-200 focus-visible:outline-none",
          "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          "disabled:pointer-events-none disabled:opacity-50",
          hasTouch && "touch-manipulation min-h-[44px]", // Área mínima de toque
          !prefersReducedMotion && "transform hover:scale-105 active:scale-95",
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        {...props}
      >
        {loading && (
          <div
            className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
            aria-hidden="true"
          />
        )}
        {children}
      </button>
    )
  }
)

AccessibleButton.displayName = "AccessibleButton"

// Componente para inputs acessíveis
interface AccessibleInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
  hint?: string
  required?: boolean
  className?: string
}

export const AccessibleInput = React.forwardRef<HTMLInputElement, AccessibleInputProps>(
  ({ label, error, hint, required, className, id, ...props }, ref) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`
    const errorId = error ? `${inputId}-error` : undefined
    const hintId = hint ? `${inputId}-hint` : undefined

    return (
      <div className="space-y-2">
        <label
          htmlFor={inputId}
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          {label}
          {required && (
            <span className="text-destructive ml-1" aria-label="obrigatório">
              *
            </span>
          )}
        </label>
        
        {hint && (
          <p id={hintId} className="text-sm text-muted-foreground">
            {hint}
          </p>
        )}
        
        <input
          ref={ref}
          id={inputId}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={cn(
            hintId && hintId,
            errorId && errorId
          ).trim() || undefined}
          className={cn(
            "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2",
            "text-sm ring-offset-background file:border-0 file:bg-transparent",
            "file:text-sm file:font-medium placeholder:text-muted-foreground",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            "focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            error && "border-destructive focus-visible:ring-destructive",
            className
          )}
          {...props}
        />
        
        {error && (
          <p id={errorId} className="text-sm text-destructive" role="alert">
            {error}
          </p>
        )}
      </div>
    )
  }
)

AccessibleInput.displayName = "AccessibleInput"

// Componente para navegação por landmarks
interface LandmarkProps {
  children: React.ReactNode
  role: 'banner' | 'navigation' | 'main' | 'complementary' | 'contentinfo' | 'search'
  label?: string
  className?: string
}

export const Landmark: React.FC<LandmarkProps> = ({ children, role, label, className }) => {
  const Tag = role === 'banner' ? 'header' : 
             role === 'navigation' ? 'nav' :
             role === 'main' ? 'main' :
             role === 'complementary' ? 'aside' :
             role === 'contentinfo' ? 'footer' :
             'section'

  return (
    <Tag
      role={role === 'search' ? 'search' : undefined}
      aria-label={label}
      className={className}
    >
      {children}
    </Tag>
  )
}

// Hook para gerenciamento de foco
export function useFocusManagement() {
  const focusableElementsSelector = React.useMemo(() => [
    'a[href]',
    'button:not([disabled])',
    'textarea:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    '[tabindex]:not([tabindex="-1"])'
  ].join(', '), [])

  const trapFocus = React.useCallback((container: HTMLElement) => {
    if (!container) {
      return () => {}
    }
    
    const focusableElements = container.querySelectorAll(focusableElementsSelector)
    const firstElement = focusableElements[0] as HTMLElement
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault()
            lastElement.focus()
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault()
            firstElement.focus()
          }
        }
      }
    }

    container.addEventListener('keydown', handleKeyDown)
    firstElement?.focus()

    return () => {
      container.removeEventListener('keydown', handleKeyDown)
    }
  }, [focusableElementsSelector])

  const restoreFocus = React.useCallback((previousElement: HTMLElement | null) => {
    if (previousElement && document.contains(previousElement)) {
      previousElement.focus()
    }
  }, [])

  return { trapFocus, restoreFocus }
}

// Componente para anúncios de screen reader
interface ScreenReaderAnnouncementProps {
  message: string
  priority?: 'polite' | 'assertive'
  className?: string
}

export const ScreenReaderAnnouncement: React.FC<ScreenReaderAnnouncementProps> = ({
  message,
  priority = 'polite',
  className
}) => {
  return (
    <div
      aria-live={priority}
      aria-atomic="true"
      className={cn("sr-only", className)}
    >
      {message}
    </div>
  )
}

// Hook para detecção de navegação por teclado
export function useKeyboardNavigation() {
  const [isKeyboardUser, setIsKeyboardUser] = React.useState(false)

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        setIsKeyboardUser(true)
      }
    }

    const handleMouseDown = () => {
      setIsKeyboardUser(false)
    }

    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('mousedown', handleMouseDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('mousedown', handleMouseDown)
    }
  }, [])

  React.useEffect(() => {
    if (isKeyboardUser) {
      document.body.classList.add('keyboard-navigation')
    } else {
      document.body.classList.remove('keyboard-navigation')
    }
  }, [isKeyboardUser])

  return isKeyboardUser
}