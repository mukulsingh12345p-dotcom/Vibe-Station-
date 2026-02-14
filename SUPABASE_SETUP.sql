-- 1. Create Categories Table (if not exists)
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_at bigint default extract(epoch from now()) * 1000
);

-- 2. Create Sub-Categories Table (if not exists)
create table if not exists public.sub_categories (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references public.categories(id) on delete cascade,
  name text not null,
  created_at bigint default extract(epoch from now()) * 1000
);

-- 3. Create Apps Table (if not exists)
create table if not exists public.apps (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references public.categories(id) on delete cascade,
  sub_category_id uuid references public.sub_categories(id) on delete cascade,
  name text not null,
  url text not null,
  ai_studio_url text,
  description text,
  created_at bigint default extract(epoch from now()) * 1000
);

-- 4. Enable Row Level Security
alter table public.categories enable row level security;
alter table public.sub_categories enable row level security;
alter table public.apps enable row level security;

-- 5. Create Policies
-- Note: Running these might give an "already exists" error if you ran the previous script. 
-- You can ignore "relation already exists" errors, we just need to ensure the UPDATE/DELETE ones are created.

-- CATEGORIES
create policy "Allow public read access on categories" on public.categories for select using (true);
create policy "Allow public insert access on categories" on public.categories for insert with check (true);
create policy "Allow public update access on categories" on public.categories for update using (true);
create policy "Allow public delete access on categories" on public.categories for delete using (true);

-- SUB-CATEGORIES
create policy "Allow public read access on sub_categories" on public.sub_categories for select using (true);
create policy "Allow public insert access on sub_categories" on public.sub_categories for insert with check (true);
create policy "Allow public update access on sub_categories" on public.sub_categories for update using (true);
create policy "Allow public delete access on sub_categories" on public.sub_categories for delete using (true);

-- APPS
create policy "Allow public read access on apps" on public.apps for select using (true);
create policy "Allow public insert access on apps" on public.apps for insert with check (true);
create policy "Allow public update access on apps" on public.apps for update using (true);
create policy "Allow public delete access on apps" on public.apps for delete using (true);
