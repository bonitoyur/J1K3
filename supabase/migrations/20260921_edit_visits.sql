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
