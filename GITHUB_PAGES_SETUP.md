# 🚀 Guia Completo de Deploy para GitHub Pages

Este guia contém todas as instruções necessárias para configurar e fazer deploy do projeto Print3DPro no GitHub Pages.

## 📋 Pré-requisitos

- [x] Conta no GitHub
- [x] Git instalado localmente
- [x] Node.js 18+ instalado
- [x] npm ou yarn instalado

## 🔧 Configuração Inicial do Repositório

### 1. Criar Repositório no GitHub

1. Acesse [GitHub](https://github.com) e faça login
2. Clique em "New repository"
3. Nome do repositório: `Print3DPro`
4. Marque como "Public" (necessário para GitHub Pages gratuito)
5. NÃO inicialize com README (já temos arquivos locais)
6. Clique em "Create repository"

### 2. Conectar Repositório Local

```bash
# No diretório Print3DPro
git init
git add .
git commit -m "Initial commit: Print3DPro website"
git branch -M main
git remote add origin https://github.com/luckaz13/Print3DPro.git
git push -u origin main
```

## ⚙️ Configuração do GitHub Pages

### 1. Habilitar GitHub Pages

1. Vá para o repositório no GitHub
2. Clique em "Settings" (Configurações)
3. Role para baixo até "Pages" no menu lateral
4. Em "Source", selecione "GitHub Actions"
5. Clique em "Save"

### 2. Configurar Branch Protection (Recomendado)

1. Em "Settings" > "Branches"
2. Clique em "Add rule"
3. Branch name pattern: `main`
4. Marque as opções:
   - [x] Require a pull request before merging
   - [x] Require status checks to pass before merging
   - [x] Require branches to be up to date before merging
   - [x] Include administrators
5. Clique em "Create"

### 3. Configurar Secrets (Se necessário)

Para variáveis de ambiente sensíveis:
1. Vá para "Settings" > "Secrets and variables" > "Actions"
2. Clique em "New repository secret"
3. Adicione as variáveis necessárias

## 🚀 Deploy Automático

### Workflow do GitHub Actions

O arquivo `.github/workflows/deploy.yml` já está configurado e fará:

1. ✅ Checkout do código
2. ✅ Setup do Node.js
3. ✅ Instalação de dependências
4. ✅ Execução de testes
5. ✅ Build para produção
6. ✅ Deploy para GitHub Pages

### Trigger do Deploy

O deploy acontece automaticamente quando:
- Push para branch `main`
- Pull Request para `main`
- Manualmente via GitHub Actions

## 🛠️ Deploy Manual Local

### Usando o Script Personalizado

```bash
# Executar script de deploy
node scripts/deploy.js
```

### Usando npm Scripts

```bash
# Build e deploy
npm run deploy

# Apenas build
npm run build:gh-pages

# Preview local
npm run preview
```

## 🔍 Verificação e Testes

### 1. Testes Automatizados

```bash
# Executar todos os testes
npm test

# Executar testes uma vez
npm run test:run

# Testes com interface
npm run test:ui
```

### 2. Análise de Bundle

```bash
# Analisar tamanho do bundle
npm run bundle-analyzer
```

### 3. Verificação de SEO

```bash
# Executar auditoria Lighthouse
npm run lighthouse

# Verificação completa de SEO
npm run seo-check
```

## 🌐 URLs e Acesso

### URLs do Site

- **Produção**: https://luckaz13.github.io/Print3DPro/
- **Preview Local**: http://localhost:4173

### Verificação de Status

1. GitHub Actions: `https://github.com/luckaz13/Print3DPro/actions`
2. GitHub Pages: Settings > Pages
3. Status do deploy: Será mostrado na página do repositório

## 🔧 Configurações Avançadas

### Domínio Customizado (Opcional)

1. Compre um domínio (ex: print3dpro.com)
2. Configure DNS:
   ```
   Type: CNAME
   Name: www
   Value: luckaz13.github.io
   ```
3. No GitHub: Settings > Pages > Custom domain
4. Digite seu domínio e clique em "Save"
5. Marque "Enforce HTTPS"

### Configuração de SSL

- GitHub Pages fornece SSL automático
- Para domínios customizados, pode levar até 24h para ativar

### Monitoramento

1. **Google Analytics**: Já configurado no código
2. **Google Search Console**: Adicione a propriedade
3. **Uptime Monitoring**: Use serviços como UptimeRobot

## 🐛 Solução de Problemas

### Deploy Falha

1. Verifique os logs em GitHub Actions
2. Certifique-se que os testes passam localmente
3. Verifique se não há erros de build

### Site Não Carrega

1. Verifique se GitHub Pages está habilitado
2. Aguarde até 10 minutos após o deploy
3. Limpe o cache do navegador

### Roteamento SPA Não Funciona

- O arquivo `404.html` já está configurado
- Certifique-se que está na pasta `public`

### Problemas de Cache

```bash
# Limpar cache do npm
npm cache clean --force

# Reinstalar dependências
rm -rf node_modules package-lock.json
npm install
```

## 📊 Métricas e Performance

### Core Web Vitals

O site está otimizado para:
- ✅ Largest Contentful Paint (LCP) < 2.5s
- ✅ First Input Delay (FID) < 100ms
- ✅ Cumulative Layout Shift (CLS) < 0.1

### Lighthouse Score Target

- 🎯 Performance: 90+
- 🎯 Accessibility: 95+
- 🎯 Best Practices: 95+
- 🎯 SEO: 100

## 📝 Manutenção

### Atualizações Regulares

1. **Dependências**: Atualize mensalmente
2. **Conteúdo**: Mantenha informações atualizadas
3. **SEO**: Monitore rankings e otimize
4. **Performance**: Execute auditorias regulares

### Backup

- Código: Versionado no Git
- Configurações: Documentadas neste guia
- Assets: Armazenados no repositório

## 🆘 Suporte

### Recursos Úteis

- [GitHub Pages Docs](https://docs.github.com/en/pages)
- [Vite Docs](https://vitejs.dev/guide/)
- [React Docs](https://react.dev/)

### Contato

Para suporte técnico, abra uma issue no repositório.

---

## ✅ Checklist de Deploy

- [ ] Repositório criado no GitHub
- [ ] Código enviado para o repositório
- [ ] GitHub Pages habilitado
- [ ] Workflow do GitHub Actions funcionando
- [ ] Site acessível na URL
- [ ] Testes passando
- [ ] SEO configurado
- [ ] Performance otimizada
- [ ] Domínio customizado (opcional)
- [ ] Monitoramento configurado

**🎉 Parabéns! Seu site está no ar!**