-- Script SQL para criar a tabela de leads no Supabase
-- Execute este script no SQL Editor do Supabase antes de usar a aplicação

-- Criar tabela leads
CREATE TABLE IF NOT EXISTS leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  origem TEXT,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'novo' CHECK (status IN ('novo', 'qualificado', 'negociacao', 'fechado', 'perdido')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_leads_origem ON leads(origem);
CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email);

-- Comentários da tabela
COMMENT ON TABLE leads IS 'Tabela de leads do CRM Broker';
COMMENT ON COLUMN leads.id IS 'Identificador único do lead (UUID)';
COMMENT ON COLUMN leads.origem IS 'Origem do lead (WhatsApp, Instagram, Indicação, etc)';
COMMENT ON COLUMN leads.name IS 'Nome completo do lead';
COMMENT ON COLUMN leads.email IS 'Email do lead';
COMMENT ON COLUMN leads.phone IS 'Telefone do lead';
COMMENT ON COLUMN leads.status IS 'Status do lead: novo, qualificado, negociacao, fechado, perdido';
COMMENT ON COLUMN leads.created_at IS 'Data e hora de criação do lead';

-- Inserir dados de exemplo (opcional)
INSERT INTO leads (origem, name, email, phone, status) VALUES
  ('WhatsApp', 'João Silva', 'joao.silva@example.com', '(11) 98765-4321', 'novo'),
  ('Instagram', 'Maria Santos', 'maria.santos@example.com', '(21) 97654-3210', 'qualificado'),
  ('Indicação', 'Pedro Oliveira', 'pedro.oliveira@example.com', '(31) 96543-2109', 'negociacao')
ON CONFLICT DO NOTHING;
