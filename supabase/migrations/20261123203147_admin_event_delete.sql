-- Allow authenticated club administrators to delete events. Anonymous users retain read-only access.
grant delete on public.events to authenticated;

create policy events_admin_delete on public.events for delete to authenticated
  using (exists (select 1 from public.admin_users a where a.user_id = (select auth.uid())));
