-- Apply once to the EXISTING AISS database. No old tables or rows are recreated.
begin;
alter table public.events drop constraint events_image_path_check;
alter table public.events add constraint events_image_path_check check (
  image_path is null or image_path in (
    '/students/gizem/ai-ethics.jpg','/students/gizem/computer-vision.jpg',
    '/students/gizem/llm-finetuning.jpg','/students/gizem/transformer-architecture.jpg'
  ) or image_path ~ '^/api/event-covers/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.jpg$'
);

-- Create the bucket through scripts/setup-event-covers.mjs (Storage API).
-- No direct inserts/deletes into Storage metadata, no upsert, no replacement grants.
create policy aiss_event_covers_admin_insert on storage.objects for insert to authenticated
with check (
  bucket_id = 'event-covers'
  and (storage.foldername(name))[1] = (select auth.uid())::text
  and name ~ '^[0-9a-f-]{36}/[0-9a-f-]{36}\.jpg$'
  and exists (select 1 from public.admin_users a where a.user_id = (select auth.uid()))
);
create policy aiss_event_covers_admin_select on storage.objects for select to authenticated
using (
  bucket_id = 'event-covers'
  and exists (select 1 from public.admin_users a where a.user_id = (select auth.uid()))
);
notify pgrst, 'reload schema';
commit;
