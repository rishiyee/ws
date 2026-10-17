"use client";

import { useState, type FormEvent } from 'react';
import { groups, type Family, type Member } from '../../lib/data';
import Button from '../Button';

type FamilyDetails = Omit<Family, 'id'>;

type Props = {
  family?: Family;
  groupIds: string[];
  availableMembers: Member[];
  onSave: (details: FamilyDetails) => void;
  onCancel: () => void;
};

const fieldClass = 'mt-2 min-h-12 w-full rounded-xl border border-border-soft bg-surface-raised px-4 text-[16px] text-ink outline-none focus:border-border-focus';

export default function FamilyEditor({ family, groupIds, availableMembers, onSave, onCancel }: Props) {
  const [name, setName] = useState(family?.name ?? '');
  const [groupId, setGroupId] = useState(family?.groupId ?? groupIds[0] ?? '');
  const [address, setAddress] = useState(family?.address ?? '');
  const [zip, setZip] = useState(family?.zip ?? '');
  const [selectedIds, setSelectedIds] = useState<string[]>(family?.memberIds ?? []);
  const [representativeId, setRepresentativeId] = useState(family?.representativeId ?? '');
  const [error, setError] = useState('');
  const selectedMembers = availableMembers.filter(member => selectedIds.includes(member.id));

  function toggleMember(id: string) {
    const next = selectedIds.includes(id) ? selectedIds.filter(item => item !== id) : [...selectedIds, id];
    setSelectedIds(next);
    if (!next.includes(representativeId)) setRepresentativeId(next[0] ?? '');
    setError('');
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!name.trim() || !address.trim() || !zip.trim()) {
      setError('Enter the family name, address, and ZIP or postal code.');
      return;
    }
    if (!groupIds.includes(groupId)) { setError('Choose a group in this community.'); return; }
    if (!selectedIds.length || !representativeId || !selectedIds.includes(representativeId)) {
      setError('Select at least one member and a family representative.');
      return;
    }
    setError('');
    onSave({ name: name.trim(), groupId, representativeId, memberIds: selectedIds, address: address.trim(), zip: zip.trim() });
  }

  return <section className="rounded-[24px] border border-border-soft bg-paper p-5 sm:p-6" aria-labelledby="family-editor-title">
    <div className="mb-5 flex items-start justify-between gap-4">
      <div><h3 id="family-editor-title" className="text-[19px] font-semibold">{family ? `Edit ${family.name}` : 'Add family'}</h3><p className="mt-1 text-[13px] text-text-muted">Choose existing community members and enter the family details. Demo changes stay in this browser.</p></div>
      <Button onClick={onCancel} variant="quiet" className="px-3 text-[13px]">Cancel</Button>
    </div>
    <form onSubmit={submit} className="space-y-5">
      <div className="grid gap-4 md:grid-cols-2">
        <label className="text-[13px] font-medium">Family name<input required maxLength={100} value={name} onChange={event => setName(event.target.value)} className={fieldClass} placeholder="e.g. Davis family" /></label>
        <label className="text-[13px] font-medium">Family group<select required value={groupId} onChange={event => setGroupId(event.target.value)} className={fieldClass}>{groupIds.map(id => { const group = groups.find(item => item.id === id); return <option key={id} value={id}>{group?.name ?? id}</option>; })}</select></label>
        <label className="text-[13px] font-medium">Address<input required maxLength={240} value={address} onChange={event => setAddress(event.target.value)} className={fieldClass} placeholder="Street, city, state" /></label>
        <label className="text-[13px] font-medium">ZIP or postal code<input required maxLength={20} value={zip} onChange={event => setZip(event.target.value)} className={fieldClass} /></label>
      </div>
      <fieldset>
        <legend className="text-[13px] font-medium">Family members</legend>
        <p className="mt-1 text-[12px] text-text-muted">Members may belong to more than one family.</p>
        <div className="mt-3 grid max-h-56 gap-2 overflow-y-auto rounded-xl border border-border-soft p-2 sm:grid-cols-2 lg:grid-cols-3">
          {availableMembers.map(member => <label key={member.id} className="flex min-h-12 items-center gap-3 rounded-lg bg-surface px-3 text-[13px]"><input type="checkbox" checked={selectedIds.includes(member.id)} onChange={() => toggleMember(member.id)} className="size-5 accent-brand" />{member.name}</label>)}
        </div>
      </fieldset>
      <label className="block max-w-md text-[13px] font-medium">Family representative
        <select required value={representativeId} onChange={event => setRepresentativeId(event.target.value)} className={fieldClass}>
          <option value="">Choose a member</option>
          {selectedMembers.map(member => <option key={member.id} value={member.id}>{member.name}</option>)}
        </select>
      </label>
      {error && <p role="alert" className="text-[13px] text-status-danger">{error}</p>}
      <Button type="submit" variant="primary" className="min-w-32">{family ? 'Save changes' : 'Add family'}</Button>
    </form>
  </section>;
}
