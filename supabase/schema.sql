-- ---------------------------------------------------------------------------
-- Datenbankschema für Shop, Bestellungen und Anfragen
-- Im Supabase-Dashboard unter „SQL Editor“ einmalig ausführen.
--
-- Zugriff erfolgt ausschließlich serverseitig mit dem Service-/Secret-Key.
-- Row Level Security ist aktiv und es gibt bewusst KEINE öffentlichen
-- Policies: Browser (anon/publishable key) können diese Tabellen weder
-- lesen noch beschreiben.
-- ---------------------------------------------------------------------------

create extension if not exists "pgcrypto";

-- Bestellungen (werden nur vom Stripe-Webhook angelegt/aktualisiert)
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  stripe_session_id text not null unique,
  stripe_payment_intent_id text,
  user_id uuid references auth.users (id) on delete set null,
  email text,
  status text not null default 'pending' check (status in ('pending', 'paid', 'failed', 'refunded')),
  amount_total integer not null default 0,
  currency text not null default 'eur',
  invoice_url text,
  consent_waiver_at timestamptz,
  livemode boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists orders_email_idx on public.orders (lower(email));
create index if not exists orders_user_idx on public.orders (user_id);
create index if not exists orders_pi_idx on public.orders (stripe_payment_intent_id);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders (id) on delete cascade,
  product_slug text not null,
  product_name text not null,
  quantity integer not null default 1 check (quantity > 0),
  unit_amount integer not null default 0,
  created_at timestamptz not null default now(),
  unique (order_id, product_slug)
);

-- Kontakt- und Projektanfragen
create table if not exists public.inquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  company text,
  service text not null,
  website text,
  message text not null,
  budget text,
  timeframe text,
  source text,
  status text not null default 'neu' check (status in ('neu', 'in_bearbeitung', 'erledigt')),
  created_at timestamptz not null default now()
);

-- updated_at automatisch pflegen
create or replace function public.touch_updated_at() returns trigger
language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists orders_touch on public.orders;
create trigger orders_touch before update on public.orders
  for each row execute function public.touch_updated_at();

-- Row Level Security: alles gesperrt, nur Service-Rolle hat Zugriff
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.inquiries enable row level security;

-- Privater Speicher für Produktdateien (kein öffentlicher Zugriff)
insert into storage.buckets (id, name, public)
values ('product-files', 'product-files', false)
on conflict (id) do update set public = false;
