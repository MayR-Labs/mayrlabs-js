---
"@mayrlabs/web-icon": minor
---

Initial release of `@mayrlabs/web-icon`.

Features:

- **Universal Icon Component**: A single `<CustomIcon />` component for all your icon needs.
- **Multiple Icon Types**:
  - `simple`: Use icons from Simple Icons (e.g., `simple:github`).
  - `dev`: Use icons from DevIcon (e.g., `dev:react`).
  - `local`: Use local images (e.g., `local:/assets/logo.png`).
  - `remote`: Use remote URLs (e.g., `remote:https://example.com/icon.png`).
- **Framework Support**:
  - React: `@mayrlabs/web-icon/react`
  - Vue: `@mayrlabs/web-icon/vue`
  - Next.js: `@mayrlabs/web-icon/next` (optimized with `next/image`)
  - Core: `@mayrlabs/web-icon/core` (vanilla JS generator)
- **Dot Notation API**: Access specific icon types easily (e.g., `<CustomIcon.simple />`).
- **Type Safety**: Full TypeScript support.
