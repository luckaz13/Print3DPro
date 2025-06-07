import * as React from "react"
import { cn } from "@/lib/utils"
import { usePrefersReducedMotion } from "@/hooks/use-mobile"

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'text' | 'circular' | 'rectangular' | 'card'
  width?: string | number
  height?: string | number
  lines?: number
  animate?: boolean
}

const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, variant = 'default', width, height, lines = 1, animate = true, ...props }, ref) => {
    const prefersReducedMotion = usePrefersReducedMotion()
    const shouldAnimate = animate && !prefersReducedMotion

    const baseClasses = cn(
      "bg-muted rounded-md",
      shouldAnimate && "animate-pulse",
      className
    )

    const style: React.CSSProperties = {
      width: width || '100%',
      height: height || undefined,
    }

    if (variant === 'text') {
      if (lines === 1) {
        return (
          <div
            ref={ref}
            className={cn(baseClasses, "h-4")}
            style={style}
            {...props}
          />
        )
      }

      return (
        <div className="space-y-2" {...props}>
          {Array.from({ length: lines }).map((_, index) => (
            <div
              key={index}
              ref={index === 0 ? ref : undefined}
              className={cn(
                baseClasses,
                "h-4",
                index === lines - 1 && "w-3/4" // Última linha mais curta
              )}
              style={index === 0 ? style : undefined}
            />
          ))}
        </div>
      )
    }

    if (variant === 'circular') {
      return (
        <div
          ref={ref}
          className={cn(baseClasses, "rounded-full", "aspect-square")}
          style={{ ...style, width: width || height || '40px' }}
          {...props}
        />
      )
    }

    if (variant === 'card') {
      return (
        <div
          ref={ref}
          className={cn(baseClasses, "p-4 space-y-3")}
          style={style}
          {...props}
        >
          <div className={cn("h-4 bg-muted-foreground/20 rounded", shouldAnimate && "animate-pulse")} />
          <div className="space-y-2">
            <div className={cn("h-3 bg-muted-foreground/20 rounded", shouldAnimate && "animate-pulse")} />
            <div className={cn("h-3 bg-muted-foreground/20 rounded w-5/6", shouldAnimate && "animate-pulse")} />
          </div>
        </div>
      )
    }

    return (
      <div
        ref={ref}
        className={cn(
          baseClasses,
          variant === 'rectangular' ? "rounded-md" : "",
          !height && "h-4"
        )}
        style={style}
        {...props}
      />
    )
  }
)

Skeleton.displayName = "Skeleton"

// Componente específico para loading de imagens
interface ImageSkeletonProps {
  aspectRatio?: 'square' | 'video' | 'portrait' | 'landscape'
  className?: string
  animate?: boolean
}

const ImageSkeleton: React.FC<ImageSkeletonProps> = ({ 
  aspectRatio = 'landscape', 
  className,
  animate = true 
}) => {
  const prefersReducedMotion = usePrefersReducedMotion()
  const shouldAnimate = animate && !prefersReducedMotion

  const aspectClasses = {
    square: "aspect-square",
    video: "aspect-video",
    portrait: "aspect-[3/4]",
    landscape: "aspect-[4/3]"
  }

  return (
    <div
      className={cn(
        "bg-muted rounded-lg flex items-center justify-center",
        aspectClasses[aspectRatio],
        shouldAnimate && "animate-pulse",
        className
      )}
    >
      <svg
        className="w-8 h-8 text-muted-foreground/40"
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
    </div>
  )
}

// Componente para loading de lista
interface ListSkeletonProps {
  items?: number
  showAvatar?: boolean
  className?: string
  animate?: boolean
}

const ListSkeleton: React.FC<ListSkeletonProps> = ({ 
  items = 3, 
  showAvatar = false, 
  className,
  animate = true 
}) => {
  const prefersReducedMotion = usePrefersReducedMotion()
  const shouldAnimate = animate && !prefersReducedMotion

  return (
    <div className={cn("space-y-4", className)}>
      {Array.from({ length: items }).map((_, index) => (
        <div key={index} className="flex items-center space-x-4">
          {showAvatar && (
            <Skeleton 
              variant="circular" 
              width="40px" 
              height="40px"
              animate={shouldAnimate}
            />
          )}
          <div className="flex-1 space-y-2">
            <Skeleton 
              variant="text" 
              height="16px"
              animate={shouldAnimate}
            />
            <Skeleton 
              variant="text" 
              height="14px" 
              width="60%"
              animate={shouldAnimate}
            />
          </div>
        </div>
      ))}
    </div>
  )
}

// Componente para loading de grid de cards
interface CardGridSkeletonProps {
  columns?: number
  rows?: number
  className?: string
  animate?: boolean
}

const CardGridSkeleton: React.FC<CardGridSkeletonProps> = ({ 
  columns = 3, 
  rows = 2, 
  className,
  animate = true 
}) => {
  const prefersReducedMotion = usePrefersReducedMotion()
  const shouldAnimate = animate && !prefersReducedMotion
  const totalItems = columns * rows

  return (
    <div 
      className={cn(
        "grid gap-4",
        `grid-cols-1 sm:grid-cols-2 lg:grid-cols-${columns}`,
        className
      )}
    >
      {Array.from({ length: totalItems }).map((_, index) => (
        <div key={index} className="space-y-3">
          <ImageSkeleton 
            aspectRatio="landscape"
            animate={shouldAnimate}
          />
          <div className="space-y-2">
            <Skeleton 
              variant="text" 
              height="16px"
              animate={shouldAnimate}
            />
            <Skeleton 
              variant="text" 
              height="14px" 
              width="75%"
              animate={shouldAnimate}
            />
          </div>
        </div>
      ))}
    </div>
  )
}

export { 
  Skeleton, 
  ImageSkeleton, 
  ListSkeleton, 
  CardGridSkeleton,
  type SkeletonProps,
  type ImageSkeletonProps,
  type ListSkeletonProps,
  type CardGridSkeletonProps
}