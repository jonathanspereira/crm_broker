# CRM Broker

Sistema de CRM para corretores de imóveis com gestão de leads, simulações financeiras e geração de documentos.

## 🚀 Tecnologias

- **Frontend**: Next.js 16.1.6 com App Router, TypeScript, Tailwind CSS
- **Banco de Dados**: PostgreSQL via Supabase
- **UI**: shadcn/ui components

## 📋 Pré-requisitos

- Node.js 18+ instalado
- Conta no [Supabase](https://supabase.com)
- Senha do banco de dados PostgreSQL do Supabase

## 🔧 Configuração

### 1. Configurar Banco de Dados

1. Acesse o [Supabase Dashboard](https://app.supabase.com)
2. Vá em **SQL Editor**
3. Execute o script SQL em `database/create-leads-table.sql`
4. Verifique se a tabela `leads` foi criada com sucesso

### 2. Configurar Variáveis de Ambiente

1. Abra o arquivo `frontend/.env.local`
2. Substitua `[YOUR-PASSWORD]` pela senha real do seu banco Supabase:
   ```env
   DATABASE_URL=postgresql://postgres:SUA_SENHA_AQUI@db.rusitibqohetwmfdwnhy.supabase.co:5432/postgres
   ```

> ⚠️ **Importante**: Nunca commite o arquivo `.env.local` com a senha. Ele já está no `.gitignore`.

### 3. Instalar Dependências

```bash
cd frontend
npm install
```

### 4. Executar o Projeto

```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000)

## 📁 Estrutura do Projeto

```
crm_broker/
├── frontend/
│   ├── app/
│   │   ├── api/
│   │   │   └── leads/
│   │   │       └── route.ts          # API REST para leads
│   │   └── (private)/
│   │       ├── leads/                # Gestão de leads
│   │       ├── simulador/            # Simulação financeira
│   │       └── documentos/           # Geração de documentos
│   ├── components/                   # Componentes React
│   └── .env.local                    # Credenciais do banco (não commitado)
└── database/
    └── create-leads-table.sql        # Script de criação da tabela
```

## 🗄️ API de Leads

A API REST está disponível em `/api/leads`:

- **GET** `/api/leads` - Lista todos os leads
- **POST** `/api/leads` - Cria novo lead
  ```json
  {
    "origem": "WhatsApp",
    "name": "João Silva",
    "email": "joao@example.com",
    "phone": "(11) 98765-4321",
    "status": "novo"
  }
  ```
- **PUT** `/api/leads` - Atualiza lead existente
  ```json
  {
    "id": "uuid-do-lead",
    "origem": "Instagram",
    "name": "João Silva",
    "email": "joao@example.com",
    "phone": "(11) 98765-4321"
  }
  ```
- **DELETE** `/api/leads?id=uuid-do-lead` - Deleta lead

## ✨ Funcionalidades

### Gestão de Leads
- ✅ Cadastro de leads com origem, nome, email e telefone
- ✅ Filtro por origem (WhatsApp, Instagram, Indicação, etc)
- ✅ Busca por texto em múltiplos campos
- ✅ Edição e exclusão de leads
- ✅ Persistência em PostgreSQL

### Simulador Financeiro
- 📊 Cálculo de financiamento imobiliário
- 💰 Parcelas de Ato, Entrada e Intercaladas
- 📈 Aplicação de FGTS e subsídios

### Documentos
- 📄 Templates de documentos editáveis
- 🔗 Associação de documentos a leads
- 💾 Salvamento automático

## 🔒 Segurança

- Credenciais do banco armazenadas em variáveis de ambiente
- Conexão SSL com Supabase
- `.env.local` ignorado pelo git

## 📝 Notas

- O status inicial de novos leads é sempre "novo"
- A coluna `origem` é opcional mas recomendada para rastreamento
- O banco usa UUID para IDs (gerado automaticamente)
- Os timestamps são em UTC com timezone

## 🐛 Solução de Problemas

### Erro de conexão com banco de dados
- Verifique se a senha em `.env.local` está correta
- Confirme que executou o script `create-leads-table.sql`
- Teste a conexão no Supabase Dashboard

### Leads não aparecem na tabela
- Abra o console do navegador (F12) e verifique erros
- Confirme que a API está respondendo em `/api/leads`
- Verifique se há dados na tabela `leads` no Supabase

### Erro "Module not found: Can't resolve 'pg'"
- Execute `npm install` novamente na pasta `frontend/`
- Reinicie o servidor de desenvolvimento

## 📞 Suporte

Para problemas ou dúvidas, verifique:
- Logs do terminal onde o servidor está rodando
- Console do navegador (F12 > Console)
- Logs do Supabase Dashboard
