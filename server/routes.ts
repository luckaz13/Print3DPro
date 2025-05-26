import type { Application, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema } from "@shared/schema";
import {
  budgetRateLimit,
  progressiveRateLimit,
  trackSuspiciousActivity,
  securityHeaders,
  budgetValidation,
  handleValidationErrors,
  sanitizeInput,
  honeypotCheck,
  securityLogger
} from "./middleware/security";
import { emailService } from "./services/emailService";
import analyticsRoutes from "./routes/analytics";

export async function registerRoutes(app: Application): Promise<void> {
  if (process.env.NODE_ENV === 'production' && !process.env.JWT_SECRET) {
    console.error("FATAL ERROR: JWT_SECRET is not defined in production environment. Please set a strong, unique value for the JWT_SECRET environment variable.");
    process.exit(1); // Exit the application with an error code
  }
  // Rota de exemplo: criar usuário com validação Zod
  app.post("/api/users", async (req, res) => {
    const parseResult = insertUserSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({ message: "Dados inválidos", errors: parseResult.error.errors });
    }
    try {
      const user = await storage.createUser(parseResult.data);
      res.status(201).json(user);
    } catch (err: any) {
      res.status(500).json({ message: err.message || "Erro ao criar usuário" });
    }
  });

  // Rota de login com geração de JWT
  app.post("/api/login", async (req, res) => {
    // Validação básica com Zod
    const loginSchema = insertUserSchema.pick({ username: true, password: true });
    const parseResult = loginSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({ message: "Dados inválidos", errors: parseResult.error.errors });
    }
    try {
      const user = await storage.getUserByUsername(parseResult.data.username);
      if (!user || user.password !== parseResult.data.password) {
        return res.status(401).json({ message: "Usuário ou senha inválidos" });
      }
      // Gerar JWT
      const jwt = require("jsonwebtoken");
      const token = jwt.sign(
        { id: user.id, username: user.username },
        process.env.JWT_SECRET as string,
        { expiresIn: "1h" }
      );
      res.json({ token });
    } catch (err: any) {
      res.status(500).json({ message: err.message || "Erro ao autenticar" });
    }
  });

  // Rota para solicitação de orçamento com todas as medidas de segurança
  app.post("/api/budget-request",
    securityLogger,
    securityHeaders,
    budgetRateLimit,
    progressiveRateLimit,
    trackSuspiciousActivity,
    sanitizeInput,
    honeypotCheck,
    budgetValidation,
    handleValidationErrors,
    async (req: Request, res: Response) => {
      try {
        const { fullName, phone, projectDescription } = req.body;
        const timestamp = new Date().toLocaleString('pt-BR', {
          timeZone: 'America/Sao_Paulo',
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        });
        const userIP = req.ip || req.connection.remoteAddress || 'unknown';

        console.log(`[BUDGET REQUEST] ${timestamp} - IP: ${userIP} - Name: ${fullName}`);
        console.log(`[BUDGET DATA] Phone: ${phone}, Project: ${projectDescription.substring(0, 100)}...`);

        // Simular envio de email (sem configuração SMTP)
        // Em produção, descomente as linhas abaixo e configure o .env
        const emailResult = await emailService.sendBudgetRequest({
          fullName,
          phone,
          projectDescription,
          timestamp,
          userIP
        });

        // Adicionar log do resultado do email para depuração, se necessário
        console.log('[BUDGET EMAIL SENT]', emailResult);

        // Resposta simulada de sucesso
        console.log(`[BUDGET SUCCESS] Request logged for ${fullName} from IP: ${userIP}`);
        res.status(200).json({
          success: true,
          message: 'Orçamento recebido com sucesso! Nossa equipe entrará em contato em breve. (Modo desenvolvimento - email não enviado)'
        });

      } catch (error) {
        console.error('[BUDGET CRITICAL ERROR]', error);
        res.status(500).json({
          error: 'Erro interno do servidor',
          message: 'Erro inesperado. Tente novamente ou entre em contato diretamente.'
        });
      }
    }
  );

  // Rota para testar conexão de email (apenas para desenvolvimento)
  if (process.env.NODE_ENV === 'development') {
    app.get("/api/test-email", async (req: Request, res: Response) => {
      try {
        const isConnected = await emailService.testConnection();
        res.json({
          emailService: isConnected ? 'connected' : 'disconnected',
          timestamp: new Date().toISOString()
        });
      } catch (error) {
        res.status(500).json({
          error: 'Failed to test email connection',
          details: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    });
  }

  // Registrar rotas de analytics
  app.use("/api", analyticsRoutes);

  // Removido createServer/app.listen daqui. O servidor deve ser iniciado no arquivo principal.
}
