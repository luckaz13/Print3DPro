# Print3DPro - Website CarossiParts

Website moderno e responsivo para empresa de impressão 3D, desenvolvido com React, TypeScript e Vite.

## 🚀 Funcionalidades

- **Interface Moderna**: Design limpo e profissional
- **Responsivo**: Adaptado para desktop, tablet e mobile
- **Navegação Suave**: Scroll automático entre seções
- **Galeria Interativa**: Portfólio com filtros por categoria
- **Formulário de Orçamento**: Sistema de cotação integrado
- **Links Sociais**: Integração com WhatsApp, Shopee, Mercado Livre

## 🛠️ Tecnologias

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS + shadcn/ui
- **Roteamento**: Wouter
- **Backend**: Express.js + Node.js
- **Banco de Dados**: PostgreSQL + Drizzle ORM
- **Testes**: Vitest + Testing Library

## 📦 Instalação

```bash
# Clone o repositório
git clone <repository-url>

# Instale as dependências
cd Print3DPro
npm install

# Configure as variáveis de ambiente
cp .env.example .env

# Execute o projeto em desenvolvimento
npm run dev
```

## 🧪 Testes

```bash
# Executar todos os testes
npm run test

# Executar testes em modo watch
npm run test:watch

# Executar testes com interface gráfica
npm run test:ui

# Executar testes uma vez
npm run test:run
```

## 🏗️ Build e Deploy

### 🚀 Deploy no GitHub Pages

O projeto está configurado para deploy automático no GitHub Pages:

```bash
# Build otimizado para GitHub Pages
npm run build:gh-pages

# Preview local do build
npm run preview

# Deploy manual (se necessário)
npm run deploy
```

**URL de Produção**: `https://[seu-usuario].github.io/Print3DPro/`

### ⚙️ Configuração Automática
- ✅ GitHub Actions configurado
- ✅ Deploy automático no push para `main`
- ✅ Build otimizado com Terser
- ✅ Bundle splitting implementado
- ✅ PWA features ativas
- ✅ Service Worker para cache offline

### 📊 Performance Otimizada
- **Bundle Sizes**:
  - Vendor: ~140KB (gzipped: ~45KB)
  - Main: ~126KB (gzipped: ~37KB)
  - UI: ~50KB (gzipped: ~17KB)
  - CSS: ~81KB (gzipped: ~13KB)

### 🔧 Build Local
```bash
# Build para produção local
npm run build

# Executar em produção
npm start
```

Para mais detalhes, consulte o [DEPLOY_GUIDE.md](./DEPLOY_GUIDE.md).

## 📁 Estrutura do Projeto

```
Print3DPro/
├── client/                 # Frontend React
│   ├── src/
│   │   ├── components/     # Componentes React
│   │   ├── pages/         # Páginas da aplicação
│   │   ├── lib/           # Utilitários e configurações
│   │   ├── assets/        # Recursos estáticos
│   │   └── test/          # Configuração de testes
├── server/                # Backend Express
├── shared/                # Código compartilhado
└── tests/                 # Testes automatizados
```

## ✨ Melhorias Implementadas

### 🐛 Correções
- **DOM Nesting Warning**: Corrigido problema de `<a>` aninhados no Navbar
- **Browserslist**: Atualizado para versão mais recente
- **Configuração de Porta**: Ajustada para evitar conflitos

### 🔄 Loading States
- **Componente Loading**: Spinner reutilizável com diferentes tamanhos
- **ImageWithLoading**: Carregamento progressivo de imagens
- **Estados de Erro**: Fallback para imagens que falham ao carregar

### 🛡️ Tratamento de Erros
- **Error Boundary**: Captura e trata erros React de forma elegante
- **Fallback UI**: Interface amigável para erros
- **Logs de Desenvolvimento**: Informações detalhadas em modo dev

### 🧪 Testes Automatizados
- **Vitest**: Framework de testes moderno e rápido
- **Testing Library**: Testes focados no comportamento do usuário
- **Mocks**: Simulação de dependências externas
- **Coverage**: Relatórios de cobertura de código

## 🎯 Scripts Disponíveis

- `npm run dev` - Servidor de desenvolvimento
- `npm run build` - Build para produção
- `npm run start` - Executar em produção
- `npm run test` - Executar testes
- `npm run check` - Verificação de tipos TypeScript
- `npm run db:push` - Sincronizar schema do banco

## 🌐 Variáveis de Ambiente

```env
NODE_ENV=development
DATABASE_URL=postgresql://...
PORT=5000
```

## 📱 Responsividade

O site é totalmente responsivo e otimizado para:
- **Desktop**: 1200px+
- **Tablet**: 768px - 1199px
- **Mobile**: < 768px

## 🎨 Componentes UI

Utilizamos a biblioteca shadcn/ui com componentes customizados:
- Buttons, Cards, Modals
- Forms, Inputs, Selects
- Navigation, Breadcrumbs
- Loading, Error States

## 🔧 Configuração de Desenvolvimento

### Requisitos
- Node.js 18+
- npm ou yarn
- PostgreSQL (para produção)

### Configuração do Editor
Recomendamos usar VS Code com as extensões:
- TypeScript
- Tailwind CSS IntelliSense
- ES7+ React/Redux/React-Native snippets

## 📈 Performance

- **Lazy Loading**: Carregamento sob demanda
- **Code Splitting**: Divisão automática do código
- **Image Optimization**: Otimização de imagens
- **Caching**: Cache inteligente de recursos

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo LICENSE para mais detalhes.