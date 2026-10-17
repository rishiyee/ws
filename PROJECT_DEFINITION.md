# Vinkling Project Definition

## Project overview

Vinkling is a responsive family and community directory. It helps invited adult members find relatives, learn how families are connected, and keep up with shared events and announcements. People must be at least 18 and have an associated phone number. The experience works on mobile devices, tablets, and desktop screens.

## Problem and purpose

Family and community information can be spread across conversations, contacts, and informal records. Vinkling brings member profiles, family relationships, community information, and updates into one place so members can find the information they need and stay connected.

## Goals

- Make it easy to find a person or family by name and explore their details.
- Show family relationships from the signed-in member’s perspective.
- Put the member’s own family and directory search near the top of the home screen.
- Keep community events, announcements, notifications, and birthdays easy to find.
- Provide a readable, touch-friendly interface for the intended age range.

## Users

### Approved community member

Each adult family member has an individual account and an associated phone number. An administrator creates and invites accounts. The invitation grants access; members verify with a code sent to their phone number or email, and stay signed in until they sign out. Members can belong to more than one family and browse all directory details in their communities.

### Community administrator

Communities can have multiple administrators with equal access under one administrator role. Administrators use a dedicated dashboard to manage family and member records, invite members, review family activity, record family milestones, and publish announcements and events.

## Product features

- **Individual sign-in:** Each adult member has an individual invited account associated with a phone number. Verification codes can be sent by phone or email. A valid invitation grants access, and sessions remain active until sign-out.
- **Home:** Personalized greeting, prominent directory search, the signed-in member’s family, an invite action, and a community directory link.
- **Family members:** Profile-style cards show a member’s photo, name, relationship, and location. Selecting a card opens a bottom drawer with more profile details and family information.
- **Directory:** Browse family groups and families, search directory records, and filter directory results.
- **Profiles:** View member profile, personal and contact details, family members, and a way to request updates through the community administrator.
- **Family details:** View family members, representative, address, and map information.
- **Family relationships:** Administrators maintain family trees; relationship labels are derived from those relationships. Members may belong to multiple families.
- **Family milestones:** Administrators can record births, marriages, and deaths for a family.
- **Admin-only family activity:** Each family has an administrator-only activity history of all admin actions affecting it. Entries show the admin and timestamp, and are retained for one year. Members cannot see this history.
- **Community admin dashboard:** Administrators manage multiple communities with separate data, family and member records, invitations, archived records, announcements, events, milestones, and activity history.
- **Community updates:** View announcements, events, birthday reminders, and notifications.
- **Appearance:** Choose Light, Dark, or System appearance from the Profile screen. The preference is saved on the device.
- **Responsive app shell:** Phone-style navigation and screen layouts adapt to desktop and mobile sizes.

## Community admin dashboard

The dashboard provides community administrators, who have equal access under the shared admin role, with tools to:

- Create, edit, archive, and restore family and member records.
- Connect relatives and maintain family relationships.
- Create invitations that grant access after verification by phone or email.
- Transfer members between families or remove them from a family.
- Archive family and member records while preserving their history.
- Create and manage community announcements and events.
- Review and correct profile information, contact details, and dates.
- Record births, marriages, and deaths as family milestones.
- View a per-family activity history, including member additions and changes to the family member count. This history is visible to community administrators only.
- Switch between multiple communities whose data is kept separate.

## Main user journeys

1. **Sign in:** A family member verifies their own approved phone number and continues to a personalized app session.
2. **Find someone:** Search from the top of Home, open a result, and review the person’s profile or family details.
3. **Browse one’s family:** Open Home or Profile, select a family member, and view their details in a bottom drawer.
4. **Check community activity:** Open birthdays, events, announcements, or notifications from the app navigation and related links.
5. **Change appearance:** Open Profile, choose Light, Dark, or System, and have the choice applied across the app.

## Product scope

The product supports multiple communities with separate data, individual accounts for invited members aged 18 or older, phone or email verification codes, a community admin dashboard, admin-only per-family activity history, and the member-facing directory and community features described above. Administrative and member access must be separated so family activity and record management are available only to administrators.

The current codebase includes the member-facing screens and an administrator dashboard interface. Family creation and editing work as a browser saved demo using fictional sample members. Persistent multi-community storage, account and role enforcement, invitations, other record editing, and audit logging still need backend implementation. Member-to-member messaging is outside the product scope.

## Design and usability principles

- Use plain labels and familiar navigation; do not rely on icons or color alone.
- Keep text readable, maintain strong contrast, and provide visible keyboard focus.
- Make interactive controls easy to tap and show clear action feedback.
- Present photos with names and useful details to support recognition.
- Respect reduced-motion preferences and support Light, Dark, and System appearance.

## Technology and structure

- Next.js App Router, React, and TypeScript.
- Tailwind CSS v4 and Lucide React icons.
- **Data and authentication:** Neon Postgres is the intended database. Neon Auth can provide email one-time passcodes through a configured email provider; the database alone does not send email.
- Shared app shell and screens in `components/VinklingApp.tsx`.
- Reusable UI components in `components/`.
- Fictional typed directory data and relationship helpers in `lib/data.ts`.
- Product requirements and design context in `family/`.

## Success criteria

- Members can reach search and their own family from the first home screen view.
- Members can locate a person or family and understand their relationship to them.
- Core information is readable and operable across supported screen sizes and theme choices.
- Member accounts and administrator tools enforce their separate access permissions.
- Administrators can manage communities, records, invitations, milestones, announcements, events, and one-year family activity histories.
