import { ChevronRight } from 'lucide-react';
import Button from './Button';
import { Photo } from './AppPrimitives';
import { familyById, groupById } from '../lib/data';

export default function GroupTile({ groupId, go }: { groupId: string; go: (path: string) => void }) {
  const group = groupById(groupId);
  if (!group) return null;
  const groupFamilies = group.familyIds.map(familyById).filter((family): family is NonNullable<typeof family> => Boolean(family));
  const portraits = groupFamilies.map(family => family.representativeId);
  const memberCount = groupFamilies.reduce((total, family) => total + family.memberIds.length, 0);
  return <Button onClick={() => go(`/directory/${group.id}`)} className="flex min-h-[82px] w-full items-center gap-3 rounded-[22px] bg-surface px-4 py-3 text-left transition hover:bg-action-hover active:scale-[.99]"><span className="flex shrink-0 -space-x-3">{portraits.slice(0, 2).map(id => <Photo key={id} id={id} className="size-[46px] rounded-2xl border-2 border-surface"/>)}</span><span className="min-w-0 flex-1"><strong className="block text-[15px] font-medium">{group.name}</strong><span className="mt-1 block text-[12px] text-text-subtle">{groupFamilies.length} families · {memberCount} members</span></span><ChevronRight size={19} className="text-text-subtle"/></Button>;
}
