# Finteiy — Project Guidelines

## UI Components
- Always use **shadcn/ui** components (https://ui.shadcn.com/docs/components) with Tailwind CSS for all UI elements.
- Do NOT create custom controls unless the required component does not exist in shadcn/ui.
- Install new shadcn components via `npx shadcn@latest add <component-name>`.
- Existing shadcn components are in `src/components/ui/`.

## Styling
- Use **Tailwind CSS v3** utility classes for all styling.
- Dark theme only — follow the existing color variables in `globals.css`.
- Fonts: Sora (headings), DM Sans (body), Space Mono (numbers/labels).

## Architecture
- Client-side state machine in `src/app/page.tsx` — no file-based routing beyond `/` and `/design-system`.
- Game logic lives in `src/hooks/use-game-engine.ts`.
- Hardcoded auth in `src/lib/auth.ts` — no backend.
- Per-user localStorage persistence via `useCollection` hook.
