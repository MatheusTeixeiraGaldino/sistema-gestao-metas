# 🔥 Configure Firebase Agora - 5 Minutos

Seu sistema está pronto, mas precisa das credenciais do Firebase para funcionar.

---

## ✅ PASSO 1: Abra Firebase Console

Vá para: https://console.firebase.google.com

---

## ✅ PASSO 2: Crie um Novo Projeto

1. Clique em "Criar projeto"
2. Nome: `metas-management-system`
3. Clique em "Continuar"
4. Desabilite Google Analytics
5. Clique em "Criar projeto"

Aguarde alguns segundos...

---

## ✅ PASSO 3: Copie as Credenciais

1. Clique no ícone de engrenagem (⚙️) no canto superior esquerdo
2. Clique em "Configurações do projeto"
3. Vá para a aba "Geral"
4. Procure por "Seus apps"
5. Se não houver nenhum app, clique em "Adicionar app"
6. Selecione "Web" (ícone `</>`)
7. Nome: `metas-management-system`
8. Clique em "Registrar app"

Você verá um bloco de código como este:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyD...",
  authDomain: "seu-projeto.firebaseapp.com",
  projectId: "seu-projeto",
  storageBucket: "seu-projeto.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123def456"
};
```

**Copie esses valores!**

---

## ✅ PASSO 4: Habilite Autenticação

1. No menu esquerdo, clique em "Autenticação"
2. Clique em "Começar"
3. Clique em "Email/Senha"
4. Ative a opção "Email/Senha"
5. Clique em "Salvar"

---

## ✅ PASSO 5: Habilite Firestore

1. No menu esquerdo, clique em "Firestore Database"
2. Clique em "Criar banco de dados"
3. Selecione "Modo de produção"
4. Região: `us-central1`
5. Clique em "Criar"

---

## ✅ PASSO 6: Habilite Cloud Storage

1. No menu esquerdo, clique em "Storage"
2. Clique em "Começar"
3. Selecione "Modo de produção"
4. Região: `us-central1`
5. Clique em "Criar"

---

## ✅ PASSO 7: Adicione Variáveis no Vercel

Agora você vai adicionar as credenciais do Firebase no Vercel.

1. Vá para: https://vercel.com/dashboard
2. Clique no seu projeto `metas-management-system`
3. Clique em "Settings" (Configurações)
4. Clique em "Environment Variables"
5. Adicione cada variável:

### Variável 1: VITE_FIREBASE_API_KEY
- **Name**: `VITE_FIREBASE_API_KEY`
- **Value**: Cole o valor de `apiKey` do Firebase
- Clique "Add"

### Variável 2: VITE_FIREBASE_AUTH_DOMAIN
- **Name**: `VITE_FIREBASE_AUTH_DOMAIN`
- **Value**: Cole o valor de `authDomain`
- Clique "Add"

### Variável 3: VITE_FIREBASE_PROJECT_ID
- **Name**: `VITE_FIREBASE_PROJECT_ID`
- **Value**: Cole o valor de `projectId`
- Clique "Add"

### Variável 4: VITE_FIREBASE_STORAGE_BUCKET
- **Name**: `VITE_FIREBASE_STORAGE_BUCKET`
- **Value**: Cole o valor de `storageBucket`
- Clique "Add"

### Variável 5: VITE_FIREBASE_MESSAGING_SENDER_ID
- **Name**: `VITE_FIREBASE_MESSAGING_SENDER_ID`
- **Value**: Cole o valor de `messagingSenderId`
- Clique "Add"

### Variável 6: VITE_FIREBASE_APP_ID
- **Name**: `VITE_FIREBASE_APP_ID`
- **Value**: Cole o valor de `appId`
- Clique "Add"

---

## ✅ PASSO 8: Redeploy na Vercel

1. Volte para "Deployments"
2. Clique no último deployment
3. Clique em "Redeploy"
4. Aguarde alguns minutos

---

## ✅ Pronto!

Seu sistema está funcionando! 

Acesse: `https://seu-projeto.vercel.app`

Você verá a página de login.

---

## 📝 Teste o Login

1. Clique em "Não tem conta? Crie uma"
2. Preencha:
   - Email: `teste@example.com`
   - Senha: `senha123`
3. Clique em "Criar Conta"
4. Você será redirecionado para o Dashboard!

---

## 🎉 Sucesso!

Seu sistema de gestão de metas está online e funcionando!

Próximos passos:
- Implementar módulo de setores
- Implementar módulo de metas
- Implementar módulo de resultados
- Implementar fluxo de aprovação
- Criar dashboards

---

**Qualquer dúvida, consulte os arquivos .md do projeto!**
