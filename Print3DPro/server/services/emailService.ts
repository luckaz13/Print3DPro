import nodemailer from 'nodemailer';
import type { Transporter } from 'nodemailer';

interface BudgetRequestData {
  fullName: string;
  phone: string;
  projectDescription: string;
  timestamp: string;
  userIP: string;
}

class EmailService {
  private transporter: Transporter | null = null;
  private isConfigured: boolean = false;

  constructor() {
    this.setupTransporter();
  }

  private setupTransporter() {
    try {
      // Configuração SMTP - usando variáveis de ambiente
      this.transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp-mail.outlook.com',
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: false, // true para 465, false para outras portas
        auth: {
          user: process.env.SMTP_USER || 'carossiparts@gmail.com',
          pass: process.env.SMTP_PASS || process.env.EMAIL_PASSWORD
        },
        tls: {
          ciphers: 'SSLv3'
        }
      });

      this.isConfigured = true;
      console.log('Email service configured successfully');
    } catch (error) {
      console.error('Failed to configure email service:', error);
      this.isConfigured = false;
    }
  }

  private generateEmailTemplate(data: BudgetRequestData): string {
    return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Nova Solicitação de Orçamento</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f4f4f4;
        }
        .container {
            background-color: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header {
            text-align: center;
            border-bottom: 3px solid #007bff;
            padding-bottom: 20px;
            margin-bottom: 30px;
        }
        .header h1 {
            color: #007bff;
            margin: 0;
            font-size: 28px;
        }
        .header p {
            color: #666;
            margin: 10px 0 0 0;
            font-size: 16px;
        }
        .info-section {
            margin-bottom: 25px;
        }
        .info-label {
            font-weight: bold;
            color: #333;
            display: block;
            margin-bottom: 5px;
            font-size: 14px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        .info-value {
            background-color: #f8f9fa;
            padding: 12px;
            border-left: 4px solid #007bff;
            margin-bottom: 15px;
            border-radius: 4px;
            font-size: 16px;
        }
        .project-description {
            background-color: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            border-left: 4px solid #28a745;
            white-space: pre-wrap;
            font-size: 15px;
            line-height: 1.7;
        }
        .metadata {
            background-color: #e9ecef;
            padding: 15px;
            border-radius: 8px;
            margin-top: 30px;
            font-size: 13px;
            color: #666;
        }
        .metadata strong {
            color: #333;
        }
        .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #dee2e6;
            color: #666;
            font-size: 14px;
        }
        .priority-badge {
            display: inline-block;
            background-color: #dc3545;
            color: white;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: bold;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎯 Nova Solicitação de Orçamento</h1>
            <p>Print3DPro - Sistema de Orçamentos</p>
            <span class="priority-badge">Alta Prioridade</span>
        </div>

        <div class="info-section">
            <span class="info-label">👤 Nome Completo</span>
            <div class="info-value">${data.fullName}</div>
        </div>

        <div class="info-section">
            <span class="info-label">📞 Telefone para Contato</span>
            <div class="info-value">
                <a href="tel:${data.phone.replace(/\D/g, '')}" style="color: #007bff; text-decoration: none;">
                    ${data.phone}
                </a>
            </div>
        </div>

        <div class="info-section">
            <span class="info-label">📋 Descrição do Projeto</span>
            <div class="project-description">${data.projectDescription}</div>
        </div>

        <div class="metadata">
            <strong>📅 Data e Hora:</strong> ${data.timestamp}<br>
            <strong>🌐 IP do Cliente:</strong> ${data.userIP}<br>
            <strong>📧 Sistema:</strong> Print3DPro Budget System v1.0
        </div>

        <div class="footer">
            <p><strong>Ação Recomendada:</strong> Entre em contato com o cliente em até 24 horas</p>
            <p>Este email foi gerado automaticamente pelo sistema de orçamentos do Print3DPro</p>
        </div>
    </div>
</body>
</html>
    `;
  }

  private generateUserConfirmationTemplate(data: BudgetRequestData): string {
    return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Confirmação de Solicitação de Orçamento</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f4f4f4;
        }
        .container {
            background-color: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header {
            text-align: center;
            border-bottom: 3px solid #28a745;
            padding-bottom: 20px;
            margin-bottom: 30px;
        }
        .header h1 {
            color: #28a745;
            margin: 0;
            font-size: 28px;
        }
        .success-icon {
            font-size: 48px;
            margin-bottom: 15px;
        }
        .message {
            background-color: #d4edda;
            border: 1px solid #c3e6cb;
            color: #155724;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 25px;
            text-align: center;
            font-size: 16px;
        }
        .next-steps {
            background-color: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            border-left: 4px solid #007bff;
        }
        .next-steps h3 {
            color: #007bff;
            margin-top: 0;
        }
        .next-steps ul {
            margin: 15px 0;
            padding-left: 20px;
        }
        .next-steps li {
            margin-bottom: 8px;
        }
        .contact-info {
            background-color: #e7f3ff;
            padding: 20px;
            border-radius: 8px;
            margin-top: 25px;
        }
        .contact-info h3 {
            color: #0066cc;
            margin-top: 0;
        }
        .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #dee2e6;
            color: #666;
            font-size: 14px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="success-icon">✅</div>
            <h1>Orçamento Recebido!</h1>
            <p>Obrigado por escolher a Print3DPro</p>
        </div>

        <div class="message">
            <strong>Olá, ${data.fullName}!</strong><br>
            Recebemos sua solicitação de orçamento com sucesso e nossa equipe já foi notificada.
        </div>

        <div class="next-steps">
            <h3>📋 Próximos Passos:</h3>
            <ul>
                <li><strong>Análise do Projeto:</strong> Nossa equipe técnica analisará sua solicitação</li>
                <li><strong>Contato Inicial:</strong> Entraremos em contato em até 24 horas</li>
                <li><strong>Proposta Personalizada:</strong> Enviaremos um orçamento detalhado</li>
                <li><strong>Desenvolvimento:</strong> Após aprovação, iniciaremos seu projeto</li>
            </ul>
        </div>

        <div class="contact-info">
            <h3>📞 Precisa de Ajuda?</h3>
            <p><strong>WhatsApp:</strong> <a href="https://api.whatsapp.com/send?phone=5554991886962">(54) 99188-6962</a></p>
            <p><strong>Instagram:</strong> <a href="https://www.instagram.com/carossiparts/">@carossiparts</a></p>
            <p><strong>Email:</strong> <a href="mailto:carossiparts@gmail.com">carossiparts@gmail.com</a></p>
        </div>

        <div class="footer">
            <p><strong>Print3DPro</strong> - Transformando suas ideias em realidade</p>
            <p>Este é um email automático, não responda a esta mensagem.</p>
        </div>
    </div>
</body>
</html>
    `;
  }

  async sendBudgetRequest(data: BudgetRequestData): Promise<{ success: boolean; message: string }> {
    if (!this.isConfigured || !this.transporter) {
      console.error('Email service not configured');
      return { success: false, message: 'Serviço de email não configurado' };
    }

    try {
      // Email para o administrador
      const adminMailOptions = {
        from: `"Print3DPro Sistema" <${process.env.SMTP_USER || 'carossiparts@gmail.com'}>`,
        to: 'carossiparts@gmail.com',
        subject: `🎯 Nova Solicitação de Orçamento - ${data.fullName}`,
        html: this.generateEmailTemplate(data),
        priority: 'high' as const,
        headers: {
          'X-Priority': '1',
          'X-MSMail-Priority': 'High',
          'Importance': 'high'
        }
      };

      // Email de confirmação para o usuário
      const userMailOptions = {
        from: `"Print3DPro" <${process.env.SMTP_USER || 'carossiparts@gmail.com'}>`,
        to: data.fullName.includes('@') ? data.fullName : undefined, // Só envia se tiver email
        subject: '✅ Confirmação: Sua solicitação de orçamento foi recebida',
        html: this.generateUserConfirmationTemplate(data)
      };

      // Enviar email para o administrador
      const adminResult = await this.transporter.sendMail(adminMailOptions);
      console.log('Admin email sent successfully:', adminResult.messageId);

      // Tentar enviar email de confirmação para o usuário (se tiver email)
      if (userMailOptions.to && this.transporter) {
        try {
          const userResult = await this.transporter.sendMail(userMailOptions);
          console.log('User confirmation email sent successfully:', userResult.messageId);
        } catch (userEmailError) {
          console.log('User confirmation email failed (non-critical):', userEmailError);
        }
      }

      return { 
        success: true, 
        message: 'Orçamento enviado com sucesso! Entraremos em contato em breve.' 
      };

    } catch (error) {
      console.error('Failed to send budget request email:', error);
      return { 
        success: false, 
        message: 'Erro ao enviar orçamento. Tente novamente ou entre em contato diretamente.' 
      };
    }
  }

  async testConnection(): Promise<boolean> {
    if (!this.isConfigured || !this.transporter) {
      return false;
    }

    try {
      await this.transporter.verify();
      console.log('Email service connection test successful');
      return true;
    } catch (error) {
      console.error('Email service connection test failed:', error);
      return false;
    }
  }
}

export const emailService = new EmailService();