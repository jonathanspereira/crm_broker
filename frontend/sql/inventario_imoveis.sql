create table if not exists public.inventario_imoveis (
  id text primary key,
  nome text not null,
  pavimentos jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists inventario_imoveis_created_at_idx
  on public.inventario_imoveis (created_at desc);

create or replace function public.set_updated_at_inventario_imoveis()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_set_updated_at_inventario_imoveis on public.inventario_imoveis;

create trigger trg_set_updated_at_inventario_imoveis
before update on public.inventario_imoveis
for each row
execute function public.set_updated_at_inventario_imoveis();
