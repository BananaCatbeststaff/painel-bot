const fs = require("fs");
const { execSync } = require("child_process");
const path = require("path");

const CONFIG_PATH = path.join(__dirname, "config.json");
const PAINEL_PATH = path.join(__dirname, "painel.js");
const REQUIRED_MODULES = ["readline-sync", "axios", "chalk", "inquirer"];

// Passo 1: Instalar dependências se faltando
function installDependencies() {
    console.log("[📦] Verificando dependências...");

    let missingModules = REQUIRED_MODULES.filter((mod) => {
        try {
            require.resolve(mod);
            return false;
        } catch {
            return true;
        }
    });

    if (missingModules.length > 0) {
        console.log(`[⬇️] Instalando módulos: ${missingModules.join(", ")}`);
        try {
            execSync(`npm install ${missingModules.join(" ")}`, { stdio: "inherit" });
        } catch (err) {
            console.error("[❌] Falha ao instalar pacotes.");
            process.exit(1);
        }
    } else {
        console.log("[✅] Todos os módulos já estão instalados.");
    }
}

// Passo 2: Criar config.json se não existir
function ensureConfigFile() {
    if (!fs.existsSync(CONFIG_PATH)) {
        const defaultConfig = {
            status: "online",
            token: "COLE_SEU_TOKEN",
            prefix: "!",
            owner: "SeuNome#0000"
        };
        fs.writeFileSync(CONFIG_PATH, JSON.stringify(defaultConfig, null, 4));
        console.log("[🛠️] config.json criado com configurações padrão.");
    } else {
        console.log("[✅] config.json já existe.");
    }
}

// Passo 3: Executar painel.js
function startPainel() {
    if (!fs.existsSync(PAINEL_PATH)) {
        console.error("[❌] painel.js não encontrado. Certifique-se de que ele esteja no mesmo diretório.");
        process.exit(1);
    }
    console.log("[🚀] Iniciando painel.js...");
    execSync("node painel.js", { stdio: "inherit" });
}

// Execução em ordem
(function main() {
    console.clear();
    console.log("==== Painel Setup Automático ====\n");
    installDependencies();
    ensureConfigFile();
    startPainel();
})();
