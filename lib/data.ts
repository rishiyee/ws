export type Member = {
  id: string;
  name: string;
  firstName: string;
  photo: string;
  dob: string;
  birthday: string;
  occupation: string;
  phone?: string;
  email?: string;
  bloodGroup: string;
  location: string;
  hometown: string;
};

export type Family = {
  id: string;
  name: string;
  groupId: string;
  representativeId: string;
  memberIds: string[];
  address: string;
  zip: string;
};

export type FamilyGroup = {
  id: string;
  name: string;
  location: string;
  familyIds: string[];
};

export const members: Member[] = [
  { id: 'robert', name: 'Robert Miller', firstName: 'Robert', photo: 'ravi', dob: 'October 12, 1972', birthday: 'October 12', occupation: 'Teacher', phone: '+1 (512) 555-0101', email: 'robert.miller@example.com', bloodGroup: 'B+', location: 'Austin', hometown: 'Portland' },
  { id: 'patricia', name: 'Patricia Johnson', firstName: 'Patricia', photo: 'priya', dob: 'October 12, 1986', birthday: 'October 12', occupation: 'Doctor', phone: '+1 (206) 555-0102', email: 'patricia.johnson@example.com', bloodGroup: 'A+', location: 'Seattle', hometown: 'Portland' },
  { id: 'andrew', name: 'Andrew Wilson', firstName: 'Andrew', photo: 'arjun', dob: 'October 12, 1989', birthday: 'October 12', occupation: 'Architect', phone: '+1 (512) 555-0103', email: 'andrew.wilson@example.com', bloodGroup: 'O−', location: 'Austin', hometown: 'Boston' },
  { id: 'emma', name: 'Emma Davis', firstName: 'Emma', photo: 'ananya', dob: 'November 24, 1996', birthday: 'November 24', occupation: 'Designer', phone: '+1 (206) 555-0104', email: 'emma.davis@example.com', bloodGroup: 'O+', location: 'Seattle', hometown: 'Portland' },
  { id: 'maria', name: 'Maria Miller', firstName: 'Maria', photo: 'meera', dob: 'December 8, 1976', birthday: 'December 8', occupation: 'Teacher', phone: '+1 (512) 555-0105', email: 'maria.miller@example.com', bloodGroup: 'AB+', location: 'Austin', hometown: 'Portland' },
  { id: 'james', name: 'James Davis', firstName: 'James', photo: 'dev', dob: 'January 19, 1994', birthday: 'January 19', occupation: 'Designer', phone: '+1 (206) 555-0106', email: 'james.davis@example.com', bloodGroup: 'A−', location: 'Seattle', hometown: 'Portland' },
  { id: 'linda', name: 'Linda Johnson', firstName: 'Linda', photo: 'asha', dob: 'February 5, 1960', birthday: 'February 5', occupation: 'Doctor', phone: '+1 (206) 555-0107', email: 'linda.johnson@example.com', bloodGroup: 'B−', location: 'Seattle', hometown: 'Portland' },
  { id: 'noah', name: 'Noah Wilson', firstName: 'Noah', photo: 'neel', dob: 'March 16, 2007', birthday: 'March 16', occupation: 'Student', phone: '+1 (512) 555-0108', email: 'noah.wilson@example.com', bloodGroup: 'O+', location: 'Austin', hometown: 'Boston' },
];

export const groups: FamilyGroup[] = [
  { id: 'oakwood', name: 'Oakwood', location: 'Seattle', familyIds: ['davis', 'johnson'] },
  { id: 'maplewood', name: 'Maplewood', location: 'Austin', familyIds: ['miller', 'wilson'] },
];

export const families: Family[] = [
  { id: 'davis', name: 'Davis family', groupId: 'oakwood', representativeId: 'emma', memberIds: ['emma', 'james'], address: '123 Maple Street, Seattle, WA 98101, United States', zip: '98101' },
  { id: 'johnson', name: 'Johnson family', groupId: 'oakwood', representativeId: 'patricia', memberIds: ['patricia', 'linda'], address: '456 Pine Avenue, Seattle, WA 98103, United States', zip: '98103' },
  { id: 'miller', name: 'Miller family', groupId: 'maplewood', representativeId: 'robert', memberIds: ['robert', 'maria'], address: '789 Oak Drive, Austin, TX 78701, United States', zip: '78701' },
  { id: 'wilson', name: 'Wilson family', groupId: 'maplewood', representativeId: 'andrew', memberIds: ['andrew', 'noah'], address: '321 Cedar Lane, Austin, TX 78702, United States', zip: '78702' },
];

export type Relationship = { first: string; second: string; firstLabel: string; secondLabel: string };
export const relationships: Relationship[] = [
  { first: 'robert', second: 'maria', firstLabel: 'Spouse', secondLabel: 'Spouse' },
  { first: 'emma', second: 'james', firstLabel: 'Spouse', secondLabel: 'Spouse' },
  { first: 'linda', second: 'patricia', firstLabel: 'Mother', secondLabel: 'Daughter' },
  { first: 'andrew', second: 'noah', firstLabel: 'Father', secondLabel: 'Son' },
];

export const admin = { phone: '+1 (206) 555-0190', email: 'admin@example.com' };
export const event = { id: 'picnic', title: 'The Sunday family picnic', date: 'Sunday, October 18, 2026', time: '9:00 AM – 12:00 PM · Pacific Time', place: 'Lake Union Park, Seattle, WA 98109' };

export const memberById = (id: string | undefined) => members.find(member => member.id === id);
export const familyByMember = (id: string | undefined) => families.find(family => family.memberIds.includes(id ?? ''));
export const groupById = (id: string | undefined) => groups.find(group => group.id === id);
export const familyById = (id: string | undefined) => families.find(family => family.id === id);

export function relationshipLabel(memberId: string, perspectiveId: string, representativeId?: string): string {
  if (memberId === perspectiveId) return representativeId === memberId ? 'Family representative' : 'You';
  const link = relationships.find(item => (item.first === memberId && item.second === perspectiveId) || (item.second === memberId && item.first === perspectiveId));
  if (link) {
    const memberIsFirst = link.first === memberId;
    const relative = memberById(memberIsFirst ? link.second : link.first);
    return `${memberIsFirst ? link.firstLabel : link.secondLabel} of ${relative?.name ?? 'family member'}`;
  }
  return memberId === representativeId ? 'Family representative' : 'Family member';
}

export function searchDirectory(query: string) {
  const normalized = query.trim().toLowerCase().replace(/−/g, '-');
  if (!normalized) return { foundGroups: groups, foundFamilies: families, foundMembers: members };
  const foundMembers = members.filter(member => {
    const relations = relationships.filter(link => link.first === member.id || link.second === member.id).map(link => {
      const first = link.first === member.id;
      return `${first ? link.firstLabel : link.secondLabel} ${memberById(first ? link.second : link.first)?.name ?? ''}`;
    });
    return [member.name, member.occupation, member.phone, member.phone?.replace(/\D/g, ''), member.email, member.dob, member.birthday, member.bloodGroup, member.location, member.hometown, ...relations].filter(Boolean).join(' ').toLowerCase().replace(/−/g, '-').includes(normalized);
  });
  const foundFamilies = families.filter(family => `${family.name} ${family.address} ${family.zip}`.toLowerCase().includes(normalized) || family.memberIds.some(id => foundMembers.some(member => member.id === id)));
  const foundGroups = groups.filter(group => `${group.name} ${group.location}`.toLowerCase().includes(normalized) || group.familyIds.some(id => foundFamilies.some(family => family.id === id)));
  return { foundGroups, foundFamilies, foundMembers };
}
