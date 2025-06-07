import type { Application, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema } from "@shared/schema";
import {
  securityHeaders,
  handleValidationErrors,
  sanitizeInput,
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



  // Registrar rotas de analytics
  app.use("/api", analyticsRoutes);

  // Removido createServer/app.listen daqui. O servidor deve ser iniciado no arquivo principal.
}
