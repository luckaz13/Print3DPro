import { Router } from 'express';
import { z } from 'zod';
import { validateRequest } from '../middleware/validation';
import { analyticsService } from '../services/analyticsService';

const router = Router();

// Schema de validação para eventos de analytics
const AnalyticsEventSchema = z.object({
  event: z.string().min(1).max(100),
  category: z.string().min(1).max(50),
  action: z.string().min(1).max(50),
  label: z.string().optional(),
  value: z.number().optional(),
  timestamp: z.number(),
  sessionId: z.string().min(1).max(100),
  userId: z.string().optional(),
  metadata: z.record(z.any()).optional(),
});

const PageViewEventSchema = z.object({
  page: z.string().min(1).max(200),
  title: z.string().min(1).max(200),
  referrer: z.string().max(500),
  timestamp: z.number(),
  sessionId: z.string().min(1).max(100),
  userId: z.string().optional(),
  viewport: z.object({
    width: z.number(),
    height: z.number(),
  }),
  userAgent: z.string().max(500),
});

const UserSessionSchema = z.object({
  sessionId: z.string().min(1).max(100),
  startTime: z.number(),
  lastActivity: z.number(),
  pageViews: z.number(),
  events: z.number(),
  referrer: z.string().max(500),
  userAgent: z.string().max(500),
  viewport: z.object({
    width: z.number(),
    height: z.number(),
  }),
});

const AnalyticsPayloadSchema = z.object({
  session: UserSessionSchema,
  events: z.array(AnalyticsEventSchema),
  pageViews: z.array(PageViewEventSchema),
  timestamp: z.number(),
});

// Endpoint para receber dados de analytics
router.post('/analytics', validateRequest(AnalyticsPayloadSchema), async (req, res) => {
  try {
    const { session, events, pageViews, timestamp } = req.body;

    // Adicionar informações do IP e User-Agent do servidor
    const clientInfo = {
      ip: req.ip || req.connection.remoteAddress || 'unknown',
      userAgent: req.get('User-Agent') || 'unknown',
      timestamp: Date.now(),
    };

    // Processar dados de analytics
    await analyticsService.processAnalyticsData({
      session,
      events,
      pageViews,
      timestamp,
      clientInfo,
    });

    res.status(200).json({ success: true, message: 'Analytics data processed successfully' });
  } catch (error) {
    console.error('Erro ao processar dados de analytics:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erro interno do servidor ao processar analytics' 
    });
  }
});

// Endpoint para obter estatísticas de analytics (para dashboard admin)
router.get('/analytics/stats', async (req, res) => {
  try {
    const { startDate, endDate, granularity = 'day' } = req.query;

    const stats = await analyticsService.getAnalyticsStats({
      startDate: startDate ? new Date(startDate as string) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 dias atrás
      endDate: endDate ? new Date(endDate as string) : new Date(),
      granularity: granularity as 'hour' | 'day' | 'week' | 'month',
    });

    res.json(stats);
  } catch (error) {
    console.error('Erro ao obter estatísticas de analytics:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erro ao obter estatísticas' 
    });
  }
});

// Endpoint para obter eventos populares
router.get('/analytics/popular-events', async (req, res) => {
  try {
    const { limit = 10, category, timeRange = '7d' } = req.query;

    const popularEvents = await analyticsService.getPopularEvents({
      limit: parseInt(limit as string),
      category: category as string,
      timeRange: timeRange as string,
    });

    res.json(popularEvents);
  } catch (error) {
    console.error('Erro ao obter eventos populares:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erro ao obter eventos populares' 
    });
  }
});

// Endpoint para obter dados de performance
router.get('/analytics/performance', async (req, res) => {
  try {
    const { timeRange = '7d' } = req.query;

    const performanceData = await analyticsService.getPerformanceData({
      timeRange: timeRange as string,
    });

    res.json(performanceData);
  } catch (error) {
    console.error('Erro ao obter dados de performance:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erro ao obter dados de performance' 
    });
  }
});

// Endpoint para obter funil de conversão
router.get('/analytics/conversion-funnel', async (req, res) => {
  try {
    const { timeRange = '30d' } = req.query;

    const funnelData = await analyticsService.getConversionFunnel({
      timeRange: timeRange as string,
    });

    res.json(funnelData);
  } catch (error) {
    console.error('Erro ao obter funil de conversão:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erro ao obter funil de conversão' 
    });
  }
});

// Endpoint para obter dados de usuários únicos
router.get('/analytics/unique-users', async (req, res) => {
  try {
    const { timeRange = '30d', granularity = 'day' } = req.query;

    const uniqueUsersData = await analyticsService.getUniqueUsersData({
      timeRange: timeRange as string,
      granularity: granularity as 'hour' | 'day' | 'week' | 'month',
    });

    res.json(uniqueUsersData);
  } catch (error) {
    console.error('Erro ao obter dados de usuários únicos:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erro ao obter dados de usuários únicos' 
    });
  }
});

export default router;