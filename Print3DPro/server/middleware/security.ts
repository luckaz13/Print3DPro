import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import { body, validationResult } from 'express-validator';
import type { Request, Response, NextFunction } from 'express';

// Rate limiting para formulário de orçamento
export const budgetRateLimit = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora
  max: 3, // máximo 3 submissões por IP por hora
  message: {
    error: 'Muitas tentativas de envio. Tente novamente em 1 hora.',
    retryAfter: 3600
  },
  standardHeaders: true,
  legacyHeaders: false,
  // Função personalizada para identificar usuários
  keyGenerator: (req: Request) => {
    return req.ip || req.connection.remoteAddress || 'unknown';
  },
  // Função para lidar com limite excedido
  handler: (req: Request, res: Response) => {
    console.log(`Rate limit exceeded for IP: ${req.ip} at ${new Date().toISOString()}`);
    res.status(429).json({
      error: 'Muitas tentativas de envio. Tente novamente em 1 hora.',
      retryAfter: 3600
    });
  }
});

// Rate limiting progressivo para tentativas suspeitas
const suspiciousAttempts = new Map<string, { count: number, lastAttempt: number }>();

export const progressiveRateLimit = (req: Request, res: Response, next: NextFunction) => {
  const ip = req.ip || req.connection.remoteAddress || 'unknown';
  const now = Date.now();
  const attempt = suspiciousAttempts.get(ip);

  if (attempt) {
    const timeDiff = now - attempt.lastAttempt;
    const requiredDelay = Math.min(attempt.count * 5000, 60000); // Máximo 1 minuto

    if (timeDiff < requiredDelay) {
      console.log(`Progressive rate limit applied for IP: ${ip}, required delay: ${requiredDelay}ms`);
      return res.status(429).json({
        error: `Aguarde ${Math.ceil((requiredDelay - timeDiff) / 1000)} segundos antes de tentar novamente.`,
        retryAfter: Math.ceil((requiredDelay - timeDiff) / 1000)
      });
    }

    // Reset contador se passou tempo suficiente (1 hora)
    if (timeDiff > 3600000) {
      suspiciousAttempts.delete(ip);
    }
  }

  next();
};

// Middleware para rastrear tentativas suspeitas
export const trackSuspiciousActivity = (req: Request, res: Response, next: NextFunction) => {
  const ip = req.ip || req.connection.remoteAddress || 'unknown';
  
  res.on('finish', () => {
    if (res.statusCode >= 400) {
      const attempt = suspiciousAttempts.get(ip) || { count: 0, lastAttempt: 0 };
      attempt.count += 1;
      attempt.lastAttempt = Date.now();
      suspiciousAttempts.set(ip, attempt);
      
      console.log(`Suspicious activity tracked for IP: ${ip}, count: ${attempt.count}`);
    }
  });
  
  next();
};

// Configuração do Helmet para headers de segurança
export const securityHeaders = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      scriptSrc: ["'self'"],
      connectSrc: ["'self'"],
    },
  },
  crossOriginEmbedderPolicy: false,
});

// Validações do servidor para o formulário de orçamento
export const budgetValidation = [
  body('fullName')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Nome deve ter entre 2 e 100 caracteres')
    .matches(/^[a-zA-ZÀ-ÿ\s]+$/)
    .withMessage('Nome deve conter apenas letras e espaços'),
  
  body('phone')
    .trim()
    .matches(/^\(\d{2}\)\s\d{5}-\d{4}$/)
    .withMessage('Telefone deve estar no formato (00) 00000-0000'),
  
  body('projectDescription')
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Descrição deve ter entre 10 e 1000 caracteres'),
  
  body('honeypot')
    .isEmpty()
    .withMessage('Campo honeypot deve estar vazio'),
];

// Middleware para processar erros de validação
export const handleValidationErrors = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const formattedErrors: Record<string, string> = {};
    
    errors.array().forEach(error => {
      if (error.type === 'field') {
        formattedErrors[error.path] = error.msg;
      }
    });
    
    console.log(`Validation errors for IP ${req.ip}:`, formattedErrors);
    
    return res.status(400).json({
      error: 'Dados inválidos',
      errors: formattedErrors
    });
  }
  
  next();
};

// Middleware para sanitização adicional
export const sanitizeInput = (req: Request, res: Response, next: NextFunction) => {
  if (req.body) {
    // Remover caracteres potencialmente perigosos
    const sanitize = (str: string) => {
      return str
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/<[^>]*>/g, '')
        .trim();
    };

    if (req.body.fullName) req.body.fullName = sanitize(req.body.fullName);
    if (req.body.projectDescription) req.body.projectDescription = sanitize(req.body.projectDescription);
  }
  
  next();
};

// Middleware para detectar bots via honeypot
export const honeypotCheck = (req: Request, res: Response, next: NextFunction) => {
  if (req.body.honeypot && req.body.honeypot.trim() !== '') {
    console.log(`Bot detected via honeypot for IP: ${req.ip}`);
    
    // Simular sucesso para confundir bots
    return res.status(200).json({
      success: true,
      message: 'Orçamento enviado com sucesso!'
    });
  }
  
  next();
};

// Middleware para logging de segurança
export const securityLogger = (req: Request, res: Response, next: NextFunction) => {
  const timestamp = new Date().toISOString();
  const ip = req.ip || req.connection.remoteAddress;
  const userAgent = req.get('User-Agent');
  
  console.log(`[SECURITY] ${timestamp} - IP: ${ip} - ${req.method} ${req.path} - User-Agent: ${userAgent}`);
  
  next();
};