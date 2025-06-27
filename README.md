# johnsurette.com

This repository contains a web application built with Vite, React and Three.js. The site showcases animated 3D cards that respond to scrolling.

## Development

1. Install dependencies (requires internet access):
   ```bash
   npm install
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

## Project Structure

- `src/components/Projects` – 3D card components and storyboard logic.
- `src/pages/ProjectsPage.tsx` – Hosts `ProjectStoryboard` in a scrollable container.
- `App.tsx` – Handles simple routing and page transitions.

Animations are implemented with `@react-three/fiber` and `framer-motion`. The storyboard divides scroll progress into scenes that shuffle a deck of cards, reveal them in a circle, and present project information.
