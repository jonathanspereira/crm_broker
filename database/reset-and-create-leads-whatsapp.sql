-- Script para recriar a tabela leads
-- Execute isto no SQL Editor do Supabase

-- Dropar tabela anterior (se existir)
DROP TABLE IF NOT EXISTS public.leads CASCADE;

-- Criar tabela leads com estrutura simples
CREATE TABLE public.leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  origem TEXT,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  status TEXT DEFAULT 'novo' CHECK (status IN ('novo', 'qualificado', 'negociacao', 'fechado', 'perdido')),
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar índices para performance
CREATE INDEX IF NOT EXISTS idx_leads_status ON public.leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON public.leads("createdAt" DESC);
CREATE INDEX IF NOT EXISTS idx_leads_origem ON public.leads(origem);
CREATE INDEX IF NOT EXISTS idx_leads_email ON public.leads(email);

-- Criar função de trigger para updatedAt
CREATE OR REPLACE FUNCTION public.set_updated_at_leads()
RETURNS TRIGGER AS $$
BEGIN
  NEW."updatedAt" = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Dropar trigger se existir e recriar
DROP TRIGGER IF EXISTS trg_set_updated_at_leads ON public.leads;
CREATE TRIGGER trg_set_updated_at_leads
BEFORE UPDATE ON public.leads
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at_leads();

-- Comentários
COMMENT ON TABLE public.leads IS 'Tabela de leads do CRM';
COMMENT ON COLUMN public.leads.id IS 'ID único do lead (UUID)';
COMMENT ON COLUMN public.leads.origem IS 'Origem do lead (WhatsApp, Instagram, Lista, etc)';
COMMENT ON COLUMN public.leads.name IS 'Nome do lead';
COMMENT ON COLUMN public.leads.email IS 'Email do lead';
COMMENT ON COLUMN public.leads.phone IS 'Telefone do lead';
COMMENT ON COLUMN public.leads.status IS 'Status do lead (novo, qualificado, negociacao, fechado, perdido)';
COMMENT ON COLUMN public.leads."createdAt" IS 'Data de criação';
COMMENT ON COLUMN public.leads."updatedAt" IS 'Data de atualização';
