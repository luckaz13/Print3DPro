import * as React from "react"
import { cn } from "@/lib/utils"
import { ImageSkeleton } from "./skeleton-loading"
import { useDeviceInfo, useSlowConnection } from "@/hooks/use-mobile"

interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string
  alt: string
  fallbackSrc?: string
  aspectRatio?: 'square' | 'video' | 'portrait' | 'landscape'
  priority?: boolean
  quality?: 'low' | 'medium' | 'high'
  showSkeleton?: boolean
  onLoad?: () => void
  onError?: () => void
  className?: string
}

const LazyImage = React.forwardRef<HTMLImageElement, LazyImageProps>(
  ({
    src,
    alt,
    fallbackSrc,
    aspectRatio = 'landscape',
    priority = false,
    quality = 'medium',
    showSkeleton = true,
    onLoad,
    onError,
    className,
    ...props
  }, ref) => {
    const [isLoaded, setIsLoaded] = React.useState(false)
    const [isError, setIsError] = React.useState(false)
    const [isInView, setIsInView] = React.useState(priority)
    const [currentSrc, setCurrentSrc] = React.useState<string>('')
    
    const imgRef = React.useRef<HTMLImageElement>(null)
    const containerRef = React.useRef<HTMLDivElement>(null)
    
    const { isMobile } = useDeviceInfo()
    const isSlowConnection = useSlowConnection()

    // Intersection Observer para lazy loading
    React.useEffect(() => {
      if (priority) return

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setIsInView(true)
            observer.disconnect()
          }
        },
        {
          rootMargin: '50px', // Carregar 50px antes de entrar na viewport
          threshold: 0.1
        }
      )

      if (containerRef.current) {
        observer.observe(containerRef.current)
      }

      return () => observer.disconnect()
    }, [priority])

    // Determinar a qualidade da imagem baseada na conexão e dispositivo
    const getOptimizedSrc = React.useCallback((originalSrc: string) => {
      if (!originalSrc) return ''

      // Se for uma URL externa, retornar como está
      if (originalSrc.startsWith('http')) {
        return originalSrc
      }

      // Para imagens locais, podemos implementar diferentes qualidades
      const extension = originalSrc.split('.').pop()
      const baseName = originalSrc.replace(`.${extension}`, '')

      // Ajustar qualidade baseada na conexão e dispositivo
      let qualitySuffix = ''
      
      if (isSlowConnection || (isMobile && quality === 'low')) {
        qualitySuffix = '-low'
      } else if (isMobile && quality === 'medium') {
        qualitySuffix = '-medium'
      }

      // Tentar carregar versão otimizada, senão usar original
      return `${baseName}${qualitySuffix}.${extension}`
    }, [isSlowConnection, isMobile, quality])

    // Atualizar src quando componente estiver em view
    React.useEffect(() => {
      if (isInView && src) {
        setCurrentSrc(getOptimizedSrc(src))
      }
    }, [isInView, src, getOptimizedSrc])

    // Handlers para eventos de imagem
    const handleLoad = React.useCallback(() => {
      setIsLoaded(true)
      setIsError(false)
      onLoad?.()
    }, [onLoad])

    const handleError = React.useCallback(() => {
      setIsError(true)
      
      // Tentar fallback se disponível
      if (fallbackSrc && currentSrc !== fallbackSrc) {
        setCurrentSrc(fallbackSrc)
        return
      }
      
      // Se não há fallback ou já tentou o fallback, tentar imagem original
      if (currentSrc !== src) {
        setCurrentSrc(src)
        return
      }
      
      onError?.()
    }, [fallbackSrc, currentSrc, src, onError])

    // Classes para aspect ratio
    const aspectClasses = {
      square: "aspect-square",
      video: "aspect-video", 
      portrait: "aspect-[3/4]",
      landscape: "aspect-[4/3]"
    }

    // Se não está em view e não é prioridade, mostrar skeleton
    if (!isInView) {
      return (
        <div 
          ref={containerRef}
          className={cn(
            "relative overflow-hidden rounded-lg",
            aspectClasses[aspectRatio],
            className
          )}
        >
          {showSkeleton && (
            <ImageSkeleton 
              aspectRatio={aspectRatio}
              className="absolute inset-0"
            />
          )}
        </div>
      )
    }

    return (
      <div 
        ref={containerRef}
        className={cn(
          "relative overflow-hidden rounded-lg",
          aspectClasses[aspectRatio],
          className
        )}
      >
        {/* Skeleton enquanto carrega */}
        {!isLoaded && !isError && showSkeleton && (
          <ImageSkeleton 
            aspectRatio={aspectRatio}
            className="absolute inset-0"
          />
        )}

        {/* Imagem principal */}
        {currentSrc && (
          <img
            ref={(node) => {
              if (imgRef.current !== node) {
                // @ts-ignore - Necessário para atualizar ref
                imgRef.current = node
              }
              if (typeof ref === 'function') {
                ref(node)
              } else if (ref) {
                // @ts-ignore - Necessário para atualizar ref
                ref.current = node
              }
            }}
            src={currentSrc}
            alt={alt}
            loading={priority ? "eager" : "lazy"}
            decoding="async"
            onLoad={handleLoad}
            onError={handleError}
            className={cn(
              "w-full h-full object-cover transition-opacity duration-300",
              isLoaded ? "opacity-100" : "opacity-0",
              isError && "hidden"
            )}
            {...props}
          />
        )}

        {/* Fallback para erro */}
        {isError && (
          <div className="absolute inset-0 flex items-center justify-center bg-muted">
            <div className="text-center text-muted-foreground">
              <svg
                className="w-8 h-8 mx-auto mb-2"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                  clipRule="evenodd"
                />
              </svg>
              <p className="text-xs">Imagem não disponível</p>
            </div>
          </div>
        )}

        {/* Overlay de loading para conexões lentas */}
        {isSlowConnection && !isLoaded && !isError && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20">
            <div className="bg-white/90 rounded-full p-2">
              <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          </div>
        )}
      </div>
    )
  }
)

LazyImage.displayName = "LazyImage"

// Hook para preload de imagens críticas
export function useImagePreload(urls: string[]) {
  React.useEffect(() => {
    urls.forEach(url => {
      const img = new Image()
      img.src = url
    })
  }, [urls])
}

// Componente para galeria de imagens com lazy loading
interface LazyImageGalleryProps {
  images: Array<{
    src: string
    alt: string
    priority?: boolean
  }>
  columns?: number
  aspectRatio?: 'square' | 'video' | 'portrait' | 'landscape'
  className?: string
  onImageClick?: (index: number) => void
}

const LazyImageGallery: React.FC<LazyImageGalleryProps> = ({
  images,
  columns = 3,
  aspectRatio = 'square',
  className,
  onImageClick
}) => {
  return (
    <div 
      className={cn(
        "grid gap-4",
        `grid-cols-1 sm:grid-cols-2 lg:grid-cols-${columns}`,
        className
      )}
    >
      {images.map((image, index) => (
        <LazyImage
          key={`${image.src}-${index}`}
          src={image.src}
          alt={image.alt}
          aspectRatio={aspectRatio}
          priority={image.priority || index < 2} // Primeiras 2 imagens com prioridade
          className={cn(
            "cursor-pointer transition-transform hover:scale-105",
            onImageClick && "hover:shadow-lg"
          )}
          onClick={() => onImageClick?.(index)}
        />
      ))}
    </div>
  )
}

export { LazyImage, LazyImageGallery, type LazyImageProps }