# Guia de Deployment - Vercel

Este documento descreve como fazer o deploy do Sistema de Gestão de Metas na Vercel com integração contínua via GitHub.

## Pré-requisitos

- Repositório GitHub configurado (veja `GITHUB_SETUP.md`)
- Conta Vercel ativa
- Variáveis de ambiente configuradas no GitHub Secrets

## Passo 1: Criar Projeto na Vercel

### Opção A: Via Dashboard Vercel

1. Acesse [Vercel Dashboard](https://vercel.com/dashboard)
2. Clique em **Add New** → **Project**
3. Selecione seu repositório GitHub `metas-management-system`
4. Clique em **Import**

### Opção B: Via CLI Vercel

```bash
# Instalar Vercel CLI
npm i -g vercel

# Fazer login
vercel login

# Deploy
vercel
```

## Passo 2: Configurar Variáveis de Ambiente

1. No Vercel Dashboard, vá para seu projeto
2. Clique em **Settings** → **Environment Variables**
3. Adicione as seguintes variáveis:

| Variável | Valor | Ambiente |
|----------|-------|----------|
| `DATABASE_URL` | String de conexão MySQL | Production, Preview, Development |
| `JWT_SECRET` | Chave secreta JWT | Production, Preview, Development |
| `VITE_APP_ID` | ID da aplicação OAuth | Production, Preview, Development |
| `VITE_OAUTH_PORTAL_URL` | URL do portal OAuth | Production, Preview, Development |
| `VITE_APP_TITLE` | Sistema de Gestão de Metas | Production, Preview, Development |
| `VITE_APP_LOGO` | URL do logo | Production, Preview, Development |
| `FIREBASE_PROJECT_ID` | ID do projeto Firebase | Production, Preview, Development |
| `FIREBASE_API_KEY` | Chave API do Firebase | Production, Preview, Development |

## Passo 3: Configurar Domínio Customizado (Opcional)

1. No Vercel Dashboard, vá para **Settings** → **Domains**
2. Clique em **Add Domain**
3. Digite seu domínio customizado
4. Siga as instruções para configurar DNS

### Exemplo de Configuração DNS (Cloudflare)

Se usar Cloudflare, adicione um registro CNAME:

```
Nome: seu-dominio
Tipo: CNAME
Conteúdo: cname.vercel-dns.com
TTL: Auto
```

## Passo 4: Configurar GitHub Integration

A integração já deve estar ativa após importar o repositório. Verifique:

1. No Vercel Dashboard, vá para **Settings** → **Git**
2. Confirme que o repositório está conectado
3. Configure:
   - ✅ **Deploy on push to main**
   - ✅ **Preview deployments for pull requests**
   - ✅ **Automatic production deployments**

## Passo 5: Configurar Build Settings

1. No Vercel Dashboard, vá para **Settings** → **Build & Development Settings**
2. Configure:
   - **Framework Preset**: `Other`
   - **Build Command**: `pnpm build`
   - **Output Directory**: `dist`
   - **Install Command**: `pnpm install`
   - **Development Command**: `pnpm dev`

## Passo 6: Configurar Banco de Dados

### Opção A: PlanetScale (Recomendado)

```bash
# Instalar CLI do PlanetScale
npm i -g @planetscale/cli

# Fazer login
pscale auth login

# Criar banco de dados
pscale database create metas-management-system

# Criar branch de produção
pscale branch create metas-management-system main

# Obter string de conexão
pscale database connection-string metas-management-system main
```

Adicione a string de conexão como `DATABASE_URL` no Vercel.

### Opção B: Banco de Dados Existente

Se já tem um banco MySQL/MariaDB:

1. Obtenha a string de conexão
2. Adicione como `DATABASE_URL` no Vercel
3. Execute migrações:
   ```bash
   pnpm db:push
   ```

## Passo 7: Executar Migrações em Produção

Após o primeiro deploy, execute as migrações:

```bash
# Localmente, com DATABASE_URL apontando para produção
DATABASE_URL="sua-string-de-conexao" pnpm db:push
```

Ou via Vercel CLI:

```bash
vercel env pull .env.production.local
pnpm db:push
```

## Passo 8: Verificar Deploy

1. No Vercel Dashboard, vá para **Deployments**
2. Verifique se o último deployment está com status **Ready**
3. Clique no deployment para ver logs
4. Acesse a URL do projeto para testar

## Monitoramento e Logs

### Ver Logs em Tempo Real

```bash
vercel logs
```

### Ver Logs de Build

1. No Vercel Dashboard, clique em um deployment
2. Vá para a aba **Build Logs**

### Configurar Alertas

1. No Vercel Dashboard, vá para **Settings** → **Notifications**
2. Configure alertas para:
   - Deployments bem-sucedidos
   - Falhas de build
   - Erros em produção

## Rollback de Deploy

Se precisar reverter para uma versão anterior:

1. No Vercel Dashboard, vá para **Deployments**
2. Encontre o deployment anterior
3. Clique em **...** → **Promote to Production**

## Variáveis de Ambiente por Ambiente

### Development (Preview)

```env
DATABASE_URL=mysql://dev:password@localhost:3306/metas_dev
JWT_SECRET=dev-secret-key
VITE_APP_ID=dev-app-id
VITE_OAUTH_PORTAL_URL=http://localhost:3000
```

### Production

```env
DATABASE_URL=mysql://prod:password@prod-db.example.com:3306/metas
JWT_SECRET=prod-secret-key-long-and-secure
VITE_APP_ID=prod-app-id
VITE_OAUTH_PORTAL_URL=https://seu-dominio.com
```

## Otimizações para Produção

### 1. Habilitar Caching

No `vercel.json`:

```json
{
  "headers": [
    {
      "source": "/static/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

### 2. Configurar CORS

Se precisar de CORS:

```json
{
  "headers": [
    {
      "source": "/api/(.*)",
      "headers": [
        {
          "key": "Access-Control-Allow-Origin",
          "value": "*"
        }
      ]
    }
  ]
}
```

### 3. Habilitar Compression

Já habilitado por padrão na Vercel.

## Troubleshooting

### Erro: "Build failed"

1. Verifique os logs de build
2. Confirme que todas as variáveis de ambiente estão configuradas
3. Teste localmente: `pnpm build`

### Erro: "Database connection refused"

1. Verifique a string `DATABASE_URL`
2. Confirme que o banco está acessível de fora
3. Verifique firewall/security groups

### Erro: "Module not found"

1. Verifique `package.json` e `pnpm-lock.yaml`
2. Execute `pnpm install` localmente
3. Faça commit e push novamente

### Erro: "Timeout during deployment"

1. Reduza o tempo de build localmente
2. Otimize dependências
3. Considere usar cache de build

## Performance Monitoring

### Usar Vercel Analytics

1. No Vercel Dashboard, vá para **Analytics**
2. Ative **Web Analytics**
3. Monitore:
   - Core Web Vitals
   - Tempo de resposta
   - Taxa de erro

### Usar Sentry para Error Tracking

```bash
npm install @sentry/react @sentry/tracing
```

Configure em `client/main.tsx`:

```tsx
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: process.env.VITE_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
});
```

## Próximos Passos

- Consulte `GITHUB_SETUP.md` para configurar CI/CD
- Consulte `FIREBASE_SETUP.md` para configurar Firebase
- Consulte `README.md` para instruções de desenvolvimento

## Referências

- [Vercel Documentation](https://vercel.com/docs)
- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
- [PlanetScale Documentation](https://planetscale.com/docs)
- [Drizzle ORM Migrations](https://orm.drizzle.team/docs/migrations)
