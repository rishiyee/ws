# Vinkling Project Definition

## Project overview

Vinkling is a responsive family and community directory. It helps approved community members find relatives, learn how families are connected, and keep up with shared events and announcements. The experience is designed for people ages 15–65 and works on mobile devices, tablets, and desktop screens.

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

Each family member has an individual account associated with their own approved phone number. They sign in with that number, browse the community directory, search for people and families, view profiles and family relationships from their own perspective, and check community updates.

### Community administrator

Uses a dedicated community admin dashboard to manage family and member records, approve and invite members, review family activity, and publish announcements and events.

## Product features

- **Individual sign-in:** Each family member has an individual account associated with their own approved phone number. The active member’s profile and relationship perspective are used throughout the app.
- **Home:** Personalized greeting, prominent directory search, the signed-in member’s family, an invite action, and a community directory link.
- **Family members:** Profile-style cards show a member’s photo, name, relationship, and location. Selecting a card opens a bottom drawer with more profile details and family information.
- **Directory:** Browse family groups and families, search directory records, and filter directory results.
- **Profiles:** View member profile, personal and contact details, family members, and a way to request updates through the community administrator.
- **Family details:** View family members, representative, address, and map information.
- **Admin-only family activity:** Community administrators can review each family’s activity history, including updates such as a person being added and the family member count changing. Members cannot see this activity history.
- **Community updates:** View announcements, events, birthday reminders, and notifications.
- **Appearance:** Choose Light, Dark, or System appearance from the Profile screen. The preference is saved on the device.
- **Responsive app shell:** Phone-style navigation and screen layouts adapt to desktop and mobile sizes.

## Community admin dashboard

The dashboard provides community administrators with tools to:

- Create, edit, archive, and restore family and member records.
- Connect relatives and maintain family relationships.
- Invite members, approve access, deactivate accounts, and revoke access.
- Create and manage community announcements and events.
- Review and correct profile information, contact details, and dates.
- View a per-family activity history, including member additions and changes to the family member count. This history is visible to community administrators only.

## Main user journeys

1. **Sign in:** A family member verifies their own approved phone number and continues to a personalized app session.
2. **Find someone:** Search from the top of Home, open a result, and review the person’s profile or family details.
3. **Browse one’s family:** Open Home or Profile, select a family member, and view their details in a bottom drawer.
4. **Check community activity:** Open birthdays, events, announcements, or notifications from the app navigation and related links.
5. **Change appearance:** Open Profile, choose Light, Dark, or System, and have the choice applied across the app.

## Product scope

The product includes individual member accounts, a community admin dashboard, admin-only per-family activity history, and the member-facing directory and community features described above. Administrative and member access must be separated so family activity and record management are available only to authorized administrators.

The current codebase implements the member-facing interface with fictional sample records. Phone verification is simulated locally, and production authentication, persistent backend storage, and the admin dashboard workflows still need implementation. Member-to-member messaging is outside the product scope.

## Design and usability principles

- Use plain labels and familiar navigation; do not rely on icons or color alone.
- Keep text readable, maintain strong contrast, and provide visible keyboard focus.
- Make interactive controls easy to tap and show clear action feedback.
- Present photos with names and useful details to support recognition.
- Respect reduced-motion preferences and support Light, Dark, and System appearance.

## Technology and structure

- Next.js App Router, React, and TypeScript.
- Tailwind CSS v4 and Lucide React icons.
- Shared app shell and screens in `components/VinklingApp.tsx`.
- Reusable UI components in `components/`.
- Fictional typed directory data and relationship helpers in `lib/data.ts`.
- Product requirements and design context in `family/`.

## Success criteria

- Members can reach search and their own family from the first home screen view.
- Members can locate a person or family and understand their relationship to them.
- Core information is readable and operable across supported screen sizes and theme choices.
- Member accounts and administrator tools enforce their separate access permissions.
