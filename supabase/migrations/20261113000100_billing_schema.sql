-- lokalhost Pro: billing schema. Additive only — safe to apply while the
-- current site is live. Re-runnable (idempotent guards throughout).

-- ───────────────────────── types ─────────────────────────
do $$ begin
  create type public.subscription_status as enum
    ('created','authenticated','active','pending','halted','cancelled','completed','expired');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.payment_status as enum ('created','authorized','captured','failed','refunded');
exception when duplicate_object then null; end $$;

create or replace function public.set_updated_at() returns trigger
language plpgsql set search_path = public as $$
begin
  new.updated_at = now();
  return new;
end $$;

-- ───────────────────────── tables ─────────────────────────
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  avatar_url text,
  provider_customer_id text unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.plans (
  id text primary key,
  name text not null,
  billing_type text not null check (billing_type in ('recurring','one_time')),
  amount integer not null check (amount > 0),
  currency text not null default 'INR',
  duration_days integer,
  provider text not null default 'razorpay',
  provider_plan_id text,
  is_active boolean not null default true,
  features jsonb not null default '[]'
);

create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  plan_id text not null references public.plans(id),
  provider text not null default 'razorpay',
  provider_subscription_id text unique not null,
  status public.subscription_status not null default 'created',
  current_period_start timestamptz,
  current_period_end timestamptz,
  cancel_at_period_end boolean not null default false,
  cancelled_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists subscriptions_user_idx on public.subscriptions (user_id, created_at desc);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  plan_id text not null references public.plans(id),
  provider text not null default 'razorpay',
  provider_order_id text unique not null,
  receipt text unique not null,
  amount integer not null,
  currency text not null default 'INR',
  status text not null default 'created' check (status in ('created','paid','failed','expired')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists orders_user_idx on public.orders (user_id, created_at desc);

create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  provider text not null default 'razorpay',
  provider_payment_id text unique not null,
  order_id uuid references public.orders(id),
  subscription_id uuid references public.subscriptions(id),
  amount integer not null,
  currency text not null default 'INR',
  status public.payment_status not null,
  method text,
  provider_invoice_id text,
  raw jsonb,
  created_at timestamptz not null default now()
);
create index if not exists payments_user_idx on public.payments (user_id, created_at desc);

create table if not exists public.entitlements (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  source_type text not null check (source_type in ('subscription','order','manual')),
  source_id uuid,
  provider_payment_id text unique,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  revoked_at timestamptz,
  note text,
  created_at timestamptz not null default now(),
  check (ends_at > starts_at)
);
create index if not exists entitlements_active_idx on public.entitlements (user_id, ends_at) where revoked_at is null;

create table if not exists public.webhook_events (
  id text primary key,
  provider text not null default 'razorpay',
  event_type text not null,
  payload jsonb not null,
  received_at timestamptz not null default now(),
  processed_at timestamptz,
  attempts integer not null default 0,
  error text
);

create table if not exists public.api_tokens (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  token_prefix text not null,
  token_hash text unique not null,
  last_used_at timestamptz,
  expires_at timestamptz,
  revoked_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.item_sources (
  id uuid primary key default gen_random_uuid(),
  item_type text not null check (item_type in ('component','block','screen','mobile_component','app','template')),
  item_id text not null,
  registry_name text unique not null,
  files jsonb not null,
  dependencies text[] not null default '{}',
  registry_dependencies text[] not null default '{}',
  install_notes text,
  updated_at timestamptz not null default now(),
  unique (item_type, item_id)
);

create table if not exists public.access_logs (
  id bigint generated always as identity primary key,
  user_id uuid references auth.users(id) on delete set null,
  item_type text,
  item_id text,
  kind text not null check (kind in ('code_view','cli_install','zip_download','copy_prompt')),
  ip inet,
  user_agent text,
  created_at timestamptz not null default now()
);

create table if not exists public.email_log (
  id bigint generated always as identity primary key,
  user_id uuid references auth.users(id) on delete set null,
  kind text not null,
  ref_id text not null,
  sent_at timestamptz not null default now(),
  unique (kind, ref_id)
);

-- ───────────────────── updated_at triggers ─────────────────────
do $$
declare t text;
begin
  foreach t in array array['profiles','subscriptions','orders','item_sources'] loop
    execute format('drop trigger if exists %I on public.%I', t || '_set_updated_at', t);
    execute format('create trigger %I before update on public.%I for each row execute function public.set_updated_at()', t || '_set_updated_at', t);
  end loop;
end $$;

-- ───────────────────── profile auto-create ─────────────────────
create or replace function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (
    new.id,
    coalesce(new.email, ''),
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name'),
    new.raw_user_meta_data->>'avatar_url'
  )
  on conflict (id) do nothing;
  return new;
end $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

-- backfill profiles for users that already exist
insert into public.profiles (id, email, full_name, avatar_url)
select u.id, coalesce(u.email, ''),
       coalesce(u.raw_user_meta_data->>'full_name', u.raw_user_meta_data->>'name'),
       u.raw_user_meta_data->>'avatar_url'
from auth.users u
on conflict (id) do nothing;

-- ───────────────────────── RLS ─────────────────────────
alter table public.profiles        enable row level security;
alter table public.plans           enable row level security;
alter table public.subscriptions   enable row level security;
alter table public.orders          enable row level security;
alter table public.payments        enable row level security;
alter table public.entitlements    enable row level security;
alter table public.webhook_events  enable row level security;
alter table public.api_tokens      enable row level security;
alter table public.item_sources    enable row level security;
alter table public.access_logs     enable row level security;
alter table public.email_log       enable row level security;

-- Strip the default broad grants, then hand back only what clients need.
revoke all on public.profiles, public.plans, public.subscriptions, public.orders, public.payments,
  public.entitlements, public.webhook_events, public.api_tokens, public.item_sources,
  public.access_logs, public.email_log from anon, authenticated;

grant select on public.plans to anon, authenticated;
grant select on public.profiles, public.subscriptions, public.orders, public.entitlements to authenticated;
-- payments: everything except the raw provider payload
grant select (id, user_id, provider, provider_payment_id, order_id, subscription_id, amount, currency,
  status, method, provider_invoice_id, created_at) on public.payments to authenticated;
-- profiles: clients may edit their name/avatar only (never provider_customer_id / email)
grant update (full_name, avatar_url) on public.profiles to authenticated;

drop policy if exists "plans: public read active" on public.plans;
create policy "plans: public read active" on public.plans for select to anon, authenticated using (is_active);

drop policy if exists "profiles: read own" on public.profiles;
create policy "profiles: read own" on public.profiles for select to authenticated using (id = (select auth.uid()));
drop policy if exists "profiles: update own" on public.profiles;
create policy "profiles: update own" on public.profiles for update to authenticated
  using (id = (select auth.uid())) with check (id = (select auth.uid()));

drop policy if exists "subscriptions: read own" on public.subscriptions;
create policy "subscriptions: read own" on public.subscriptions for select to authenticated using (user_id = (select auth.uid()));
drop policy if exists "orders: read own" on public.orders;
create policy "orders: read own" on public.orders for select to authenticated using (user_id = (select auth.uid()));
drop policy if exists "payments: read own" on public.payments;
create policy "payments: read own" on public.payments for select to authenticated using (user_id = (select auth.uid()));
drop policy if exists "entitlements: read own" on public.entitlements;
create policy "entitlements: read own" on public.entitlements for select to authenticated using (user_id = (select auth.uid()));
-- webhook_events, api_tokens, item_sources, access_logs, email_log: no policies → service role only.

-- ───────────────────── access checks ─────────────────────
create or replace function public.has_active_access(uid uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from entitlements
    where user_id = uid and revoked_at is null
      and now() >= starts_at and now() < ends_at
  );
$$;
revoke execute on function public.has_active_access(uuid) from public, anon, authenticated;
grant execute on function public.has_active_access(uuid) to service_role;

create or replace function public.my_access() returns table (has_access boolean, ends_at timestamptz)
language sql stable security definer set search_path = public as $$
  select exists (
           select 1 from entitlements
           where user_id = auth.uid() and revoked_at is null
             and now() >= starts_at and now() < ends_at),
         (select max(e.ends_at) from entitlements e
           where e.user_id = auth.uid() and e.revoked_at is null and e.ends_at > now());
$$;
revoke execute on function public.my_access() from public, anon;
grant execute on function public.my_access() to authenticated, service_role;

-- ───────────────────── grant / revoke (atomic) ─────────────────────
-- Yearly one-time order. Stacks: starts at max(now, latest live ends_at).
create or replace function public.grant_for_order(
  p_order_id uuid, p_provider_payment_id text, p_amount integer, p_currency text,
  p_method text default null, p_raw jsonb default null
) returns jsonb
language plpgsql security definer set search_path = public as $$
declare
  o orders%rowtype;
  pl plans%rowtype;
  v_start timestamptz;
  v_end timestamptz;
  v_inserted integer := 0;
  v_cancel jsonb;
begin
  select * into o from orders where id = p_order_id for update;
  if not found then return jsonb_build_object('ok', false, 'reason', 'order_not_found'); end if;
  if o.user_id is null then return jsonb_build_object('ok', false, 'reason', 'no_user'); end if;
  select * into pl from plans where id = o.plan_id;

  if pl.billing_type <> 'one_time' or pl.duration_days is null
     or p_amount is distinct from pl.amount or p_amount is distinct from o.amount
     or upper(p_currency) is distinct from upper(pl.currency) then
    return jsonb_build_object('ok', false, 'reason', 'amount_mismatch',
      'expected', pl.amount, 'got', p_amount, 'currency', p_currency);
  end if;

  perform pg_advisory_xact_lock(hashtext(o.user_id::text));

  select greatest(now(), coalesce(max(ends_at), now())) into v_start
  from entitlements where user_id = o.user_id and revoked_at is null and ends_at > now();
  v_end := v_start + make_interval(days => pl.duration_days);

  insert into payments (user_id, provider, provider_payment_id, order_id, amount, currency, status, method, raw)
  values (o.user_id, o.provider, p_provider_payment_id, o.id, p_amount, upper(p_currency), 'captured', p_method, p_raw)
  on conflict (provider_payment_id) do update
    set status = case when payments.status = 'refunded' then payments.status else 'captured' end,
        method = coalesce(excluded.method, payments.method),
        raw = coalesce(excluded.raw, payments.raw);

  insert into entitlements (user_id, source_type, source_id, provider_payment_id, starts_at, ends_at)
  values (o.user_id, 'order', o.id, p_provider_payment_id, v_start, v_end)
  on conflict (provider_payment_id) do nothing;
  get diagnostics v_inserted = row_count;

  update orders set status = 'paid' where id = o.id and status <> 'paid';

  -- Live monthly subscriptions the caller must cancel at cycle end with the provider.
  select coalesce(jsonb_agg(jsonb_build_object('id', s.id, 'provider_subscription_id', s.provider_subscription_id)), '[]'::jsonb)
    into v_cancel
  from subscriptions s
  where s.user_id = o.user_id and s.status in ('authenticated','active','pending')
    and not s.cancel_at_period_end;

  return jsonb_build_object('ok', true, 'granted', v_inserted = 1, 'user_id', o.user_id,
    'starts_at', v_start, 'ends_at', v_end, 'subscriptions_to_cancel', v_cancel);
end $$;

-- Monthly subscription charge. Access always mirrors the provider's billing period (+1 day grace).
create or replace function public.grant_for_subscription_charge(
  p_subscription_id uuid, p_provider_payment_id text, p_amount integer, p_currency text,
  p_current_start timestamptz, p_current_end timestamptz,
  p_method text default null, p_raw jsonb default null
) returns jsonb
language plpgsql security definer set search_path = public as $$
declare
  s subscriptions%rowtype;
  pl plans%rowtype;
  v_inserted integer := 0;
begin
  select * into s from subscriptions where id = p_subscription_id for update;
  if not found then return jsonb_build_object('ok', false, 'reason', 'subscription_not_found'); end if;
  if s.user_id is null then return jsonb_build_object('ok', false, 'reason', 'no_user'); end if;
  if p_current_start is null or p_current_end is null or p_current_end <= p_current_start then
    return jsonb_build_object('ok', false, 'reason', 'bad_period');
  end if;
  select * into pl from plans where id = s.plan_id;

  if pl.billing_type <> 'recurring' or p_amount is distinct from pl.amount
     or upper(p_currency) is distinct from upper(pl.currency) then
    return jsonb_build_object('ok', false, 'reason', 'amount_mismatch',
      'expected', pl.amount, 'got', p_amount, 'currency', p_currency);
  end if;

  perform pg_advisory_xact_lock(hashtext(s.user_id::text));

  insert into payments (user_id, provider, provider_payment_id, subscription_id, amount, currency, status, method, raw)
  values (s.user_id, s.provider, p_provider_payment_id, s.id, p_amount, upper(p_currency), 'captured', p_method, p_raw)
  on conflict (provider_payment_id) do update
    set status = case when payments.status = 'refunded' then payments.status else 'captured' end,
        method = coalesce(excluded.method, payments.method),
        raw = coalesce(excluded.raw, payments.raw);

  insert into entitlements (user_id, source_type, source_id, provider_payment_id, starts_at, ends_at)
  values (s.user_id, 'subscription', s.id, p_provider_payment_id, p_current_start, p_current_end + interval '1 day')
  on conflict (provider_payment_id) do nothing;
  get diagnostics v_inserted = row_count;

  -- Never move the period backwards (out-of-order webhooks).
  update subscriptions set
    status = case when status in ('cancelled','completed','expired') then status else 'active'::subscription_status end,
    current_period_start = case when current_period_end is null or p_current_end > current_period_end then p_current_start else current_period_start end,
    current_period_end = greatest(coalesce(current_period_end, p_current_end), p_current_end)
  where id = s.id;

  return jsonb_build_object('ok', true, 'granted', v_inserted = 1, 'user_id', s.user_id,
    'starts_at', p_current_start, 'ends_at', p_current_end + interval '1 day');
end $$;

create or replace function public.revoke_for_payment(p_provider_payment_id text) returns jsonb
language plpgsql security definer set search_path = public as $$
declare v_count integer;
begin
  update entitlements set revoked_at = now()
  where provider_payment_id = p_provider_payment_id and revoked_at is null;
  get diagnostics v_count = row_count;
  update payments set status = 'refunded' where provider_payment_id = p_provider_payment_id;
  return jsonb_build_object('ok', true, 'revoked', v_count);
end $$;

revoke execute on function public.grant_for_order(uuid, text, integer, text, text, jsonb) from public, anon, authenticated;
revoke execute on function public.grant_for_subscription_charge(uuid, text, integer, text, timestamptz, timestamptz, text, jsonb) from public, anon, authenticated;
revoke execute on function public.revoke_for_payment(text) from public, anon, authenticated;
revoke execute on function public.handle_new_user() from public, anon, authenticated;
grant execute on function public.grant_for_order(uuid, text, integer, text, text, jsonb) to service_role;
grant execute on function public.grant_for_subscription_charge(uuid, text, integer, text, timestamptz, timestamptz, text, jsonb) to service_role;
grant execute on function public.revoke_for_payment(text) to service_role;

-- ───────────────────────── seed plans ─────────────────────────
-- provider_plan_id for pro_monthly is synced from RAZORPAY_PLAN_ID_MONTHLY by the app.
insert into public.plans (id, name, billing_type, amount, currency, duration_days, features) values
  ('pro_monthly', 'Pro Monthly', 'recurring', 99900, 'INR', null,
   '["All premium components and blocks","All templates","Mobile UI screens and components","CLI access to the Pro registry","Cancel anytime"]'),
  ('pro_yearly', 'Pro Yearly', 'one_time', 799900, 'INR', 365,
   '["Everything in Monthly","365 days of access","Save 33% vs monthly","One-time payment, no auto-renewal"]')
on conflict (id) do update
  set name = excluded.name, billing_type = excluded.billing_type, amount = excluded.amount,
      currency = excluded.currency, duration_days = excluded.duration_days, features = excluded.features;
