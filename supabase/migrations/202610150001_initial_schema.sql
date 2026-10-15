-- Vinkling initial PostgreSQL schema.
-- Apply with Supabase CLI or any PostgreSQL migration runner.

create extension if not exists pgcrypto;

create type public.account_role as enum ('member', 'admin');
create type public.account_status as enum ('invited', 'approved', 'suspended', 'revoked');
create type public.record_status as enum ('draft', 'published', 'archived');
create type public.relationship_type as enum ('parent_child', 'spouse');
create type public.invitation_status as enum ('pending', 'accepted', 'expired', 'revoked');
create type public.event_status as enum ('scheduled', 'cancelled', 'completed');

create table public.communities (
  id uuid primary key default gen_random_uuid(),
  name text not null check (length(trim(name)) > 0),
  timezone text not null default 'UTC',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.accounts (
  id uuid primary key references auth.users(id) on delete cascade,
  community_id uuid not null references public.communities(id) on delete restrict,
  person_id uuid,
  phone text not null,
  role public.account_role not null default 'member',
  status public.account_status not null default 'invited',
  phone_verified_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (community_id, phone)
);

create table public.families (
  id uuid primary key default gen_random_uuid(),
  community_id uuid not null references public.communities(id) on delete restrict,
  name text not null check (length(trim(name)) > 0),
  photo_url text,
  contact_phone text,
  address text,
  location text,
  ancestral_hometown text,
  history text,
  status public.record_status not null default 'draft',
  published_at timestamptz,
  archived_at timestamptz,
  created_by uuid references public.accounts(id) on delete set null,
  updated_by uuid references public.accounts(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.people (
  id uuid primary key default gen_random_uuid(),
  community_id uuid not null references public.communities(id) on delete restrict,
  family_id uuid references public.families(id) on delete set null,
  name text not null check (length(trim(name)) > 0),
  photo_url text,
  phone text,
  email text,
  address text,
  occupation text,
  education text,
  date_of_birth date,
  blood_group text,
  location text,
  ancestral_hometown text,
  is_deceased boolean not null default false,
  deceased_at date,
  status public.record_status not null default 'draft',
  published_at timestamptz,
  archived_at timestamptz,
  created_by uuid references public.accounts(id) on delete set null,
  updated_by uuid references public.accounts(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (not is_deceased or deceased_at is not null)
);

alter table public.accounts
  add constraint accounts_person_id_fkey foreign key (person_id)
  references public.people(id) on delete set null;

create table public.relationships (
  id uuid primary key default gen_random_uuid(),
  community_id uuid not null references public.communities(id) on delete restrict,
  person_id uuid not null references public.people(id) on delete cascade,
  related_person_id uuid not null references public.people(id) on delete cascade,
  relationship_type public.relationship_type not null,
  created_by uuid references public.accounts(id) on delete set null,
  created_at timestamptz not null default now(),
  check (person_id <> related_person_id),
  unique (person_id, related_person_id, relationship_type)
);

create table public.invitations (
  id uuid primary key default gen_random_uuid(),
  community_id uuid not null references public.communities(id) on delete restrict,
  person_id uuid references public.people(id) on delete set null,
  phone text not null,
  created_by uuid references public.accounts(id) on delete set null,
  status public.invitation_status not null default 'pending',
  expires_at timestamptz not null,
  accepted_at timestamptz,
  revoked_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.announcements (
  id uuid primary key default gen_random_uuid(),
  community_id uuid not null references public.communities(id) on delete restrict,
  title text not null check (length(trim(title)) > 0),
  body text not null,
  author_id uuid references public.accounts(id) on delete set null,
  status public.record_status not null default 'draft',
  published_at timestamptz,
  archived_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.events (
  id uuid primary key default gen_random_uuid(),
  community_id uuid not null references public.communities(id) on delete restrict,
  title text not null check (length(trim(title)) > 0),
  description text,
  starts_at timestamptz not null,
  ends_at timestamptz,
  venue text,
  online_url text,
  organizer_name text,
  organizer_contact text,
  status public.event_status not null default 'scheduled',
  created_by uuid references public.accounts(id) on delete set null,
  updated_by uuid references public.accounts(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (ends_at is null or ends_at >= starts_at),
  check (venue is not null or online_url is not null)
);

create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  community_id uuid not null references public.communities(id) on delete cascade,
  account_id uuid not null references public.accounts(id) on delete cascade,
  announcement_id uuid references public.announcements(id) on delete cascade,
  event_id uuid references public.events(id) on delete cascade,
  person_id uuid references public.people(id) on delete cascade,
  kind text not null check (kind in ('announcement', 'event', 'birthday', 'system')),
  title text not null,
  body text,
  read_at timestamptz,
  created_at timestamptz not null default now(),
  check (num_nonnulls(announcement_id, event_id, person_id) <= 1)
);

create table public.audit_entries (
  id bigint generated always as identity primary key,
  community_id uuid not null references public.communities(id) on delete cascade,
  actor_id uuid references public.accounts(id) on delete set null,
  action text not null,
  entity_type text not null,
  entity_id uuid,
  changes jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index accounts_community_status_idx on public.accounts (community_id, status);
create index families_community_status_name_idx on public.families (community_id, status, name);
create index people_community_status_name_idx on public.people (community_id, status, name);
create index people_family_id_idx on public.people (family_id);
create index people_birth_date_idx on public.people (community_id, date_of_birth) where is_deceased = false;
create index relationships_person_idx on public.relationships (person_id);
create index relationships_related_person_idx on public.relationships (related_person_id);
create index invitations_pending_phone_idx on public.invitations (community_id, phone, expires_at) where status = 'pending';
create index announcements_published_idx on public.announcements (community_id, published_at desc) where status = 'published';
create index events_upcoming_idx on public.events (community_id, starts_at) where status = 'scheduled';
create index notifications_account_unread_idx on public.notifications (account_id, created_at desc) where read_at is null;
create index audit_entries_entity_idx on public.audit_entries (community_id, entity_type, entity_id, created_at desc);

-- Full text search over the fields used by directory discovery.
create index people_search_idx on public.people using gin (
  to_tsvector('simple', coalesce(name, '') || ' ' || coalesce(occupation, '') || ' ' ||
    coalesce(education, '') || ' ' || coalesce(location, '') || ' ' || coalesce(ancestral_hometown, ''))
);
create index families_search_idx on public.families using gin (
  to_tsvector('simple', coalesce(name, '') || ' ' || coalesce(address, '') || ' ' ||
    coalesce(location, '') || ' ' || coalesce(ancestral_hometown, ''))
);

-- Keep modified timestamps consistent without application-side coordination.
create function public.set_updated_at() returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger communities_set_updated_at before update on public.communities for each row execute function public.set_updated_at();
create trigger accounts_set_updated_at before update on public.accounts for each row execute function public.set_updated_at();
create trigger families_set_updated_at before update on public.families for each row execute function public.set_updated_at();
create trigger people_set_updated_at before update on public.people for each row execute function public.set_updated_at();
create trigger announcements_set_updated_at before update on public.announcements for each row execute function public.set_updated_at();
create trigger events_set_updated_at before update on public.events for each row execute function public.set_updated_at();

-- Capture administrative changes in the database so audit coverage does not
-- depend on every application code path remembering to write an audit row.
create function public.write_audit_entry() returns trigger language plpgsql security definer set search_path = '' as $$
declare
  before_row jsonb;
  after_row jsonb;
  row_data jsonb;
begin
  if tg_op <> 'INSERT' then before_row = to_jsonb(old); end if;
  if tg_op <> 'DELETE' then after_row = to_jsonb(new); end if;
  row_data = coalesce(after_row, before_row);
  insert into public.audit_entries (community_id, actor_id, action, entity_type, entity_id, changes)
  values (
    (row_data ->> 'community_id')::uuid,
    (select auth.uid()),
    lower(tg_op),
    tg_table_name,
    (row_data ->> 'id')::uuid,
    jsonb_build_object('before', before_row, 'after', after_row)
  );
  return coalesce(new, old);
end;
$$;

create trigger accounts_audit after insert or update or delete on public.accounts for each row execute function public.write_audit_entry();
create trigger families_audit after insert or update or delete on public.families for each row execute function public.write_audit_entry();
create trigger people_audit after insert or update or delete on public.people for each row execute function public.write_audit_entry();
create trigger relationships_audit after insert or update or delete on public.relationships for each row execute function public.write_audit_entry();
create trigger invitations_audit after insert or update or delete on public.invitations for each row execute function public.write_audit_entry();
create trigger announcements_audit after insert or update or delete on public.announcements for each row execute function public.write_audit_entry();
create trigger events_audit after insert or update or delete on public.events for each row execute function public.write_audit_entry();

-- Supabase authorization policies. Server code must still validate every write and
-- derive the community from the authenticated account, never from client input.
alter table public.communities enable row level security;
alter table public.accounts enable row level security;
alter table public.families enable row level security;
alter table public.people enable row level security;
alter table public.relationships enable row level security;
alter table public.invitations enable row level security;
alter table public.announcements enable row level security;
alter table public.events enable row level security;
alter table public.notifications enable row level security;
alter table public.audit_entries enable row level security;

create function public.current_community_id() returns uuid
language sql stable security definer set search_path = '' as $$
  select a.community_id from public.accounts a where a.id = (select auth.uid()) and a.status = 'approved'
$$;

create function public.is_community_admin(target_community_id uuid) returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.accounts a where a.id = (select auth.uid())
    and a.community_id = target_community_id and a.status = 'approved' and a.role = 'admin')
$$;

create policy communities_read on public.communities for select to authenticated
  using (id = (select public.current_community_id()));
create policy accounts_read_community on public.accounts for select to authenticated
  using (community_id = (select public.current_community_id()));
create policy accounts_admin_write on public.accounts for all to authenticated
  using ((select public.is_community_admin(community_id)))
  with check ((select public.is_community_admin(community_id)));

create policy families_read_published on public.families for select to authenticated
  using (community_id = (select public.current_community_id()) and (status = 'published' or (select public.is_community_admin(community_id))));
create policy families_admin_write on public.families for all to authenticated
  using ((select public.is_community_admin(community_id)))
  with check ((select public.is_community_admin(community_id)));
create policy people_read_published on public.people for select to authenticated
  using (community_id = (select public.current_community_id()) and (status = 'published' or (select public.is_community_admin(community_id))));
create policy people_admin_write on public.people for all to authenticated
  using ((select public.is_community_admin(community_id)))
  with check ((select public.is_community_admin(community_id)));
create policy relationships_read_community on public.relationships for select to authenticated
  using (community_id = (select public.current_community_id()));
create policy relationships_admin_write on public.relationships for all to authenticated
  using ((select public.is_community_admin(community_id)))
  with check ((select public.is_community_admin(community_id)));
create policy invitations_admin_only on public.invitations for all to authenticated
  using ((select public.is_community_admin(community_id)))
  with check ((select public.is_community_admin(community_id)));
create policy announcements_read_published on public.announcements for select to authenticated
  using (community_id = (select public.current_community_id()) and (status = 'published' or (select public.is_community_admin(community_id))));
create policy announcements_admin_write on public.announcements for all to authenticated
  using ((select public.is_community_admin(community_id)))
  with check ((select public.is_community_admin(community_id)));
create policy events_read_community on public.events for select to authenticated
  using (community_id = (select public.current_community_id()));
create policy events_admin_write on public.events for all to authenticated
  using ((select public.is_community_admin(community_id)))
  with check ((select public.is_community_admin(community_id)));
create policy notifications_self_read_update on public.notifications for select to authenticated
  using (account_id = (select auth.uid()) and community_id = (select public.current_community_id()));
create policy notifications_self_update on public.notifications for update to authenticated
  using (account_id = (select auth.uid()) and community_id = (select public.current_community_id()))
  with check (account_id = (select auth.uid()) and community_id = (select public.current_community_id()));
create policy audit_admin_read on public.audit_entries for select to authenticated
  using ((select public.is_community_admin(community_id)));

revoke all on public.communities, public.accounts, public.families, public.people,
  public.relationships, public.invitations, public.announcements, public.events,
  public.notifications, public.audit_entries from anon;
grant select on public.communities, public.accounts, public.families, public.people,
  public.relationships, public.announcements, public.events to authenticated;
grant insert, update, delete on public.accounts, public.families, public.people,
  public.relationships, public.invitations, public.announcements, public.events to authenticated;
grant update on public.notifications to authenticated;
grant select on public.notifications to authenticated;
grant select on public.audit_entries to authenticated;
