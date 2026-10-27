-- Synthetic development fixtures ONLY. Reruns do not duplicate these rows.
begin;
insert into public.events(id,title,description,category,starts_at,ends_at,location,
  image_path,publication_status,is_featured)
values
('10000000-0000-4000-8000-000000000001',
 'DEMO - Published backend workshop',
 'Synthetic classroom event used to verify public event visibility.',
 'WORKSHOP','2026-11-02T15:00:00Z','2026-11-02T16:00:00Z','Classroom demo',
 '/students/gizem/transformer-architecture.jpg','published',false),
('10000000-0000-4000-8000-000000000002',
 'DEMO - Hidden draft',
 'Synthetic draft that must not be returned to a public visitor.',
 'TALK','2026-11-09T15:00:00Z',null,'Classroom demo',null,'draft',false)
on conflict (id) do nothing;
insert into public.contact_messages(id,full_name,university_email,area_of_interest,message)
values ('20000000-0000-4000-8000-000000000001',
 'Demo Student','demo@example.invalid','General Inquiry',
 'Synthetic classroom message; this is not a real student submission.')
on conflict (id) do nothing;
commit;
