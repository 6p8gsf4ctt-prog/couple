-- COUPLE V3 — Supabase schema
create schema if not exists private;

create table if not exists public.couples (
  id uuid primary key default gen_random_uuid(),
  created_by uuid not null references auth.users(id) on delete cascade,
  invite_code text,
  created_at timestamptz not null default now()
);

create table if not exists public.couple_members (
  couple_id uuid not null references public.couples(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  display_name text not null check (char_length(display_name) between 1 and 40),
  joined_at timestamptz not null default now(),
  primary key (couple_id, user_id),
  unique (user_id)
);

create table if not exists public.vouchers (
  id uuid primary key default gen_random_uuid(),
  couple_id uuid not null references public.couples(id) on delete cascade,
  sender_id uuid not null references auth.users(id) on delete cascade,
  recipient_id uuid not null references auth.users(id) on delete cascade,
  offered_at timestamptz not null default now(),
  status text not null default 'offered' check (status in ('offered','ready','proposal','validated','replan','used')),
  mode text check (mode is null or mode in ('classic','exceptional')),
  moment_at timestamptz,
  exception_when text check (exception_when is null or exception_when in ('date','now')),
  revealed_at timestamptz,
  proposed_at timestamptz,
  validated_at timestamptz,
  rejected_at timestamptz,
  cancelled_at timestamptz,
  used_at timestamptz,
  color text not null default 'red' check (color in ('red','violet','amber','mint')),
  last_event_type text,
  last_event_at timestamptz,
  last_event_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (sender_id <> recipient_id)
);

create table if not exists public.voucher_secrets (
  voucher_id uuid primary key references public.vouchers(id) on delete cascade,
  title text not null check (char_length(title) between 1 and 120),
  message text not null default '',
  content text not null default '',
  usage text not null default '',
  source text not null check (source in ('catalogue','custom')),
  catalogue_id text,
  catalogue_category text,
  custom_category text,
  initial_mode text not null check (initial_mode in ('classic','exceptional')),
  initial_moment_at timestamptz,
  initial_exception_when text check (initial_exception_when is null or initial_exception_when in ('date','now'))
);

create index if not exists couple_members_user_idx on public.couple_members(user_id);
create index if not exists vouchers_couple_idx on public.vouchers(couple_id, offered_at desc);
create index if not exists vouchers_sender_year_idx on public.vouchers(sender_id, offered_at desc);
create index if not exists vouchers_recipient_idx on public.vouchers(recipient_id, offered_at desc);

create or replace function private.my_couple_id()
returns uuid
language sql
stable
security definer
set search_path = ''
as $$
  select cm.couple_id from public.couple_members cm where cm.user_id = (select auth.uid()) limit 1
$$;

create or replace function private.is_couple_member(p_couple_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists(
    select 1 from public.couple_members cm
    where cm.couple_id = p_couple_id and cm.user_id = (select auth.uid())
  )
$$;

revoke all on schema private from public;
grant usage on schema private to authenticated;
revoke all on function private.my_couple_id() from public;
revoke all on function private.is_couple_member(uuid) from public;
grant execute on function private.my_couple_id() to authenticated;
grant execute on function private.is_couple_member(uuid) to authenticated;

alter table public.couples enable row level security;
alter table public.couple_members enable row level security;
alter table public.vouchers enable row level security;
alter table public.voucher_secrets enable row level security;

revoke all on table public.couples from anon, authenticated;
revoke all on table public.couple_members from anon, authenticated;
revoke all on table public.vouchers from anon, authenticated;
revoke all on table public.voucher_secrets from anon, authenticated;
grant select on table public.couples to authenticated;
grant select on table public.couple_members to authenticated;
grant select on table public.vouchers to authenticated;
grant select on table public.voucher_secrets to authenticated;

drop policy if exists couples_select_members on public.couples;
create policy couples_select_members on public.couples for select to authenticated
using ((select private.is_couple_member(id)));

drop policy if exists members_select_same_couple on public.couple_members;
create policy members_select_same_couple on public.couple_members for select to authenticated
using (couple_id = (select private.my_couple_id()));

drop policy if exists vouchers_select_members on public.vouchers;
create policy vouchers_select_members on public.vouchers for select to authenticated
using ((select private.is_couple_member(couple_id)));

drop policy if exists secrets_select_authorized on public.voucher_secrets;
create policy secrets_select_authorized on public.voucher_secrets for select to authenticated
using (
  exists (
    select 1 from public.vouchers v
    where v.id = voucher_id
      and (v.sender_id = (select auth.uid()) or (v.recipient_id = (select auth.uid()) and v.revealed_at is not null))
  )
);

create or replace function public.create_couple(p_display_name text)
returns table(couple_id uuid, invite_code text)
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user uuid := auth.uid();
  v_couple uuid;
  v_code text;
begin
  if v_user is null then raise exception 'AUTH_REQUIRED'; end if;
  if nullif(btrim(p_display_name),'') is null then raise exception 'DISPLAY_NAME_REQUIRED'; end if;
  if exists(select 1 from public.couple_members cm where cm.user_id=v_user) then raise exception 'ALREADY_IN_COUPLE'; end if;
  v_code := upper(substr(replace(gen_random_uuid()::text,'-',''),1,8));
  insert into public.couples(created_by,invite_code)
    values(v_user,v_code) returning id into v_couple;
  insert into public.couple_members(couple_id,user_id,display_name)
    values(v_couple,v_user,left(btrim(p_display_name),40));
  couple_id := v_couple; invite_code := v_code; return next;
end;
$$;

create or replace function public.join_couple(p_invite_code text, p_display_name text)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user uuid := auth.uid();
  v_couple uuid;
begin
  if v_user is null then raise exception 'AUTH_REQUIRED'; end if;
  if nullif(btrim(p_display_name),'') is null then raise exception 'DISPLAY_NAME_REQUIRED'; end if;
  if exists(select 1 from public.couple_members cm where cm.user_id=v_user) then raise exception 'ALREADY_IN_COUPLE'; end if;
  select c.id into v_couple from public.couples c
    where c.invite_code = upper(btrim(p_invite_code))
    for update;
  if v_couple is null then raise exception 'INVALID_INVITE_CODE'; end if;
  if (select count(*) from public.couple_members cm where cm.couple_id=v_couple) >= 2 then raise exception 'COUPLE_FULL'; end if;
  insert into public.couple_members(couple_id,user_id,display_name)
    values(v_couple,v_user,left(btrim(p_display_name),40));
  update public.couples set invite_code=null where id=v_couple;
  return v_couple;
end;
$$;

create or replace function public.renew_invite_code()
returns text
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user uuid := auth.uid();
  v_couple uuid;
  v_code text;
begin
  select cm.couple_id into v_couple from public.couple_members cm where cm.user_id=v_user limit 1;
  if v_couple is null then raise exception 'NO_COUPLE'; end if;
  if (select count(*) from public.couple_members cm where cm.couple_id=v_couple) >= 2 then raise exception 'COUPLE_ALREADY_COMPLETE'; end if;
  v_code := upper(substr(replace(gen_random_uuid()::text,'-',''),1,8));
  update public.couples set invite_code=v_code where id=v_couple;
  return v_code;
end;
$$;

create or replace function public.my_couple()
returns table(couple_id uuid, my_name text, partner_name text, is_complete boolean, invite_open boolean)
language sql
stable
security definer
set search_path = ''
as $$
  select mine.couple_id,
         mine.display_name,
         partner.display_name,
         (partner.user_id is not null),
         (c.invite_code is not null)
  from public.couple_members mine
  join public.couples c on c.id=mine.couple_id
  left join public.couple_members partner on partner.couple_id=mine.couple_id and partner.user_id<>mine.user_id
  where mine.user_id=(select auth.uid())
  limit 1
$$;

create or replace function public.send_voucher(
  p_title text,
  p_message text default '',
  p_mode text default 'classic',
  p_moment_at timestamptz default null,
  p_exception_when text default null,
  p_source text default 'catalogue',
  p_catalogue_id text default null,
  p_catalogue_category text default null,
  p_custom_category text default null,
  p_content text default '',
  p_usage text default '',
  p_color text default 'red'
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user uuid := auth.uid();
  v_couple uuid;
  v_partner uuid;
  v_id uuid;
  v_start timestamptz := date_trunc('year',now());
  v_end timestamptz := date_trunc('year',now()) + interval '1 year';
  v_count integer;
begin
  if v_user is null then raise exception 'AUTH_REQUIRED'; end if;
  if nullif(btrim(p_title),'') is null then raise exception 'TITLE_REQUIRED'; end if;
  select cm.couple_id into v_couple from public.couple_members cm where cm.user_id=v_user limit 1;
  if v_couple is null then raise exception 'NO_COUPLE'; end if;
  select cm.user_id into v_partner from public.couple_members cm where cm.couple_id=v_couple and cm.user_id<>v_user limit 1;
  if v_partner is null then raise exception 'PARTNER_REQUIRED'; end if;
  if p_source not in ('catalogue','custom') then raise exception 'INVALID_SOURCE'; end if;
  if p_mode not in ('classic','exceptional') then raise exception 'INVALID_MODE'; end if;
  if p_color not in ('red','violet','amber','mint') then p_color := 'red'; end if;

  if p_source='catalogue' then
    select count(*) into v_count from public.vouchers v join public.voucher_secrets s on s.voucher_id=v.id where v.sender_id=v_user and s.source='catalogue' and v.offered_at>=v_start and v.offered_at<v_end;
    if v_count>=11 then raise exception 'CATALOGUE_LIMIT'; end if;
    if p_catalogue_category is null then raise exception 'CATEGORY_REQUIRED'; end if;
    select count(*) into v_count from public.vouchers v join public.voucher_secrets s on s.voucher_id=v.id where v.sender_id=v_user and s.source='catalogue' and s.catalogue_category=p_catalogue_category and v.offered_at>=v_start and v.offered_at<v_end;
    if v_count>=3 then raise exception 'CATEGORY_LIMIT'; end if;
  else
    select count(*) into v_count from public.vouchers v join public.voucher_secrets s on s.voucher_id=v.id where v.sender_id=v_user and s.source='custom' and v.offered_at>=v_start and v.offered_at<v_end;
    if v_count>=1 then raise exception 'CUSTOM_LIMIT'; end if;
  end if;

  if p_mode='exceptional' then
    select count(*) into v_count from public.vouchers v join public.voucher_secrets s on s.voucher_id=v.id where v.sender_id=v_user and s.initial_mode='exceptional' and v.offered_at>=v_start and v.offered_at<v_end;
    if v_count>=2 then raise exception 'EXCEPTION_LIMIT'; end if;
    if p_exception_when not in ('date','now') then raise exception 'EXCEPTION_WHEN_REQUIRED'; end if;
    if p_exception_when='date' and p_moment_at is null then raise exception 'MOMENT_REQUIRED'; end if;
    if p_exception_when='now' then p_moment_at := now(); end if;
  else
    p_moment_at := null;
    p_exception_when := null;
  end if;

  insert into public.vouchers(
    couple_id,sender_id,recipient_id,status,color,last_event_type,last_event_at,last_event_by
  ) values(
    v_couple,v_user,v_partner,'offered',p_color,'sent',now(),v_user
  ) returning id into v_id;

  insert into public.voucher_secrets(voucher_id,title,message,content,usage,source,catalogue_id,catalogue_category,custom_category,initial_mode,initial_moment_at,initial_exception_when)
    values(v_id,left(btrim(p_title),120),coalesce(p_message,''),coalesce(p_content,''),coalesce(p_usage,''),p_source,p_catalogue_id,p_catalogue_category,p_custom_category,p_mode,p_moment_at,p_exception_when);
  return v_id;
end;
$$;

create or replace function public.reveal_voucher(p_voucher_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user uuid := auth.uid();
  v public.vouchers%rowtype;
  s public.voucher_secrets%rowtype;
begin
  select * into v from public.vouchers where id=p_voucher_id for update;
  if v.id is null or v.recipient_id<>v_user then raise exception 'NOT_ALLOWED'; end if;
  select * into s from public.voucher_secrets where voucher_id=p_voucher_id;
  if v.revealed_at is null then
    if v.status<>'offered' then raise exception 'INVALID_STATE'; end if;
    update public.vouchers set
      revealed_at=now(),
      mode=s.initial_mode,
      moment_at=s.initial_moment_at,
      exception_when=s.initial_exception_when,
      status=case when s.initial_mode='exceptional' then 'proposal' else 'ready' end,
      proposed_at=case when s.initial_mode='exceptional' then now() else proposed_at end,
      last_event_type='discovered',last_event_at=now(),last_event_by=v_user,updated_at=now()
    where id=p_voucher_id returning * into v;
  end if;
  return jsonb_build_object('id',v.id,'title',s.title,'message',s.message,'content',s.content,'usage',s.usage,'source',s.source,'catalogue_id',s.catalogue_id,'catalogue_category',s.catalogue_category,'custom_category',s.custom_category,'mode',s.initial_mode,'moment_at',s.initial_moment_at,'exception_when',s.initial_exception_when);
end;
$$;

create or replace function public.propose_voucher(p_voucher_id uuid, p_moment_at timestamptz, p_exception_when text default 'date')
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user uuid := auth.uid();
  v public.vouchers%rowtype;
  v_owner uuid;
  v_event text;
begin
  select * into v from public.vouchers where id=p_voucher_id for update;
  if v.id is null then raise exception 'NOT_FOUND'; end if;
  v_owner := case when v.mode='exceptional' then v.sender_id else v.recipient_id end;
  if v_owner<>v_user then raise exception 'NOT_PROPOSAL_OWNER'; end if;
  if v.status not in ('ready','replan','proposal','validated') then raise exception 'INVALID_STATE'; end if;
  if v.mode='classic' and p_exception_when='now' then raise exception 'NOW_REQUIRES_EXCEPTION'; end if;
  if p_exception_when not in ('date','now') then raise exception 'INVALID_MOMENT_KIND'; end if;
  if p_exception_when='date' and p_moment_at is null then raise exception 'MOMENT_REQUIRED'; end if;
  if p_exception_when='now' then p_moment_at:=now(); end if;
  v_event := case when v.status in ('proposal','validated') then 'modified' else 'proposal' end;
  update public.vouchers set status='proposal',moment_at=p_moment_at,exception_when=p_exception_when,
    proposed_at=now(),validated_at=null,last_event_type=v_event,last_event_at=now(),last_event_by=v_user,updated_at=now()
    where id=p_voucher_id;
end;
$$;

create or replace function public.accept_voucher(p_voucher_id uuid)
returns text
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user uuid := auth.uid();
  v public.vouchers%rowtype;
  v_owner uuid;
  v_status text;
begin
  select * into v from public.vouchers where id=p_voucher_id for update;
  if v.id is null or v.status<>'proposal' then raise exception 'INVALID_STATE'; end if;
  v_owner := case when v.mode='exceptional' then v.sender_id else v.recipient_id end;
  if v_user=v_owner or v_user not in (v.sender_id,v.recipient_id) then raise exception 'NOT_APPROVER'; end if;
  if v.mode='exceptional' and v.exception_when='now' then
    v_status:='used';
    update public.vouchers set status='used',moment_at=now(),used_at=now(),last_event_type='accepted',last_event_at=now(),last_event_by=v_user,updated_at=now() where id=p_voucher_id;
  else
    v_status:='validated';
    update public.vouchers set status='validated',validated_at=now(),last_event_type='accepted',last_event_at=now(),last_event_by=v_user,updated_at=now() where id=p_voucher_id;
  end if;
  return v_status;
end;
$$;

create or replace function public.reject_voucher(p_voucher_id uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user uuid := auth.uid();
  v public.vouchers%rowtype;
  v_owner uuid;
begin
  select * into v from public.vouchers where id=p_voucher_id for update;
  if v.id is null or v.status<>'proposal' then raise exception 'INVALID_STATE'; end if;
  v_owner := case when v.mode='exceptional' then v.sender_id else v.recipient_id end;
  if v_user=v_owner or v_user not in (v.sender_id,v.recipient_id) then raise exception 'NOT_APPROVER'; end if;
  update public.vouchers set status='replan',moment_at=null,exception_when=null,rejected_at=now(),validated_at=null,
    last_event_type='rejected',last_event_at=now(),last_event_by=v_user,updated_at=now() where id=p_voucher_id;
end;
$$;

create or replace function public.cancel_voucher(p_voucher_id uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user uuid := auth.uid();
  v public.vouchers%rowtype;
begin
  select * into v from public.vouchers where id=p_voucher_id for update;
  if v.id is null or v.status<>'validated' then raise exception 'INVALID_STATE'; end if;
  if v_user not in (v.sender_id,v.recipient_id) then raise exception 'NOT_ALLOWED'; end if;
  update public.vouchers set status='replan',moment_at=null,exception_when=null,cancelled_at=now(),validated_at=null,
    last_event_type='cancelled',last_event_at=now(),last_event_by=v_user,updated_at=now() where id=p_voucher_id;
end;
$$;

create or replace function public.normalize_vouchers()
returns integer
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user uuid := auth.uid();
  v_couple uuid;
  v_count integer;
begin
  select cm.couple_id into v_couple from public.couple_members cm where cm.user_id=v_user limit 1;
  if v_couple is null then return 0; end if;
  update public.vouchers set status='used',used_at=moment_at,updated_at=now()
    where couple_id=v_couple and status='validated' and moment_at is not null and moment_at<=now();
  get diagnostics v_count = row_count;
  return v_count;
end;
$$;

revoke execute on function public.create_couple(text) from public, anon;
revoke execute on function public.join_couple(text,text) from public, anon;
revoke execute on function public.renew_invite_code() from public, anon;
revoke execute on function public.my_couple() from public, anon;
revoke execute on function public.send_voucher(text,text,text,timestamptz,text,text,text,text,text,text,text,text) from public, anon;
revoke execute on function public.reveal_voucher(uuid) from public, anon;
revoke execute on function public.propose_voucher(uuid,timestamptz,text) from public, anon;
revoke execute on function public.accept_voucher(uuid) from public, anon;
revoke execute on function public.reject_voucher(uuid) from public, anon;
revoke execute on function public.cancel_voucher(uuid) from public, anon;
revoke execute on function public.normalize_vouchers() from public, anon;

grant execute on function public.create_couple(text) to authenticated;
grant execute on function public.join_couple(text,text) to authenticated;
grant execute on function public.renew_invite_code() to authenticated;
grant execute on function public.my_couple() to authenticated;
grant execute on function public.send_voucher(text,text,text,timestamptz,text,text,text,text,text,text,text,text) to authenticated;
grant execute on function public.reveal_voucher(uuid) to authenticated;
grant execute on function public.propose_voucher(uuid,timestamptz,text) to authenticated;
grant execute on function public.accept_voucher(uuid) to authenticated;
grant execute on function public.reject_voucher(uuid) to authenticated;
grant execute on function public.cancel_voucher(uuid) to authenticated;
grant execute on function public.normalize_vouchers() to authenticated;

-- Realtime for the shared voucher state. Safe to re-run.
do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname='supabase_realtime' and schemaname='public' and tablename='vouchers'
  ) then
    execute 'alter publication supabase_realtime add table public.vouchers';
  end if;
end $$;
