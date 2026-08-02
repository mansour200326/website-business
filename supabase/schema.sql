-- Websmith first-party analytics — run this in the Supabase SQL editor.
-- (The existing `leads` table is untouched; the dashboard only reads it.)

create table if not exists public.site_events (
  id            bigint generated always as identity primary key,
  created_at    timestamptz not null default now(),
  type          text not null check (type in ('pageview', 'whatsapp_click', 'tel_click', 'portfolio_click')),
  path          text,
  referrer      text,
  country       text,
  device        text check (device in ('mobile', 'desktop')),
  visitor_hash  text
);

-- The dashboard filters by time range and groups by type — index both.
create index if not exists site_events_created_at_idx on public.site_events (created_at desc);
create index if not exists site_events_type_idx       on public.site_events (type);

-- Lock the table down: RLS on with no policies means the anon/authenticated
-- keys can do nothing. Only the service-role key (used by the server routes,
-- which bypasses RLS) can read or write.
alter table public.site_events enable row level security;
