"use client";

import { usePathname, useRouter } from 'next/navigation';
import { ArrowDownUp, ArrowLeft, ArrowRight, Bell, Cake, CalendarDays, CheckCircle2, ChevronRight, Mail, Megaphone, Phone, Share, SlidersHorizontal, UserRound, UsersRound } from 'lucide-react';
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
import CountryCodeDropdown, { type CountryCode } from './CountryCodeDropdown';
import PhoneNumberField from './PhoneNumberField';
import OtpInput from './OtpInput';
import { admin, event, familyById, familyByMember, groupById, groups, memberById, members, relationshipLabel, searchDirectory } from '../lib/data';

const sessionKey = 'vinkling-next-session-v1';
const demoOtpCode = '1234';
const countries: CountryCode[] = [
  { code: 'US', name: 'United States', dialCode: '+1' },
  { code: 'CA', name: 'Canada', dialCode: '+1' },
  { code: 'GB', name: 'United Kingdom', dialCode: '+44' },
  { code: 'IN', name: 'India', dialCode: '+91' },
];
const peopleByPhone = new Map(members.map(member => [member.phone?.replace(/\D/g, ''), member.id]));

type ScreenProps = { memberId: string; go: (path: string) => void; back: () => void };
type Notice = { id: string; title: string; detail: string; destination: string; read: boolean; icon: ReactNode };

function maskPhoneNumber(phone?: string) {
  const digits = phone?.replace(/\D/g, '') ?? '';
  if (digits.length < 5) return phone ?? '';
  const countryDigits = digits.slice(0, Math.max(0, digits.length - 10));
  const localDigits = digits.slice(countryDigits.length);
  return `${countryDigits ? `+${countryDigits} ` : ''}${'•'.repeat(Math.max(0, localDigits.length - 4))} ${localDigits.slice(-4)}`;
}

function Home({ memberId, go, searchQuery, setSearchQuery }: ScreenProps & { searchQuery: string; setSearchQuery: (value: string) => void }) {
  const [greeting, setGreeting] = useState('Good morning');
  const member = memberById(memberId);
  const family = familyByMember(memberId);
  const community = groupById(family?.groupId);
  const familyCount = groups.reduce((total, group) => total + group.familyIds.length, 0);
  const city = member?.location.split(',')[0] ?? 'your community';
  const today = new Intl.DateTimeFormat('en-US', { weekday: 'short', month: 'short', day: 'numeric' }).format(new Date());
  useEffect(() => {
    function updateGreeting() {
      const hour = new Date().getHours();
      setGreeting(hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening');
    }
    updateGreeting();
    const timer = window.setInterval(updateGreeting, 60_000);
    return () => window.clearInterval(timer);
  }, []);
  async function inviteFriends() {
    if (navigator.share) await navigator.share({ title: 'Join me on Vinkling', text: 'Let?s stay connected with our family community on Vinkling.', url: window.location.origin }).catch(() => undefined);
    else go('/directory');
  }
  return <div className="space-y-9 px-5 pb-10 pt-8 sm:px-8 sm:pt-10">
    <section className="space-y-3">
      <div className="flex items-start justify-between gap-3">
        <h2 className="max-w-[290px] text-[clamp(38px,10vw,54px)] font-normal leading-[1.12] tracking-[-2.8px]">{greeting},<br/><span className="text-brand">{city}</span></h2>
        <Button onClick={() => go('/notifications')} className="grid size-12 shrink-0 place-items-center rounded-full" aria-label="Notifications"><Bell size={23} strokeWidth={1.7}/></Button>
      </div>
      <p className="inline-flex rounded-full bg-surface-alt px-4 py-2 text-[15px] text-text-secondary">{today}</p>
    </section>
    {searchQuery.trim() ? <SearchResults query={searchQuery} go={go}/> : <>
      <section className="space-y-2">
        <h3 className="text-[25px] font-semibold tracking-[-.8px]">Invite your friends</h3>
        <button onClick={inviteFriends} className="flex min-h-[116px] w-full items-center gap-4 rounded-[28px] bg-surface-alt px-5 py-5 text-left transition active:scale-[.99]">
          <span className="flex-1 text-[17px] leading-[1.45]">Know someone who lives here or has plans to visit? <strong className="font-medium text-brand">Invite them</strong> to Vinkling.</span>
          <span className="grid size-[62px] shrink-0 place-items-center rounded-full bg-action-soft"><Share size={23} strokeWidth={1.8}/></span>
        </button>
      </section>
      <section aria-label="Search the directory"><SearchBox value={searchQuery} setValue={setSearchQuery} placeholder="Find a person or family?"/></section>
      <section className="space-y-2"><SectionTitle action={<Button onClick={() => go('/directory')} className="min-h-12 px-2 text-[13px] text-brand">View all</Button>}>Your community</SectionTitle><Button onClick={() => go(community ? `/directory/${community.id}` : '/family-groups')} className="flex min-h-[78px] w-full items-center gap-3 rounded-[22px] bg-surface-alt p-4 text-left"><span className="grid size-11 place-items-center rounded-full bg-action-soft"><UsersRound size={19}/></span><span className="min-w-0 flex-1"><strong className="block text-[14px] font-medium">{community?.name ?? 'Family directory'}</strong><span className="mt-1 block text-[12px] text-text-muted">{familyCount} families ? {members.length} people</span></span><ChevronRight size={18}/></Button></section>
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
    <Button onClick={() => setDetailsOpen(true)} aria-label={`Open ${family.name}`} className="flex min-h-[86px] w-full items-center gap-3 rounded-[22px] bg-surface px-4 py-3 text-left transition hover:bg-action-hover">
      <Photo id={representative.id} className="size-[56px] rounded-2xl"/><span className="min-w-0 flex-1"><strong className="block text-[15px] font-medium leading-5">{family.name}</strong><span className="mt-1 block text-[12px] leading-4 text-text-subtle">Represented by {representative.name}</span><span className="mt-1 block text-[12px] leading-4 text-text-subtle">{visibleMemberIds ? `${visibleMemberIds.length} of ${family.memberIds.length} members match` : `${family.memberIds.length} members`}</span></span><ChevronRight size={18} className="shrink-0 text-text-subtle"/>
    </Button>
    {detailsOpen && <BottomSheet title={family.name} close={() => setDetailsOpen(false)}><div className="space-y-4">
      <div className="flex items-center gap-3"><Photo id={representative.id} className="size-12 rounded-full"/><div><p className="text-[13px] font-medium">{representative.name}</p><p className="mt-1 text-[12px] text-text-subtle">Family representative · {memberIds.length} {memberIds.length === 1 ? 'member' : 'members'}</p></div></div>
      <ShareButton title={family.name} label="Share family" text={`View the ${family.name} on Vinkling.`} path={`/families/${family.id}`}/>
      <ContactActions memberId={representative.id}/>
      <section aria-label="Family members"><SectionTitle>Family members</SectionTitle><ul className="divide-y divide-border-soft">{memberIds.map(id => <li key={id}><MemberCard memberId={id} perspectiveId={perspectiveId} open={() => setSelectedId(id)}/></li>)}</ul></section>
      <section><SectionTitle>Family address</SectionTitle><AddressMap address={family.address} label={family.name}/></section>
    </div></BottomSheet>}
    {selectedId && <MemberProfileSheet memberId={selectedId} perspectiveId={perspectiveId} close={closeSheet}/>}
  </article>;
}

function MemberCard({ memberId, perspectiveId, open }: { memberId: string; perspectiveId: string; open: () => void }) {
  const member = memberById(memberId)!;
  const relation = relationshipLabel(memberId, perspectiveId, familyByMember(memberId)?.representativeId);
  return <Button onClick={open} aria-label={`View ${member.name}'s profile`} className="flex min-h-12 w-full items-center gap-3 rounded-[20px] bg-surface-raised p-3 text-left"><Photo id={member.id} className="size-12 rounded-2xl"/><span className="min-w-0 flex-1"><strong className="block text-[14px] font-medium">{member.name}</strong><span className="mt-1 block text-[12px] text-brand-hover">{relation}</span><span className="mt-0.5 block truncate text-[12px] text-text-subtle">{member.occupation}</span></span><ChevronRight size={18} className="shrink-0 text-text-subtle"/></Button>;
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
    {group && <ShareButton title={`${group.name} family group`} label="Share group" text={`Explore the ${group.name} family group on Vinkling.`} path={`/directory/${group.id}`}/>}
    <SearchBox value={query} setValue={setQuery} compact placeholder={searchPlaceholder}/><div className="flex items-center justify-between"><p className="text-[12px] text-text-subtle">{ownFamily ? 'Your family details' : groupId ? `${group?.familyIds.length ?? 0} families · ${filteredFamilies.reduce((sum, family) => sum + family.memberIds.length, 0)} members` : `${filteredFamilies.length} family${filteredFamilies.length === 1 ? '' : ' groups'} found`}</p>{!groupId && <Button className="inline-flex min-h-12 items-center gap-2 rounded-full bg-action px-4 text-[12px]" onClick={() => setFiltersOpen(true)}><SlidersHorizontal size={16}/>Filters{[location,hometown,occupation].filter(Boolean).length > 0 && <span className="grid size-5 place-items-center rounded-full bg-ink-strong text-[12px] text-white">{[location,hometown,occupation].filter(Boolean).length}</span>}</Button>}</div>
    {ownFamily && currentFamily && <ShareButton title={currentFamily.name} label="Share family" text={`View the ${currentFamily.name} on Vinkling.`} path={`/families/${currentFamily.id}`}/>}
    {filteredFamilies.length ? <div className="space-y-3">{filteredFamilies.map(family => <FamilyCard key={family.id} familyId={family.id} visibleMemberIds={visibleMembers(family)} perspectiveId={ownFamily || family.memberIds.includes(memberId) ? memberId : family.representativeId}/>)}</div> : <Empty title={ownFamily ? 'No family members found' : 'No families found'} text={ownFamily ? 'Try a different name, occupation, or relationship.' : 'Try a different name or clear your filters.'}/>}
    {filtersOpen && <BottomSheet title="Filter families" close={() => setFiltersOpen(false)}><div className="space-y-4"><label className="block text-[12px] font-medium text-text-muted">Location<select value={location} onChange={e => setLocation(e.target.value)} className="mt-2 min-h-12 w-full rounded-2xl border border-border-soft bg-surface-raised px-4 text-[16px]"><option value="">All locations</option><option>Seattle</option><option>Austin</option></select></label><label className="block text-[12px] font-medium text-text-muted">Hometown<select value={hometown} onChange={e => setHometown(e.target.value)} className="mt-2 min-h-12 w-full rounded-2xl border border-border-soft bg-surface-raised px-4 text-[16px]"><option value="">All hometowns</option><option>Portland</option><option>Boston</option></select></label><label className="block text-[12px] font-medium text-text-muted">Occupation<select value={occupation} onChange={e => setOccupation(e.target.value)} className="mt-2 min-h-12 w-full rounded-2xl border border-border-soft bg-surface-raised px-4 text-[16px]"><option value="">All occupations</option>{Array.from(new Set(members.map(member => member.occupation))).map(value => <option key={value}>{value}</option>)}</select></label></div><Button onClick={() => setFiltersOpen(false)} variant="primary" className="mt-5 w-full">Show {filteredFamilies.length} families</Button><Button onClick={() => { setLocation(''); setHometown(''); setOccupation(''); }} className="mt-2 min-h-12 w-full text-[12px] text-brand-hover">Clear filters</Button></BottomSheet>}
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
    <div className="flex min-h-12 items-center gap-1 rounded-full bg-surface p-1" aria-label="Directory view">
      <Button aria-pressed={view === 'groups'} onClick={() => setView('groups')} className={`min-h-10 flex-1 rounded-full px-3 text-[12px] ${view === 'groups' ? 'bg-white font-medium shadow-sm' : 'text-text-muted'}`}>Family groups</Button>
      <Button aria-pressed={view === 'people'} onClick={() => setView('people')} className={`min-h-10 flex-1 rounded-full px-3 text-[12px] ${view === 'people' ? 'bg-white font-medium shadow-sm' : 'text-text-muted'}`}>People</Button>
    </div>
    {view === 'groups' ? <><p className="px-1 text-[12px] text-text-subtle">{foundGroups.length} family groups</p>{foundGroups.length ? <div className="space-y-2">{foundGroups.map(group => <GroupTile key={group.id} groupId={group.id} go={go}/>)}</div> : <Empty title="No family groups found" text="Try another name or location."/>}</> : <><p className="px-1 text-[12px] text-text-subtle">{foundMembers.length} people</p>{sortedMembers.length ? <div>{Object.entries(memberSections).map(([initial, people]) => <section key={initial} aria-label={`${initial} names`}><h2 className="px-1 pb-2 pt-3 text-[14px] font-semibold text-text-disabled">{initial}</h2><div className="divide-y divide-border-soft">{people.map(person => <Button key={person.id} onClick={() => setSelectedId(person.id)} aria-label={`View ${person.name}'s profile`} className="flex min-h-[76px] w-full items-center gap-4 px-2 text-left">
        <Photo id={person.id} className="size-12 rounded-full"/>
        <span className="min-w-0 flex-1"><strong className="block truncate text-[14px] font-normal">{person.name}</strong><span className="mt-1 block truncate text-[12px] text-text-subtle">{person.occupation}</span></span><ChevronRight size={18} className="text-text-subtle"/>
      </Button>)}</div></section>)}</div> : <Empty title="No people found" text="Try another name or detail."/>}</>}
    {selectedMember && <MemberProfileSheet memberId={selectedMember.id} perspectiveId={memberId} close={() => setSelectedId(null)}/>}
  </div>;
}

function FamilyGroups({ go }: Pick<ScreenProps, 'go'>) {
  const [query, setQuery] = useState('');
  const { foundGroups } = searchDirectory(query);
  return <div className="space-y-3 px-[18px] pb-8 pt-2"><SearchBox value={query} setValue={setQuery} compact placeholder="Search family groups…"/><p className="px-1 text-[12px] text-text-subtle">{foundGroups.length} family groups</p>{foundGroups.length ? <div className="space-y-2">{foundGroups.map(group => <GroupTile key={group.id} groupId={group.id} go={go}/>)}</div> : <Empty title="No family groups found" text="Try another group name or location."/>}</div>;
}

function FamilyDetail({ familyId, perspectiveId, go }: { familyId: string; perspectiveId: string; go: (path: string) => void }) {
  const family = familyById(familyId);
  if (!family) return <div className="px-[18px] pt-4"><Empty title="Family not found" text="This family link may be out of date."/></div>;
  const group = groupById(family.groupId);
  return <div className="space-y-5 px-[18px] pb-8 pt-2">
    <ShareButton title={family.name} label="Share family" text={`View the ${family.name} on Vinkling.`} path={`/families/${family.id}`}/>
    <SurfaceCard><div className="flex items-center gap-3"><Photo id={family.representativeId} className="size-12 rounded-full"/><div><p className="text-[14px] font-medium">{memberById(family.representativeId)?.name}</p><p className="mt-1 text-[12px] text-text-subtle">Family representative · {group?.name}</p></div></div></SurfaceCard>
    <section><SectionTitle>Family members</SectionTitle><div className="space-y-2">{family.memberIds.map(id => <MemberCard key={id} memberId={id} perspectiveId={perspectiveId} open={() => go(`/members/${id}`)}/>)}</div></section>
    <section><SectionTitle>Family address</SectionTitle><AddressMap address={family.address} label={`${family.name} address`}/></section>
  </div>;
}

function SharedMemberDetail({ memberId, go }: { memberId: string; go: (path: string) => void }) {
  const member = memberById(memberId);
  if (!member) return <div className="px-[18px] pt-4"><Empty title="Member not found" text="This member link may be out of date."/></div>;
  const family = familyByMember(member.id);
  const group = groupById(family?.groupId);
  return <div className="space-y-5 px-[18px] pb-8 pt-2">
    <ShareButton title={`${member.name}'s profile`} label="Share profile" text={`View ${member.name}'s profile on Vinkling.`} path={`/members/${member.id}`}/>
    <SurfaceCard><div className="flex items-center gap-4"><Photo id={member.id} className="size-16 rounded-full"/><div className="min-w-0"><h2 className="text-[18px] font-medium">{member.name}</h2><p className="mt-1 text-[13px] text-text-muted">{member.occupation}</p><p className="mt-1 text-[13px] text-text-muted">{member.location}</p></div></div></SurfaceCard>
    <ContactActions memberId={member.id}/>
    {family && <Button onClick={() => go(`/families/${family.id}`)} className="flex min-h-[72px] w-full items-center gap-3 rounded-[22px] bg-surface p-4 text-left"><span className="grid size-10 place-items-center rounded-full bg-action-soft"><UsersRound size={19}/></span><span className="min-w-0 flex-1"><strong className="block text-[14px] font-medium">{family.name}</strong><span className="mt-1 block text-[12px] text-text-muted">{group?.name}</span></span><ChevronRight size={18}/></Button>}
  </div>;
}

function Profile({ memberId, go, onLogout }: ScreenProps & { onLogout: () => void }) {
  const member = memberById(memberId)!;
  const family = familyByMember(memberId)!;
  const group = groupById(family.groupId)!;
  const [copied, setCopied] = useState('');
  const relationship = relationshipLabel(memberId, family.representativeId, family.representativeId);
  async function copy(value: string, label: string) { try { await navigator.clipboard.writeText(value); setCopied(`${label} copied`); window.setTimeout(() => setCopied(''), 1800); } catch { setCopied('Select the contact text to copy it.'); } }
  return <div className="space-y-7 px-[18px] pb-8 pt-2">
    <section className="space-y-3" aria-label="Your profile"><ProfileCard memberId={memberId}/><ShareButton title={`${member.name}'s profile`} label="Share profile" text={`View ${member.name}'s profile on Vinkling.`} path={`/members/${member.id}`}/></section>
    <section className="space-y-2"><SectionTitle>My family</SectionTitle><Button onClick={() => go('/my-family')} className="flex min-h-[76px] w-full items-center gap-3 rounded-[22px] bg-surface p-4 text-left transition hover:bg-action-hover"><span className="grid size-11 shrink-0 place-items-center rounded-full bg-action"><UsersRound size={19}/></span><span className="min-w-0 flex-1"><strong className="block text-[14px] font-medium">{family.name}</strong><span className="mt-1 block text-[12px] text-text-subtle">{group.name} · {family.memberIds.length} members</span></span><ChevronRight size={18}/></Button></section>
    <section><SurfaceCard><SectionTitle>Personal details</SectionTitle><dl className="grid grid-cols-2 gap-x-4 gap-y-5 text-[12px]"><Detail label="Date of birth" value={member.dob}/><Detail label="Family relationship" value={memberId === family.representativeId ? 'Family representative' : relationship}/><Detail label="Occupation" value={member.occupation}/><Detail label="Education" value={member.education}/><Detail label="Current location" value={member.location}/><Detail label="Ancestral hometown" value={member.hometown}/></dl></SurfaceCard></section>
    <section><SurfaceCard><SectionTitle>Contact details</SectionTitle>{member.phone && <ContactRow icon={<Phone size={17}/>} label="Mobile number" value={member.phone} href={`tel:${member.phone.replace(/[^+\d]/g, '')}`} copy={() => copy(member.phone!, 'Mobile number')} copied={copied === 'Mobile number copied'}/ >}{member.email && <ContactRow icon={<Mail size={17}/>} label="Email address" value={member.email} href={`mailto:${member.email}`} copy={() => copy(member.email!, 'Email address')} copied={copied === 'Email address copied'}/ >}{copied.startsWith('Select') && <p aria-live="polite" className="pt-1 text-[12px] text-text-muted">{copied}</p>}</SurfaceCard></section>
    <section><SurfaceCard><h2 className="text-[14px] font-medium">Need to update your details?</h2><p className="mt-2 text-[12px] leading-5 text-text-muted">Contact the community admin to request a profile or family change.</p><div className="mt-4"><ContactActions memberId="admin"/></div></SurfaceCard></section>
    <Button onClick={onLogout} variant="secondary" className="w-full">Log out</Button>
  </div>;
}

function Birthdays({ memberId }: ScreenProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const closeSheet = useCallback(() => setSelectedId(null), []);
  const today = members.filter(member => member.birthday === 'October 12');
  return <div className="space-y-3 px-[18px] pb-8 pt-2">
    <p className="mb-4 text-[12px] text-text-subtle">A little moment to celebrate our people.</p>
    {today.length > 0 && <article className="overflow-hidden rounded-[22px] bg-surface">
      {today.map((member, index) => <div key={member.id} className={index > 0 ? 'border-t border-border' : ''}>
        <Button onClick={() => setSelectedId(member.id)} aria-label={`View ${member.name}'s profile`} className="flex min-h-12 w-full items-center gap-3 p-4 pb-3 text-left"><Photo id={member.id} className="size-[52px] rounded-2xl"/><span className="min-w-0 flex-1"><strong className="block text-[14px] font-medium">{member.name}</strong><span className="mt-1 block text-[12px] text-text-subtle">Celebrating today · {member.birthday}</span><Blood id={member.id}/></span><ChevronRight size={18} className="text-text-subtle"/></Button>
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
    <div className="flex items-center gap-3"><Photo id={member.id} className="size-[64px] rounded-full"/><div className="min-w-0 flex-1"><h3 className="text-[16px] font-medium">{member.name}</h3><p className="mt-1 text-[12px] text-brand-hover">{activeRelation}{family && <span className="text-text-subtle"> · {family.name}</span>}</p></div></div>
    <ShareButton title={`${member.name}'s profile`} label="Share profile" text={`View ${member.name}'s profile on Vinkling.`} path={`/members/${member.id}`}/>
    <ContactActions memberId={member.id}/>
    {family && <section aria-label={`${family.name} members`}><SectionTitle>{family.name} members</SectionTitle><div className="divide-y divide-border-soft">{family.memberIds.map(id => { const person = memberById(id)!; const personRelation = relationshipLabel(id, perspectiveId, family.representativeId); return <Button key={id} onClick={() => setActiveId(id)} aria-current={id === activeId ? 'true' : undefined} className={`flex min-h-[64px] w-full items-center gap-3 px-2 text-left ${id === activeId ? 'bg-surface-active' : ''}`}><Photo id={id} className="size-11 rounded-full"/><span className="min-w-0 flex-1"><strong className="block truncate text-[13px] font-medium">{person.name}</strong><span className="block truncate text-[11px] text-text-subtle">{personRelation}</span></span>{id === activeId && <span className="text-[10px] text-brand-hover">Viewing</span>}</Button>; })}</div></section>}
    <section><SectionTitle>Personal details</SectionTitle><dl className="grid grid-cols-2 gap-x-4 gap-y-4 rounded-2xl bg-surface-active p-4 text-[12px]"><Detail label="Date of birth" value={member.dob}/><Detail label="Blood group" value={member.bloodGroup}/><Detail label="Occupation" value={member.occupation}/><Detail label="Education" value={member.education}/><Detail label="Current location" value={member.location}/><Detail label="Ancestral hometown" value={member.hometown}/></dl></section>
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
    <div className="mb-4 flex min-h-12 items-center gap-2 rounded-full bg-surface p-1">
      <Button onClick={() => setFilter('all')} className={`min-h-10 flex-1 rounded-full text-[12px] ${filter === 'all' ? 'bg-white font-medium shadow-sm' : 'text-text-muted'}`}>All</Button>
      <Button onClick={() => setFilter('unread')} className={`min-h-10 flex-1 rounded-full text-[12px] ${filter === 'unread' ? 'bg-white font-medium shadow-sm' : 'text-text-muted'}`}>Unread</Button>
    </div>
    {shown.length ? <div className="space-y-2">{shown.map(item => <Button key={item.id} onClick={() => { setRead(current => [...new Set([...current, item.id])]); go(item.destination); }} className="flex w-full items-center gap-3 rounded-[20px] bg-surface p-4 text-left">
      <span className="grid size-10 shrink-0 place-items-center rounded-full bg-white/80 text-text-muted">{item.icon}</span>
      <span className="min-w-0 flex-1"><strong className="block text-[13px] font-medium">{item.title}</strong><span className="mt-1 block text-[12px] leading-5 text-text-muted">{item.detail}</span><span className="mt-2 block text-[12px] text-text-faint">Today</span></span>
      {!item.read && <span className="size-2 shrink-0 rounded-full bg-brand" aria-label="Unread"/>}<ChevronRight size={17} className="text-text-subtle"/>
    </Button>)}</div> : <Empty title="You’re all caught up" text="No unread notifications."/>}
  </div>;
}

function Events({ go }: ScreenProps) { return <div className="space-y-3 px-[18px] pb-8 pt-2"><p className="text-[12px] text-text-subtle">Your upcoming community gatherings.</p><Button onClick={() => go('/events/picnic')} className="flex w-full items-center gap-3 rounded-[22px] bg-surface p-4 text-left"><span className="grid size-12 place-items-center rounded-2xl bg-action"><CalendarDays size={21}/></span><span className="flex-1"><strong className="block text-[14px]">{event.title}</strong><span className="mt-1 block text-[12px] text-text-subtle">October 18 · 9:00 AM · Lake Union Park</span></span><ChevronRight size={18}/></Button></div>; }
function EventDetail() { return <div className="space-y-4 px-[18px] pb-8 pt-2"><span className="inline-flex rounded-full bg-surface px-3 py-2 text-[12px] font-medium text-text-muted">Community gathering</span><p className="text-[13px] leading-6 text-text-muted">A relaxed morning of familiar faces, new connections, and time together.</p><SurfaceCard><h2 className="font-medium">{event.date}</h2><p className="mt-2 text-[12px] text-text-muted">{event.time}</p></SurfaceCard><SurfaceCard><h2 className="font-medium">{event.place}</h2><p className="mt-2 text-[12px] leading-5 text-text-muted">Bring a picnic blanket and a breakfast to share. All community families are welcome.</p></SurfaceCard><SurfaceCard><h2 className="font-medium">Organizer</h2><p className="mt-2 text-[12px] text-text-muted">Community admin team</p></SurfaceCard></div>; }

function Announcements({ go, detail = false }: ScreenProps & { detail?: boolean }) { if (detail) return <div className="space-y-4 px-[18px] pb-8 pt-2"><span className="inline-flex rounded-full bg-surface px-3 py-2 text-[12px] font-medium text-text-muted">Community announcement</span><p className="text-[12px] text-text-muted">From the community admin · October 12, 2026</p><SurfaceCard><h2 className="text-[17px] font-medium">A warm welcome to our new families</h2><p className="mt-3 text-[12px] leading-6 text-text-muted">Eight families joined our community directory this month. Explore their profiles and discover the stories and connections that bring us together.</p></SurfaceCard><Button onClick={() => go('/directory')} variant="primary">Explore the directory <ArrowRight size={17}/></Button></div>; return <div className="px-[18px] pb-8 pt-2"><Button onClick={() => go('/announcements/directory')} className="flex w-full items-center gap-3 rounded-[22px] bg-surface p-4 text-left"><span className="grid size-10 place-items-center rounded-full bg-white/80"><Megaphone size={18}/></span><span className="flex-1"><strong className="block text-[14px]">Our directory is growing</strong><span className="mt-1 block text-[12px] text-text-muted">Meet the 8 families who joined us this month.</span></span><ChevronRight size={18}/></Button></div>; }

function SearchResults({ query, go }: { query: string; go: (path: string) => void }) {
  const { foundGroups, foundFamilies, foundMembers } = searchDirectory(query);
  const needle = query.trim().toLowerCase();
  const announcementMatches = Boolean(needle && `our directory is growing new families joined community admin`.includes(needle));
  const hasResults = foundGroups.length || foundFamilies.length || foundMembers.length || announcementMatches;
  return <div className="space-y-5 px-[18px] pb-8 pt-2">{!query && <p className="text-[12px] text-text-muted">Search family names, relationships, phone, email, location, ZIP codes, and announcements.</p>}{foundGroups.length > 0 && <section><SectionTitle>Family groups</SectionTitle><div className="space-y-2">{foundGroups.map(group => <GroupTile key={group.id} groupId={group.id} go={go}/>)}</div></section>}{foundFamilies.length > 0 && <section><SectionTitle>Families</SectionTitle><div className="space-y-2">{foundFamilies.map(family => <Button key={family.id} onClick={() => go(`/directory/${family.groupId}`)} className="flex min-h-14 w-full items-center gap-3 rounded-2xl bg-surface px-4 text-left"><span className="flex-1"><strong className="text-[13px] font-medium">{family.name}</strong><span className="mt-1 block text-[12px] text-text-muted">{groupById(family.groupId)?.name} · {family.memberIds.length} members</span></span><ChevronRight size={17}/></Button>)}</div></section>}{foundMembers.length > 0 && <section><SectionTitle>Members</SectionTitle><div className="space-y-2">{foundMembers.map(member => <div key={member.id} className="rounded-[20px] bg-surface p-3"><div className="mb-3 flex items-center gap-3"><Photo id={member.id} className="size-12 rounded-xl"/><span className="flex-1"><strong className="text-[13px] font-medium">{member.name}</strong><span className="mt-1 block text-[12px] text-text-muted">{member.occupation} · {member.location}</span></span><Blood id={member.id}/></div><ContactActions memberId={member.id}/></div>)}</div></section>}{announcementMatches && <section><SectionTitle>Updates</SectionTitle><Button onClick={() => go('/announcements/directory')} className="flex min-h-14 w-full items-center gap-3 rounded-2xl bg-surface px-4 text-left"><Megaphone size={19}/><span className="flex-1 text-[13px] font-medium">Our directory is growing</span><ChevronRight size={17}/></Button></section>}{query && !hasResults && <Empty title="No matches" text="Try another name or detail."/>}</div>;
}

export default function VinklingApp() {
  const pathname = usePathname();
  const router = useRouter();
  const [memberId, setMemberId] = useState('');
  const [sessionReady, setSessionReady] = useState(false);
  const [phone, setPhone] = useState('98765 43210');
  const [countryCode, setCountryCode] = useState('IN');
  const [otp, setOtp] = useState(['', '', '', '']);
  const [loginError, setLoginError] = useState('');
  const [otpMemberId, setOtpMemberId] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const contentRef = useRef<HTMLElement>(null);
  const path = pathname || '/';
  const go = (destination: string) => {
    if (destination === path) return;
    window.history.pushState(null, '', destination);
  };

  useEffect(() => {
    const session = localStorage.getItem(sessionKey);
    if (session && memberById(session)) setMemberId(session);
    setSessionReady(true);
  }, []);
  useEffect(() => {
    if (!sessionReady) return;
    const isPublic = path === '/login' || path === '/login/verify';
    if (!memberId && !isPublic) router.replace('/login');
    else if (memberId && path === '/login') router.replace('/');
  }, [memberId, path, router, sessionReady]);
  useLayoutEffect(() => {
    if (contentRef.current) contentRef.current.scrollTop = 0;
  }, [path]);

  const groupRoute = path.match(/^\/directory\/([^/]+)$/)?.[1];
  const familyRoute = path.match(/^\/families\/([^/]+)$/)?.[1];
  const memberRoute = path.match(/^\/members\/([^/]+)$/)?.[1];
  const isDirectory = path === '/directory';
  const isFamilyGroups = path === '/family-groups';
  const isOwnFamily = path === '/my-family';
  const isProfile = path === '/profile';
  const title = path === '/' ? 'Vinkling' : isDirectory ? 'Directory' : isFamilyGroups ? 'Family groups' : groupRoute ? groupById(groupRoute)?.name ?? 'Family group' : familyRoute ? familyById(familyRoute)?.name ?? 'Family' : memberRoute ? memberById(memberRoute)?.name ?? 'Member' : isOwnFamily ? 'My family' : isProfile ? 'My profile' : path === '/notifications' ? 'Notifications' : path === '/birthdays' ? 'Birthdays' : path === '/events' ? 'Events' : path === '/events/picnic' ? 'Family picnic' : path === '/announcements' ? 'Community board' : path === '/announcements/directory' ? 'Our directory is growing' : path === '/search' ? 'Search' : 'Vinkling';
  const login = path === '/login' || path === '/login/verify' || path === '/login/confirm';
  const backTarget = isOwnFamily ? '/profile' : familyRoute ? `/directory/${familyById(familyRoute)?.groupId ?? ''}` : memberRoute ? `/directory/${familyByMember(memberRoute)?.groupId ?? ''}` : groupRoute || isFamilyGroups ? '/directory' : path === '/announcements/directory' ? '/announcements' : path === '/events/picnic' ? '/events' : '/';
  const navigateBack = () => go(backTarget);
  const selectedCountry = countries.find(country => country.code === countryCode) ?? countries[0];
  const phoneDigits = phone.replace(/\D/g, '');
  const nationalNumber = phoneDigits.startsWith(selectedCountry.dialCode.slice(1))
    ? phoneDigits.slice(selectedCountry.dialCode.length - 1)
    : phoneDigits;
  const phoneKey = `${selectedCountry.dialCode.replace(/\D/g, '')}${nationalNumber}`;

  function requestCode(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const found = peopleByPhone.get(phoneKey);
    if (!found) { setLoginError('This number is not in the family directory yet.'); return; }
    setOtpMemberId(found); setLoginError(''); setOtp(['', '', '', '']); go('/login/verify');
  }
  function verifyCode(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const enteredCode = otp.join('');
    if (!enteredCode) { setLoginError('Enter the four-digit verification code.'); document.getElementById('otp-0')?.focus(); return; }
    if (otp.some(digit => !digit)) { setLoginError('Enter all four digits.'); document.getElementById(`otp-${otp.findIndex(digit => !digit)}`)?.focus(); return; }
    if (enteredCode !== demoOtpCode) { setLoginError('That code does not match. Try again.'); return; }
    // Keep verification usable after a refresh on /login/verify, where React
    // state is reset but the entered phone number is still available.
    const verifiedMemberId = otpMemberId || peopleByPhone.get(phoneKey) || '';
    if (!verifiedMemberId) { setLoginError('Enter a directory phone number before verifying.'); return; }
    localStorage.setItem(sessionKey, verifiedMemberId); setMemberId(verifiedMemberId);
    go('/login/confirm');
  }
  function continueAfterConfirmation() {
    const seen = localStorage.getItem(`vinkling-welcome:${memberById(memberId)?.email}`);
    go(seen ? '/' : '/welcome');
  }
  function changeConfirmedNumber() {
    localStorage.removeItem(sessionKey);
    setMemberId('');
    setOtpMemberId('');
    setOtp(['', '', '', '']);
    go('/login');
  }
  function finishWelcome() { localStorage.setItem(`vinkling-welcome:${memberById(memberId)?.email}`, 'complete'); go('/'); }
  function logout() { localStorage.removeItem(sessionKey); setMemberId(''); go('/login'); }

  if (!sessionReady || (!memberId && !login && path !== '/welcome')) return <main className="grid min-h-svh place-items-center bg-paper px-8" aria-label="Loading Vinkling"><div className="flex flex-col items-center text-center"><img src="/icon.svg" alt="" className="size-20 rounded-[26px] shadow-sm"/><h1 className="mt-5 text-[30px] font-medium tracking-[-1.3px] text-ink-soft">vinkling</h1><p className="mt-1 text-[13px] text-text-muted">Your family, close at heart.</p><span className="mt-8 h-1 w-12 overflow-hidden rounded-full bg-action"><span className="block h-full w-1/2 animate-pulse rounded-full bg-brand motion-reduce:animate-none"/></span></div></main>;
  if (path === '/login/confirm' && memberId) return <IdentityConfirmation memberId={memberId} onContinue={continueAfterConfirmation} onChangeNumber={changeConfirmedNumber}/>;
  if (path === '/welcome' && memberId) return <Welcome memberId={memberId} onContinue={finishWelcome}/>;
  if (login && !memberId) return (
    <PhoneFrame screenClassName="bg-paper"><StatusBar/><section className="flex min-h-0 flex-1 flex-col overflow-y-auto px-7 pb-7 pt-5">
      <Button onClick={() => path === '/login/verify' ? go('/login') : undefined} className="grid size-12 place-items-center rounded-full bg-field disabled:opacity-30" aria-label="Go back" disabled={path !== '/login/verify'}><ArrowLeft size={20}/></Button>
      <div className="mt-[15vh]"><p className="text-[38px] font-normal tracking-[-1.8px]">{path === '/login/verify' ? 'check your messages' : 'log in'}</p><p className="mt-2 text-[14px] text-text-muted">{path === '/login/verify' ? `enter the code sent to ${selectedCountry.dialCode} ${phone}` : 'enter the number you used to join Vinkling'}</p>
        {path === '/login/verify' && <button type="button" onClick={() => { setOtp(['', '', '', '']); setLoginError(''); go('/login'); }} className="mt-1 inline-flex min-h-8 items-center p-0 text-[13px] font-medium text-brand-hover underline underline-offset-4">Change number</button>}
      </div>
      {path === '/login/verify' ? <form onSubmit={verifyCode} className="mt-8">
        <label htmlFor="otp-0" className="mb-3 block text-[12px] font-semibold tracking-[1px]">VERIFICATION CODE</label>
        <OtpInput value={otp} onChange={value => { setOtp(value); setLoginError(''); }} invalid={Boolean(loginError)}/>
        <p role="alert" className="min-h-7 pt-2 text-[12px] text-red-600">{loginError}</p><div className="sticky bottom-0 z-10 mt-3 bg-paper pt-2" style={{ paddingBottom: 'max(env(safe-area-inset-bottom), 8px)' }}><Button type="submit" variant="primary" className="min-h-[58px] w-full text-[14px] tracking-[1px]">CONTINUE</Button></div>
      </form> : <form onSubmit={requestCode} className="mt-10"><label htmlFor="phone" className="mb-2 block text-[12px] font-semibold tracking-[1px]">PHONE NUMBER</label>
        <div className="flex gap-3"><CountryCodeDropdown countries={countries} value={countryCode} onChange={value => { setCountryCode(value); setLoginError(''); }}/><PhoneNumberField id="phone" value={phone} onChange={setPhone} invalid={Boolean(loginError)}/></div>
        <p role="alert" className="min-h-7 pt-2 text-[12px] text-red-600">{loginError}</p><Button type="submit" variant="primary" className="mt-3 min-h-[58px] w-full text-[14px] tracking-[1px]">CONTINUE</Button>
      </form>}
      <p className="mt-auto pt-6 text-center text-[12px] text-text-muted">For approved community members</p>
    </section></PhoneFrame>
  );

  const page = <div key={path} className="screen-transition">{path === '/' && <Home memberId={memberId} go={go} back={navigateBack} searchQuery={searchQuery} setSearchQuery={setSearchQuery}/ >}{isDirectory && <DirectoryList memberId={memberId} go={go}/ >}{isFamilyGroups && <FamilyGroups go={go}/ >}{groupRoute && <Directory memberId={memberId} go={go} back={navigateBack} groupId={groupRoute}/ >}{familyRoute && <FamilyDetail familyId={familyRoute} perspectiveId={memberId} go={go}/ >}{memberRoute && <SharedMemberDetail memberId={memberRoute} go={go}/ >}{isOwnFamily && <Directory memberId={memberId} go={go} back={navigateBack} groupId={familyByMember(memberId)?.groupId} ownFamily/>}{isProfile && <Profile memberId={memberId} go={go} back={navigateBack} onLogout={logout}/ >}{path === '/notifications' && <Notifications memberId={memberId} go={go} back={navigateBack}/ >}{path === '/birthdays' && <Birthdays memberId={memberId} go={go} back={navigateBack}/ >}{path === '/events' && <Events memberId={memberId} go={go} back={navigateBack}/ >}{path === '/events/picnic' && <EventDetail/>}{path === '/announcements' && <Announcements memberId={memberId} go={go} back={navigateBack}/ >}{path === '/announcements/directory' && <Announcements memberId={memberId} go={go} back={navigateBack} detail/>}{path === '/search' && <div className="space-y-2 pt-2"><div className="px-[18px]"><SearchBox value={searchQuery} setValue={setSearchQuery} compact autoFocus/></div><SearchResults query={searchQuery} go={go}/></div>}</div>;
  if (!memberId) return null;
  return <PhoneFrame screenClassName="bg-paper">
    <StatusBar/>{path !== '/' && <AppHeader title={title} go={go} back={navigateBack} canBack={path !== '/' && !isProfile && !isDirectory && path !== '/events' && path !== '/notifications'} showSearch={path !== '/search' && path !== '/notifications' && !isDirectory && !isFamilyGroups && !groupRoute && !isProfile} showNotifications={false}/>}<main ref={contentRef} className="relative min-h-0 flex-1 overflow-y-auto overscroll-contain pb-24 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">{page}</main><BottomNavigation pathname={path} memberId={memberId} go={go}/>
  </PhoneFrame>;
}

function Welcome({ memberId, onContinue }: { memberId: string; onContinue: () => void }) { const member = memberById(memberId)!; return <PhoneFrame screenClassName="bg-white"><StatusBar/><section className="flex min-h-0 flex-1 flex-col justify-end overflow-y-auto p-7"><div className="mb-auto mt-[30vh] grid size-16 place-items-center rounded-full bg-field"><UserRound size={30} className="text-text-muted"/></div><h1 className="text-[38px] font-medium leading-[1.08] tracking-[-1.6px]">Welcome {member.firstName},<br/>you’re in!</h1><p className="mt-4 text-[14px] leading-6 text-text-muted">Your family and community are now in one place. Find familiar faces and stay connected.</p><Button onClick={onContinue} variant="primary" className="mt-10 min-h-[58px] w-full text-[14px]">Get Started</Button></section></PhoneFrame>; }

function IdentityConfirmation({ memberId, onContinue, onChangeNumber }: { memberId: string; onContinue: () => void; onChangeNumber: () => void }) {
  const member = memberById(memberId)!;
  return <PhoneFrame screenClassName="bg-paper"><StatusBar/><section className="flex min-h-0 flex-1 flex-col overflow-y-auto px-7 pb-8 pt-5">
    <div className="grid size-12 place-items-center rounded-full bg-brand-soft text-brand"><CheckCircle2 size={24}/></div>
    <div className="mt-[12vh]"><h1 className="text-[34px] font-normal leading-[1.12] tracking-[-1.4px]">Your number is verified</h1><p className="mt-3 text-[14px] leading-6 text-text-muted">We found this Vinkling account. Is it yours?</p></div>
    <div className="mt-7 flex items-center gap-4 rounded-[24px] bg-surface p-5">
      <Photo id={memberId} className="size-14 rounded-full"/>
      <div className="min-w-0"><p className="truncate text-[17px] font-medium">{member.name}</p><p className="mt-1 text-[14px] text-text-muted">{maskPhoneNumber(member.phone)}</p></div>
    </div>
    <div className="mt-auto pt-8"><Button onClick={onContinue} variant="primary" className="min-h-[58px] w-full text-[14px]">Yes, continue</Button><Button onClick={onChangeNumber} className="mt-3 min-h-12 w-full text-[14px] font-medium text-text-muted">This isn’t me · Change number</Button></div>
  </section></PhoneFrame>;
}
