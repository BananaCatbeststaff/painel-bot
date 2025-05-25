const { execSync } = require('child_process');
const fs = require('fs');
const https = require('https');
const path = require('path');

const PAINEL_URL = 'https://raw.githubusercontent.com/BananaCatbeststaff/painel-bot/refs/heads/main/Painel%20Efetivo';
const PAINEL_FILE = path.join(__dirname, 'painel.js');
const DEPENDENCIES = ['readline-sync']; // Adicione mais dependências se necessário

// Função para baixar o painel.js
function baixarPainel(url, destino, callback) {
  console.log('⬇️  Baixando painel.js...');
  const file = fs.createWriteStream(destino);
  https.get(url, res => {
    if (res.statusCode !== 200) {
      console.error(`❌ Falha ao baixar painel.js (status: ${res.statusCode})`);
      return;
    }
    res.pipe(file);
    file.on('finish', () => {
      file.close(callback);
      console.log('✅ painel.js baixado com sucesso.');
    });
  }).on('error', err => {
    fs.unlink(destino, () => {});
    console.error('❌ Erro ao baixar painel.js:', err.message);
  });
}

// Instala dependências faltantes
function instalarDependencias(deps) {
  const faltando = [];

  for (const dep of deps) {
    try {
      require.resolve(dep);
    } catch {
      faltando.push(dep);
    }
  }

  if (faltando.length > 0) {
    console.log(`🔧 Instalando dependências: ${faltando.join(', ')}`);
    try {
      execSync(`npm install ${faltando.join(' ')}`, { stdio: 'inherit' });
      console.log('✅ Dependências instaladas com sucesso.');
    } catch (err) {
      console.error('❌ Erro ao instalar dependências:', err);
      process.exit(1);
    }
  } else {
    console.log('✅ Todas as dependências já estão instaladas.');
  }
}

// Executa o painel.js
function iniciarPainel() {
  try {
    console.log('\n🚀 Iniciando painel...');
    require('./painel.js');
  } catch (err) {
    console.error('❌ Erro ao executar painel.js:', err);
  }
}

// Execução principal
baixarPainel(PAINEL_URL, PAINEL_FILE, () => {
  instalarDependencias(DEPENDENCIES);
  iniciarPainel();
});
