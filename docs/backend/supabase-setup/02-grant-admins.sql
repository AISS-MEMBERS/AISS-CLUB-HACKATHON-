-- Create both users in Authentication > Users first.
-- Replace BOTH placeholders with the exact existing Auth account emails.
-- Keep the filled-in copy private. Never put passwords in SQL.
begin;
create temporary table aiss_class_admin_emails(email text primary key) on commit drop;
insert into aiss_class_admin_emails(email) values
  ('REPLACE_WITH_MOHAMAD_AUTH_EMAIL'),('REPLACE_WITH_SELEN_AUTH_EMAIL');
do $$
begin
  if exists (
    select 1 from aiss_class_admin_emails requested where not exists (
      select 1 from auth.users u where lower(u.email) = lower(requested.email)
    )
  ) then
    raise exception 'An admin Auth account is missing or a placeholder is unchanged. Create users first and correct both emails.';
  end if;
end $$;
insert into public.admin_users(user_id)
select u.id from auth.users u
join aiss_class_admin_emails requested on lower(requested.email) = lower(u.email)
on conflict (user_id) do nothing;
commit;
select user_id, created_at from public.admin_users order by created_at;
