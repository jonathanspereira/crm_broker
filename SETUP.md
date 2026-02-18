# 🎯 Setup Rápido - CRM Broker

## ⚡ Passos para Rodar o Projeto

### 1️⃣ Configurar Banco de Dados Supabase

```bash
# 1. Acesse https://app.supabase.com
# 2. Abra o SQL Editor
# 3. Cole e execute o conteúdo do arquivo:
```
📁 `database/create-leads-table.sql`

### 2️⃣ Configurar Senha do Banco

```bash
# Edite o arquivo:
```
📁 `frontend/.env.local`

```env
# Substitua [YOUR-PASSWORD] pela sua senha do Supabase:
DATABASE_URL=postgresql://postgres:SUA_SENHA_AQUI@db.rusitibqohetwmfdwnhy.supabase.co:5432/postgres
```

### 3️⃣ Instalar e Rodar

```bash
cd frontend

# Instalar dependências (já instaladas: pg, @types/pg)
npm install

# Rodar servidor de desenvolvimento
npm run dev
```

### 4️⃣ Acessar

Abra: [http://localhost:3000](http://localhost:3000)

---

## ✅ Checklist

- [ ] Script SQL executado no Supabase
- [ ] Tabela `leads` criada no banco
- [ ] Senha configurada em `.env.local`
- [ ] `npm install` executado
- [ ] Servidor rodando em `localhost:3000`

---

## 🧪 Testar API

Após configurar, teste a API:

```bash
# GET - Listar todos os leads
curl http://localhost:3000/api/leads

# POST - Criar novo lead
curl -X POST http://localhost:3000/api/leads \
  -H "Content-Type: application/json" \
  -d '{
    "origem": "WhatsApp",
    "name": "Teste Silva",
    "email": "teste@example.com",
    "phone": "(11) 98765-4321"
  }'
```

---

## 🆘 Problemas Comuns

### ❌ Erro: "Module not found: Can't resolve 'pg'"
```bash
cd frontend
npm install
```

### ❌ Erro: "Connection refused" ou "ECONNREFUSED"
- Verifique a senha em `.env.local`
- Confirme que executou o script SQL no Supabase

### ❌ Erro: "relation \"leads\" does not exist"
- Execute o script `database/create-leads-table.sql` no SQL Editor do Supabase

### ❌ Leads não aparecem na interface
- Abra o Console do navegador (F12)
- Verifique se há erros na aba Console
- Confirme que a API responde em `/api/leads`

---

## 📚 Documentação Completa

Veja: [README.md](../README.md)
