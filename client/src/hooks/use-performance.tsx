import * as React from "react"
import { useDeviceInfo, useSlowConnection } from "./use-mobile"

// Hook para otimizações de performance baseadas no dispositivo
export function usePerformanceOptimizations() {
  const { isMobile, isSmallMobile } = useDeviceInfo()
  const isSlowConnection = useSlowConnection()

  // Configurações de performance baseadas no dispositivo
  const performanceConfig = React.useMemo(() => ({
    // Reduzir animações em dispositivos móveis pequenos ou conexões lentas
    reduceAnimations: isSmallMobile || isSlowConnection,
    
    // Lazy loading mais agressivo em conexões lentas
    lazyLoadingThreshold: isSlowConnection ? '100px' : '50px',
    
    // Qualidade de imagem baseada no dispositivo
    imageQuality: isSlowConnection ? 'low' : isMobile ? 'medium' : 'high',
    
    // Debounce para eventos em dispositivos móveis
    debounceDelay: isMobile ? 300 : 150,
    
    // Throttle para scroll em dispositivos móveis
    scrollThrottle: isMobile ? 100 : 50,
    
    // Batch updates para melhor performance
    batchUpdates: isMobile,
    
    // Preload menos recursos em conexões lentas
    preloadLimit: isSlowConnection ? 2 : isMobile ? 4 : 8,
  }), [isMobile, isSmallMobile, isSlowConnection])

  return performanceConfig
}

// Hook para debounce otimizado
export function useDebounce<T>(value: T, delay: number) {
  const [debouncedValue, setDebouncedValue] = React.useState<T>(value)
  const { debounceDelay } = usePerformanceOptimizations()

  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay || debounceDelay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay, debounceDelay])

  return debouncedValue
}

// Hook para throttle otimizado
export function useThrottle<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T {
  const { scrollThrottle } = usePerformanceOptimizations()
  const lastRun = React.useRef(Date.now())

  return React.useCallback(
    ((...args) => {
      const effectiveDelay = delay || scrollThrottle
      
      if (Date.now() - lastRun.current >= effectiveDelay) {
        callback(...args)
        lastRun.current = Date.now()
      }
    }) as T,
    [callback, delay, scrollThrottle]
  )
}

// Hook para intersection observer otimizado
export function useIntersectionObserver(
  elementRef: React.RefObject<Element>,
  options?: IntersectionObserverInit
) {
  const [isIntersecting, setIsIntersecting] = React.useState(false)
  const { lazyLoadingThreshold } = usePerformanceOptimizations()

  React.useEffect(() => {
    const element = elementRef.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting)
      },
      {
        rootMargin: lazyLoadingThreshold,
        threshold: 0.1,
        ...options,
      }
    )

    observer.observe(element)

    return () => {
      observer.disconnect()
    }
  }, [elementRef, lazyLoadingThreshold, options])

  return isIntersecting
}

// Hook para memoização inteligente baseada em performance
export function useSmartMemo<T>(
  factory: () => T,
  deps: React.DependencyList,
  shouldMemoize?: boolean
): T {
  const { batchUpdates } = usePerformanceOptimizations()
  
  // Se não deve memoizar ou não está em modo de batch updates, calcular sempre
  if (!shouldMemoize && !batchUpdates) {
    return factory()
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  return React.useMemo(factory, deps)
}

// Hook para callback otimizado
export function useSmartCallback<T extends (...args: any[]) => any>(
  callback: T,
  deps: React.DependencyList,
  shouldMemoize?: boolean
): T {
  const { batchUpdates } = usePerformanceOptimizations()
  
  // Se não deve memoizar ou não está em modo de batch updates, retornar callback direto
  if (!shouldMemoize && !batchUpdates) {
    return callback
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  return React.useCallback(callback, deps)
}

// Hook para gerenciamento de recursos críticos
export function useResourceManager() {
  const { preloadLimit, imageQuality } = usePerformanceOptimizations()
  const [loadedResources, setLoadedResources] = React.useState<Set<string>>(new Set())

  const preloadResource = React.useCallback((url: string, type: 'image' | 'font' | 'script' = 'image') => {
    if (loadedResources.has(url) || loadedResources.size >= preloadLimit) {
      return Promise.resolve()
    }

    return new Promise<void>((resolve, reject) => {
      if (type === 'image') {
        const img = new Image()
        img.onload = () => {
          setLoadedResources(prev => new Set(prev).add(url))
          resolve()
        }
        img.onerror = reject
        img.src = url
      } else if (type === 'font') {
        const link = document.createElement('link')
        link.rel = 'preload'
        link.as = 'font'
        link.href = url
        link.crossOrigin = 'anonymous'
        link.onload = () => {
          setLoadedResources(prev => new Set(prev).add(url))
          resolve()
        }
        link.onerror = reject
        document.head.appendChild(link)
      }
    })
  }, [loadedResources, preloadLimit])

  const getOptimizedImageUrl = React.useCallback((url: string) => {
    if (!url || url.startsWith('http')) return url

    const extension = url.split('.').pop()
    const baseName = url.replace(`.${extension}`, '')

    switch (imageQuality) {
      case 'low':
        return `${baseName}-low.${extension}`
      case 'medium':
        return `${baseName}-medium.${extension}`
      default:
        return url
    }
  }, [imageQuality])

  return {
    preloadResource,
    getOptimizedImageUrl,
    loadedResourcesCount: loadedResources.size,
    canPreloadMore: loadedResources.size < preloadLimit
  }
}

// Hook para monitoramento de performance
export function usePerformanceMonitor() {
  const [metrics, setMetrics] = React.useState({
    renderCount: 0,
    lastRenderTime: 0,
    averageRenderTime: 0,
  })

  const startTime = React.useRef<number>(0)

  React.useEffect(() => {
    startTime.current = performance.now()
  })

  React.useEffect(() => {
    const endTime = performance.now()
    const renderTime = endTime - startTime.current

    setMetrics(prev => ({
      renderCount: prev.renderCount + 1,
      lastRenderTime: renderTime,
      averageRenderTime: (prev.averageRenderTime * prev.renderCount + renderTime) / (prev.renderCount + 1)
    }))
  })

  return metrics
}

// Hook para otimização de scroll
export function useOptimizedScroll(callback: (scrollY: number) => void) {
  const { scrollThrottle } = usePerformanceOptimizations()
  const throttledCallback = useThrottle(callback, scrollThrottle)

  React.useEffect(() => {
    const handleScroll = () => {
      throttledCallback(window.scrollY)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [throttledCallback])
}

// Hook para detecção de idle state
export function useIdleDetection(timeout: number = 5000) {
  const [isIdle, setIsIdle] = React.useState(false)
  const timeoutRef = React.useRef<NodeJS.Timeout>()

  const resetTimeout = React.useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    
    setIsIdle(false)
    timeoutRef.current = setTimeout(() => {
      setIsIdle(true)
    }, timeout)
  }, [timeout])

  React.useEffect(() => {
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart']
    
    events.forEach(event => {
      document.addEventListener(event, resetTimeout, { passive: true })
    })

    resetTimeout()

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, resetTimeout)
      })
      
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [resetTimeout])

  return isIdle
}