-- 1. Create Categories Table
create table public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_at bigint default extract(epoch from now()) * 1000
);

-- 2. Create Sub-Categories Table
create table public.sub_categories (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references public.categories(id) on delete cascade,
  name text not null,
  created_at bigint default extract(epoch from now()) * 1000
);

-- 3. Create Apps Table
create table public.apps (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references public.categories(id) on delete cascade,
  sub_category_id uuid references public.sub_categories(id) on delete cascade,
  name text not null,
  url text not null,
  ai_studio_url text,
  description text,
  created_at bigint default extract(epoch from now()) * 1000
);

-- 4. Enable Row Level Security (Optional: allows public access for now)
alter table public.categories enable row level security;
alter table public.sub_categories enable row level security;
alter table public.apps enable row level security;

-- 5. Create Policies to allow public read/write (since we aren't using Supabase Auth yet)
create policy "Allow public read access on categories" on public.categories for select using (true);
create policy "Allow public insert access on categories" on public.categories for insert with check (true);

create policy "Allow public read access on sub_categories" on public.sub_categories for select using (true);
create policy "Allow public insert access on sub_categories" on public.sub_categories for insert with check (true);

create policy "Allow public read access on apps" on public.apps for select using (true);
create policy "Allow public insert access on apps" on public.apps for insert with check (true);
