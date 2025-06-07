#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

console.log('🔍 Executando verificações pré-deploy...\n');

let hasErrors = false;

// Função para reportar erro
function reportError(message) {
  console.error(`❌ ${message}`);
  hasErrors = true;
}

// Função para reportar sucesso
function reportSuccess(message) {
  console.log(`✅ ${message}`);
}

// Função para reportar aviso
function reportWarning(message) {
  console.warn(`⚠️  ${message}`);
}

try {
  // 1. Verificar estrutura de arquivos essenciais
  console.log('📁 Verificando estrutura de arquivos...');
  
  const essentialFiles = [
    'package.json',
    'vite.config.ts',
    'client/index.html',
    'client/public/404.html',
    'client/public/manifest.json',
    'client/public/robots.txt',
    'client/public/sitemap.xml',
    '.github/workflows/deploy.yml'
  ];

  for (const file of essentialFiles) {
    const filePath = path.join(projectRoot, file);
    if (fs.existsSync(filePath)) {
      reportSuccess(`Arquivo encontrado: ${file}`);
    } else {
      reportError(`Arquivo essencial não encontrado: ${file}`);
    }
  }

  // 2. Verificar configurações do package.json
  console.log('\n📦 Verificando package.json...');
  
  const packageJson = JSON.parse(fs.readFileSync(path.join(projectRoot, 'package.json'), 'utf8'));
  
  if (packageJson.scripts['build:gh-pages']) {
    reportSuccess('Script build:gh-pages encontrado');
  } else {
    reportError('Script build:gh-pages não encontrado');
  }

  if (packageJson.scripts.deploy) {
    reportSuccess('Script deploy encontrado');
  } else {
    reportError('Script deploy não encontrado');
  }

  if (packageJson.devDependencies['gh-pages']) {
    reportSuccess('Dependência gh-pages encontrada');
  } else {
    reportError('Dependência gh-pages não encontrada');
  }

  // 3. Verificar configuração do Vite
  console.log('\n⚙️  Verificando configuração do Vite...');
  
  const viteConfigPath = path.join(projectRoot, 'vite.config.ts');
  const viteConfig = fs.readFileSync(viteConfigPath, 'utf8');
  
  if (viteConfig.includes("base: process.env.NODE_ENV === 'production' ? '/Print3DPro/' : '/'")) {
    reportSuccess('Base URL configurada corretamente');
  } else {
    reportError('Base URL não configurada corretamente no vite.config.ts');
  }

  if (viteConfig.includes("outDir: path.resolve(import.meta.dirname, \"dist/public\")")) {
    reportSuccess('Output directory configurado corretamente');
  } else {
    reportError('Output directory não configurado corretamente');
  }

  // 4. Verificar HTML principal
  console.log('\n🌐 Verificando index.html...');
  
  const indexHtmlPath = path.join(projectRoot, 'client/index.html');
  const indexHtml = fs.readFileSync(indexHtmlPath, 'utf8');
  
  if (indexHtml.includes('https://luckaz13.github.io/Print3DPro/')) {
    reportSuccess('URLs do GitHub Pages configuradas');
  } else {
    reportWarning('URLs do GitHub Pages podem não estar configuradas');
  }

  if (indexHtml.includes('Single Page Apps for GitHub Pages')) {
    reportSuccess('Script SPA para GitHub Pages encontrado');
  } else {
    reportError('Script SPA para GitHub Pages não encontrado');
  }

  // 5. Verificar 404.html
  console.log('\n🔄 Verificando 404.html...');
  
  const notFoundPath = path.join(projectRoot, 'client/public/404.html');
  const notFoundHtml = fs.readFileSync(notFoundPath, 'utf8');
  
  if (notFoundHtml.includes('pathSegmentsToKeep = 1')) {
    reportSuccess('Configuração SPA no 404.html correta');
  } else {
    reportError('Configuração SPA no 404.html incorreta');
  }

  // 6. Verificar workflow do GitHub Actions
  console.log('\n🔄 Verificando GitHub Actions workflow...');
  
  const workflowPath = path.join(projectRoot, '.github/workflows/deploy.yml');
  const workflow = fs.readFileSync(workflowPath, 'utf8');
  
  if (workflow.includes('actions/setup-node@v4')) {
    reportSuccess('Action setup-node configurada');
  } else {
    reportWarning('Action setup-node pode estar desatualizada');
  }

  if (workflow.includes('npm run build:gh-pages')) {
    reportSuccess('Build command configurado no workflow');
  } else {
    reportError('Build command não configurado no workflow');
  }

  if (workflow.includes('npm run test:run')) {
    reportSuccess('Testes configurados no workflow');
  } else {
    reportWarning('Testes não configurados no workflow');
  }

  // 7. Verificar dependências críticas
  console.log('\n📚 Verificando dependências...');
  
  const criticalDeps = ['react', 'react-dom', 'vite'];
  for (const dep of criticalDeps) {
    if (packageJson.dependencies[dep] || packageJson.devDependencies[dep]) {
      reportSuccess(`Dependência encontrada: ${dep}`);
    } else {
      reportError(`Dependência crítica não encontrada: ${dep}`);
    }
  }

  // 8. Verificar se há mudanças não commitadas
  console.log('\n📝 Verificando status do Git...');
  
  try {
    const gitStatus = execSync('git status --porcelain', { encoding: 'utf8', cwd: projectRoot });
    if (gitStatus.trim()) {
      reportWarning('Há mudanças não commitadas:');
      console.log(gitStatus);
    } else {
      reportSuccess('Nenhuma mudança não commitada');
    }
  } catch (error) {
    reportWarning('Não foi possível verificar status do Git');
  }

  // 9. Verificar branch atual
  try {
    const currentBranch = execSync('git branch --show-current', { encoding: 'utf8', cwd: projectRoot }).trim();
    if (currentBranch === 'main' || currentBranch === 'master') {
      reportSuccess(`Branch atual: ${currentBranch}`);
    } else {
      reportWarning(`Branch atual: ${currentBranch} (recomendado: main/master)`);
    }
  } catch (error) {
    reportWarning('Não foi possível verificar branch atual');
  }

  // 10. Verificar se node_modules existe
  console.log('\n📦 Verificando instalação...');
  
  if (fs.existsSync(path.join(projectRoot, 'node_modules'))) {
    reportSuccess('node_modules encontrado');
  } else {
    reportError('node_modules não encontrado - execute npm install');
  }

  // Resultado final
  console.log('\n' + '='.repeat(50));
  
  if (hasErrors) {
    console.error('❌ Verificação pré-deploy FALHOU!');
    console.error('Por favor, corrija os erros acima antes de fazer o deploy.');
    process.exit(1);
  } else {
    console.log('✅ Todas as verificações passaram!');
    console.log('🚀 Projeto pronto para deploy!');
  }

} catch (error) {
  console.error('\n❌ Erro durante verificação:');
  console.error(error.message);
  process.exit(1);
}