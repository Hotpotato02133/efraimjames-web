-- Storage RLS for the "portfolio-assets" bucket (created by scripts/seed.mjs
-- with { public: true }). That flag only makes the public-URL read endpoint
-- bypass RLS — uploads/updates/deletes from the browser (admin CMS, signed
-- in via Supabase Auth) still go through storage.objects RLS like any other
-- table. Without these policies, admin image uploads are rejected.

create policy "portfolio-assets public read"
  on storage.objects for select
  using (bucket_id = 'portfolio-assets');

create policy "portfolio-assets authenticated insert"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'portfolio-assets');

create policy "portfolio-assets authenticated update"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'portfolio-assets')
  with check (bucket_id = 'portfolio-assets');

create policy "portfolio-assets authenticated delete"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'portfolio-assets');
