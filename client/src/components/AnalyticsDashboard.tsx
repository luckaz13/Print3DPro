import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart3, 
  Users, 
  Eye, 
  MousePointer, 
  Clock, 
  TrendingUp,
  Smartphone,
  Monitor,
  Tablet,
  RefreshCw
} from 'lucide-react';

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

interface PopularEvent {
  event: string;
  category: string;
  action: string;
  count: number;
}

interface PerformanceData {
  averageLoadTime: number;
  averageDomContentLoaded: number;
  averageFirstPaint: number;
  performanceDistribution: Array<{ range: string; count: number }>;
}

export const AnalyticsDashboard: React.FC = () => {
  const [stats, setStats] = useState<AnalyticsStats | null>(null);
  const [popularEvents, setPopularEvents] = useState<PopularEvent[]>([]);
  const [performanceData, setPerformanceData] = useState<PerformanceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('7d');

  const fetchAnalyticsData = async () => {
    setLoading(true);
    try {
      // Buscar estatísticas gerais
      const statsResponse = await fetch(`/api/analytics/stats?timeRange=${timeRange}`);
      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setStats(statsData);
      }

      // Buscar eventos populares
      const eventsResponse = await fetch(`/api/analytics/popular-events?timeRange=${timeRange}&limit=10`);
      if (eventsResponse.ok) {
        const eventsData = await eventsResponse.json();
        setPopularEvents(eventsData);
      }

      // Buscar dados de performance
      const performanceResponse = await fetch(`/api/analytics/performance?timeRange=${timeRange}`);
      if (performanceResponse.ok) {
        const perfData = await performanceResponse.json();
        setPerformanceData(perfData);
      }
    } catch (error) {
      console.error('Erro ao buscar dados de analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalyticsData();
  }, [timeRange]);

  const formatDuration = (ms: number): string => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    
    if (minutes > 0) {
      return `${minutes}m ${remainingSeconds}s`;
    }
    return `${remainingSeconds}s`;
  };

  const formatLoadTime = (ms: number): string => {
    if (ms < 1000) {
      return `${Math.round(ms)}ms`;
    }
    return `${(ms / 1000).toFixed(1)}s`;
  };

  const getDeviceIcon = (device: string) => {
    switch (device) {
      case 'mobile':
        return <Smartphone className="w-4 h-4" />;
      case 'tablet':
        return <Tablet className="w-4 h-4" />;
      default:
        return <Monitor className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <RefreshCw className="w-6 h-6 animate-spin mr-2" />
        <span>Carregando dados de analytics...</span>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center p-8">
        <p>Nenhum dado de analytics disponível.</p>
        <Button onClick={fetchAnalyticsData} className="mt-4">
          <RefreshCw className="w-4 h-4 mr-2" />
          Tentar Novamente
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
        <div className="flex items-center space-x-2">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-2 border rounded-md"
          >
            <option value="24h">Últimas 24h</option>
            <option value="7d">Últimos 7 dias</option>
            <option value="30d">Últimos 30 dias</option>
            <option value="90d">Últimos 90 dias</option>
          </select>
          <Button onClick={fetchAnalyticsData} variant="outline" size="sm">
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Cards de Métricas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sessões Totais</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalSessions.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {stats.uniqueUsers} usuários únicos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Visualizações</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalPageViews.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {(stats.totalPageViews / stats.totalSessions).toFixed(1)} por sessão
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Eventos</CardTitle>
            <MousePointer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalEvents.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {(stats.totalEvents / stats.totalSessions).toFixed(1)} por sessão
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Duração Média</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatDuration(stats.averageSessionDuration)}
            </div>
            <p className="text-xs text-muted-foreground">
              Taxa de rejeição: {stats.bounceRate.toFixed(1)}%
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="events">Eventos</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="devices">Dispositivos</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Páginas Mais Visitadas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {stats.topPages.map((page, index) => (
                    <div key={page.page} className="flex items-center justify-between">
                      <span className="text-sm font-medium">
                        {index + 1}. {page.page === '/' ? 'Página Inicial' : page.page}
                      </span>
                      <Badge variant="secondary">{page.views}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Navegadores</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {Object.entries(stats.browserStats)
                    .sort(([, a], [, b]) => b - a)
                    .slice(0, 5)
                    .map(([browser, count]) => (
                      <div key={browser} className="flex items-center justify-between">
                        <span className="text-sm font-medium">{browser}</span>
                        <Badge variant="secondary">{count}</Badge>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="events" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Eventos Mais Populares</CardTitle>
              <CardDescription>
                Interações mais frequentes dos usuários
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {popularEvents.map((event, index) => (
                  <div key={`${event.event}-${index}`} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <div className="font-medium">{event.event}</div>
                      <div className="text-sm text-muted-foreground">
                        {event.category} → {event.action}
                      </div>
                    </div>
                    <Badge variant="outline">{event.count}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          {performanceData && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Métricas de Performance</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span>Tempo de Carregamento:</span>
                    <span className="font-medium">
                      {formatLoadTime(performanceData.averageLoadTime)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>DOM Content Loaded:</span>
                    <span className="font-medium">
                      {formatLoadTime(performanceData.averageDomContentLoaded)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>First Paint:</span>
                    <span className="font-medium">
                      {formatLoadTime(performanceData.averageFirstPaint)}
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Distribuição de Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {performanceData.performanceDistribution.map((range) => (
                      <div key={range.range} className="flex items-center justify-between">
                        <span className="text-sm">{range.range}</span>
                        <Badge variant="secondary">{range.count}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        <TabsContent value="devices" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Dispositivos</CardTitle>
              <CardDescription>
                Distribuição por tipo de dispositivo
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(stats.deviceStats).map(([device, count]) => (
                  <div key={device} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-2">
                      {getDeviceIcon(device)}
                      <span className="font-medium capitalize">{device}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary">{count}</Badge>
                      <span className="text-sm text-muted-foreground">
                        ({((count / stats.totalSessions) * 100).toFixed(1)}%)
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};