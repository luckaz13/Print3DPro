import "dotenv/config";
import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import cors from "cors";

const app = express();

// Configuração de CORS
app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? ['https://luckaz13.github.io' /* Adicionar novo domínio de produção aqui ou via process.env.PROD_CORS_ORIGIN */]
    : true, // Permite todas as origens em desenvolvimento
  credentials: true
}));

// Middleware para parsing de JSON com limite de tamanho
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: false, limit: '10mb' }));

// Trust proxy para obter IP real
app.set('trust proxy', 1);

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // Setup Vite ou arquivos estáticos conforme ambiente
  const port = parseInt(process.env.PORT || "5000", 10);
  if (app.get("env") === "development") {
    const { createServer } = await import("http");
    const server = createServer(app);
    await setupVite(app, server);
    server.listen(port, "0.0.0.0", () => {
      log(`serving on port ${port}`);
    });
  } else {
    serveStatic(app);
    app.listen(port, "0.0.0.0", () => {
      log(`serving on port ${port}`);
    });
  }
})();
