import { families, groups, members, type Family } from './data';

const storageKey = 'vinkling-family-records-v1';
const originalFamilies = families.map(family => ({ ...family, memberIds: [...family.memberIds] }));
const memberIds = new Set(members.map(member => member.id));
const groupIds = new Set(groups.map(group => group.id));

function isFamily(value: unknown): value is Family {
  if (!value || typeof value !== 'object') return false;
  const family = value as Partial<Family>;
  return typeof family.id === 'string' && family.id.length > 0
    && typeof family.name === 'string' && family.name.trim().length > 0
    && typeof family.groupId === 'string' && groupIds.has(family.groupId)
    && typeof family.representativeId === 'string' && memberIds.has(family.representativeId)
    && Array.isArray(family.memberIds) && family.memberIds.length > 0
    && family.memberIds.every(id => typeof id === 'string' && memberIds.has(id))
    && family.memberIds.includes(family.representativeId)
    && typeof family.address === 'string' && typeof family.zip === 'string';
}

function applyRecords(saved: Family[]) {
  const edited = new Map(saved.map(family => [family.id, family]));
  families.splice(0, families.length,
    ...originalFamilies.map(family => edited.get(family.id) ?? family),
    ...saved.filter(family => !originalFamilies.some(original => original.id === family.id)),
  );
  for (const group of groups) {
    group.familyIds = families.filter(family => family.groupId === group.id).map(family => family.id);
  }
}

export function loadFamilyRecords() {
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey) ?? '[]');
    applyRecords(Array.isArray(saved) ? saved.filter(isFamily) : []);
  } catch {
    applyRecords([]);
  }
}

export function saveFamilyRecord(family: Family) {
  const current = families.filter(item => item.id !== family.id);
  const next = [...current, family];
  const original = new Map(originalFamilies.map(item => [item.id, item]));
  const changes = next.filter(item => JSON.stringify(item) !== JSON.stringify(original.get(item.id)));
  localStorage.setItem(storageKey, JSON.stringify(changes));
  applyRecords(changes);
  window.dispatchEvent(new Event('vinkling-families-updated'));
}

export function subscribeToFamilyRecords(refresh: () => void) {
  loadFamilyRecords();
  refresh();
  const onChange = () => refresh();
  const onStorage = (event: StorageEvent) => {
    if (event.key !== storageKey) return;
    loadFamilyRecords();
    refresh();
  };
  window.addEventListener('vinkling-families-updated', onChange);
  window.addEventListener('storage', onStorage);
  return () => {
    window.removeEventListener('vinkling-families-updated', onChange);
    window.removeEventListener('storage', onStorage);
  };
}
