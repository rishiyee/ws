# Vinkling

Vinkling is a mobile first family directory built with the Next.js App Router, React, TypeScript, Tailwind CSS v4, and Lucide React icons.

## Run locally

```sh
npm install
npm run dev
```

Open http://127.0.0.1:3000. The demo account is `+91 98765 43210`. Login is local demo behavior and does not send SMS.

## Manage demo families

Open http://127.0.0.1:3000/admin and select **Families**. Use **Add family** or a row's **Edit** button to set the name, family group, address, existing members, and representative. Changes are saved in this browser and appear in the member directory after refresh. They are not shared across devices or stored on a server. Newly added families can be browsed in their family group; direct share links require backend storage.

## Project structure

- `app/` — App Router layout and route files, plus the global Tailwind theme.
- `components/VinklingApp.tsx` — screen content and interactions.
- `components/AppHeader.tsx`, `components/BottomNavigation.tsx` — shared app navigation.
- `components/Button.tsx` — shared button element with primary, secondary, quiet, icon, and destructive variants.
- `components/PhoneFrame.tsx`, `components/ProfileCard.tsx`, `components/SearchBox.tsx` — reusable interface components.
- `lib/data.ts` — typed family, member, relationship, event, and search data.
- `lib/familyRecords.ts` — browser saved demo family changes shared by the admin and member views.
- `public/photos/` and `public/fonts/` — locally hosted mock portraits and Inter font files.
- `family/PRD.md` — product requirements and archived Refero design references.

## Checks

```sh
npm run typecheck
npm run build
```

Profile relationships are shown from each signed in member’s perspective. Relationship correction requests are prepared as emails to the community admin; no backend or live SMS service is connected.
