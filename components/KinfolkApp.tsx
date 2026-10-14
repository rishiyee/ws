"use client";

import { usePathname, useRouter } from 'next/navigation';
import { ArrowLeft, ArrowRight, Cake, CalendarDays, ChevronRight, Mail, Megaphone, Phone, SlidersHorizontal, UserRound, UsersRound } from 'lucide-react';
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, type FormEvent, type ReactNode } from 'react';
import AddressMap from './AddressMap';
import AppHeader from './AppHeader';
import BottomNavigation from './BottomNavigation';
import Button from './Button';
import PhoneFrame from './PhoneFrame';
import ProfileCard from './ProfileCard';
import SearchBox from './SearchBox';
import GroupTile from './GroupTile';
import { Blood, BottomSheet, ContactActions, ContactRow, Detail, Empty, Photo, SectionTitle, StatusBar } from './AppPrimitives';
import SurfaceCard from './SurfaceCard';
import ShareButton from './ShareButton';
import { admin, event, familyById, familyByMember, groupById, groups, memberById, members, relationshipLabel, searchDirectory } from '../lib/data';

const sessionKey = 'kinfolk-next-session-v1';
const peopleByPhone = new Map(members.map(member => [member.phone?.replace(/\D/g, '').slice(-10), member.id]));

type ScreenProps = { memberId: string; go: (path: string) => void; back: () => void };
type Notice = { id: string; title: string; detail: string; destination: string; read: boolean; icon: ReactNode };

function Home({ memberId, go, searchQuery, setSearchQuery }: ScreenProps & { searchQuery: string; setSearchQuery: (value: string) => void }) {
  const member = memberById(memberId);
  const family = familyByMember(memberId);
  const community = groupById(family?.groupId);
  const todaysBirthdays = members.filter(person => person.birthday === 'October 12');
  const familyCount = groups.reduce((total, group) => total + group.familyIds.length, 0);
  const quickActions = [
    { label: 'Directory', detail: `${groups.length} family groups`, path: '/directory', Icon: UsersRound },
    { label: 'Birthdays', detail: `${todaysBirthdays.length} today`, path: '/birthdays', Icon: Cake },
    { label: 'Community board', detail: 'Latest updates', path: '/announcements', Icon: Megaphone },
  ];

  return <div className="space-y-5 px-[18px] pb-8 pt-1">
    <section>
      <p className="text-[12px] font-medium uppercase tracking-[.12em] text-[#9c9690]">Monday, October 12</p>
      <h2 className="mt-2 text-[24px] font-medium leading-tight tracking-[-.7px]">Good morning, {member?.firstName}</h2>
      <p className="mt-1 text-[13px] text-[#817c76]">Here&rsquo;s what&rsquo;s happening with your family.</p>
    </section>

    <SearchBox value={searchQuery} setValue={setSearchQuery} placeholder="Find a person or family…"/>

    {searchQuery.trim() ? <SearchResults query={searchQuery} go={go}/> : <>
      <section aria-labelledby="quick-access-title">
        <h3 id="quick-access-title" className="mb-3 text-[13px] font-medium text-[#6f6963]">Quick access</h3>
        <div className="grid grid-cols-2 gap-2.5">
          {quickActions.map(({ label, detail, path, Icon }) => <Button key={label} onClick={() => go(path)} className="group flex min-h-[82px] items-center gap-3 rounded-[20px] border border-[#e7e0d8] bg-white/75 p-3 text-left shadow-[0_4px_14px_rgba(68,52,38,.04)] transition hover:border-[#d8c9bc] hover:bg-white active:scale-[.98]">
            <span className="grid size-10 shrink-0 place-items-center rounded-[14px] bg-[#f0e7df] text-[#a75027]"><Icon size={19}/></span>
            <span className="min-w-0"><strong className="block text-[13px] font-medium">{label}</strong><span className="mt-1 block text-[11px] text-[#918981]">{detail}</span></span>
          </Button>)}
        </div>
      </section>

      <section>
        <SectionTitle action={<Button onClick={() => go('/directory')} className="min-h-12 px-2 text-[12px] font-medium text-[#e64d08]">Browse all</Button>}>Your community</SectionTitle>
        <Button onClick={() => go(community ? `/directory/${community.id}` : '/family-groups')} className="flex min-h-[78px] w-full items-center gap-3 rounded-[22px] border border-[#e7e0d8] bg-white/65 p-4 text-left transition hover:bg-white active:scale-[.99]">
          <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-[#e8e1d9]"><UsersRound size={19}/></span>
          <span className="min-w-0 flex-1"><strong className="block text-[14px] font-medium">{community?.name ?? 'Family directory'}</strong><span className="mt-1 block text-[12px] text-[#8c857e]">{familyCount} families · {members.length} people</span></span>
          <ChevronRight size={18} className="shrink-0 text-[#8c857e]"/>
        </Button>
      </section>

    </>}
  </div>;
}

function FamilyCard({ familyId, perspectiveId, visibleMemberIds }: { familyId: string; perspectiveId: string; visibleMemberIds?: string[] }) {
  const family = familyById(familyId)!;
  const representative = memberById(family.representativeId)!;
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const closeSheet = useCallback(() => setSelectedId(null), []);
  const memberIds = visibleMemberIds ?? family.memberIds;
  return <article>
    <Button onClick={() => setDetailsOpen(true)} aria-label={`Open ${family.name}`} className="flex min-h-[86px] w-full items-center gap-3 rounded-[22px] bg-[#efece7] px-4 py-3 text-left transition hover:bg-[#e9e5df]">
      <Photo id={representative.id} className="size-[56px] rounded-2xl"/><span className="min-w-0 flex-1"><strong className="block text-[15px] font-medium leading-5">{family.name}</strong><span className="mt-1 block text-[12px] leading-4 text-[#8b837b]">Represented by {representative.name}</span><span className="mt-1 block text-[12px] leading-4 text-[#8b837b]">{visibleMemberIds ? `${visibleMemberIds.length} of ${family.memberIds.length} members match` : `${family.memberIds.length} members`}</span></span><ChevronRight size={18} className="shrink-0 text-[#8c857e]"/>
    </Button>
    {detailsOpen && <BottomSheet title={family.name} close={() => setDetailsOpen(false)}><div className="space-y-4">
      <div className="flex items-center gap-3"><Photo id={representative.id} className="size-12 rounded-full"/><div><p className="text-[13px] font-medium">{representative.name}</p><p className="mt-1 text-[12px] text-[#8b837b]">Family representative · {memberIds.length} {memberIds.length === 1 ? 'member' : 'members'}</p></div></div>
      <ContactActions memberId={representative.id}/>
      <section aria-label="Family members"><SectionTitle>Family members</SectionTitle><ul className="divide-y divide-[#e7e0d8]">{memberIds.map(id => <li key={id}><MemberCard memberId={id} perspectiveId={perspectiveId} open={() => setSelectedId(id)}/></li>)}</ul></section>
      <section><SectionTitle>Family address</SectionTitle><AddressMap address={family.address} label={family.name}/></section>
    </div></BottomSheet>}
    {selectedId && <MemberProfileSheet memberId={selectedId} perspectiveId={perspectiveId} close={closeSheet}/>}
  </article>;
}

function MemberCard({ memberId, perspectiveId, open }: { memberId: string; perspectiveId: string; open: () => void }) {
  const member = memberById(memberId)!;
  const relation = relationshipLabel(memberId, perspectiveId, familyByMember(memberId)?.representativeId);
  return <Button onClick={open} aria-label={`View ${member.name}'s profile`} className="flex min-h-12 w-full items-center gap-3 rounded-[20px] bg-[#f8f5f1] p-3 text-left"><Photo id={member.id} className="size-12 rounded-2xl"/><span className="min-w-0 flex-1"><strong className="block text-[14px] font-medium">{member.name}</strong><span className="mt-1 block text-[12px] text-[#a15937]">{relation}</span><span className="mt-0.5 block truncate text-[12px] text-[#8b837b]">{member.occupation}</span></span><ChevronRight size={18} className="shrink-0 text-[#8c857e]"/></Button>;
}

function Directory({ memberId, go, groupId, ownFamily = false }: ScreenProps & { groupId?: string; ownFamily?: boolean }) {
  const [query, setQuery] = useState('');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [location, setLocation] = useState('');
  const [hometown, setHometown] = useState('');
  const [occupation, setOccupation] = useState('');
  const result = useMemo(() => searchDirectory(query), [query]);
  const filteredFamilies = useMemo(() => {
    return result.foundFamilies.filter(family => (!groupId || family.groupId === groupId) && (!ownFamily || family.memberIds.includes(memberId)) && (!location || groupById(family.groupId)?.location === location) && (!hometown || family.memberIds.some(id => memberById(id)?.hometown === hometown)) && (!occupation || family.memberIds.some(id => memberById(id)?.occupation === occupation))).sort((a, b) => a.name.localeCompare(b.name));
  }, [result, groupId, location, hometown, occupation, ownFamily, memberId]);
  const group = groupById(groupId);
  const currentFamily = ownFamily ? familyByMember(memberId) : undefined;
  const normalizedQuery = query.trim().toLowerCase();
  function visibleMembers(family: NonNullable<ReturnType<typeof familyById>>) {
    if (!normalizedQuery || `${family.name} ${family.address} ${family.zip}`.toLowerCase().includes(normalizedQuery)) return undefined;
    return family.memberIds.filter(id => result.foundMembers.some(member => member.id === id));
  }
  const searchPlaceholder = ownFamily ? 'Search your family members…' : groupId ? `Search in ${group?.name ?? 'this group'}…` : 'Search families and people…';
  return <div className="space-y-4 px-[18px] pb-8 pt-2">
    <SearchBox value={query} setValue={setQuery} compact placeholder={searchPlaceholder}/><div className="flex items-center justify-between"><p className="text-[12px] text-[#958d85]">{ownFamily ? 'Your family details' : groupId ? `${group?.familyIds.length ?? 0} families · ${filteredFamilies.reduce((sum, family) => sum + family.memberIds.length, 0)} members` : `${filteredFamilies.length} family${filteredFamilies.length === 1 ? '' : ' groups'} found`}</p>{!groupId && <Button className="inline-flex min-h-12 items-center gap-2 rounded-full bg-[#e8e1d9] px-4 text-[12px]" onClick={() => setFiltersOpen(true)}><SlidersHorizontal size={16}/>Filters{[location,hometown,occupation].filter(Boolean).length > 0 && <span className="grid size-5 place-items-center rounded-full bg-[#171513] text-[12px] text-white">{[location,hometown,occupation].filter(Boolean).length}</span>}</Button>}</div>
    {ownFamily && currentFamily && <ShareButton title={currentFamily.name} text={`View the ${currentFamily.name} on Kinfolk.`} path="/my-family"/>}
    {filteredFamilies.length ? <div className="space-y-3">{filteredFamilies.map(family => <FamilyCard key={family.id} familyId={family.id} visibleMemberIds={visibleMembers(family)} perspectiveId={ownFamily || family.memberIds.includes(memberId) ? memberId : family.representativeId}/>)}</div> : <Empty title={ownFamily ? 'No family members found' : 'No families found'} text={ownFamily ? 'Try a different name, occupation, or relationship.' : 'Try a different name or clear your filters.'}/>}
    {filtersOpen && <BottomSheet title="Filter families" close={() => setFiltersOpen(false)}><div className="space-y-4"><label className="block text-[12px] font-medium text-[#77716a]">Location<select value={location} onChange={e => setLocation(e.target.value)} className="mt-2 min-h-12 w-full rounded-2xl border border-[#e7e0d8] bg-[#f8f5f1] px-4 text-[14px]"><option value="">All locations</option><option>Seattle</option><option>Austin</option></select></label><label className="block text-[12px] font-medium text-[#77716a]">Hometown<select value={hometown} onChange={e => setHometown(e.target.value)} className="mt-2 min-h-12 w-full rounded-2xl border border-[#e7e0d8] bg-[#f8f5f1] px-4 text-[14px]"><option value="">All hometowns</option><option>Portland</option><option>Boston</option></select></label><label className="block text-[12px] font-medium text-[#77716a]">Occupation<select value={occupation} onChange={e => setOccupation(e.target.value)} className="mt-2 min-h-12 w-full rounded-2xl border border-[#e7e0d8] bg-[#f8f5f1] px-4 text-[14px]"><option value="">All occupations</option>{Array.from(new Set(members.map(member => member.occupation))).map(value => <option key={value}>{value}</option>)}</select></label></div><Button onClick={() => setFiltersOpen(false)} variant="primary" className="mt-5 w-full">Show {filteredFamilies.length} families</Button><Button onClick={() => { setLocation(''); setHometown(''); setOccupation(''); }} className="mt-2 min-h-12 w-full text-[12px] text-[#e64d08]">Clear filters</Button></BottomSheet>}
  </div>;
}

function DirectoryList({ memberId, go }: Pick<ScreenProps, 'memberId' | 'go'>) {
  const [query, setQuery] = useState('');
  const [view, setView] = useState<'groups' | 'people'>('groups');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const { foundGroups, foundMembers } = searchDirectory(query);
  const sortedMembers = [...foundMembers].sort((a, b) => a.name.localeCompare(b.name));
  const memberSections = sortedMembers.reduce<Record<string, typeof sortedMembers>>((sections, person) => {
    const initial = person.name.charAt(0).toUpperCase();
    (sections[initial] ??= []).push(person);
    return sections;
  }, {});
  const selectedMember = selectedId ? memberById(selectedId) : undefined;
  return <div className="space-y-3 px-[18px] pb-8 pt-2">
    <SearchBox value={query} setValue={setQuery} compact placeholder={view === 'groups' ? 'Search family groups…' : 'Search people…'}/>
    <div className="flex min-h-12 items-center gap-1 rounded-full bg-[#efece7] p-1" aria-label="Directory view">
      <Button aria-pressed={view === 'groups'} onClick={() => setView('groups')} className={`min-h-10 flex-1 rounded-full px-3 text-[12px] ${view === 'groups' ? 'bg-white font-medium shadow-sm' : 'text-[#817c76]'}`}>Family groups</Button>
      <Button aria-pressed={view === 'people'} onClick={() => setView('people')} className={`min-h-10 flex-1 rounded-full px-3 text-[12px] ${view === 'people' ? 'bg-white font-medium shadow-sm' : 'text-[#817c76]'}`}>People</Button>
    </div>
    {view === 'groups' ? <><p className="px-1 text-[12px] text-[#958d85]">{foundGroups.length} family groups</p>{foundGroups.length ? <div className="space-y-2">{foundGroups.map(group => <GroupTile key={group.id} groupId={group.id} go={go}/>)}</div> : <Empty title="No family groups found" text="Try another name or location."/>}</> : <><p className="px-1 text-[12px] text-[#958d85]">{foundMembers.length} people</p>{sortedMembers.length ? <div>{Object.entries(memberSections).map(([initial, people]) => <section key={initial} aria-label={`${initial} names`}><h2 className="px-1 pb-2 pt-3 text-[14px] font-semibold text-[#b6ada5]">{initial}</h2><div className="divide-y divide-[#e7e0d8]">{people.map(person => <Button key={person.id} onClick={() => setSelectedId(person.id)} aria-label={`View ${person.name}'s profile`} className="flex min-h-[76px] w-full items-center gap-4 px-2 text-left">
        <Photo id={person.id} className="size-12 rounded-full"/>
        <span className="min-w-0 flex-1"><strong className="block truncate text-[14px] font-normal">{person.name}</strong><span className="mt-1 block truncate text-[12px] text-[#8b837b]">{person.occupation}</span></span><ChevronRight size={18} className="text-[#8c857e]"/>
      </Button>)}</div></section>)}</div> : <Empty title="No people found" text="Try another name or detail."/>}</>}
    {selectedMember && <MemberProfileSheet memberId={selectedMember.id} perspectiveId={memberId} close={() => setSelectedId(null)}/>}
  </div>;
}

function FamilyGroups({ go }: Pick<ScreenProps, 'go'>) {
  const [query, setQuery] = useState('');
  const { foundGroups } = searchDirectory(query);
  return <div className="space-y-3 px-[18px] pb-8 pt-2"><SearchBox value={query} setValue={setQuery} compact placeholder="Search family groups…"/><p className="px-1 text-[12px] text-[#958d85]">{foundGroups.length} family groups</p>{foundGroups.length ? <div className="space-y-2">{foundGroups.map(group => <GroupTile key={group.id} groupId={group.id} go={go}/>)}</div> : <Empty title="No family groups found" text="Try another group name or location."/>}</div>;
}

function Profile({ memberId, go, onLogout }: ScreenProps & { onLogout: () => void }) {
  const member = memberById(memberId)!;
  const family = familyByMember(memberId)!;
  const group = groupById(family.groupId)!;
  const [copied, setCopied] = useState('');
  const relationship = relationshipLabel(memberId, family.representativeId, family.representativeId);
  async function copy(value: string, label: string) { try { await navigator.clipboard.writeText(value); setCopied(`${label} copied`); window.setTimeout(() => setCopied(''), 1800); } catch { setCopied('Select the contact text to copy it.'); } }
  return <div className="space-y-4 px-[18px] pb-8 pt-2">
    <ProfileCard memberId={memberId}/>
    <ShareButton title={`${member.name}'s profile`} text={`View ${member.name}'s profile on Kinfolk.`} path="/profile"/>
    <SurfaceCard><SectionTitle>Personal details</SectionTitle><dl className="grid grid-cols-2 gap-x-4 gap-y-4 text-[12px]"><Detail label="Date of birth" value={member.dob}/><Detail label="Occupation" value={member.occupation}/><Detail label="Education" value={member.education}/><Detail label="Current location" value={member.location}/><Detail label="Family relationship" value={memberId === family.representativeId ? 'Family representative' : relationship}/><Detail label="ZIP code" value={family.zip}/><Detail label="Ancestral hometown" value={member.hometown}/></dl><div className="mt-4"><AddressMap address={family.address} label="your address"/></div></SurfaceCard>
    <SurfaceCard><SectionTitle>Contact details</SectionTitle>{member.phone && <ContactRow icon={<Phone size={17}/>} label="Mobile number" value={member.phone} href={`tel:${member.phone.replace(/[^+\d]/g, '')}`} copy={() => copy(member.phone!, 'Mobile number')} copied={copied === 'Mobile number copied'}/>}{member.email && <ContactRow icon={<Mail size={17}/>} label="Email address" value={member.email} href={`mailto:${member.email}`} copy={() => copy(member.email!, 'Email address')} copied={copied === 'Email address copied'}/>}{copied.startsWith('Select') && <p aria-live="polite" className="pt-1 text-[12px] text-[#866d59]">{copied}</p>}</SurfaceCard>
    <section className="space-y-3"><SectionTitle>My family</SectionTitle><Button onClick={() => go('/my-family')} className="flex min-h-[76px] w-full items-center gap-3 rounded-[22px] bg-[#efece7] p-4 text-left"><span className="grid size-11 shrink-0 place-items-center rounded-full bg-[#e8e1d9]"><UsersRound size={19}/></span><span className="min-w-0 flex-1"><strong className="block text-[14px] font-medium">{family.name}</strong><span className="mt-1 block text-[12px] text-[#8b837b]">{group.name} · {family.memberIds.length} members</span></span><ChevronRight size={18}/></Button></section>
    <SurfaceCard><h2 className="text-[15px] font-medium">Request a change</h2><p className="mt-2 text-[12px] leading-5 text-[#817c76]">Need to update a profile or family detail? Contact the community admin.</p><p className="mt-3 text-[12px] leading-5 text-[#817c76]">{admin.phone}<br/>{admin.email}</p><div className="mt-4"><ContactActions memberId="admin"/></div></SurfaceCard>
    <Button onClick={onLogout} variant="destructive" className="w-full">Log out</Button>
  </div>;
}

function Birthdays({ memberId }: ScreenProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const closeSheet = useCallback(() => setSelectedId(null), []);
  const today = members.filter(member => member.birthday === 'October 12');
  return <div className="space-y-3 px-[18px] pb-8 pt-2">
    <p className="mb-4 text-[12px] text-[#8b837b]">A little moment to celebrate our people.</p>
    {today.length > 0 && <article className="overflow-hidden rounded-[22px] bg-[#efece7]">
      {today.map((member, index) => <div key={member.id} className={index > 0 ? 'border-t border-[#ded8d0]' : ''}>
        <Button onClick={() => setSelectedId(member.id)} aria-label={`View ${member.name}'s profile`} className="flex min-h-12 w-full items-center gap-3 p-4 pb-3 text-left"><Photo id={member.id} className="size-[52px] rounded-2xl"/><span className="min-w-0 flex-1"><strong className="block text-[14px] font-medium">{member.name}</strong><span className="mt-1 block text-[12px] text-[#8b837b]">Celebrating today · {member.birthday}</span><Blood id={member.id}/></span><ChevronRight size={18} className="text-[#8c857e]"/></Button>
        <div className="px-4 pb-4"><ContactActions memberId={member.id}/></div>
      </div>)}
    </article>}
    {selectedId && <MemberProfileSheet memberId={selectedId} perspectiveId={memberId} close={closeSheet}/>}
  </div>;
}

function MemberProfileSheet({ memberId, perspectiveId, close }: { memberId: string; perspectiveId: string; close: () => void }) {
  const [activeId, setActiveId] = useState(memberId);
  useEffect(() => setActiveId(memberId), [memberId]);
  const member = memberById(activeId)!;
  const family = familyByMember(activeId);
  const activeRelation = relationshipLabel(activeId, perspectiveId, family?.representativeId);
  return <BottomSheet title="Member profile" close={close}><div className="space-y-4">
    <div className="flex items-center gap-3"><Photo id={member.id} className="size-[64px] rounded-full"/><div className="min-w-0 flex-1"><h3 className="text-[16px] font-medium">{member.name}</h3><p className="mt-1 text-[12px] text-[#a15937]">{activeRelation}{family && <span className="text-[#8b837b]"> · {family.name}</span>}</p></div></div>
    <ContactActions memberId={member.id}/>
    {family && <section aria-label={`${family.name} members`}><SectionTitle>{family.name} members</SectionTitle><div className="divide-y divide-[#e7e0d8]">{family.memberIds.map(id => { const person = memberById(id)!; const personRelation = relationshipLabel(id, perspectiveId, family.representativeId); return <Button key={id} onClick={() => setActiveId(id)} aria-current={id === activeId ? 'true' : undefined} className={`flex min-h-[64px] w-full items-center gap-3 px-2 text-left ${id === activeId ? 'bg-[#f3efea]' : ''}`}><Photo id={id} className="size-11 rounded-full"/><span className="min-w-0 flex-1"><strong className="block truncate text-[13px] font-medium">{person.name}</strong><span className="block truncate text-[11px] text-[#8b837b]">{personRelation}</span></span>{id === activeId && <span className="text-[10px] text-[#a15937]">Viewing</span>}</Button>; })}</div></section>}
    <section><SectionTitle>Personal details</SectionTitle><dl className="grid grid-cols-2 gap-x-4 gap-y-4 rounded-2xl bg-[#f3efea] p-4 text-[12px]"><Detail label="Date of birth" value={member.dob}/><Detail label="Blood group" value={member.bloodGroup}/><Detail label="Occupation" value={member.occupation}/><Detail label="Education" value={member.education}/><Detail label="Current location" value={member.location}/><Detail label="Ancestral hometown" value={member.hometown}/></dl></section>
    {family && <section><SectionTitle>Family address</SectionTitle><AddressMap address={family.address} label={`${family.name} address`}/></section>}
  </div></BottomSheet>;
}

function Notifications({ go }: ScreenProps) {
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [read, setRead] = useState<string[]>([]);
  const notifications: Notice[] = [
    { id: 'birthdays', title: '3 birthdays today', detail: 'Robert, Patricia, and Andrew are celebrating today.', destination: '/birthdays', read: read.includes('birthdays'), icon: <Cake size={19}/> },
    { id: 'directory', title: 'New from your community admin', detail: '8 families joined the directory this month.', destination: '/announcements/directory', read: read.includes('directory'), icon: <UsersRound size={19}/> },
  ];
  const shown = notifications.filter(item => filter === 'all' || !item.read);
  return <div className="px-[18px] pb-8 pt-2">
    <div className="mb-4 flex min-h-12 items-center gap-2 rounded-full bg-[#efece7] p-1">
      <Button onClick={() => setFilter('all')} className={`min-h-10 flex-1 rounded-full text-[12px] ${filter === 'all' ? 'bg-white font-medium shadow-sm' : 'text-[#817c76]'}`}>All</Button>
      <Button onClick={() => setFilter('unread')} className={`min-h-10 flex-1 rounded-full text-[12px] ${filter === 'unread' ? 'bg-white font-medium shadow-sm' : 'text-[#817c76]'}`}>Unread</Button>
    </div>
    {shown.length ? <div className="space-y-2">{shown.map(item => <Button key={item.id} onClick={() => { setRead(current => [...new Set([...current, item.id])]); go(item.destination); }} className="flex w-full items-center gap-3 rounded-[20px] bg-[#efece7] p-4 text-left">
      <span className="grid size-10 shrink-0 place-items-center rounded-full bg-white/80 text-[#86614b]">{item.icon}</span>
      <span className="min-w-0 flex-1"><strong className="block text-[13px] font-medium">{item.title}</strong><span className="mt-1 block text-[12px] leading-5 text-[#817c76]">{item.detail}</span><span className="mt-2 block text-[12px] text-[#a49c94]">Today</span></span>
      {!item.read && <span className="size-2 shrink-0 rounded-full bg-[#ff5500]" aria-label="Unread"/>}<ChevronRight size={17} className="text-[#8c857e]"/>
    </Button>)}</div> : <Empty title="You’re all caught up" text="No unread notifications."/>}
  </div>;
}

function Events({ go }: ScreenProps) { return <div className="space-y-3 px-[18px] pb-8 pt-2"><p className="text-[12px] text-[#8b837b]">Your upcoming community gatherings.</p><Button onClick={() => go('/events/picnic')} className="flex w-full items-center gap-3 rounded-[22px] bg-[#efece7] p-4 text-left"><span className="grid size-12 place-items-center rounded-2xl bg-[#e8e1d9]"><CalendarDays size={21}/></span><span className="flex-1"><strong className="block text-[14px]">{event.title}</strong><span className="mt-1 block text-[12px] text-[#8b837b]">October 18 · 9:00 AM · Lake Union Park</span></span><ChevronRight size={18}/></Button></div>; }
function EventDetail() { return <div className="space-y-4 px-[18px] pb-8 pt-2"><span className="inline-flex rounded-full bg-[#efece7] px-3 py-2 text-[12px] font-medium text-[#826a57]">Community gathering</span><p className="text-[13px] leading-6 text-[#817c76]">A relaxed morning of familiar faces, new connections, and time together.</p><SurfaceCard><h2 className="font-medium">{event.date}</h2><p className="mt-2 text-[12px] text-[#817c76]">{event.time}</p></SurfaceCard><SurfaceCard><h2 className="font-medium">{event.place}</h2><p className="mt-2 text-[12px] leading-5 text-[#817c76]">Bring a picnic blanket and a breakfast to share. All community families are welcome.</p></SurfaceCard><SurfaceCard><h2 className="font-medium">Organizer</h2><p className="mt-2 text-[12px] text-[#817c76]">Community admin team</p></SurfaceCard></div>; }

function Announcements({ go, detail = false }: ScreenProps & { detail?: boolean }) { if (detail) return <div className="space-y-4 px-[18px] pb-8 pt-2"><span className="inline-flex rounded-full bg-[#efece7] px-3 py-2 text-[12px] font-medium text-[#826a57]">Community announcement</span><p className="text-[12px] text-[#817c76]">From the community admin · October 12, 2026</p><SurfaceCard><h2 className="text-[17px] font-medium">A warm welcome to our new families</h2><p className="mt-3 text-[12px] leading-6 text-[#817c76]">Eight families joined our community directory this month. Explore their profiles and discover the stories and connections that bring us together.</p></SurfaceCard><Button onClick={() => go('/directory')} variant="primary">Explore the directory <ArrowRight size={17}/></Button></div>; return <div className="px-[18px] pb-8 pt-2"><Button onClick={() => go('/announcements/directory')} className="flex w-full items-center gap-3 rounded-[22px] bg-[#efece7] p-4 text-left"><span className="grid size-10 place-items-center rounded-full bg-white/80"><Megaphone size={18}/></span><span className="flex-1"><strong className="block text-[14px]">Our directory is growing</strong><span className="mt-1 block text-[12px] text-[#817c76]">Meet the 8 families who joined us this month.</span></span><ChevronRight size={18}/></Button></div>; }

function SearchResults({ query, go }: { query: string; go: (path: string) => void }) {
  const { foundGroups, foundFamilies, foundMembers } = searchDirectory(query);
  const needle = query.trim().toLowerCase();
  const announcementMatches = Boolean(needle && `our directory is growing new families joined community admin`.includes(needle));
  const hasResults = foundGroups.length || foundFamilies.length || foundMembers.length || announcementMatches;
  return <div className="space-y-5 px-[18px] pb-8 pt-2">{!query && <p className="text-[12px] text-[#817c76]">Search family names, relationships, phone, email, location, ZIP codes, and announcements.</p>}{foundGroups.length > 0 && <section><SectionTitle>Family groups</SectionTitle><div className="space-y-2">{foundGroups.map(group => <GroupTile key={group.id} groupId={group.id} go={go}/>)}</div></section>}{foundFamilies.length > 0 && <section><SectionTitle>Families</SectionTitle><div className="space-y-2">{foundFamilies.map(family => <Button key={family.id} onClick={() => go(`/directory/${family.groupId}`)} className="flex min-h-14 w-full items-center gap-3 rounded-2xl bg-[#efece7] px-4 text-left"><span className="flex-1"><strong className="text-[13px] font-medium">{family.name}</strong><span className="mt-1 block text-[12px] text-[#817c76]">{groupById(family.groupId)?.name} · {family.memberIds.length} members</span></span><ChevronRight size={17}/></Button>)}</div></section>}{foundMembers.length > 0 && <section><SectionTitle>Members</SectionTitle><div className="space-y-2">{foundMembers.map(member => <div key={member.id} className="rounded-[20px] bg-[#efece7] p-3"><div className="mb-3 flex items-center gap-3"><Photo id={member.id} className="size-12 rounded-xl"/><span className="flex-1"><strong className="text-[13px] font-medium">{member.name}</strong><span className="mt-1 block text-[12px] text-[#817c76]">{member.occupation} · {member.location}</span></span><Blood id={member.id}/></div><ContactActions memberId={member.id}/></div>)}</div></section>}{announcementMatches && <section><SectionTitle>Updates</SectionTitle><Button onClick={() => go('/announcements/directory')} className="flex min-h-14 w-full items-center gap-3 rounded-2xl bg-[#efece7] px-4 text-left"><Megaphone size={19}/><span className="flex-1 text-[13px] font-medium">Our directory is growing</span><ChevronRight size={17}/></Button></section>}{query && !hasResults && <Empty title="No matches" text="Try another name or detail."/>}</div>;
}

export default function KinfolkApp() {
  const pathname = usePathname();
  const router = useRouter();
  const [memberId, setMemberId] = useState('');
  const [sessionReady, setSessionReady] = useState(false);
  const [phone, setPhone] = useState('(206) 555-0104');
  const [otp, setOtp] = useState('');
  const [loginError, setLoginError] = useState('');
  const [otpMemberId, setOtpMemberId] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const contentRef = useRef<HTMLElement>(null);
  const path = pathname || '/';
  const go = (destination: string) => router.push(destination, { scroll: false });

  useEffect(() => {
    const session = localStorage.getItem(sessionKey);
    if (session && memberById(session)) setMemberId(session);
    setSessionReady(true);
  }, []);
  useEffect(() => {
    if (!sessionReady) return;
    const isPublic = path === '/login' || path === '/login/verify';
    if (!memberId && !isPublic) router.replace('/login');
    else if (memberId && path.startsWith('/login')) router.replace('/');
  }, [memberId, path, router, sessionReady]);
  useLayoutEffect(() => {
    if (contentRef.current) contentRef.current.scrollTop = 0;
  }, [path]);

  const groupRoute = path.match(/^\/directory\/([^/]+)$/)?.[1];
  const isDirectory = path === '/directory';
  const isFamilyGroups = path === '/family-groups';
  const isOwnFamily = path === '/my-family';
  const isProfile = path === '/profile';
  const title = path === '/' ? 'Kinfolk' : isDirectory ? 'Directory' : isFamilyGroups ? 'Family groups' : groupRoute ? groupById(groupRoute)?.name ?? 'Family group' : isOwnFamily ? 'My family' : isProfile ? 'My profile' : path === '/notifications' ? 'Notifications' : path === '/birthdays' ? 'Birthdays' : path === '/events' ? 'Events' : path === '/events/picnic' ? 'Family picnic' : path === '/announcements' ? 'Community board' : path === '/announcements/directory' ? 'Our directory is growing' : path === '/search' ? 'Search' : 'Kinfolk';
  const login = path === '/login' || path === '/login/verify';
  const backTarget = isOwnFamily ? '/profile' : groupRoute || isFamilyGroups ? '/directory' : path === '/announcements/directory' ? '/announcements' : path === '/events/picnic' ? '/events' : '/';
  const navigateBack = () => go(backTarget);
  const phoneKey = phone.replace(/\D/g, '').slice(-10);

  function requestCode(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const found = peopleByPhone.get(phoneKey);
    if (!found) { setLoginError('This number is not in the family directory yet.'); return; }
    setOtpMemberId(found); setLoginError(''); setOtp(''); go('/login/verify');
  }
  function verifyCode(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (otp !== '123456') { setLoginError('That code does not match. Try again.'); return; }
    // Keep verification usable after a refresh on /login/verify, where React
    // state is reset but the entered phone number is still available.
    const verifiedMemberId = otpMemberId || peopleByPhone.get(phoneKey) || '';
    if (!verifiedMemberId) { setLoginError('Enter a directory phone number before verifying.'); return; }
    localStorage.setItem(sessionKey, verifiedMemberId); setMemberId(verifiedMemberId);
    const seen = localStorage.getItem(`kinfolk-welcome:${memberById(verifiedMemberId)?.email}`);
    go(seen ? '/' : '/welcome');
  }
  function finishWelcome() { localStorage.setItem(`kinfolk-welcome:${memberById(memberId)?.email}`, 'complete'); go('/'); }
  function logout() { localStorage.removeItem(sessionKey); setMemberId(''); go('/login'); }

  if (!sessionReady || (!memberId && !login && path !== '/welcome')) return <main className="grid min-h-svh place-items-center bg-[#e9e5e1]"><span className="size-7 animate-spin rounded-full border-2 border-[#ded8d0] border-t-[#ff5500]" aria-label="Loading"/></main>;
  if (path === '/welcome' && memberId) return <Welcome memberId={memberId} onContinue={finishWelcome}/>;
  if (login && !memberId) return <PhoneFrame screenClassName="bg-[#f6f2ef]"><StatusBar/><section className="flex min-h-0 flex-1 flex-col overflow-y-auto px-7 pb-7 pt-5"><Button onClick={() => path === '/login/verify' ? go('/login') : undefined} className="grid size-12 place-items-center rounded-full bg-[#f0f0f0] disabled:opacity-30" aria-label="Go back" disabled={path !== '/login/verify'}><ArrowLeft size={20}/></Button><div className="mt-[15vh]"><p className="text-[38px] font-normal tracking-[-1.8px]">{path === '/login/verify' ? 'check your messages' : 'log in'}</p><p className="mt-2 text-[14px] text-[#888]">{path === '/login/verify' ? `enter the code sent to ${phone}` : 'enter the number you used to join Kinfolk'}</p></div>{path === '/login/verify' ? <form onSubmit={verifyCode} className="mt-10"><label htmlFor="otp" className="mb-2 block text-[12px] font-semibold tracking-[1px]">VERIFICATION CODE</label><input id="otp" autoComplete="one-time-code" inputMode="numeric" maxLength={6} value={otp} onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0,6))} placeholder="• • • • • •" className="h-[62px] w-full rounded-xl bg-[#f0f0f0] px-4 text-center text-[22px] tracking-[8px] outline-none focus:ring-2 focus:ring-[#ff5500]"/><p role="alert" className="min-h-7 pt-2 text-[12px] text-red-600">{loginError}</p><Button type="submit" variant="primary" className="mt-3 min-h-[58px] w-full text-[14px] tracking-[1px]">CONTINUE</Button><p className="mt-5 text-center text-[12px] text-[#777]">Demo code: 123456</p></form> : <form onSubmit={requestCode} className="mt-10"><label htmlFor="phone" className="mb-2 block text-[12px] font-semibold tracking-[1px]">PHONE NUMBER</label><div className="flex gap-3"><span className="grid h-[58px] w-[76px] shrink-0 place-items-center rounded-xl bg-[#f0f0f0] text-[15px]">+1⌄</span><input id="phone" type="tel" autoComplete="tel-national" inputMode="tel" value={phone} onChange={e => setPhone(e.target.value)} className="h-[58px] min-w-0 flex-1 rounded-xl bg-[#f0f0f0] px-4 text-[16px] outline-none focus:ring-2 focus:ring-[#ff5500]"/></div><p role="alert" className="min-h-7 pt-2 text-[12px] text-red-600">{loginError}</p><Button type="submit" variant="primary" className="mt-3 min-h-[58px] w-full text-[14px] tracking-[1px]">CONTINUE</Button><p className="mt-5 text-center text-[12px] text-[#777]">Preview account: (206) 555-0104 · no SMS is sent</p></form>}<p className="mt-auto pt-6 text-center text-[12px] text-[#999]">For approved community members</p></section></PhoneFrame>;

  const page = <div key={path}>{path === '/' && <Home memberId={memberId} go={go} back={navigateBack} searchQuery={searchQuery} setSearchQuery={setSearchQuery}/ >}{isDirectory && <DirectoryList memberId={memberId} go={go}/ >}{isFamilyGroups && <FamilyGroups go={go}/ >}{groupRoute && <Directory memberId={memberId} go={go} back={navigateBack} groupId={groupRoute}/ >}{isOwnFamily && <Directory memberId={memberId} go={go} back={navigateBack} groupId={familyByMember(memberId)?.groupId} ownFamily/>}{isProfile && <Profile memberId={memberId} go={go} back={navigateBack} onLogout={logout}/ >}{path === '/notifications' && <Notifications memberId={memberId} go={go} back={navigateBack}/ >}{path === '/birthdays' && <Birthdays memberId={memberId} go={go} back={navigateBack}/ >}{path === '/events' && <Events memberId={memberId} go={go} back={navigateBack}/ >}{path === '/events/picnic' && <EventDetail/>}{path === '/announcements' && <Announcements memberId={memberId} go={go} back={navigateBack}/ >}{path === '/announcements/directory' && <Announcements memberId={memberId} go={go} back={navigateBack} detail/>}{path === '/search' && <div className="space-y-2 pt-2"><div className="px-[18px]"><SearchBox value={searchQuery} setValue={setSearchQuery} compact autoFocus/></div><SearchResults query={searchQuery} go={go}/></div>}</div>;
  if (!memberId) return null;
  return <PhoneFrame screenClassName="bg-[#f6f2ef]">
    <StatusBar/><AppHeader title={title} go={go} back={navigateBack} canBack={path !== '/' && !isProfile && !isDirectory && path !== '/events'} showSearch={path !== '/' && path !== '/search' && !isDirectory && !isFamilyGroups && !groupRoute && !isProfile} showNotifications={path !== '/notifications'}/><main ref={contentRef} className="relative min-h-0 flex-1 overflow-y-auto overscroll-contain pb-24 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">{page}</main><BottomNavigation pathname={path} memberId={memberId} go={go}/>
  </PhoneFrame>;
}

function Welcome({ memberId, onContinue }: { memberId: string; onContinue: () => void }) { const member = memberById(memberId)!; return <PhoneFrame screenClassName="bg-white"><StatusBar/><section className="flex min-h-0 flex-1 flex-col justify-end overflow-y-auto p-7"><div className="mb-auto mt-[30vh] grid size-16 place-items-center rounded-full bg-[#f1f1f1]"><UserRound size={30} className="text-[#888]"/></div><h1 className="text-[38px] font-medium leading-[1.08] tracking-[-1.6px]">Welcome {member.firstName},<br/>you’re in!</h1><p className="mt-4 text-[14px] leading-6 text-[#777]">Your family and community are now in one place. Find familiar faces and stay connected.</p><Button onClick={onContinue} variant="primary" className="mt-10 min-h-[58px] w-full text-[14px]">Get Started</Button></section></PhoneFrame>; }
