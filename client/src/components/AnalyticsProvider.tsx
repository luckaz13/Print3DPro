import React, { createContext, useContext, useEffect, ReactNode } from 'react';
import { useAnalytics, useScrollTracking } from '@/hooks/use-analytics';

interface AnalyticsContextType {
  trackPageView: (page: string, title?: string) => void;
  trackEvent: (
    event: string,
    category: string,
    action: string,
    label?: string,
    value?: number,
    metadata?: Record<string, any>
  ) => void;
  trackClick: (element: string, category?: string) => void;
  trackFormSubmit: (formName: string, success?: boolean) => void;
  trackError: (error: string, category?: string) => void;
  trackTimeOnSection: (section: string, timeSpent: number) => void;
  trackScroll: (percentage: number) => void;
  setUserId: (userId: string) => void;
}

const AnalyticsContext = createContext<AnalyticsContextType | null>(null);

interface AnalyticsProviderProps {
  children: ReactNode;
  enableScrollTracking?: boolean;
  enableErrorTracking?: boolean;
}

export const AnalyticsProvider: React.FC<AnalyticsProviderProps> = ({
  children,
  enableScrollTracking = true,
  enableErrorTracking = true,
}) => {
  const analytics = useAnalytics();

  // Ativar rastreamento de scroll se habilitado
  if (enableScrollTracking) {
    useScrollTracking();
  }

  // Configurar rastreamento global de erros
  useEffect(() => {
    if (!enableErrorTracking) return;

    const handleError = (event: ErrorEvent) => {
      analytics.trackError(
        `${event.message} at ${event.filename}:${event.lineno}:${event.colno}`,
        'javascript_error'
      );
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      analytics.trackError(
        `Unhandled Promise Rejection: ${event.reason}`,
        'promise_rejection'
      );
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, [analytics, enableErrorTracking]);

  // Rastrear performance da página
  useEffect(() => {
    const trackPerformance = () => {
      if ('performance' in window && 'getEntriesByType' in performance) {
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        
        if (navigation) {
          analytics.trackEvent(
            'page_performance',
            'performance',
            'page_load_time',
            'total_load_time',
            Math.round(navigation.loadEventEnd - navigation.fetchStart)
          );

          analytics.trackEvent(
            'page_performance',
            'performance',
            'dom_content_loaded',
            'dom_ready_time',
            Math.round(navigation.domContentLoadedEventEnd - navigation.fetchStart)
          );

          analytics.trackEvent(
            'page_performance',
            'performance',
            'first_paint',
            'first_paint_time',
            Math.round(navigation.responseStart - navigation.fetchStart)
          );
        }
      }
    };

    // Aguardar o carregamento completo da página
    if (document.readyState === 'complete') {
      setTimeout(trackPerformance, 100);
    } else {
      window.addEventListener('load', () => {
        setTimeout(trackPerformance, 100);
      });
    }
  }, [analytics]);

  return (
    <AnalyticsContext.Provider value={analytics}>
      {children}
    </AnalyticsContext.Provider>
  );
};

// Hook para usar o contexto de analytics
export const useAnalyticsContext = (): AnalyticsContextType => {
  const context = useContext(AnalyticsContext);
  if (!context) {
    throw new Error('useAnalyticsContext deve ser usado dentro de um AnalyticsProvider');
  }
  return context;
};

// HOC para adicionar analytics a componentes
export const withAnalytics = <P extends object>(
  Component: React.ComponentType<P>,
  componentName: string
) => {
  const WrappedComponent: React.FC<P> = (props) => {
    const analytics = useAnalyticsContext();

    useEffect(() => {
      analytics.trackEvent(
        'component_mount',
        'component_lifecycle',
        'mount',
        componentName
      );

      return () => {
        analytics.trackEvent(
          'component_unmount',
          'component_lifecycle',
          'unmount',
          componentName
        );
      };
    }, [analytics]);

    return <Component {...props} />;
  };

  WrappedComponent.displayName = `withAnalytics(${componentName})`;
  return WrappedComponent;
};

// Hook para rastrear cliques automaticamente
export const useClickTracking = (elementName: string, category: string = 'interaction') => {
  const { trackClick } = useAnalyticsContext();

  return {
    onClick: () => trackClick(elementName, category),
    onClickCapture: () => trackClick(elementName, category),
  };
};

// Hook para rastrear formulários
export const useFormTracking = (formName: string) => {
  const { trackFormSubmit, trackEvent } = useAnalyticsContext();

  const trackFormStart = () => {
    trackEvent('form_start', 'form_interaction', 'start', formName);
  };

  const trackFormField = (fieldName: string, action: 'focus' | 'blur' | 'change') => {
    trackEvent('form_field', 'form_interaction', action, `${formName}_${fieldName}`);
  };

  const trackFormValidation = (fieldName: string, isValid: boolean) => {
    trackEvent(
      'form_validation',
      'form_interaction',
      isValid ? 'valid' : 'invalid',
      `${formName}_${fieldName}`
    );
  };

  const trackFormSubmission = (success: boolean, errorMessage?: string) => {
    trackFormSubmit(formName, success);
    
    if (!success && errorMessage) {
      trackEvent('form_error', 'form_interaction', 'submit_error', formName, undefined, {
        errorMessage,
      });
    }
  };

  const trackFormAbandonment = (completedFields: string[]) => {
    trackEvent('form_abandonment', 'form_interaction', 'abandon', formName, undefined, {
      completedFields,
      completionRate: completedFields.length,
    });
  };

  return {
    trackFormStart,
    trackFormField,
    trackFormValidation,
    trackFormSubmission,
    trackFormAbandonment,
  };
};

// Hook para rastrear interações com mídia
export const useMediaTracking = (mediaName: string, mediaType: 'image' | 'video' | 'audio') => {
  const { trackEvent } = useAnalyticsContext();

  const trackMediaView = () => {
    trackEvent('media_view', 'media_interaction', 'view', `${mediaType}_${mediaName}`);
  };

  const trackMediaClick = () => {
    trackEvent('media_click', 'media_interaction', 'click', `${mediaType}_${mediaName}`);
  };

  const trackMediaLoad = (loadTime?: number) => {
    trackEvent(
      'media_load',
      'media_interaction',
      'load',
      `${mediaType}_${mediaName}`,
      loadTime
    );
  };

  const trackMediaError = (errorMessage: string) => {
    trackEvent(
      'media_error',
      'media_interaction',
      'error',
      `${mediaType}_${mediaName}`,
      undefined,
      { errorMessage }
    );
  };

  return {
    trackMediaView,
    trackMediaClick,
    trackMediaLoad,
    trackMediaError,
  };
};

// Hook para rastrear navegação
export const useNavigationTracking = () => {
  const { trackEvent } = useAnalyticsContext();

  const trackNavigation = (from: string, to: string, method: 'click' | 'programmatic' = 'click') => {
    trackEvent('navigation', 'navigation', method, `${from}_to_${to}`);
  };

  const trackExternalLink = (url: string, linkText?: string) => {
    trackEvent('external_link', 'navigation', 'click', url, undefined, {
      linkText,
      domain: new URL(url).hostname,
    });
  };

  const trackDownload = (fileName: string, fileType?: string) => {
    trackEvent('download', 'navigation', 'click', fileName, undefined, {
      fileType,
    });
  };

  return {
    trackNavigation,
    trackExternalLink,
    trackDownload,
  };
};