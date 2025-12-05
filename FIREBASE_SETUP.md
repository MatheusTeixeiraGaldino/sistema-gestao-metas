# Configuração do Firebase

Este documento descreve como configurar o Firebase para o Sistema de Gestão de Metas.

## Pré-requisitos

- Conta Google ativa
- Acesso ao [Firebase Console](https://console.firebase.google.com)
- Node.js 18+ instalado localmente (para CLI do Firebase)

## Passo 1: Criar Projeto Firebase

1. Acesse [Firebase Console](https://console.firebase.google.com)
2. Clique em **"Criar projeto"**
3. Insira o nome do projeto: `metas-management-system`
4. Desabilite Google Analytics (opcional)
5. Clique em **"Criar projeto"**

## Passo 2: Configurar Autenticação

### Habilitar Métodos de Autenticação

1. No Firebase Console, vá para **Autenticação** → **Métodos de login**
2. Habilite os seguintes provedores:
   - **Email/Senha**
   - **Google** (recomendado para integração SSO)
   - **OAuth customizado** (se usar Manus OAuth)

### Configurar OAuth Google

1. Vá para **Autenticação** → **Configurações**
2. Em **Domínios autorizados**, adicione:
   - `localhost:3000`
   - `seu-dominio.vercel.app`
   - `seu-dominio-customizado.com`

## Passo 3: Configurar Firestore Database

1. No Firebase Console, vá para **Firestore Database**
2. Clique em **Criar banco de dados**
3. Selecione **Modo de produção**
4. Escolha a região: `us-central1` (ou mais próxima de seus usuários)
5. Clique em **Criar**

### Definir Regras de Segurança

Substitua as regras padrão pelas seguintes (em **Firestore** → **Regras**):

```firestore
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Usuários podem ler/escrever seus próprios dados
    match /users/{userId} {
      allow read, write: if request.auth.uid == userId;
    }

    // Setores: apenas criadores e admins podem editar
    match /sectors/{sectorId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null && request.auth.token.admin == true;
      allow update, delete: if request.auth != null && 
        (resource.data.createdBy == request.auth.uid || request.auth.token.admin == true);
    }

    // Metas: leitura para todos autenticados, escrita para criadores
    match /goals/{goalId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null && request.auth.token.admin == true;
      allow update, delete: if request.auth != null && request.auth.token.admin == true;
    }

    // Resultados: colaboradores podem criar/editar seus próprios
    match /results/{resultId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update: if request.auth != null && resource.data.userId == request.auth.uid;
    }

    // Aprovações: apenas admins podem criar
    match /approvals/{approvalId} {
      allow read: if request.auth != null;
      allow create, update: if request.auth != null && request.auth.token.admin == true;
    }
  }
}
```

## Passo 4: Configurar Cloud Storage

1. No Firebase Console, vá para **Storage**
2. Clique em **Começar**
3. Selecione **Modo de produção**
4. Escolha a região: `us-central1`
5. Clique em **Criar**

### Definir Regras de Storage

Substitua as regras padrão (em **Storage** → **Regras**):

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Evidências de resultados
    match /evidence/{userId}/{allPaths=**} {
      allow read: if request.auth != null;
      allow write: if request.auth.uid == userId;
    }

    // Documentos do sistema
    match /documents/{allPaths=**} {
      allow read: if request.auth != null;
      allow write: if request.auth.token.admin == true;
    }
  }
}
```

## Passo 5: Obter Credenciais

1. No Firebase Console, vá para **Configurações do Projeto** (ícone de engrenagem)
2. Clique na aba **Contas de Serviço**
3. Clique em **Gerar nova chave privada**
4. Salve o arquivo JSON com segurança

### Configurar Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto com as credenciais do Firebase:

```env
# Firebase Config
VITE_FIREBASE_API_KEY=seu_api_key
VITE_FIREBASE_AUTH_DOMAIN=seu-projeto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=seu-projeto-id
VITE_FIREBASE_STORAGE_BUCKET=seu-projeto.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=seu_sender_id
VITE_FIREBASE_APP_ID=seu_app_id

# Backend (Node.js)
FIREBASE_SERVICE_ACCOUNT_KEY=seu_service_account_json_base64
```

## Passo 6: Configurar Autenticação Customizada (Opcional)

Se estiver usando Manus OAuth, configure a integração:

1. No Firebase Console, vá para **Autenticação** → **Provedores**
2. Adicione um novo provedor OAuth customizado
3. Configure os endpoints do Manus OAuth conforme documentado em `DEPLOYMENT.md`

## Passo 7: Habilitar Funções Cloud (Opcional)

Para automações backend:

1. No Firebase Console, vá para **Cloud Functions**
2. Clique em **Criar função**
3. Configure conforme necessário para suas automações

## Verificação

Para verificar se tudo está configurado corretamente:

```bash
# Testar conexão com Firebase
npm run test:firebase

# Verificar regras de Firestore
npm run verify:firestore-rules

# Verificar regras de Storage
npm run verify:storage-rules
```

## Próximos Passos

- Consulte `DEPLOYMENT.md` para configurar o deploy na Vercel
- Consulte `GITHUB_SETUP.md` para configurar CI/CD com GitHub Actions
- Consulte `README.md` para instruções de desenvolvimento local

## Suporte

Para mais informações sobre Firebase, consulte:
- [Documentação oficial do Firebase](https://firebase.google.com/docs)
- [Firestore Documentation](https://firebase.google.com/docs/firestore)
- [Firebase Storage Documentation](https://firebase.google.com/docs/storage)
