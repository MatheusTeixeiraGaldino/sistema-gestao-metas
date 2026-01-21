# 🎯 Sistema de Gestão de Metas

Sistema 100% online para gestão de metas, exclusivamente informativo, sem cálculos ou análises automáticas.

## ✨ Características

- ✅ **100% Online** - Nenhuma instalação necessária
- ✅ **Sem Cálculos** - Sistema puramente informativo
- ✅ **Gestão Completa** - Programas, metas e resultados
- ✅ **Fluxo de Aprovação** - Lançador → Gerência → Admin
- ✅ **Auditoria** - Histórico completo de alterações
- ✅ **Storage Seguro** - Comprovantes no Supabase
- ✅ **Deploy Grátis** - Vercel + Supabase

## 🚀 Deploy Rápido (10 minutos)

### 1. Configurar Supabase

**1.1. Criar Conta e Projeto**
```bash
1. Acesse https://supabase.com
2. Crie uma conta (grátis)
3. Clique em "New Project"
4. Nome: sistema-metas
5. Database Password: [crie uma senha forte]
6. Region: South America (São Paulo)
7. Aguarde 2 minutos para provisionamento
```

**1.2. Executar Scripts SQL**
```sql
-- Copie o SQL completo do arquivo "Guia Completo de Deploy"
-- Cole no SQL Editor do Supabase
-- Clique em RUN
```

**1.3. Configurar Storage**
```bash
1. No painel Supabase, vá em "Storage"
2. Clique em "New Bucket"
3. Nome: comprovantes
4. Public: SIM (ou configure políticas)
5. Clique em "Create Bucket"
```

**1.4. Copiar Credenciais**
```bash
1. Vá em Settings → API
2. Copie:
   - Project URL
   - anon/public key
```

### 2. Configurar Projeto Local

**2.1. Criar Projeto**
```bash
# Criar pasta
mkdir sistema-metas
cd sistema-metas

# Inicializar projeto
npm create vite@latest . -- --template react-ts

# Instalar dependências
npm install
npm install @supabase/supabase-js lucide-react date-fns
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

**2.2. Criar Arquivos de Configuração**

Crie `.env.local`:
```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-aqui
```

Atualize `tailwind.config.js`:
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

Crie `src/index.css`:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

**2.3. Criar Estrutura de Pastas**
```bash
mkdir -p src/lib
```

**2.4. Copiar Código**

Copie os arquivos:
- `src/lib/supabase.ts` (do artefato "Guia Completo")
- `src/App.tsx` (do artefato "App.tsx Completo")
- `src/main.tsx` (do artefato "Guia Completo")

**2.5. Testar Localmente**
```bash
npm run dev
```

Acesse: http://localhost:5173

### 3. Deploy na Vercel

**3.1. Preparar Git**
```bash
# Criar .gitignore
echo "node_modules
dist
.env.local
.DS_Store" > .gitignore

# Inicializar git
git init
git add .
git commit -m "Sistema de gestão de metas"
```

**3.2. Criar Repositório GitHub**
```bash
# No GitHub:
1. Criar novo repositório "sistema-metas"
2. Copiar comandos de push

# No terminal:
git remote add origin https://github.com/SEU_USUARIO/sistema-metas.git
git branch -M main
git push -u origin main
```

**3.3. Deploy na Vercel**
```bash
1. Acesse https://vercel.com
2. Clique em "New Project"
3. Importe repositório do GitHub
4. Configure variáveis de ambiente:
   - VITE_SUPABASE_URL
   - VITE_SUPABASE_ANON_KEY
5. Clique em "Deploy"
6. Aguarde 2 minutos
7. Acesse a URL gerada!
```

## 📁 Estrutura do Projeto

```
sistema-metas/
├── src/
│   ├── lib/
│   │   └── supabase.ts          # Cliente Supabase
│   ├── App.tsx                   # Componente principal
│   ├── main.tsx                  # Entry point
│   └── index.css                 # Estilos Tailwind
├── .env.local                    # Variáveis de ambiente
├── package.json                  # Dependências
├── tailwind.config.js            # Config Tailwind
└── vite.config.ts                # Config Vite
```

## 🗄️ Estrutura do Banco de Dados

### Tabelas Principais

- **setores** - Setores da organização
- **equipes** - Equipes por setor
- **usuarios** - Usuários do sistema
- **programas** - Programas de metas
- **metas** - Metas cadastradas
- **resultados** - Resultados lançados
- **historico_auditoria** - Log de alterações

### Fluxos de Aprovação

**Sugestão de Metas:**
```
Lançador → Gerência → Admin
```

**Lançamento de Resultados:**
```
Lançador → Admin
```

## 👥 Tipos de Usuário

### Admin
- Aprovar/reprovar metas
- Aprovar/reprovar resultados
- Criar programas
- Visualizar tudo

### Gerente
- Aprovar/reprovar sugestões de metas
- Visualizar relatórios

### Lançador
- Sugerir metas
- Lançar resultados
- Visualizar suas metas

## 🎯 Tipos de Métrica (Visual)

- **Numérico** - 150
- **Monetário** - R$ 250.000,00
- **Percentual** - 85%
- **Data** - 15/12/2024
- **Quantidade** - 50 unidades
- **Nota** - 8.5
- **Diferença de Dias** - 30 dias

## 📊 Períodos de Acompanhamento

- Mensal
- Bimestral
- Trimestral
- Quadrimestral
- Semestral
- Anual

## 🔒 Segurança

- ✅ Row Level Security (RLS) ativado
- ✅ Autenticação via Supabase Auth
- ✅ Variáveis de ambiente protegidas
- ✅ Políticas de acesso por tabela
- ✅ Storage com controle de acesso

## 📝 Criar Primeiro Usuário Admin

No Supabase SQL Editor:

```sql
-- 1. Criar usuário no Auth (substitua email e senha)
-- Vá em Authentication → Users → Add User
-- Email: admin@empresa.com
-- Password: sua-senha

-- 2. Inserir na tabela usuarios (substitua o ID do usuário criado)
INSERT INTO usuarios (auth_user_id, nome, email, tipo, ativo)
VALUES (
  'UUID-DO-USUARIO-CRIADO',
  'Administrador',
  'admin@empresa.com',
  'admin',
  true
);
```

## 🆘 Solução de Problemas

### Erro: "Invalid API credentials"
```bash
# Verifique se as variáveis estão corretas
echo $VITE_SUPABASE_URL
echo $VITE_SUPABASE_ANON_KEY

# Recrie .env.local com valores corretos
```

### Erro: "relation does not exist"
```bash
# Execute todos os scripts SQL novamente
# Verifique se está conectado ao projeto correto
```

### Erro: "Cannot upload file"
```bash
# Verifique se o bucket 'comprovantes' existe
# Verifique as políticas de acesso no Storage
```

### Deploy Vercel falhou
```bash
# Verifique variáveis de ambiente na Vercel
# Verifique se build local funciona: npm run build
```

## 📚 Recursos Adicionais

- [Documentação Supabase](https://supabase.com/docs)
- [Documentação Vercel](https://vercel.com/docs)
- [Documentação React](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)

## 🔄 Atualizações

Para atualizar o sistema em produção:

```bash
# Fazer alterações localmente
npm run dev

# Testar
npm run build
npm run preview

# Commitar
git add .
git commit -m "Descrição da alteração"
git push

# Vercel faz deploy automático!
```

## 📊 Dados de Exemplo

O script SQL já insere:
- 3 setores
- 3 equipes
- Estrutura completa

Para adicionar mais dados de teste, use o SQL Editor.

## 🎨 Personalização

### Mudar Cores
Edite `tailwind.config.js`:
```javascript
theme: {
  extend: {
    colors: {
      primary: '#sua-cor',
    },
  },
}
```

### Adicionar Logo
Substitua em `App.tsx`:
```typescript
<Target className="w-8 h-8" />
// por
<img src="/logo.png" className="w-8 h-8" />
```

## ⚠️ IMPORTANTE

- ❌ **Sem cálculos** - Sistema não faz análises
- ❌ **Sem rankings** - Não gera classificações
- ❌ **Sem percentuais** - Não calcula desempenho
- ✅ **Apenas informativo** - Cadastro e consulta

## 📞 Suporte

Para dúvidas técnicas:
1. Verifique este README
2. Consulte a documentação oficial
3. Verifique os logs do Supabase

## 📄 Licença

Sistema desenvolvido para uso interno.

---

**Desenvolvido com React + TypeScript + Supabase + Vercel**
