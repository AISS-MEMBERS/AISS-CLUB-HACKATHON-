-- Read-only operator inspection; SQL Editor runs as a privileged operator.
-- It does NOT simulate the browser's RLS access.
select tablename, rowsecurity from pg_tables where schemaname='public'
and tablename in ('events','contact_messages','admin_users');
select tablename, policyname, roles, cmd, qual, with_check from pg_policies
where schemaname='public' and tablename in ('events','contact_messages','admin_users')
order by tablename, policyname;
select
 has_table_privilege('anon','public.events','SELECT') as anonymous_events_select,
 has_table_privilege('anon','public.contact_messages','SELECT') as anonymous_messages_select,
 has_table_privilege('authenticated','public.admin_users','INSERT') as users_can_self_promote,
 has_column_privilege('authenticated','public.contact_messages','status','UPDATE') as status_update_granted,
 has_column_privilege('authenticated','public.contact_messages','message','UPDATE') as message_edit_granted;
-- Expected: true, false, false, true, false.
