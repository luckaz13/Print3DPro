import fs from 'fs/promises';
import path from 'path';

// Interfaces para os dados de analytics
interface AnalyticsEvent {
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

interface PageViewEvent {
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

interface UserSession {
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

interface AnalyticsData {
  session: UserSession;
  events: AnalyticsEvent[];
  pageViews: PageViewEvent[];
  timestamp: number;
  clientInfo: {
    ip: string;
    userAgent: string;
    timestamp: number;
  };
}

interface AnalyticsStats {
  totalSessions: number;
  totalPageViews: number;
  totalEvents: number;
  uniqueUsers: number;
  averageSessionDuration: number;
  bounceRate: number;
  topPages: Array<{ page: string; views: number }>;
  topEvents: Array<{ event: string; count: number }>;
  deviceStats: {
    desktop: number;
    mobile: number;
    tablet: number;
  };
  browserStats: Record<string, number>;
  timeSeriesData: Array<{
    date: string;
    sessions: number;
    pageViews: number;
    events: number;
  }>;
}

class AnalyticsService {
  private dataDir: string;
  private sessionsFile: string;
  private eventsFile: string;
  private pageViewsFile: string;

  constructor() {
    this.dataDir = path.join(process.cwd(), 'data', 'analytics');
    this.sessionsFile = path.join(this.dataDir, 'sessions.jsonl');
    this.eventsFile = path.join(this.dataDir, 'events.jsonl');
    this.pageViewsFile = path.join(this.dataDir, 'pageviews.jsonl');
    this.ensureDataDirectory();
  }

  private async ensureDataDirectory(): Promise<void> {
    try {
      await fs.mkdir(this.dataDir, { recursive: true });
    } catch (error) {
      console.error('Erro ao criar diretório de dados:', error);
    }
  }

  private async appendToFile(filePath: string, data: any): Promise<void> {
    try {
      const jsonLine = JSON.stringify(data) + '\n';
      await fs.appendFile(filePath, jsonLine, 'utf8');
    } catch (error) {
      console.error(`Erro ao escrever no arquivo ${filePath}:`, error);
    }
  }

  private async readJsonLines(filePath: string): Promise<any[]> {
    try {
      const content = await fs.readFile(filePath, 'utf8');
      return content
        .split('\n')
        .filter(line => line.trim())
        .map(line => JSON.parse(line));
    } catch (error) {
      if ((error as any).code === 'ENOENT') {
        return [];
      }
      console.error(`Erro ao ler arquivo ${filePath}:`, error);
      return [];
    }
  }

  private detectDeviceType(userAgent: string): 'desktop' | 'mobile' | 'tablet' {
    const ua = userAgent.toLowerCase();
    
    if (ua.includes('tablet') || ua.includes('ipad')) {
      return 'tablet';
    }
    
    if (ua.includes('mobile') || ua.includes('android') || ua.includes('iphone')) {
      return 'mobile';
    }
    
    return 'desktop';
  }

  private extractBrowser(userAgent: string): string {
    const ua = userAgent.toLowerCase();
    
    if (ua.includes('chrome') && !ua.includes('edge')) return 'Chrome';
    if (ua.includes('firefox')) return 'Firefox';
    if (ua.includes('safari') && !ua.includes('chrome')) return 'Safari';
    if (ua.includes('edge')) return 'Edge';
    if (ua.includes('opera')) return 'Opera';
    
    return 'Other';
  }

  public async processAnalyticsData(data: AnalyticsData): Promise<void> {
    try {
      // Enriquecer dados da sessão
      const enrichedSession = {
        ...data.session,
        clientIp: data.clientInfo.ip,
        serverTimestamp: data.clientInfo.timestamp,
        deviceType: this.detectDeviceType(data.session.userAgent),
        browser: this.extractBrowser(data.session.userAgent),
      };

      // Salvar sessão
      await this.appendToFile(this.sessionsFile, enrichedSession);

      // Salvar eventos
      for (const event of data.events) {
        const enrichedEvent = {
          ...event,
          clientIp: data.clientInfo.ip,
          serverTimestamp: data.clientInfo.timestamp,
          deviceType: this.detectDeviceType(data.session.userAgent),
          browser: this.extractBrowser(data.session.userAgent),
        };
        await this.appendToFile(this.eventsFile, enrichedEvent);
      }

      // Salvar page views
      for (const pageView of data.pageViews) {
        const enrichedPageView = {
          ...pageView,
          clientIp: data.clientInfo.ip,
          serverTimestamp: data.clientInfo.timestamp,
          deviceType: this.detectDeviceType(pageView.userAgent),
          browser: this.extractBrowser(pageView.userAgent),
        };
        await this.appendToFile(this.pageViewsFile, enrichedPageView);
      }

      console.log(`Analytics processados: ${data.events.length} eventos, ${data.pageViews.length} page views`);
    } catch (error) {
      console.error('Erro ao processar dados de analytics:', error);
      throw error;
    }
  }

  public async getAnalyticsStats(options: {
    startDate: Date;
    endDate: Date;
    granularity: 'hour' | 'day' | 'week' | 'month';
  }): Promise<AnalyticsStats> {
    try {
      const sessions = await this.readJsonLines(this.sessionsFile);
      const events = await this.readJsonLines(this.eventsFile);
      const pageViews = await this.readJsonLines(this.pageViewsFile);

      // Filtrar por data
      const filteredSessions = sessions.filter(s => 
        s.startTime >= options.startDate.getTime() && 
        s.startTime <= options.endDate.getTime()
      );

      const filteredEvents = events.filter(e => 
        e.timestamp >= options.startDate.getTime() && 
        e.timestamp <= options.endDate.getTime()
      );

      const filteredPageViews = pageViews.filter(pv => 
        pv.timestamp >= options.startDate.getTime() && 
        pv.timestamp <= options.endDate.getTime()
      );

      // Calcular estatísticas
      const uniqueUsers = new Set(filteredSessions.map(s => s.sessionId)).size;
      const totalSessionDuration = filteredSessions.reduce((sum, s) => 
        sum + (s.lastActivity - s.startTime), 0
      );
      const averageSessionDuration = totalSessionDuration / filteredSessions.length || 0;

      // Calcular bounce rate (sessões com apenas 1 page view)
      const singlePageSessions = filteredSessions.filter(s => s.pageViews === 1).length;
      const bounceRate = (singlePageSessions / filteredSessions.length) * 100 || 0;

      // Top páginas
      const pageViewCounts = filteredPageViews.reduce((acc, pv) => {
        acc[pv.page] = (acc[pv.page] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const topPages = Object.entries(pageViewCounts)
        .sort(([, a], [, b]) => (b as number) - (a as number))
        .slice(0, 10)
        .map(([page, views]) => ({ page, views: views as number }));

      // Top eventos
      const eventCounts = filteredEvents.reduce((acc, e) => {
        const key = `${e.category}:${e.action}`;
        acc[key] = (acc[key] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const topEvents = Object.entries(eventCounts)
        .sort(([, a], [, b]) => (b as number) - (a as number))
        .slice(0, 10)
        .map(([event, count]) => ({ event, count: count as number }));

      // Estatísticas de dispositivos
      const deviceStats = filteredSessions.reduce((acc, s) => {
        const deviceType = s.deviceType || 'desktop';
        acc[deviceType as keyof typeof acc] = (acc[deviceType as keyof typeof acc] || 0) + 1;
        return acc;
      }, { desktop: 0, mobile: 0, tablet: 0 });

      // Estatísticas de navegadores
      const browserStats = filteredSessions.reduce((acc, s) => {
        const browser = s.browser || 'Other';
        acc[browser] = (acc[browser] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      // Dados de série temporal
      const timeSeriesData = this.generateTimeSeriesData(
        filteredSessions,
        filteredPageViews,
        filteredEvents,
        options.startDate,
        options.endDate,
        options.granularity
      );

      return {
        totalSessions: filteredSessions.length,
        totalPageViews: filteredPageViews.length,
        totalEvents: filteredEvents.length,
        uniqueUsers,
        averageSessionDuration,
        bounceRate,
        topPages,
        topEvents,
        deviceStats,
        browserStats,
        timeSeriesData,
      };
    } catch (error) {
      console.error('Erro ao obter estatísticas de analytics:', error);
      throw error;
    }
  }

  private generateTimeSeriesData(
    sessions: any[],
    pageViews: any[],
    events: any[],
    startDate: Date,
    endDate: Date,
    granularity: 'hour' | 'day' | 'week' | 'month'
  ): Array<{ date: string; sessions: number; pageViews: number; events: number }> {
    const data: Record<string, { sessions: number; pageViews: number; events: number }> = {};

    // Função para formatar data baseada na granularidade
    const formatDate = (timestamp: number): string => {
      const date = new Date(timestamp);
      switch (granularity) {
        case 'hour':
          return date.toISOString().slice(0, 13) + ':00:00.000Z';
        case 'day':
          return date.toISOString().slice(0, 10);
        case 'week':
          const weekStart = new Date(date);
          weekStart.setDate(date.getDate() - date.getDay());
          return weekStart.toISOString().slice(0, 10);
        case 'month':
          return date.toISOString().slice(0, 7);
        default:
          return date.toISOString().slice(0, 10);
      }
    };

    // Processar sessões
    sessions.forEach(session => {
      const key = formatDate(session.startTime);
      if (!data[key]) data[key] = { sessions: 0, pageViews: 0, events: 0 };
      data[key].sessions++;
    });

    // Processar page views
    pageViews.forEach(pv => {
      const key = formatDate(pv.timestamp);
      if (!data[key]) data[key] = { sessions: 0, pageViews: 0, events: 0 };
      data[key].pageViews++;
    });

    // Processar eventos
    events.forEach(event => {
      const key = formatDate(event.timestamp);
      if (!data[key]) data[key] = { sessions: 0, pageViews: 0, events: 0 };
      data[key].events++;
    });

    return Object.entries(data)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, stats]) => ({ date, ...stats }));
  }

  public async getPopularEvents(options: {
    limit: number;
    category?: string;
    timeRange: string;
  }): Promise<Array<{ event: string; category: string; action: string; count: number }>> {
    try {
      const events = await this.readJsonLines(this.eventsFile);
      const cutoffTime = this.getTimeRangeCutoff(options.timeRange);

      const filteredEvents = events.filter(e => 
        e.timestamp >= cutoffTime &&
        (!options.category || e.category === options.category)
      );

      const eventCounts = filteredEvents.reduce((acc, e) => {
        const key = `${e.event}:${e.category}:${e.action}`;
        acc[key] = (acc[key] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      return Object.entries(eventCounts)
        .sort(([, a], [, b]) => (b as number) - (a as number))
        .slice(0, options.limit)
        .map(([key, count]) => {
          const [event, category, action] = key.split(':');
          return { event, category, action, count: count as number };
        });
    } catch (error) {
      console.error('Erro ao obter eventos populares:', error);
      throw error;
    }
  }

  public async getPerformanceData(options: {
    timeRange: string;
  }): Promise<{
    averageLoadTime: number;
    averageDomContentLoaded: number;
    averageFirstPaint: number;
    performanceDistribution: Array<{ range: string; count: number }>;
  }> {
    try {
      const events = await this.readJsonLines(this.eventsFile);
      const cutoffTime = this.getTimeRangeCutoff(options.timeRange);

      const performanceEvents = events.filter(e => 
        e.timestamp >= cutoffTime &&
        e.category === 'performance'
      );

      const loadTimes = performanceEvents
        .filter(e => e.action === 'page_load_time')
        .map(e => e.value)
        .filter(v => v !== undefined);

      const domTimes = performanceEvents
        .filter(e => e.action === 'dom_content_loaded')
        .map(e => e.value)
        .filter(v => v !== undefined);

      const paintTimes = performanceEvents
        .filter(e => e.action === 'first_paint')
        .map(e => e.value)
        .filter(v => v !== undefined);

      const averageLoadTime = loadTimes.reduce((sum, time) => sum + time, 0) / loadTimes.length || 0;
      const averageDomContentLoaded = domTimes.reduce((sum, time) => sum + time, 0) / domTimes.length || 0;
      const averageFirstPaint = paintTimes.reduce((sum, time) => sum + time, 0) / paintTimes.length || 0;

      // Distribuição de performance
      const ranges = [
        { min: 0, max: 1000, label: '0-1s' },
        { min: 1000, max: 2000, label: '1-2s' },
        { min: 2000, max: 3000, label: '2-3s' },
        { min: 3000, max: 5000, label: '3-5s' },
        { min: 5000, max: Infinity, label: '5s+' },
      ];

      const performanceDistribution = ranges.map(range => ({
        range: range.label,
        count: loadTimes.filter(time => time >= range.min && time < range.max).length,
      }));

      return {
        averageLoadTime,
        averageDomContentLoaded,
        averageFirstPaint,
        performanceDistribution,
      };
    } catch (error) {
      console.error('Erro ao obter dados de performance:', error);
      throw error;
    }
  }

  public async getConversionFunnel(options: {
    timeRange: string;
  }): Promise<Array<{ step: string; users: number; conversionRate: number }>> {
    try {
      const events = await this.readJsonLines(this.eventsFile);
      const pageViews = await this.readJsonLines(this.pageViewsFile);
      const cutoffTime = this.getTimeRangeCutoff(options.timeRange);

      const filteredEvents = events.filter(e => e.timestamp >= cutoffTime);
      const filteredPageViews = pageViews.filter(pv => pv.timestamp >= cutoffTime);

      // Definir etapas do funil
      const steps = [
        { name: 'Visitantes', filter: () => true },
        { name: 'Visualizou Portfólio', filter: (pv: any) => pv.page.includes('portfolio') || pv.page === '/' },
        { name: 'Visualizou Orçamento', filter: (e: any) => e.category === 'form_interaction' && e.action === 'start' },
        { name: 'Preencheu Formulário', filter: (e: any) => e.category === 'form_interaction' && e.action === 'change' },
        { name: 'Enviou Orçamento', filter: (e: any) => e.category === 'conversion' && e.action === 'submit_success' },
      ];

      const uniqueUsers = new Set([
        ...filteredPageViews.map(pv => pv.sessionId),
        ...filteredEvents.map(e => e.sessionId)
      ]);

      const totalUsers = uniqueUsers.size;
      let previousStepUsers = totalUsers;

      const funnelData = steps.map((step, index) => {
        let users: number;

        if (index === 0) {
          users = totalUsers;
        } else if (index === 1) {
          const portfolioUsers = new Set(
            filteredPageViews
              .filter(step.filter)
              .map(pv => pv.sessionId)
          );
          users = portfolioUsers.size;
        } else {
          const stepUsers = new Set(
            filteredEvents
              .filter(step.filter)
              .map(e => e.sessionId)
          );
          users = stepUsers.size;
        }

        const conversionRate = previousStepUsers > 0 ? (users / previousStepUsers) * 100 : 0;
        previousStepUsers = users;

        return {
          step: step.name,
          users,
          conversionRate: index === 0 ? 100 : conversionRate,
        };
      });

      return funnelData;
    } catch (error) {
      console.error('Erro ao obter funil de conversão:', error);
      throw error;
    }
  }

  public async getUniqueUsersData(options: {
    timeRange: string;
    granularity: 'hour' | 'day' | 'week' | 'month';
  }): Promise<Array<{ date: string; uniqueUsers: number; newUsers: number; returningUsers: number }>> {
    try {
      const sessions = await this.readJsonLines(this.sessionsFile);
      const cutoffTime = this.getTimeRangeCutoff(options.timeRange);

      const filteredSessions = sessions.filter(s => s.startTime >= cutoffTime);

      // Agrupar por data
      const groupedData: Record<string, Set<string>> = {};
      const allTimeUsers = new Set<string>();

      // Primeiro, coletar todos os usuários históricos para identificar novos vs retornantes
      const allSessions = await this.readJsonLines(this.sessionsFile);
      allSessions.forEach(session => {
        if (session.startTime < cutoffTime) {
          allTimeUsers.add(session.sessionId);
        }
      });

      filteredSessions.forEach(session => {
        const date = this.formatDateByGranularity(session.startTime, options.granularity);
        if (!groupedData[date]) {
          groupedData[date] = new Set();
        }
        groupedData[date].add(session.sessionId);
      });

      return Object.entries(groupedData)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([date, users]) => {
          const uniqueUsers = users.size;
          const newUsers = Array.from(users).filter(user => !allTimeUsers.has(user)).length;
          const returningUsers = uniqueUsers - newUsers;

          return {
            date,
            uniqueUsers,
            newUsers,
            returningUsers,
          };
        });
    } catch (error) {
      console.error('Erro ao obter dados de usuários únicos:', error);
      throw error;
    }
  }

  private getTimeRangeCutoff(timeRange: string): number {
    const now = Date.now();
    const ranges: Record<string, number> = {
      '1h': 60 * 60 * 1000,
      '24h': 24 * 60 * 60 * 1000,
      '7d': 7 * 24 * 60 * 60 * 1000,
      '30d': 30 * 24 * 60 * 60 * 1000,
      '90d': 90 * 24 * 60 * 60 * 1000,
    };

    return now - (ranges[timeRange] || ranges['7d']);
  }

  private formatDateByGranularity(timestamp: number, granularity: 'hour' | 'day' | 'week' | 'month'): string {
    const date = new Date(timestamp);
    switch (granularity) {
      case 'hour':
        return date.toISOString().slice(0, 13) + ':00:00.000Z';
      case 'day':
        return date.toISOString().slice(0, 10);
      case 'week':
        const weekStart = new Date(date);
        weekStart.setDate(date.getDate() - date.getDay());
        return weekStart.toISOString().slice(0, 10);
      case 'month':
        return date.toISOString().slice(0, 7);
      default:
        return date.toISOString().slice(0, 10);
    }
  }
}

export const analyticsService = new AnalyticsService();