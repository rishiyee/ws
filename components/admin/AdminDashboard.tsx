"use client";

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Activity, ArrowRight, Bell, CalendarDays, ChevronDown, CircleUserRound, House, LayoutDashboard, Pencil, Plus, UsersRound } from 'lucide-react';
import { communities, event, families, memberById, members, type Family } from '../../lib/data';
import { saveFamilyRecord, subscribeToFamilyRecords } from '../../lib/familyRecords';
import { Photo } from '../AppPrimitives';
import Button from '../Button';
import EmptyState from '../EmptyState';
import SearchBox from '../SearchBox';
import FamilyEditor from './FamilyEditor';

type Section = 'overview' | 'families' | 'members' | 'activity' | 'updates';

const navigation: { id: Section; label: string; Icon: typeof LayoutDashboard }[] = [
  { id: 'overview', label: 'Overview', Icon: LayoutDashboard },
  { id: 'families', label: 'Families', Icon: House },
  { id: 'members', label: 'Members', Icon: UsersRound },
  { id: 'activity', label: 'Family activity', Icon: Activity },
  { id: 'updates', label: 'Events & updates', Icon: CalendarDays },
];

const communityRoster = new Map(communities.map(community => [
  community.id,
  new Set(families.filter(family => community.familyGroupIds.includes(family.groupId)).flatMap(family => family.memberIds)),
]));

export default function AdminDashboard() {
  const [section, setSection] = useState<Section>('overview');
  const [communityId, setCommunityId] = useState(communities[0]?.id ?? '');
  const [query, setQuery] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editorOpen, setEditorOpen] = useState(false);
  const [notice, setNotice] = useState('');
  const [, setFamilyVersion] = useState(0);
  useEffect(() => subscribeToFamilyRecords(() => setFamilyVersion(version => version + 1)), []);
  const community = communities.find(item => item.id === communityId) ?? communities[0];
  const communityFamilies = families.filter(family => community?.familyGroupIds.includes(family.groupId));
  const communityMemberIds = new Set(communityFamilies.flatMap(family => family.memberIds));
  const communityMembers = members.filter(member => communityMemberIds.has(member.id));
  const availableMembers = members.filter(member => communityRoster.get(communityId)?.has(member.id) || communityMemberIds.has(member.id));
  const filteredFamilies = communityFamilies.filter(family => family.name.toLowerCase().includes(query.toLowerCase()));
  const filteredMembers = communityMembers.filter(member => `${member.name} ${member.phone ?? ''} ${member.email ?? ''}`.toLowerCase().includes(query.toLowerCase()));
  const editingFamily = editingId ? families.find(family => family.id === editingId) : undefined;

  function saveFamily(details: Omit<Family, 'id'>) {
    const record = { ...details, id: editingFamily?.id ?? `family-${crypto.randomUUID()}` };
    try {
      saveFamilyRecord(record);
      setEditorOpen(false);
      setEditingId(null);
      setQuery('');
      setNotice(`${record.name} ${editingFamily ? 'updated' : 'added'} in this browser.`);
    } catch {
      setNotice('Could not save this family in your browser. Please try again.');
    }
  }

  function openEditor(family?: Family) {
    setEditingId(family?.id ?? null);
    setEditorOpen(true);
    setNotice('');
    setSection('families');
  }

  return <div className="min-h-svh bg-canvas text-ink">
    <div className="flex min-h-svh">
      <aside className="hidden w-[250px] shrink-0 flex-col border-r border-border-soft bg-paper px-5 py-6 md:flex">
        <a href="/" className="flex items-center gap-3 px-2" aria-label="Vinkling home">
          <Image src="/icon.svg" alt="" width={40} height={40} className="size-10 rounded-[14px]" />
          <span><strong className="block text-[18px] font-semibold tracking-[-.5px]">vinkling</strong><span className="text-[11px] text-text-muted">Community admin</span></span>
        </a>
        <div className="mt-9">
          <label htmlFor="community-select" className="mb-2 block px-2 text-[10px] font-semibold uppercase tracking-[1.1px] text-text-subtle">Community</label>
          <div className="relative">
            <select id="community-select" value={communityId} onChange={e => { setCommunityId(e.target.value); setQuery(''); setEditorOpen(false); setNotice(''); }} className="h-12 w-full appearance-none rounded-xl border border-border-soft bg-surface-raised px-3 pr-9 text-[13px] font-medium outline-none focus:border-border-focus">
              {communities.map(item => <option key={item.id} value={item.id}>{item.name} · {item.location}</option>)}
            </select><ChevronDown size={16} className="pointer-events-none absolute right-3 top-4 text-text-muted" />
          </div>
        </div>
        <nav aria-label="Admin navigation" className="mt-8 space-y-1">
          {navigation.map(({ id, label, Icon }) => <Button key={id} onClick={() => { setSection(id); setQuery(''); }} aria-current={section === id ? 'page' : undefined} className={`flex min-h-12 w-full items-center gap-3 rounded-xl px-3 text-left text-[13px] font-medium transition ${section === id ? 'bg-brand-soft text-brand-hover' : 'text-text-secondary hover:bg-surface'}`}><Icon size={18} />{label}</Button>)}
        </nav>
        <div className="mt-auto rounded-2xl bg-surface p-4"><p className="text-[12px] font-medium">Need help?</p><p className="mt-1 text-[11px] leading-5 text-text-muted">Contact your community support team.</p></div>
      </aside>

      <main className="min-w-0 flex-1">
        <header className="sticky top-0 z-10 border-b border-border-soft bg-paper/95 px-5 py-4 backdrop-blur sm:px-8">
          <div className="flex items-center justify-between gap-4">
            <div className="min-w-0"><p className="text-[11px] text-text-subtle md:hidden">COMMUNITY ADMIN · {community?.name}</p><h1 className="truncate text-[22px] font-semibold tracking-[-.6px]">{navigation.find(item => item.id === section)?.label}</h1></div>
            <div className="flex items-center gap-3"><a href="/" className="inline-flex min-h-10 items-center gap-2 rounded-full bg-surface px-4 text-[12px] font-medium text-text-secondary hover:bg-action-hover"><CircleUserRound size={16} />Member app</a><span className="grid size-10 place-items-center rounded-full bg-brand-soft text-brand-hover" aria-label="Admin account"><CircleUserRound size={20} /></span></div>
          </div>
          <label className="mt-4 block text-[12px] font-medium md:hidden">Community<select value={communityId} onChange={e => { setCommunityId(e.target.value); setQuery(''); setEditorOpen(false); setNotice(''); }} className="mt-2 min-h-12 w-full rounded-xl border border-border-soft bg-surface-raised px-3 text-[16px]">{communities.map(item => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label>
          <div className="mt-4 flex gap-1 overflow-x-auto md:hidden">
            {navigation.map(({ id, label, Icon }) => <Button key={id} onClick={() => { setSection(id); setQuery(''); }} aria-pressed={section === id} className={`inline-flex min-h-12 shrink-0 items-center gap-2 rounded-full px-3 text-[11px] font-medium ${section === id ? 'bg-brand text-white' : 'bg-surface text-text-secondary'}`}><Icon size={15} />{label}</Button>)}
          </div>
        </header>

        <div className="space-y-7 px-5 py-7 sm:px-8 sm:py-9">
          {section === 'overview' && <>
            <div><p className="text-[13px] text-text-muted">{community?.location} · Community workspace</p><h2 className="mt-1 text-[28px] font-semibold tracking-[-.8px]">Welcome back</h2><p className="mt-2 text-[13px] text-text-muted">Here’s an overview of {community?.name}.</p></div>
            <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
              <Stat label="Families" value={communityFamilies.length} note="In this community" Icon={House} />
              <Stat label="Members" value={communityMembers.length} note="Across all families" Icon={UsersRound} />
              <Stat label="Announcements" value="—" note="Community updates" Icon={Bell} />
              <Stat label="Upcoming events" value="1" note="Next community event" Icon={CalendarDays} />
            </div>
            <div className="grid gap-5 lg:grid-cols-[1.3fr_1fr]">
              <section className="rounded-[24px] border border-border-soft bg-paper p-5 sm:p-6"><div className="flex items-center justify-between"><div><h3 className="text-[16px] font-semibold">Family activity</h3><p className="mt-1 text-[12px] text-text-muted">Admin actions from the past year</p></div><Button onClick={() => setSection('activity')} variant="quiet" className="px-3 text-[12px]">View history <ArrowRight size={15} /></Button></div><EmptyState title="No recent activity" text="Family changes made by administrators will appear here with the admin name and time." variant="plain" icon={<Activity size={18}/>} /></section>
              <section className="rounded-[24px] border border-border-soft bg-paper p-5 sm:p-6"><div className="flex items-center justify-between"><div><h3 className="text-[16px] font-semibold">Next event</h3><p className="mt-1 text-[12px] text-text-muted">Community calendar</p></div><CalendarDays size={19} className="text-brand" /></div><div className="mt-5 rounded-2xl bg-surface p-4"><span className="rounded-full bg-card px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[.8px] text-brand-hover">Upcoming</span><h4 className="mt-3 text-[15px] font-semibold">{event.title}</h4><p className="mt-2 text-[12px] text-text-muted">{event.date} · {event.time}</p><p className="mt-1 text-[12px] text-text-muted">{event.place}</p></div></section>
            </div>
            <section className="rounded-[24px] border border-border-soft bg-paper p-5 sm:p-6"><div className="mb-4 flex items-center justify-between"><div><h3 className="text-[16px] font-semibold">Families</h3><p className="mt-1 text-[12px] text-text-muted">Recently listed in {community?.name}</p></div><Button onClick={() => setSection('families')} variant="quiet" className="px-3 text-[12px]">All families</Button></div><FamilyRows items={communityFamilies.slice(0, 4)} /></section>
          </>}

          {section === 'families' && <>
            <div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-[13px] text-text-muted">{community?.name} · {communityFamilies.length} families</p><h2 className="mt-1 text-[25px] font-semibold tracking-[-.6px]">Family directory</h2></div><div className="flex w-full flex-wrap items-center gap-3 sm:w-auto"><div className="min-w-[220px] flex-1 sm:w-[260px]"><SearchBox value={query} setValue={setQuery} compact placeholder="Search families" /></div><Button onClick={() => openEditor()} variant="primary"><Plus size={18}/>Add family</Button></div></div>
            {notice && <p role="status" className="rounded-xl bg-brand-soft px-4 py-3 text-[13px] text-brand-hover">{notice}</p>}
            {editorOpen && <FamilyEditor key={editingId ?? 'new'} family={editingFamily} groupIds={community?.familyGroupIds ?? []} availableMembers={availableMembers} onSave={saveFamily} onCancel={() => setEditorOpen(false)} />}
            <section className="overflow-hidden rounded-[24px] border border-border-soft bg-paper"><FamilyRows items={filteredFamilies} onEdit={openEditor} /></section>
          </>}

          {section === 'members' && <>
            <div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-[13px] text-text-muted">{community?.name} · {communityMembers.length} members</p><h2 className="mt-1 text-[25px] font-semibold tracking-[-.6px]">Member directory</h2></div><div className="w-full sm:w-[260px]"><SearchBox value={query} setValue={setQuery} compact placeholder="Search members" /></div></div>
            <section className="overflow-hidden rounded-[24px] border border-border-soft bg-paper"><div className="hidden grid-cols-[1.5fr_1fr_1fr] border-b border-border-soft px-5 py-3 text-[10px] font-semibold uppercase tracking-[.8px] text-text-subtle sm:grid"><span>Member</span><span>Family</span><span>Contact</span></div>{filteredMembers.map(member => <div key={member.id} className="grid gap-2 border-b border-border-soft px-5 py-4 last:border-0 sm:grid-cols-[1.5fr_1fr_1fr] sm:items-center"><div className="flex items-center gap-3"><Photo id={member.id} className="size-11 rounded-full"/><div><p className="text-[13px] font-medium">{member.name}</p><p className="mt-1 text-[11px] text-text-muted">{member.occupation} · {member.location}</p></div></div><p className="text-[12px] text-text-secondary">{communityFamilies.filter(family => family.memberIds.includes(member.id)).map(family => family.name).join(', ') || 'No family assigned'}</p><p className="text-[12px] text-text-muted">{member.phone ?? member.email ?? 'No contact listed'}</p></div>)}{filteredMembers.length === 0 && <EmptyState title="No members found" text="Try another name or contact detail." variant="plain" icon={<Activity size={18}/>} />}</section>
          </>}

          {section === 'activity' && <><div><p className="text-[13px] text-text-muted">{community?.name} · Retained for one year</p><h2 className="mt-1 text-[25px] font-semibold tracking-[-.6px]">Family activity history</h2><p className="mt-2 text-[12px] text-text-muted">All administrator actions affecting families, including the admin and timestamp.</p></div><section className="rounded-[24px] border border-border-soft bg-paper"><EmptyState title="No activity recorded" text="When an administrator adds or updates a family record, it will be listed here." variant="plain" icon={<Activity size={18}/>} /></section></>}

          {section === 'updates' && <><div><p className="text-[13px] text-text-muted">{community?.name}</p><h2 className="mt-1 text-[25px] font-semibold tracking-[-.6px]">Events & announcements</h2><p className="mt-2 text-[12px] text-text-muted">Community updates managed by administrators.</p></div><section className="rounded-[24px] border border-border-soft bg-paper p-5 sm:p-6"><h3 className="text-[16px] font-semibold">Events</h3><div className="mt-4 rounded-2xl bg-surface p-4"><p className="text-[14px] font-medium">{event.title}</p><p className="mt-1 text-[12px] text-text-muted">{event.date} · {event.place}</p></div><h3 className="mt-7 text-[16px] font-semibold">Announcements</h3><EmptyState title="No announcements" text="There are no announcements listed for this community." variant="plain" icon={<Activity size={18}/>} /></section></>}
        </div>
      </main>
    </div>
  </div>;
}

function Stat({ label, value, note, Icon }: { label: string; value: string | number; note: string; Icon: typeof LayoutDashboard }) {
  return <article className="rounded-[22px] border border-border-soft bg-paper p-4 sm:p-5"><div className="flex items-center justify-between"><span className="text-[11px] font-medium text-text-muted">{label}</span><span className="grid size-9 place-items-center rounded-xl bg-brand-soft text-brand-hover"><Icon size={17} /></span></div><p className="mt-4 text-[27px] font-semibold tracking-[-.8px]">{value}</p><p className="mt-1 text-[10px] text-text-subtle">{note}</p></article>;
}

function FamilyRows({ items, onEdit }: { items: typeof families; onEdit?: (family: Family) => void }) {
  if (!items.length) return <EmptyState title="No families found" text="Families in this community will appear here." variant="plain" icon={<Activity size={18}/>} />;
  return <div>{items.map(family => { const representative = memberById(family.representativeId); return <article key={family.id} className="flex items-center gap-3 border-b border-border-soft px-5 py-4 last:border-0">{representative ? <Photo id={representative.id} className="size-11 rounded-full"/> : <Image src="/icon.svg" alt="" width={44} height={44} className="size-11 rounded-full object-cover"/>}<div className="min-w-0 flex-1"><h3 className="truncate text-[13px] font-medium">{family.name}</h3><p className="mt-1 truncate text-[11px] text-text-muted">{representative?.name ?? 'No representative assigned'} · {family.address.split(',')[1]?.trim() ?? 'Location not set'}</p></div><div className="text-right"><p className="text-[13px] font-medium">{family.memberIds.length}</p><p className="text-[10px] text-text-subtle">members</p></div>{onEdit && <Button onClick={() => onEdit(family)} variant="quiet" aria-label={`Edit ${family.name}`} className="ml-1 px-3 text-[12px]"><Pencil size={16}/><span className="hidden sm:inline">Edit</span></Button>}</article>; })}</div>;
}
