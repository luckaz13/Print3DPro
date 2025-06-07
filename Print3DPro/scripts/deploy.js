#!/usr/bin/env node

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

console.log('🚀 Iniciando deploy para GitHub Pages...\n');

try {
  // 1. Verificar se estamos no branch correto
  console.log('📋 Verificando branch atual...');
  const currentBranch = execSync('git branch --show-current', { encoding: 'utf8' }).trim();
  console.log(`Branch atual: ${currentBranch}`);
  
  if (currentBranch !== 'main' && currentBranch !== 'master') {
    console.warn('⚠️  Aviso: Você não está no branch main/master');
  }

  // 2. Verificar se há mudanças não commitadas
  console.log('\n📋 Verificando status do git...');
  const gitStatus = execSync('git status --porcelain', { encoding: 'utf8' });
  if (gitStatus.trim()) {
    console.warn('⚠️  Aviso: Há mudanças não commitadas:');
    console.log(gitStatus);
    console.log('Considere fazer commit antes do deploy.\n');
  }

  // 3. Instalar dependências se necessário
  console.log('📦 Verificando dependências...');
  if (!fs.existsSync(path.join(projectRoot, 'node_modules'))) {
    console.log('Instalando dependências...');
    execSync('npm ci', { stdio: 'inherit', cwd: projectRoot });
  }

  // 4. Executar testes
  console.log('\n🧪 Executando testes...');
  try {
    execSync('npm run test:run', { stdio: 'inherit', cwd: projectRoot });
    console.log('✅ Todos os testes passaram!');
  } catch (error) {
    console.error('❌ Alguns testes falharam. Deploy cancelado.');
    process.exit(1);
  }

  // 5. Build para produção
  console.log('\n🏗️  Fazendo build para produção...');
  execSync('npm run build:gh-pages', { stdio: 'inherit', cwd: projectRoot });
  console.log('✅ Build concluído com sucesso!');

  // 6. Verificar se o diretório de build existe
  const buildDir = path.join(projectRoot, 'dist/public');
  if (!fs.existsSync(buildDir)) {
    console.error('❌ Diretório de build não encontrado!');
    process.exit(1);
  }

  // 7. Verificar arquivos essenciais
  console.log('\n📋 Verificando arquivos essenciais...');
  const essentialFiles = ['index.html', '404.html', 'manifest.json'];
  for (const file of essentialFiles) {
    if (!fs.existsSync(path.join(buildDir, file))) {
      console.error(`❌ Arquivo essencial não encontrado: ${file}`);
      process.exit(1);
    }
  }
  console.log('✅ Todos os arquivos essenciais estão presentes!');

  // 8. Deploy usando gh-pages
  console.log('\n🚀 Fazendo deploy para GitHub Pages...');
  execSync('npm run deploy', { stdio: 'inherit', cwd: projectRoot });

  console.log('\n✅ Deploy concluído com sucesso!');
  console.log('🌐 Seu site estará disponível em: https://luckaz13.github.io/Print3DPro/');
  console.log('⏱️  Pode levar alguns minutos para as mudanças aparecerem.');

  // 9. Executar verificação de SEO (opcional)
  console.log('\n🔍 Executando verificação de SEO...');
  try {
    execSync('npm run seo-check', { stdio: 'inherit', cwd: projectRoot });
  } catch (error) {
    console.warn('⚠️  Verificação de SEO falhou, mas o deploy foi bem-sucedido.');
  }

} catch (error) {
  console.error('\n❌ Erro durante o deploy:');
  console.error(error.message);
  process.exit(1);
}