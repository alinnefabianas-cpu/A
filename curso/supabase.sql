-- Do Corte ao Pix: tabela de progresso para o login na nuvem (Supabase).
-- Rode no SQL Editor do seu projeto Supabase uma única vez.

create table if not exists public.progresso (
  user_id uuid primary key references auth.users (id) on delete cascade,
  dados jsonb not null default '{}'::jsonb,
  atualizado_em timestamptz not null default now()
);

alter table public.progresso enable row level security;

-- Cada aluno só lê e grava o próprio progresso.
create policy "ler o próprio progresso" on public.progresso
  for select using (auth.uid() = user_id);
create policy "criar o próprio progresso" on public.progresso
  for insert with check (auth.uid() = user_id);
create policy "atualizar o próprio progresso" on public.progresso
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
