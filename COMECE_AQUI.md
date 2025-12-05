# 🚀 COMECE AQUI - Guia Rápido de Setup

**Leia este arquivo primeiro!** Ele tem tudo que você precisa fazer, passo a passo, com instruções copy-paste.

---

## ⚡ Resumo Rápido

Você vai fazer 10 passos simples para ter seu sistema rodando:

1. ✅ Instalar ferramentas (Node.js, Git)
2. ✅ Criar conta GitHub
3. ✅ Criar repositório GitHub
4. ✅ Configurar Git no seu computador
5. ✅ Criar conta Firebase
6. ✅ Criar conta Vercel
7. ✅ Conectar GitHub com Vercel
8. ✅ Configurar banco de dados
9. ✅ Adicionar secrets no GitHub
10. ✅ Fazer primeiro deploy

**Tempo estimado: 30-45 minutos**

---

## 📋 PASSO 1: Instalar Ferramentas Necessárias

### Windows

**1. Instalar Node.js:**
- Vá para https://nodejs.org
- Clique em "LTS" (versão 20.x)
- Execute o instalador
- **IMPORTANTE**: Marque "Add to PATH" durante a instalação
- Reinicie o computador

**2. Instalar Git:**
- Vá para https://git-scm.com/download/win
- Execute o instalador
- Use as opções padrão

**3. Verificar instalação:**
- Abra PowerShell (Win + R, digite "powershell")
- Cole isto:
```bash
node --version
git --version
```
- Você deve ver versões como `v20.x.x` e `git version 2.x.x`

### macOS

Abra o Terminal e cole isto:

```bash
# Instalar Homebrew
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Instalar Node.js
brew install node

# Instalar Git
brew install git

# Verificar
node --version
git --version
```

### Linux (Ubuntu/Debian)

```bash
sudo apt update
sudo apt install -y nodejs npm git

# Verificar
node --version
git --version
```

✅ **Ferramentas instaladas!**

---

## 📋 PASSO 2: Criar Conta GitHub

1. Abra https://github.com
2. Clique em "Sign up"
3. Preencha com:
   - Email pessoal
   - Senha forte
   - Username (ex: seu-nome-github)
4. Clique "Create account"
5. Confirme o email que GitHub enviou

✅ **Conta GitHub criada!**

---

## 📋 PASSO 3: Criar Repositório GitHub

1. Faça login em https://github.com
2. Clique no ícone de perfil (canto superior direito)
3. Clique em "Your repositories"
4. Clique no botão verde "New"
5. Preencha assim:
   - **Repository name**: `metas-management-system`
   - **Description**: `Sistema de gestão de metas`
   - **Visibility**: Selecione "Private"
   - Deixe as outras opções desmarcadas
6. Clique "Create repository"

Você verá uma página com a URL. **Copie e guarde essa URL** (algo como `https://github.com/seu-usuario/metas-management-system.git`)

✅ **Repositório criado!**

---

## 📋 PASSO 4: Configurar Git no Seu Computador

Abra o terminal/PowerShell e execute:

```bash
git config --global user.name "Seu Nome Completo"
git config --global user.email "seu-email@example.com"
```

Exemplo:
```bash
git config --global user.name "João Silva"
git config --global user.email "joao@example.com"
```

### Configurar SSH (Recomendado)

Execute isto no terminal:

```bash
ssh-keygen -t ed25519 -C "seu-email@example.com"
```

Pressione Enter 3 vezes (valores padrão).

Agora copie sua chave pública:

**macOS/Linux:**
```bash
cat ~/.ssh/id_ed25519.pub
```

**Windows PowerShell:**
```bash
Get-Content $env:USERPROFILE\.ssh\id_ed25519.pub
```

Copie tudo que aparecer.

Agora adicione no GitHub:
1. Vá para https://github.com/settings/keys
2. Clique "New SSH key"
3. Cole a chave que você copiou
4. Clique "Add SSH key"

✅ **Git configurado!**

---

## 📋 PASSO 5: Criar Conta Firebase

1. Vá para https://firebase.google.com
2. Clique "Get started"
3. Faça login com sua conta Google (ou crie uma)
4. Clique "Create project"
5. Nome do projeto: `metas-management-system`
6. Clique "Continue"
7. Desabilite Google Analytics
8. Clique "Create project"
9. Aguarde alguns segundos

✅ **Firebase criado!**

---

## 📋 PASSO 6: Criar Conta Vercel

1. Vá para https://vercel.com
2. Clique "Sign Up"
3. Clique "Continue with GitHub"
4. Autorize o Vercel
5. Preencha seu nome e email
6. Clique "Create Team"

✅ **Vercel criado!**

---

## 📋 PASSO 7: Conectar GitHub com Vercel

1. Vá para https://vercel.com/dashboard
2. Clique "Add New" → "Project"
3. Clique "Continue with GitHub"
4. Procure por `metas-management-system`
5. Clique "Import"
6. Deixe as configurações padrão
7. Clique "Deploy"

Aguarde o deploy terminar (pode levar alguns minutos).

✅ **GitHub conectado com Vercel!**

---

## 📋 PASSO 8: Configurar Banco de Dados

Escolha uma opção:

### Opção A: PlanetScale (Recomendado - Gratuito)

1. Vá para https://planetscale.com
2. Clique "Sign up"
3. Clique "Continue with GitHub"
4. Autorize
5. Clique "Create a database"
6. Nome: `metas-management-system`
7. Região: `us-east`
8. Clique "Create database"
9. Clique no banco criado
10. Clique "Connect"
11. Selecione "Node.js"
12. **Copie a string de conexão** (começa com `mysql://`)

**Guarde essa string!**

### Opção B: MySQL Local (Se tem MySQL instalado)

Abra o terminal e execute:

```bash
mysql -u root -p
```

Digite sua senha, depois:

```sql
CREATE DATABASE metas_management;
EXIT;
```

A string de conexão será:
```
mysql://root:sua-senha@localhost:3306/metas_management
```

✅ **Banco de dados configurado!**

---

## 📋 PASSO 9: Adicionar Secrets no GitHub

1. Vá para seu repositório: `https://github.com/seu-usuario/metas-management-system`
2. Clique em "Settings" (no menu superior)
3. Clique em "Secrets and variables" (menu esquerdo)
4. Clique em "Actions"

Agora adicione cada secret clicando em "New repository secret":

### Secret 1: DATABASE_URL
- **Name**: `DATABASE_URL`
- **Value**: Cole a string de conexão do PlanetScale ou MySQL
- Clique "Add secret"

### Secret 2: JWT_SECRET

Abra o terminal e execute:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copie o resultado (será uma sequência longa).

- **Name**: `JWT_SECRET`
- **Value**: Cole o resultado
- Clique "Add secret"

### Secret 3: VERCEL_TOKEN

1. Vá para https://vercel.com/account/tokens
2. Clique "Create Token"
3. Nome: `github-actions`
4. Clique "Create"
5. Copie o token

- **Name**: `VERCEL_TOKEN`
- **Value**: Cole o token
- Clique "Add secret"

### Secret 4: VERCEL_ORG_ID

1. Vá para https://vercel.com/dashboard
2. Clique no seu projeto
3. Clique "Settings"
4. Procure por "Project ID"
5. Copie o ID

- **Name**: `VERCEL_ORG_ID`
- **Value**: Cole o ID
- Clique "Add secret"

### Secret 5: VERCEL_PROJECT_ID

Use o mesmo ID do passo anterior:

- **Name**: `VERCEL_PROJECT_ID`
- **Value**: Cole o ID
- Clique "Add secret"

✅ **Secrets configurados!**

---

## 📋 PASSO 10: Fazer Primeiro Deploy

### 10.1 Clonar o Repositório

Abra o terminal e execute:

```bash
git clone https://github.com/seu-usuario/metas-management-system.git
cd metas-management-system
```

### 10.2 Instalar Dependências

```bash
npm install -g pnpm
pnpm install
```

### 10.3 Executar Migrações

```bash
pnpm db:push
```

### 10.4 Iniciar Servidor Local

```bash
pnpm dev
```

Abra seu navegador em `http://localhost:3000`

Você deve ver a página inicial do projeto!

### 10.5 Fazer Commit e Push

```bash
git add .
git commit -m "Initial setup"
git push origin main
```

### 10.6 Verificar Deploy

1. Vá para https://vercel.com/dashboard
2. Clique no seu projeto
3. Aguarde o deployment ficar "Ready"
4. Clique na URL para acessar seu projeto em produção

✅ **Primeiro deploy realizado!**

---

## 🎉 Parabéns!

Você configurou com sucesso:
- ✅ GitHub
- ✅ Firebase
- ✅ Vercel
- ✅ Banco de Dados
- ✅ CI/CD Automático
- ✅ Deploy Contínuo

---

## 📚 Próximos Passos

Agora você pode:

1. **Desenvolver localmente**: Use `pnpm dev` para trabalhar
2. **Fazer commits**: Cada push faz deploy automático
3. **Ler documentação**:
   - `DEVELOPMENT.md` - Desenvolvimento local
   - `TROUBLESHOOTING.md` - Soluções para problemas
   - `README_SETUP.md` - Visão geral completa

---

## 🆘 Problemas?

Se algo não funcionar:

1. Abra `TROUBLESHOOTING.md` - tem soluções para 20+ problemas comuns
2. Verifique se todos os secrets estão corretos no GitHub
3. Verifique os logs no Vercel Dashboard

---

**Qualquer dúvida, consulte os outros arquivos .md do projeto!**

**Boa sorte! 🚀**
