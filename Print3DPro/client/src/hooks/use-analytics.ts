import { useEffect, useCallback, useRef } from 'react';

// Tipos para eventos de analytics
export interface AnalyticsEvent {
  event: string;
  category: string;
  action: string;
  label?: string;
  value?: number;
  timestamp: number;
  sessionId: string;
  userId?: string;
  metadata?: Record<string, any>;
}

export interface PageViewEvent {
  page: string;
  title: string;
  referrer: string;
  timestamp: number;
  sessionId: string;
  userId?: string;
  viewport: {
    width: number;
    height: number;
  };
  userAgent: string;
}

export interface UserSession {
  sessionId: string;
  startTime: number;
  lastActivity: number;
  pageViews: number;
  events: number;
  referrer: string;
  userAgent: string;
  viewport: {
    width: number;
    height: number;
  };
}

class AnalyticsManager {
  private sessionId: string;
  private userId?: string;
  private session: UserSession;
  private eventQueue: AnalyticsEvent[] = [];
  private pageViewQueue: PageViewEvent[] = [];
  private isOnline: boolean = navigator.onLine;
  private flushInterval: NodeJS.Timeout | null = null;

  constructor() {
    this.sessionId = this.generateSessionId();
    this.session = this.initializeSession();
    this.setupEventListeners();
    this.startPeriodicFlush();
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private initializeSession(): UserSession {
    return {
      sessionId: this.sessionId,
      startTime: Date.now(),
      lastActivity: Date.now(),
      pageViews: 0,
      events: 0,
      referrer: document.referrer,
      userAgent: navigator.userAgent,
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight,
      },
    };
  }

  private setupEventListeners(): void {
    // Detectar mudanças de conectividade
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.flushEvents();
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
    });

    // Detectar mudanças no viewport
    window.addEventListener('resize', () => {
      this.session.viewport = {
        width: window.innerWidth,
        height: window.innerHeight,
      };
    });

    // Flush eventos antes de sair da página
    window.addEventListener('beforeunload', () => {
      this.flushEvents(true);
    });

    // Detectar visibilidade da página
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        this.updateLastActivity();
      }
    });
  }

  private startPeriodicFlush(): void {
    this.flushInterval = setInterval(() => {
      this.flushEvents();
    }, 30000); // Flush a cada 30 segundos
  }

  private updateLastActivity(): void {
    this.session.lastActivity = Date.now();
  }

  // Rastrear visualização de página
  public trackPageView(page: string, title: string = document.title): void {
    this.updateLastActivity();
    this.session.pageViews++;

    const pageViewEvent: PageViewEvent = {
      page,
      title,
      referrer: document.referrer,
      timestamp: Date.now(),
      sessionId: this.sessionId,
      userId: this.userId,
      viewport: { ...this.session.viewport },
      userAgent: navigator.userAgent,
    };

    this.pageViewQueue.push(pageViewEvent);
    this.flushEvents();
  }

  // Rastrear evento personalizado
  public trackEvent(
    event: string,
    category: string,
    action: string,
    label?: string,
    value?: number,
    metadata?: Record<string, any>
  ): void {
    this.updateLastActivity();
    this.session.events++;

    const analyticsEvent: AnalyticsEvent = {
      event,
      category,
      action,
      label,
      value,
      timestamp: Date.now(),
      sessionId: this.sessionId,
      userId: this.userId,
      metadata,
    };

    this.eventQueue.push(analyticsEvent);
    
    // Flush imediatamente para eventos importantes
    if (category === 'conversion' || category === 'error') {
      this.flushEvents();
    }
  }

  // Rastrear clique em elemento
  public trackClick(element: string, category: string = 'interaction'): void {
    this.trackEvent('click', category, 'click', element);
  }


  // Rastrear erro
  public trackError(error: string, category: string = 'error'): void {
    this.trackEvent('error', category, 'error_occurred', error);
  }

  // Rastrear tempo gasto em seção
  public trackTimeOnSection(section: string, timeSpent: number): void {
    this.trackEvent(
      'time_on_section',
      'engagement',
      'section_time',
      section,
      timeSpent
    );
  }

  // Rastrear scroll
  public trackScroll(percentage: number): void {
    if (percentage === 25 || percentage === 50 || percentage === 75 || percentage === 100) {
      this.trackEvent(
        'scroll',
        'engagement',
        'scroll_depth',
        `${percentage}%`,
        percentage
      );
    }
  }

  // Definir ID do usuário
  public setUserId(userId: string): void {
    this.userId = userId;
  }

  // Flush eventos para o servidor
  private async flushEvents(isBeforeUnload: boolean = false): Promise<void> {
    if (!this.isOnline && !isBeforeUnload) return;
    if (this.eventQueue.length === 0 && this.pageViewQueue.length === 0) return;

    const payload = {
      session: this.session,
      events: [...this.eventQueue],
      pageViews: [...this.pageViewQueue],
      timestamp: Date.now(),
    };

    try {
      if (isBeforeUnload) {
        // Usar sendBeacon para envio confiável antes de sair da página
        navigator.sendBeacon('/api/analytics', JSON.stringify(payload));
      } else {
        await fetch('/api/analytics', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });
      }

      // Limpar filas após envio bem-sucedido
      this.eventQueue = [];
      this.pageViewQueue = [];
    } catch (error) {
      console.warn('Falha ao enviar dados de analytics:', error);
      // Manter eventos na fila para tentar novamente
    }
  }

  // Limpar recursos
  public destroy(): void {
    if (this.flushInterval) {
      clearInterval(this.flushInterval);
    }
    this.flushEvents(true);
  }
}

// Instância singleton do gerenciador de analytics
let analyticsManager: AnalyticsManager | null = null;

// Hook principal para usar analytics
export const useAnalytics = () => {
  const managerRef = useRef<AnalyticsManager | null>(null);

  useEffect(() => {
    if (!managerRef.current) {
      managerRef.current = new AnalyticsManager();
      analyticsManager = managerRef.current;
    }

    return () => {
      if (managerRef.current) {
        managerRef.current.destroy();
      }
    };
  }, []);

  const trackPageView = useCallback((page: string, title?: string) => {
    analyticsManager?.trackPageView(page, title);
  }, []);

  const trackEvent = useCallback((
    event: string,
    category: string,
    action: string,
    label?: string,
    value?: number,
    metadata?: Record<string, any>
  ) => {
    analyticsManager?.trackEvent(event, category, action, label, value, metadata);
  }, []);

  const trackClick = useCallback((element: string, category?: string) => {
    analyticsManager?.trackClick(element, category);
  }, []);


  const trackError = useCallback((error: string, category?: string) => {
    analyticsManager?.trackError(error, category);
  }, []);

  const trackTimeOnSection = useCallback((section: string, timeSpent: number) => {
    analyticsManager?.trackTimeOnSection(section, timeSpent);
  }, []);

  const trackScroll = useCallback((percentage: number) => {
    analyticsManager?.trackScroll(percentage);
  }, []);

  const setUserId = useCallback((userId: string) => {
    analyticsManager?.setUserId(userId);
  }, []);

  return {
    trackPageView,
    trackEvent,
    trackClick,
    trackError,
    trackTimeOnSection,
    trackScroll,
    setUserId,
  };
};

// Hook para rastrear automaticamente visualizações de página
export const usePageTracking = (pageName: string, pageTitle?: string) => {
  const { trackPageView } = useAnalytics();

  useEffect(() => {
    trackPageView(pageName, pageTitle);
  }, [pageName, pageTitle, trackPageView]);
};

// Hook para rastrear automaticamente scroll
export const useScrollTracking = () => {
  const { trackScroll } = useAnalytics();
  const lastScrollPercentage = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercentage = Math.round((scrollTop / scrollHeight) * 100);

      if (scrollPercentage > lastScrollPercentage.current) {
        trackScroll(scrollPercentage);
        lastScrollPercentage.current = scrollPercentage;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [trackScroll]);
};

// Hook para rastrear tempo gasto em seções
export const useSectionTracking = (sectionName: string) => {
  const { trackTimeOnSection } = useAnalytics();
  const startTimeRef = useRef<number>(Date.now());
  const isVisibleRef = useRef<boolean>(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !isVisibleRef.current) {
            startTimeRef.current = Date.now();
            isVisibleRef.current = true;
          } else if (!entry.isIntersecting && isVisibleRef.current) {
            const timeSpent = Date.now() - startTimeRef.current;
            if (timeSpent > 1000) { // Só rastrear se passou mais de 1 segundo
              trackTimeOnSection(sectionName, timeSpent);
            }
            isVisibleRef.current = false;
          }
        });
      },
      { threshold: 0.5 }
    );

    const element = document.getElementById(sectionName);
    if (element) {
      observer.observe(element);
    }

    return () => {
      if (element) {
        observer.unobserve(element);
      }
      // Rastrear tempo final se ainda estiver visível
      if (isVisibleRef.current) {
        const timeSpent = Date.now() - startTimeRef.current;
        if (timeSpent > 1000) {
          trackTimeOnSection(sectionName, timeSpent);
        }
      }
    };
  }, [sectionName, trackTimeOnSection]);
};