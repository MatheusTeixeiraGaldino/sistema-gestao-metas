# Sistema de Gestão de Metas - TODO

## Funcionalidades Principais

### Estrutura Organizacional
- [ ] Modelo de dados para setores (nome, descrição, responsáveis)
- [ ] Modelo de dados para responsáveis (cadastrador, aprovador, acompanhador)
- [ ] API para criar/editar/listar setores
- [ ] Interface para cadastro de setores
- [ ] Integração com links do Google Drive para evidências

### Gestão de Metas
- [ ] Modelo de dados para metas (tipo: %, inteiro, data; peso; descrição)
- [ ] Validação de soma de pesos por setor
- [ ] API para criar/editar/listar metas
- [ ] Interface para gestão de metas
- [ ] Suporte para 3 tipos de metas (percentual, inteiro, data)

### Apontamento de Resultados
- [ ] Modelo de dados para resultados (valor, evidências, data)
- [ ] Interface para colaboradores apontarem resultados
- [ ] Upload de arquivos/imagens/planilhas
- [ ] Link para pasta do Drive para evidências
- [ ] Validação de tipos de dados

### Fluxo de Validação
- [ ] Modelo de dados para aprovações (status, comentários, rastreabilidade)
- [ ] API para aprovação/reprovação de resultados
- [ ] Interface para ADMIN revisar resultados
- [ ] Sistema de comentários e feedback
- [ ] Rastreabilidade de alterações

### Dashboards e Relatórios
- [ ] Dashboard consolidado por setor
- [ ] Dashboard consolidado por período
- [ ] Status dos resultados (rascunho, enviado, aprovado, reprovado)
- [ ] Gráficos e estatísticas
- [ ] Exportação de relatórios

### Autenticação e Segurança
- [ ] Integração com Manus OAuth (já existe)
- [ ] Roles de usuário (ADMIN, colaborador)
- [ ] Controle de acesso por setor
- [ ] Auditoria de ações

### Configuração de Deploy
- [ ] Arquivo .env.example
- [ ] Configuração do GitHub Actions
- [ ] Configuração da Vercel
- [ ] Documentação de setup
- [ ] Instruções para integração com Firebase

## Status Geral
- [x] Projeto inicializado com stack React + Express + tRPC + Tailwind
- [x] Banco de dados configurado (schema e migrações)
- [x] Arquivos de configuração Firebase criados
- [x] Arquivos de configuração GitHub e CI/CD criados
- [x] Arquivos de configuração Vercel criados
- [x] Documentação completa gerada
- [x] Guia 100% online sem instalação criado
- [ ] Autenticação com Firebase implementada
- [ ] Funcionalidades core desenvolvidas (setores, metas, resultados, aprovações)
- [ ] Dashboards e relatórios implementados
- [ ] Deploy configurado e testado
