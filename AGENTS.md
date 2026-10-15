# Repository Guidelines

## Project Structure

This project uses the Next.js App Router. Routes and metadata live in `app/`; the client side app shell and screens live in `components/VinklingApp.tsx`; typed sample directory data and relationship helpers live in `lib/data.ts`. Tailwind CSS v4 is configured in `app/globals.css`. Mock portraits and local fonts are in `public/`. The original product requirements and visual reference screenshots remain in `family/` for context.

## Development and Build

- `npm install` installs project dependencies.
- `npm run dev` starts the local development server.
- `npm run typecheck` checks TypeScript without emitting files.
- `npm run build` creates and type checks a production build.
- `npm start` serves the completed production build.

## Style and Components

Use TypeScript and React function components. Indent with two spaces; use PascalCase for components and camelCase for functions, values, and files. Prefer small typed helpers for repeated UI and use Tailwind utility classes for styling. Use Lucide React for icons and Next `Image` for local portraits. Keep interactive targets at least 48 pixels tall, label icon only buttons accessibly, and honor reduced motion.

## Data and Interactions

Update fictional directory records in `lib/data.ts`; do not add private or real family information. Keep family relationships reciprocal and derive labels from both members’ IDs so a father and son see the correct perspective. Login, OTP, contact requests, and directory data are demo only; no SMS or backend is configured.

## Pull Requests

Use concise, imperative commit subjects (for example, `Fix member relationship labels`). Describe visible changes and note the checks run. Include screenshots for visual changes and link related issues when available. No repository history is available to establish a stricter commit convention.
