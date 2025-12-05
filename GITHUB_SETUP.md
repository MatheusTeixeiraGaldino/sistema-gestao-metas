# Configuração do GitHub e CI/CD

Este documento descreve como configurar o repositório GitHub e o pipeline de CI/CD com GitHub Actions.

## Passo 1: Criar Repositório GitHub

1. Acesse [GitHub](https://github.com) e faça login
2. Clique em **Novo repositório** (ou use `+` no canto superior direito)
3. Configure:
   - **Nome do repositório**: `metas-management-system`
   - **Descrição**: `Sistema online para gestão de metas organizacionais`
   - **Visibilidade**: Privado (recomendado) ou Público
   - **Inicializar com README**: Desabilitar (vamos fazer isso localmente)
4. Clique em **Criar repositório**

## Passo 2: Conectar Repositório Local

```bash
# Clonar ou inicializar repositório
cd /home/ubuntu/metas-management-system

# Se ainda não é um repositório git
git init

# Adicionar remote
git remote add origin https://github.com/seu-usuario/metas-management-system.git

# Configurar branch padrão
git branch -M main

# Adicionar todos os arquivos
git add .

# Commit inicial
git commit -m "Initial commit: Sistema de Gestão de Metas"

# Push para GitHub
git push -u origin main
```

## Passo 3: Configurar GitHub Actions

Crie o arquivo `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Vercel

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build-and-test:
    runs-on: ubuntu-latest
    
    strategy:
      matrix:
        node-version: [18.x, 20.x]
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}
          cache: 'pnpm'
      
      - name: Install pnpm
        run: npm install -g pnpm
      
      - name: Install dependencies
        run: pnpm install
      
      - name: Run linter
        run: pnpm format --check
      
      - name: Run tests
        run: pnpm test
        env:
          DATABASE_URL: ${{ secrets.DATABASE_URL }}
          JWT_SECRET: ${{ secrets.JWT_SECRET }}
      
      - name: Build
        run: pnpm build
        env:
          DATABASE_URL: ${{ secrets.DATABASE_URL }}
          JWT_SECRET: ${{ secrets.JWT_SECRET }}
          VITE_APP_ID: ${{ secrets.VITE_APP_ID }}
          VITE_OAUTH_PORTAL_URL: ${{ secrets.VITE_OAUTH_PORTAL_URL }}

  deploy:
    needs: build-and-test
    runs-on: ubuntu-latest
    if: github.event_name == 'push' && github.ref == 'refs/heads/main'
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Deploy to Vercel
        uses: vercel/action@master
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
```

## Passo 4: Configurar Secrets do GitHub

1. No repositório GitHub, vá para **Settings** → **Secrets and variables** → **Actions**
2. Clique em **New repository secret** e adicione:

| Secret | Descrição |
|--------|-----------|
| `DATABASE_URL` | String de conexão do banco de dados |
| `JWT_SECRET` | Chave secreta para JWT (mínimo 32 caracteres) |
| `VITE_APP_ID` | ID da aplicação Manus OAuth |
| `VITE_OAUTH_PORTAL_URL` | URL do portal OAuth |
| `VERCEL_TOKEN` | Token de acesso da Vercel |
| `VERCEL_ORG_ID` | ID da organização na Vercel |
| `VERCEL_PROJECT_ID` | ID do projeto na Vercel |
| `FIREBASE_SERVICE_ACCOUNT_KEY` | Chave de serviço do Firebase (base64) |

### Como obter os secrets:

**JWT_SECRET**: Gere uma chave segura
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**VERCEL_TOKEN**: 
1. Acesse [Vercel Settings](https://vercel.com/account/tokens)
2. Clique em **Create Token**
3. Copie o token

**VERCEL_ORG_ID e VERCEL_PROJECT_ID**:
1. Acesse seu projeto na Vercel
2. Vá para **Settings** → **General**
3. Copie os IDs mostrados

## Passo 5: Configurar Branch Protection (Recomendado)

1. No repositório GitHub, vá para **Settings** → **Branches**
2. Clique em **Add rule** em **Branch protection rules**
3. Configure:
   - **Branch name pattern**: `main`
   - ✅ **Require a pull request before merging**
   - ✅ **Require status checks to pass before merging**
   - ✅ **Require branches to be up to date before merging**
   - ✅ **Require code reviews before merging** (mínimo 1)

## Passo 6: Configurar Notificações

1. No repositório GitHub, vá para **Settings** → **Notifications**
2. Configure alertas para:
   - Falhas de build
   - Deployments bem-sucedidos
   - Pull requests

## Estrutura de Branches

Recomendamos seguir o Git Flow:

```
main (produção)
  ├── develop (staging)
  │   ├── feature/estrutura-organizacional
  │   ├── feature/gestao-metas
  │   ├── feature/apontamento-resultados
  │   ├── feature/validacao-fluxo
  │   └── feature/dashboards
  └── hotfix/...
```

## Processo de Desenvolvimento

1. **Criar branch de feature**:
   ```bash
   git checkout -b feature/nome-da-feature
   ```

2. **Fazer commits**:
   ```bash
   git add .
   git commit -m "Descrição clara da mudança"
   ```

3. **Push para GitHub**:
   ```bash
   git push origin feature/nome-da-feature
   ```

4. **Criar Pull Request**:
   - Vá para GitHub
   - Clique em **Compare & pull request**
   - Descreva as mudanças
   - Solicite revisão

5. **Merge após aprovação**:
   - Clique em **Merge pull request**
   - Clique em **Confirm merge**

## Verificação de Saúde do Repositório

```bash
# Verificar status
git status

# Ver histórico de commits
git log --oneline -10

# Ver branches
git branch -a

# Sincronizar com remoto
git fetch origin
git pull origin main
```

## Troubleshooting

### Erro: "fatal: remote origin already exists"
```bash
git remote remove origin
git remote add origin https://github.com/seu-usuario/metas-management-system.git
```

### Erro: "Permission denied (publickey)"
Configure sua chave SSH:
```bash
ssh-keygen -t ed25519 -C "seu-email@example.com"
cat ~/.ssh/id_ed25519.pub  # Copie e adicione em GitHub Settings → SSH Keys
```

### Erro: "fatal: The current branch main has no upstream branch"
```bash
git push -u origin main
```

## Próximos Passos

- Consulte `DEPLOYMENT.md` para configurar o deploy na Vercel
- Consulte `FIREBASE_SETUP.md` para configurar Firebase
- Consulte `README.md` para instruções de desenvolvimento

## Referências

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [GitHub Secrets Documentation](https://docs.github.com/en/actions/security-guides/encrypted-secrets)
- [Vercel GitHub Integration](https://vercel.com/docs/git)
