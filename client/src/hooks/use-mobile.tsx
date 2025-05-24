import * as React from "react"

// Breakpoints customizados para diferentes dispositivos
const MOBILE_BREAKPOINT = 768
const TABLET_BREAKPOINT = 1024
const SMALL_MOBILE_BREAKPOINT = 640

// Tipos para melhor tipagem
interface DeviceInfo {
  isMobile: boolean
  isTablet: boolean
  isDesktop: boolean
  isSmallMobile: boolean
  orientation: 'portrait' | 'landscape' | null
  deviceType: 'ios' | 'android' | 'desktop' | 'unknown'
  hasTouch: boolean
  screenWidth: number
  screenHeight: number
}

// Hook principal para detecção mobile
export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean>(false)

  React.useEffect(() => {
    // Função para determinar se é mobile
    const checkIsMobile = () => {
      const width = window.innerWidth
      return width < MOBILE_BREAKPOINT
    }

    // Definir estado inicial
    setIsMobile(checkIsMobile())

    // Media query listener
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => {
      setIsMobile(checkIsMobile())
    }

    mql.addEventListener("change", onChange)
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return isMobile
}

// Hook avançado para informações completas do dispositivo
export function useDeviceInfo(): DeviceInfo {
  const [deviceInfo, setDeviceInfo] = React.useState<DeviceInfo>(() => {
    // Estado inicial para evitar flash de conteúdo incorreto
    if (typeof window === 'undefined') {
      return {
        isMobile: false,
        isTablet: false,
        isDesktop: true,
        isSmallMobile: false,
        orientation: null,
        deviceType: 'unknown',
        hasTouch: false,
        screenWidth: 1024,
        screenHeight: 768,
      }
    }

    const width = window.innerWidth
    const height = window.innerHeight
    
    return {
      isMobile: width < MOBILE_BREAKPOINT,
      isTablet: width >= MOBILE_BREAKPOINT && width < TABLET_BREAKPOINT,
      isDesktop: width >= TABLET_BREAKPOINT,
      isSmallMobile: width < SMALL_MOBILE_BREAKPOINT,
      orientation: height > width ? 'portrait' : 'landscape',
      deviceType: getDeviceType(),
      hasTouch: 'ontouchstart' in window || navigator.maxTouchPoints > 0,
      screenWidth: width,
      screenHeight: height,
    }
  })

  React.useEffect(() => {
    const updateDeviceInfo = () => {
      const width = window.innerWidth
      const height = window.innerHeight
      
      setDeviceInfo({
        isMobile: width < MOBILE_BREAKPOINT,
        isTablet: width >= MOBILE_BREAKPOINT && width < TABLET_BREAKPOINT,
        isDesktop: width >= TABLET_BREAKPOINT,
        isSmallMobile: width < SMALL_MOBILE_BREAKPOINT,
        orientation: height > width ? 'portrait' : 'landscape',
        deviceType: getDeviceType(),
        hasTouch: 'ontouchstart' in window || navigator.maxTouchPoints > 0,
        screenWidth: width,
        screenHeight: height,
      })
    }

    // Listeners para mudanças
    window.addEventListener('resize', updateDeviceInfo)
    window.addEventListener('orientationchange', updateDeviceInfo)

    // Cleanup
    return () => {
      window.removeEventListener('resize', updateDeviceInfo)
      window.removeEventListener('orientationchange', updateDeviceInfo)
    }
  }, [])

  return deviceInfo
}

// Hook para detecção de orientação
export function useOrientation() {
  const [orientation, setOrientation] = React.useState<'portrait' | 'landscape'>(() => {
    if (typeof window === 'undefined') return 'landscape'
    return window.innerHeight > window.innerWidth ? 'portrait' : 'landscape'
  })

  React.useEffect(() => {
    const updateOrientation = () => {
      setOrientation(window.innerHeight > window.innerWidth ? 'portrait' : 'landscape')
    }

    window.addEventListener('resize', updateOrientation)
    window.addEventListener('orientationchange', updateOrientation)

    return () => {
      window.removeEventListener('resize', updateOrientation)
      window.removeEventListener('orientationchange', updateOrientation)
    }
  }, [])

  return orientation
}

// Hook para detecção de capacidade de touch
export function useHasTouch() {
  const [hasTouch, setHasTouch] = React.useState<boolean>(() => {
    if (typeof window === 'undefined') return false
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0
  })

  React.useEffect(() => {
    // Detectar mudanças na capacidade de touch (dispositivos híbridos)
    const checkTouch = () => {
      setHasTouch('ontouchstart' in window || navigator.maxTouchPoints > 0)
    }

    // Verificar periodicamente para dispositivos híbridos
    const interval = setInterval(checkTouch, 1000)

    return () => clearInterval(interval)
  }, [])

  return hasTouch
}

// Hook para detecção de conexão lenta
export function useSlowConnection() {
  const [isSlowConnection, setIsSlowConnection] = React.useState<boolean>(false)

  React.useEffect(() => {
    if ('connection' in navigator) {
      const connection = (navigator as any).connection
      
      const updateConnectionStatus = () => {
        if (connection) {
          const slowTypes = ['slow-2g', '2g']
          setIsSlowConnection(
            slowTypes.includes(connection.effectiveType) || 
            connection.downlink < 1.5
          )
        }
      }

      updateConnectionStatus()
      connection.addEventListener('change', updateConnectionStatus)

      return () => {
        connection.removeEventListener('change', updateConnectionStatus)
      }
    }
  }, [])

  return isSlowConnection
}

// Função auxiliar para detectar tipo de dispositivo
function getDeviceType(): 'ios' | 'android' | 'desktop' | 'unknown' {
  if (typeof window === 'undefined') return 'unknown'
  
  const userAgent = navigator.userAgent.toLowerCase()
  
  if (/iphone|ipad|ipod/.test(userAgent)) {
    return 'ios'
  } else if (/android/.test(userAgent)) {
    return 'android'
  } else if (!/mobile|tablet/.test(userAgent)) {
    return 'desktop'
  }
  
  return 'unknown'
}

// Hook para detecção de preferência de modo escuro
export function usePrefersDarkMode() {
  const [prefersDark, setPrefersDark] = React.useState<boolean>(() => {
    if (typeof window === 'undefined') return false
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  })

  React.useEffect(() => {
    const mql = window.matchMedia('(prefers-color-scheme: dark)')
    const onChange = (e: MediaQueryListEvent) => {
      setPrefersDark(e.matches)
    }

    mql.addEventListener('change', onChange)
    return () => mql.removeEventListener('change', onChange)
  }, [])

  return prefersDark
}

// Hook para detecção de movimento reduzido (acessibilidade)
export function usePrefersReducedMotion() {
  const [prefersReduced, setPrefersReduced] = React.useState<boolean>(() => {
    if (typeof window === 'undefined') return false
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
  })

  React.useEffect(() => {
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)')
    const onChange = (e: MediaQueryListEvent) => {
      setPrefersReduced(e.matches)
    }

    mql.addEventListener('change', onChange)
    return () => mql.removeEventListener('change', onChange)
  }, [])

  return prefersReduced
}
