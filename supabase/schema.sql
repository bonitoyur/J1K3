-- Supabase SQL Editor에서 실행하세요.
create table if not exists public.mountain_catalog (
  id text primary key
);
alter table public.mountain_catalog enable row level security;
revoke all on public.mountain_catalog from anon, authenticated;

create table if not exists public.mountain_visits (
  id uuid primary key default gen_random_uuid(),
  mountain_id text not null references public.mountain_catalog(id),
  user_id uuid not null references auth.users(id),
  visited_on date not null check (visited_on <= (now() at time zone 'Asia/Seoul')::date),
  author text not null check (char_length(btrim(author)) between 1 and 40),
  comment text not null check (char_length(btrim(comment)) between 1 and 2000),
  created_at timestamptz not null default now()
);
create index if not exists mountain_visits_mountain_idx on public.mountain_visits(mountain_id);
alter table public.mountain_visits enable row level security;
revoke all on public.mountain_visits from anon, authenticated;
grant select (id, mountain_id, visited_on, author, comment) on public.mountain_visits to anon, authenticated;
grant insert (mountain_id, user_id, visited_on, author, comment) on public.mountain_visits to authenticated;
drop policy if exists "Public visit history" on public.mountain_visits;
create policy "Public visit history" on public.mountain_visits for select to anon, authenticated using (true);
drop policy if exists "Create own visit" on public.mountain_visits;
create policy "Create own visit" on public.mountain_visits for insert to authenticated
  with check ((select auth.uid()) = user_id);
-- 작성자 수정/삭제 정책은 파일 아래에 정의되어 있습니다.

insert into public.mountain_catalog (id) values
('myeongseong'),
('baegun'),
('hwaak'),
('gamaksan'),
('soyo'),
('unak'),
('myeongji'),
('mani'),
('bukhansan'),
('dobongsan'),
('chukryeong'),
('cheonma'),
('gwanak'),
('yumyeong'),
('yongmun'),
('national-001'),
('national-002'),
('national-003'),
('national-004'),
('national-005'),
('national-006'),
('national-007'),
('national-008'),
('national-009'),
('national-010'),
('national-011'),
('national-012'),
('national-013'),
('national-014'),
('national-015'),
('national-016'),
('national-017'),
('national-018'),
('national-019'),
('national-020'),
('national-021'),
('national-022'),
('national-023'),
('national-024'),
('national-025'),
('national-026'),
('national-027'),
('national-028'),
('national-029'),
('national-030'),
('national-031'),
('national-032'),
('national-033'),
('national-034'),
('national-035'),
('national-036'),
('national-037'),
('national-038'),
('national-039'),
('national-040'),
('national-041'),
('national-042'),
('national-043'),
('national-044'),
('national-045'),
('national-046'),
('national-047'),
('national-048'),
('national-049'),
('national-050'),
('national-051'),
('national-052'),
('national-053'),
('national-054'),
('national-055'),
('national-056'),
('national-057'),
('national-058'),
('national-059'),
('national-060'),
('national-061'),
('national-062'),
('national-063'),
('national-064'),
('national-065'),
('national-066'),
('national-067'),
('national-068'),
('national-069'),
('national-070'),
('national-071'),
('national-072'),
('national-073'),
('national-074'),
('national-075'),
('national-076'),
('national-077'),
('national-078'),
('national-079'),
('national-080'),
('national-081'),
('national-082'),
('national-083'),
('national-084'),
('national-085')
on conflict (id) do nothing;

-- 기존 schema.sql로 이미 설치한 프로젝트에서 실행합니다. 기존 기록은 유지됩니다.
begin;
grant update (visited_on, author, comment) on public.mountain_visits to authenticated;
grant delete on public.mountain_visits to authenticated;
drop policy if exists "Update own visit" on public.mountain_visits;
create policy "Update own visit" on public.mountain_visits for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);
drop policy if exists "Delete own visit" on public.mountain_visits;
create policy "Delete own visit" on public.mountain_visits for delete to authenticated
  using ((select auth.uid()) = user_id);

-- 소유자 UUID를 공개하지 않고 로그인한 사용자의 기록 ID만 반환합니다.
-- 인자를 받지 않으며 반드시 JWT의 auth.uid()로 제한합니다.
create or replace function public.my_mountain_visit_ids()
returns table (id uuid)
language sql stable security definer set search_path = ''
as $$
  select v.id from public.mountain_visits v where v.user_id = (select auth.uid());
$$;
revoke all on function public.my_mountain_visit_ids() from public, anon;
grant execute on function public.my_mountain_visit_ids() to authenticated;
commit;
