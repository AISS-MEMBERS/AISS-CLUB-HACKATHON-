-- Additive integration change. Existing AISS tables and membership are preserved.
-- Run once on the existing AISS development database after the original baseline.
begin;
create schema if not exists aiss_private;
revoke all on schema aiss_private from public, anon, authenticated;
grant usage on schema aiss_private to service_role;
create table aiss_private.request_limits (
  scope text not null check (scope in ('contact','login')),
  bucket_hash text not null check (bucket_hash ~ '^[0-9a-f]{64}$'),
  attempts integer not null check (attempts > 0),
  expires_at timestamptz not null,
  primary key (scope,bucket_hash)
);
alter table aiss_private.request_limits enable row level security;
revoke all on aiss_private.request_limits from public, anon, authenticated;
grant select,insert,update,delete on aiss_private.request_limits to service_role;
create index request_limits_expiry_idx on aiss_private.request_limits(expires_at);

-- SECURITY INVOKER: only service_role has the private table privileges.
-- No public SECURITY DEFINER function or public RPC execution grant.
create function public.aiss_consume_rate_limit(p_scope text,p_bucket text)
returns table(allowed boolean,retry_after integer)
language plpgsql security invoker set search_path = ''
as $$
declare
  v_now timestamptz := clock_timestamp();
  v_seconds integer;
  v_attempts integer;
  v_expiry timestamptz;
begin
  if p_scope is null or p_scope not in ('contact','login') or
     p_bucket is null or p_bucket !~ '^[0-9a-f]{64}$' then
    raise exception 'Invalid request limit input' using errcode='22023';
  end if;
  v_seconds := case when p_scope='contact' then 600 else 900 end;
  insert into aiss_private.request_limits as limits(scope,bucket_hash,attempts,expires_at)
  values(p_scope,p_bucket,1,v_now + make_interval(secs => v_seconds))
  on conflict(scope,bucket_hash) do update set
    attempts = case when limits.expires_at <= v_now then 1 else least(limits.attempts + 1,6) end,
    expires_at = case when limits.expires_at <= v_now then
      v_now + make_interval(secs => v_seconds) else limits.expires_at end
  returning attempts,expires_at into v_attempts,v_expiry;
  -- Bounded cleanup of stale identifiers. The new/current bucket cannot match.
  delete from aiss_private.request_limits where (scope,bucket_hash) in (
    select stale.scope,stale.bucket_hash from aiss_private.request_limits stale
    where stale.expires_at < v_now - interval '1 day' order by stale.expires_at limit 100
  );
  return query select v_attempts <= 5,
    case when v_attempts <= 5 then 0 else greatest(1,ceil(extract(epoch from (v_expiry-v_now)))::integer) end;
end $$;
revoke all on function public.aiss_consume_rate_limit(text,text) from public,anon,authenticated;
grant execute on function public.aiss_consume_rate_limit(text,text) to service_role;
notify pgrst,'reload schema';
commit;
