# johnsurette.com

Development environment:
- Node `22`
- npm `10`
- Install with `npm ci`

Cloudflare deployment:
- `npm run deploy`
- Commit and push changes before triggering a Cloudflare Git build, since Cloudflare deploys the remote branch state rather than your local workspace.

This repository contains a web application built with Vite, React and Three.js. The site showcases animated 3D cards that respond to scrolling.

## Development

1. Install dependencies (requires internet access):
   ```bash
   npm ci
   ```
2. Start the development server:
   ```bash
   npm run dev
   ```
   The app opens at `http://localhost:5173` by default.
3. Build for production:
   ```bash
   npm run build
   ```
4. Run a local Cloudflare-style preview:
   ```bash
   npm run cf:dev
   ```

## Project Structure

- `src/components/Projects` – 3D card components and storyboard logic.
- `src/pages/ProjectsPage.tsx` – Hosts `ProjectStoryboard` in a scrollable container.
- `App.tsx` – Handles simple routing and page transitions.

Animations are implemented with `@react-three/fiber` and `framer-motion`. The storyboard divides scroll progress into scenes that shuffle a deck of cards, reveal them in a circle, and present project information.
