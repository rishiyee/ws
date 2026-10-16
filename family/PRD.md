# Community Family Directory — Product Requirements Document

Status: Draft for review  
Date: 12 October 2026

## 1. Product overview

Build a responsive website where approved community members can discover families, explore their history and relationships, and stay informed about community activities. Community admins create and maintain all family profiles. Members sign in using a phone number and one-time password (OTP).

## 2. Goals

- Maintain a central, searchable directory of families in one community.
- Help members find people through names, locations, ancestral hometowns, and occupations.
- Preserve family history and show relationships through family trees.
- Share announcements, community events, and birthday reminders.
- Work well on phones, tablets, and desktop computers.

## 3. Confirmed decisions

| Area | Requirement |
| --- | --- |
| Audience | Community members ages 15–65 across multiple families |
| Access | Approved community members only, after sign-in |
| Onboarding | Admins create family profiles and invite members |
| Profile management | Community admins alone create and edit profiles |
| Profile content | Family and member information, relationships, occupations, birthdays, ancestral hometown, family history, and family tree |
| Discovery | Name search and filters for location, ancestral hometown, and occupation |
| Visibility | All approved members can see all directory details |
| Community features | Announcements, events, and birthday reminders |
| Platform | Responsive website |
| Authentication | Phone number with OTP |
| Exclusion | Member messaging |

## 4.1 Audience and usability

The product serves community members from ages 15 through 65. Screens should be straightforward for younger members while remaining comfortable to read and operate for older members.

- Use clear labels and familiar navigation; do not rely on icons or color alone to explain actions.
- Keep text readable, maintain strong contrast, and provide visible focus states.
- Make buttons and other interactive controls easy to tap, with clear feedback after actions.
- Present family photos alongside names and useful details so members can recognize people quickly.
- Keep layouts responsive and avoid requiring precise gestures or hidden interactions.

## 4. Users and permissions

### Community admin

- Create, edit, archive, and restore family and member records.
- Link relatives and maintain family trees.
- Invite members, approve access, and revoke access.
- Manage announcements and events.
- Correct contact details and dates, and resolve duplicate records.

### Approved member

- Sign in using an invited, approved phone number.
- Browse all active family and member profiles, including contact details, addresses, and birthdays.
- Search and filter the directory.
- View family histories, family trees, announcements, events, and birthday reminders.
- Cannot edit directory records or message other members within the product.

### Visitor or unapproved user

- Can access the sign-in page but cannot access directory content.
- Cannot gain community access simply by verifying a phone number.

## 5. Core journeys

### Admin adds a family

1. Admin creates a family record with available details.
2. Admin adds individual members and their relationships.
3. Admin reviews and publishes the profile.
4. Admin invites selected members using their phone numbers.
5. An invited member verifies their phone number through OTP and receives approved access.

### Member finds a person or family

1. Member signs in.
2. Member searches by family or member name.
3. Member optionally filters by location, ancestral hometown, or occupation.
4. Member opens a family or individual profile and views details and relationships.

### Member checks community updates

1. Member opens the home page.
2. Member sees active announcements, upcoming events, and birthday reminders.
3. Member opens an announcement or event for full details.

## 6. Functional requirements

### FR-01: Phone OTP authentication and membership

- Accept phone numbers with country codes.
- Send and verify time-limited, single-use OTPs.
- Provide resend controls, attempt limits, and clear expiry and failure states.
- Grant directory access only when the verified number belongs to an approved, active account.
- Support sign-out and secure session expiry.
- Admins can invite, deactivate, and update accounts; phone-number changes require verification of the new number.
- Revoked accounts must lose access, including through existing sessions.

### FR-02: Family profiles

- Store family name, family photo, contact phone number, address, current location, ancestral hometown, and family history.
- Show the members associated with the family.
- Allow admins to save incomplete drafts and publish completed records.
- Require a family name to create a record; additional details may be added later.
- Archived profiles do not appear in the active directory.

### FR-03: Individual member profiles

- Store name, photo, phone number, address or inherited family address, occupation, date of birth, and family affiliation.
- Support members without their own phone number or login account.
- Keep directory records separate from access accounts: creating a person record does not automatically grant access.
- Display missing optional information gracefully.
- Allow admins to mark deceased members and retain their historical relationships; exclude them from birthday reminders.

### FR-04: Relationships and family trees

- Support parent-child and spouse relationships, including links across family records.
- Derive sibling relationships from shared parents where possible.
- Provide an interactive family tree within family profiles, usable on mobile and desktop.
- Allow users to open individual profiles from tree nodes.
- Prevent self-links, duplicate links, and parent-child cycles.
- Support incomplete ancestry without requiring placeholder people.

### FR-05: Search and filters

- Search both family names and individual member names, ignoring case and surrounding whitespace.
- Filter by current location, ancestral hometown, and occupation.
- Support combined filters and a clear-all action.
- Show useful result summaries and clear empty states.
- Preserve search and filter state when returning from a profile.

### FR-06: Announcements

- Admins can create, edit, publish, and archive announcements.
- Each announcement includes a title, body, author, and publication date.
- Members see published announcements in a list and on the home page.
- Draft and archived announcements are hidden from members.

### FR-07: Community events

- Admins can create, edit, and cancel events.
- Store title, description, start date and time, optional end date and time, venue or online link, and organizer contact.
- Members can view upcoming events and event details.
- Show cancelled events clearly and distinguish past events from upcoming ones.
- Display event times using the community's configured timezone.

### FR-08: Birthday reminders

- Show today's birthdays and upcoming birthdays on the signed-in home page.
- Calculate reminders using the community timezone.
- Exclude records without a known birthday and deceased members.
- Link each birthday entry to the member's profile.
- Initial scope assumes in-app reminders; SMS, email, and browser push delivery require a separate decision.

### FR-09: Admin workspace

- Provide lists for families, people, accounts, announcements, and events.
- Support record creation, editing, publishing where applicable, and archiving.
- Flag likely duplicate people or families for admin review without automatically merging them.
- Record who made each administrative change and when.
- Confirm archive and access-revocation actions before applying them.

## 7. Information architecture

- Sign-in: phone entry, OTP verification, and access status.
- Home: search entry point, announcements, upcoming events, and birthdays.
- Directory: family and member results with filters.
- Family profile: overview, contact details, members, history, and tree.
- Member profile: personal information and linked relatives.
- Announcements: list and detail views.
- Events: upcoming and past lists, plus detail views.
- Admin workspace: directory management, invitations, accounts, and community content.

## 8. Data model

| Entity | Main fields |
| --- | --- |
| Community | Name, timezone |
| Family | ID, name, photo, contact phone, address, location, ancestral hometown, history, status |
| Person | ID, family ID, name, photo, phone, address, occupation, birth date, deceased status |
| Relationship | ID, source person, related person, relationship type |
| Account | ID, verified phone number, optional person link, role, approval/access status |
| Invitation | ID, phone number, creator, status, expiry |
| Announcement | ID, title, body, author, publication date, status |
| Event | ID, title, description, start/end time, venue/link, organizer, status |
| Audit entry | Actor, action, affected record, timestamp |

Phone numbers used for accounts must be unique. Person records may have no phone number or share a household contact number.

## 9. Non-functional requirements

- Enforce membership and admin permissions on the server for every protected operation.
- Protect OTP endpoints against repeated requests and guessing; never log OTP values.
- Use HTTPS and secure session handling.
- Protect uploaded images and directory data from unauthenticated access.
- Provide keyboard navigation, readable contrast, labeled form controls, and accessible error messages.
- Avoid horizontal page overflow on phone screens; allow controlled pan and zoom within family trees.
- Compress and resize uploaded photos and paginate directory results.
- Maintain automated backups and verify that records can be restored.
- Show actionable loading, empty, error, and retry states.
- Target directory searches within two seconds for the agreed launch dataset under normal operating conditions; validate dataset size and load before launch.

## 10. First-release scope

Include all confirmed features: responsive website, phone OTP, admin invitations and access management, admin-managed family and person profiles, family history and trees, search and filters, announcements, events, and in-app birthday reminders.

Exclude member messaging, member profile editing, public directory access, native mobile apps, event payments, and event registration. Bulk import, export, and external reminder channels are future candidates unless added to launch scope.

## 11. Acceptance criteria

1. An unauthenticated or unapproved user cannot retrieve any directory content through pages, APIs, or protected image URLs.
2. An invited, approved member can verify their phone through OTP and access the directory.
3. A revoked member loses access through both new and existing sessions.
4. An admin can create a family, add people and relationships, and publish a profile visible to members.
5. Members can read all published details but cannot change records, including through direct API requests.
6. Search finds matching family and person names; location, hometown, and occupation filters work individually and together.
7. Family trees display stored relationships and reject invalid parent-child cycles.
8. Published announcements and upcoming events appear correctly; drafts remain hidden and cancellations are visible.
9. Birthday reminders follow the community timezone and omit deceased people and unknown birthdays.
10. Core sign-in, search, profile, and admin flows work on phone and desktop screen sizes.
11. The product contains no member messaging feature.

## 12. Success measures

Measure approved-member activation, monthly active members, profile completeness, searches that lead to profile views, and admin effort to maintain records. Establish numerical targets after confirming community size and collecting a launch baseline.

## 13. Delivery sequence

1. Establish account roles, phone OTP, invitations, and protected access.
2. Build admin-managed family and person records with photos and auditing.
3. Add directory search, filters, profiles, relationships, and family trees.
4. Add announcements, events, and birthday reminders.
5. Validate permissions, mobile usability, OTP behavior, backup restoration, and launch-data performance.

## 14. Assumptions and remaining decisions

The following are proposed defaults, not answers confirmed during requirements gathering:

- The first deployment serves one community, with multiple admin accounts supported.
- English is the initial interface language; other languages remain undecided.
- Birthday reminders appear in-app only.
- Family and person fields beyond names are optional to support incomplete records.
- Profile changes can be requested outside the app; an in-app correction workflow is not yet in scope.
- The initial admin account is provisioned during setup through a restricted administrative process.
- Community timezone, expected family/member counts, hosting, OTP provider, budget, launch date, retention policy, and treatment of February 29 birthday reminders need confirmation before implementation.
