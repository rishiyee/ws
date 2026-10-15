export type Member = {
  id: string;
  name: string;
  firstName: string;
  photo: string;
  dob: string;
  birthday: string;
  occupation: string;
  education: string;
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
  { id: 'robert', name: 'Robert Miller', firstName: 'Robert', photo: 'ravi', dob: 'October 12, 1972', birthday: 'October 12', occupation: 'Teacher', education: 'Master of Education', phone: '+1 (512) 555-0101', email: 'robert.miller@example.com', bloodGroup: 'B+', location: 'Austin', hometown: 'Portland' },
  { id: 'patricia', name: 'Patricia Johnson', firstName: 'Patricia', photo: 'priya', dob: 'October 12, 1986', birthday: 'October 12', occupation: 'Doctor', education: 'Doctor of Medicine (MD)', phone: '+1 (206) 555-0102', email: 'patricia.johnson@example.com', bloodGroup: 'A+', location: 'Seattle', hometown: 'Portland' },
  { id: 'andrew', name: 'Andrew Wilson', firstName: 'Andrew', photo: 'arjun', dob: 'October 12, 1989', birthday: 'October 12', occupation: 'Architect', education: 'Master of Architecture', phone: '+1 (512) 555-0103', email: 'andrew.wilson@example.com', bloodGroup: 'O−', location: 'Austin', hometown: 'Boston' },
  { id: 'emma', name: 'Emma Davis', firstName: 'Emma', photo: 'ananya', dob: 'November 24, 1996', birthday: 'November 24', occupation: 'Designer', education: 'BFA, Graphic Design', phone: '+91 98765 43210', email: 'emma.davis@example.com', bloodGroup: 'O+', location: 'Seattle', hometown: 'Portland' },
  { id: 'maria', name: 'Maria Miller', firstName: 'Maria', photo: 'meera', dob: 'December 8, 1976', birthday: 'December 8', occupation: 'Teacher', education: 'BA, English Literature', phone: '+1 (512) 555-0105', email: 'maria.miller@example.com', bloodGroup: 'AB+', location: 'Austin', hometown: 'Portland' },
  { id: 'james', name: 'James Davis', firstName: 'James', photo: 'dev', dob: 'January 19, 1994', birthday: 'January 19', occupation: 'Designer', education: 'BFA, Interaction Design', phone: '+1 (206) 555-0106', email: 'james.davis@example.com', bloodGroup: 'A−', location: 'Seattle', hometown: 'Portland' },
  { id: 'linda', name: 'Linda Johnson', firstName: 'Linda', photo: 'asha', dob: 'February 5, 1960', birthday: 'February 5', occupation: 'Doctor', education: 'Doctor of Medicine (MD)', phone: '+1 (206) 555-0107', email: 'linda.johnson@example.com', bloodGroup: 'B−', location: 'Seattle', hometown: 'Portland' },
  { id: 'noah', name: 'Noah Wilson', firstName: 'Noah', photo: 'neel', dob: 'March 16, 2007', birthday: 'March 16', occupation: 'Student', education: 'High school, senior year', phone: '+1 (512) 555-0108', email: 'noah.wilson@example.com', bloodGroup: 'O+', location: 'Austin', hometown: 'Boston' },
  { id: 'carter', name: 'Olivia Carter', firstName: 'Olivia', photo: 'ananya', dob: 'April 14, 1985', birthday: 'April 14', occupation: 'Nurse', education: 'Bachelor of Science in Nursing', bloodGroup: 'A+', location: 'Seattle', hometown: 'Denver' },
  { id: 'brooks', name: 'Ethan Brooks', firstName: 'Ethan', photo: 'arjun', dob: 'June 3, 1979', birthday: 'June 3', occupation: 'Software engineer', education: 'Bachelor of Science, Computer Science', bloodGroup: 'O+', location: 'Seattle', hometown: 'Salem' },
  { id: 'reed', name: 'Sophia Reed', firstName: 'Sophia', photo: 'priya', dob: 'September 22, 1991', birthday: 'September 22', occupation: 'Accountant', education: 'Master of Accounting', bloodGroup: 'B+', location: 'Seattle', hometown: 'Spokane' },
  { id: 'bennett', name: 'Lucas Bennett', firstName: 'Lucas', photo: 'dev', dob: 'January 7, 1982', birthday: 'January 7', occupation: 'Chef', education: 'Culinary Arts Diploma', bloodGroup: 'AB+', location: 'Seattle', hometown: 'Tacoma' },
  { id: 'hayes', name: 'Amelia Hayes', firstName: 'Amelia', photo: 'meera', dob: 'May 29, 1993', birthday: 'May 29', occupation: 'Librarian', education: 'Master of Library Science', bloodGroup: 'O−', location: 'Seattle', hometown: 'Bellingham' },
  { id: 'foster', name: 'Mason Foster', firstName: 'Mason', photo: 'ravi', dob: 'August 11, 1977', birthday: 'August 11', occupation: 'Carpenter', education: 'Apprenticeship in Carpentry', bloodGroup: 'A−', location: 'Seattle', hometown: 'Boise' },
  { id: 'perry', name: 'Isabella Perry', firstName: 'Isabella', photo: 'asha', dob: 'October 2, 1988', birthday: 'October 2', occupation: 'Photographer', education: 'Bachelor of Fine Arts', bloodGroup: 'B−', location: 'Seattle', hometown: 'Eugene' },
  { id: 'long', name: 'Benjamin Long', firstName: 'Benjamin', photo: 'neel', dob: 'December 19, 1981', birthday: 'December 19', occupation: 'Electrician', education: 'Electrical Apprenticeship', bloodGroup: 'AB−', location: 'Seattle', hometown: 'Portland' },
  { id: 'gray', name: 'Mia Gray', firstName: 'Mia', photo: 'priya', dob: 'July 25, 1995', birthday: 'July 25', occupation: 'Teacher', education: 'Bachelor of Education', bloodGroup: 'O+', location: 'Seattle', hometown: 'Yakima' },
  { id: 'ward', name: 'Daniel Ward', firstName: 'Daniel', photo: 'ravi', dob: 'March 9, 1974', birthday: 'March 9', occupation: 'Architect', education: 'Master of Architecture', bloodGroup: 'A+', location: 'Seattle', hometown: 'Olympia' },
];

export const groups: FamilyGroup[] = [
  { id: 'oakwood', name: 'Oakwood', location: 'Seattle', familyIds: ['davis', 'johnson', 'carter', 'brooks', 'reed', 'bennett', 'hayes', 'foster', 'perry', 'long', 'gray', 'ward'] },
  { id: 'maplewood', name: 'Maplewood', location: 'Austin', familyIds: ['miller', 'wilson'] },
];

export const families: Family[] = [
  { id: 'davis', name: 'Davis family', groupId: 'oakwood', representativeId: 'emma', memberIds: ['emma', 'james'], address: '123 Maple Street, Seattle, WA 98101, United States', zip: '98101' },
  { id: 'johnson', name: 'Johnson family', groupId: 'oakwood', representativeId: 'patricia', memberIds: ['patricia', 'linda'], address: '456 Pine Avenue, Seattle, WA 98103, United States', zip: '98103' },
  { id: 'carter', name: 'Carter family', groupId: 'oakwood', representativeId: 'carter', memberIds: ['carter'], address: '712 Cedar Street, Seattle, WA 98104, United States', zip: '98104' },
  { id: 'brooks', name: 'Brooks family', groupId: 'oakwood', representativeId: 'brooks', memberIds: ['brooks'], address: '809 Union Street, Seattle, WA 98101, United States', zip: '98101' },
  { id: 'reed', name: 'Reed family', groupId: 'oakwood', representativeId: 'reed', memberIds: ['reed'], address: '245 Summit Avenue, Seattle, WA 98102, United States', zip: '98102' },
  { id: 'bennett', name: 'Bennett family', groupId: 'oakwood', representativeId: 'bennett', memberIds: ['bennett'], address: '638 Cherry Street, Seattle, WA 98104, United States', zip: '98104' },
  { id: 'hayes', name: 'Hayes family', groupId: 'oakwood', representativeId: 'hayes', memberIds: ['hayes'], address: '921 Madison Street, Seattle, WA 98104, United States', zip: '98104' },
  { id: 'foster', name: 'Foster family', groupId: 'oakwood', representativeId: 'foster', memberIds: ['foster'], address: '374 12th Avenue, Seattle, WA 98122, United States', zip: '98122' },
  { id: 'perry', name: 'Perry family', groupId: 'oakwood', representativeId: 'perry', memberIds: ['perry'], address: '518 Spring Street, Seattle, WA 98104, United States', zip: '98104' },
  { id: 'long', name: 'Long family', groupId: 'oakwood', representativeId: 'long', memberIds: ['long'], address: '166 Roy Street, Seattle, WA 98109, United States', zip: '98109' },
  { id: 'gray', name: 'Gray family', groupId: 'oakwood', representativeId: 'gray', memberIds: ['gray'], address: '443 Olive Way, Seattle, WA 98101, United States', zip: '98101' },
  { id: 'ward', name: 'Ward family', groupId: 'oakwood', representativeId: 'ward', memberIds: ['ward'], address: '703 15th Avenue, Seattle, WA 98122, United States', zip: '98122' },
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
    return [member.name, member.occupation, member.education, member.phone, member.phone?.replace(/\D/g, ''), member.email, member.dob, member.birthday, member.bloodGroup, member.location, member.hometown, ...relations].filter(Boolean).join(' ').toLowerCase().replace(/−/g, '-').includes(normalized);
  });
  const foundFamilies = families.filter(family => `${family.name} ${family.address} ${family.zip}`.toLowerCase().includes(normalized) || family.memberIds.some(id => foundMembers.some(member => member.id === id)));
  const foundGroups = groups.filter(group => `${group.name} ${group.location}`.toLowerCase().includes(normalized) || group.familyIds.some(id => foundFamilies.some(family => family.id === id)));
  return { foundGroups, foundFamilies, foundMembers };
}
