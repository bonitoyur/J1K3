-- Run on PostgreSQL 14+ (Neon supported). Independent of Firebase and Supabase Auth.
begin;
create table if not exists hiking_mountains (id text primary key);
create table if not exists hiking_visits (
  id uuid primary key default gen_random_uuid(),
  mountain_id text not null references hiking_mountains(id),
  visited_on date not null check (visited_on <= (now() at time zone 'Asia/Seoul')::date),
  author text not null check (char_length(btrim(author)) between 1 and 40),
  comment text not null check (char_length(btrim(comment)) between 1 and 2000),
  owner_hash text not null check (owner_hash ~ '^[a-f0-9]{64}$'),
  created_at timestamptz not null default now()
);
create index if not exists hiking_visits_mountain_idx on hiking_visits(mountain_id);
revoke all on hiking_mountains, hiking_visits from public;
insert into hiking_mountains (id) values
('myeongseong'), ('baegun'), ('hwaak'), ('gamaksan'), ('soyo'),
('unak'), ('myeongji'), ('mani'), ('bukhansan'), ('dobongsan'),
('chukryeong'), ('cheonma'), ('gwanak'), ('yumyeong'), ('yongmun')
on conflict do nothing;
insert into hiking_mountains (id)
select 'national-' || lpad(n::text, 3, '0') from generate_series(1, 85) n
on conflict do nothing;
commit;
