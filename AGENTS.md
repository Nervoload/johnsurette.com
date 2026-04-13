# AGENTS.md

This file is the operating guide for coding agents in this repository.

## Project Objective
Build and maintain `johnsurette.com` as a high-quality narrative portfolio site with strong architecture first, then layered animation/3D where it has clear storytelling value.

The experience goal is:
- Intentional visual design (not generic templates)
- Reusable, modular systems
- Smooth interactions on desktop and mobile
- Data-driven content where possible

## Thinking Procedure (Do This First)
Before changing code, reason through these questions:
1. What is the exact goal of the prompt?
2. What concrete steps are needed to achieve it?
3. What constraints apply (architecture, accessibility, performance, maintainability)?
4. What result should emerge if those steps are done correctly?
5. Do the steps align with the goal, or conflict with it?
6. What generalized approach can solve this class of problem in this codebase?

Use this reasoning internally by default; provide it to the user when useful or requested.

## Current Architecture (Foundation Update - Feb 2026)

### App Shell
- Routing is path-based in `src/App.tsx` (`/`, `/projects`, `/about`, `/blog`, `/contact`).
- Route metadata is centralized in `src/components/sections.ts`.
- Global navigation is `src/components/NavBar/NavBar.tsx`.
- Global page transition is `src/components/Transitions/TransitionWipe.tsx`.
- Shared page layout and footer scroll ownership live in `src/components/layout/PageScaffold.tsx`.
- Footer behavior is centralized in `src/components/Footer.tsx`.

### Pages
- `src/pages/LandingPage.tsx`
  - Hero stage with swappable centerpiece via registry:
    - `src/components/LandingComponents/centerpieces/centerpieceRegistry.ts`
    - `src/components/LandingComponents/centerpieces/WaveOrbCenterpiece.tsx`
  - Story sequence:
    - `src/components/LandingStory/LandingStoryboard.tsx`
    - `src/components/LandingStory/storySections.ts`
    - `src/components/LandingStory/sections/*`
- `src/pages/ProjectsPage.tsx`
  - Intro 3D sequence:
    - `src/components/Projects/ProjectStoryboard.tsx`
    - `src/components/Projects/ProjectIntroSequence.tsx`
    - `src/components/Projects/StoryboardSection.tsx`
  - Expandable card stack:
    - `src/components/Projects/ProjectCardStack.tsx`
    - Data in `src/components/Projects/projectData.ts`
- `src/pages/AboutPage.tsx`
  - Pop-up timeline stage:
    - `src/components/About/PopBookTimeline.tsx`
    - Data in `src/components/About/timelineData.ts`
- `src/pages/BlogPage.tsx`
  - Foundation card layout for articles.
- `src/pages/ContactPage.tsx`
  - Contact blocks + social carousel:
    - `src/components/Contact/SocialPostCarousel.tsx`

### Build/Chunking
- Code-splitting and chunk strategy are in `src/App.tsx` and `vite.config.ts`.

## Active vs Legacy Files

### Active Landing Component Pattern
- `CenterpieceStage` + registered centerpiece (`centerpieces/`) is the active pattern.

### Removed Legacy Landing Files
These were removed during cleanup and should stay out of active architecture unless intentionally redesigned and reintroduced:
- `src/components/LandingComponents/AnimatedDotFieldCanvas.tsx`
- `src/components/LandingComponents/CenterOrb.tsx`
- `src/components/LandingComponents/GradientRing.tsx`
- `src/components/LandingComponents/RadialDotFieldCanvas.tsx`
- `src/components/LandingComponents/SectionLayer.tsx`

Projects files previously removed from active architecture (do not restore by default):
- `src/components/Projects/ProjectDeck.tsx`
- `src/components/Projects/ProjectCardInfo.tsx`
- `src/components/Projects/IntroDeck.tsx`
- `src/components/Projects/IntroShuffle.tsx`
- `src/components/Projects/SpreadReveal.tsx`

## Engineering Rules for This Repo

1. Preserve architecture boundaries:
- Route metadata in `src/components/sections.ts`
- Shared scroll/footer shell in `src/components/layout/PageScaffold.tsx`
- Global nav and transition components as single sources of truth

2. Prefer data-driven implementations:
- New project cards should extend `projectData.ts`
- New landing story scenes should extend `storySections.ts` + `LandingStory/sections`
- New about checkpoints should extend `timelineData.ts`

3. Keep 3D scoped:
- Use 3D in high-value scenes (hero/intro moments)
- Use lighter DOM/CSS motion for dense UI content

4. Mobile and accessibility are mandatory:
- Do not rely on hover-only interactions
- Keep keyboard navigation functional for controls
- Maintain readable contrast and clear focus behavior

5. Performance discipline:
- Avoid avoidable rerenders in scroll-driven paths
- Avoid unnecessary state updates on every frame when motion values can stay in animation layer
- Be cautious with expensive canvases/shaders and stacked blur effects

6. Keep placeholders explicit:
- Prefer TODO-marked placeholders over silent fake production values
- If data is temporary, isolate it in data files (not scattered hardcoded strings)

## Implementation Workflow
1. Read relevant files before editing.
2. Confirm fit with current architecture above.
3. Make minimal, coherent edits.
4. Validate with:
- `npm run build`
5. Summarize:
- What changed
- Why it changed
- Any follow-up tasks

## Page-Specific Guidance

### Landing
- Keep `CenterpieceStage` and registry-based centerpiece swapping.
- Maintain clean separation between hero centerpiece and lower storyboard.
- New section visuals belong in dedicated `LandingStory/sections/*` components.

### Projects
- Intro sequence and card stack are separate responsibilities; keep them modular.
- New project details belong in `projectData.ts`.
- Preserve expandable card behavior; avoid one-off custom logic per card.

### About
- Keep timeline scene data in `timelineData.ts`.
- Maintain layered foreground/midground/background transition model.

### Blog
- Keep simple and scalable for future post routing.
- Prefer article data structure over hardcoded repeated JSX when expanded.

### Contact
- Keep static contact info + feed components decoupled.
- Social feed behavior should degrade gracefully with no posts.

## Known Technical Debt (Track Explicitly)
- Placeholder links and emails still exist in project/contact/footer content and should be replaced.
- Build currently emits a `three-mesh-bvh`/`three` compatibility warning and dependency alignment should be reviewed.
- **Framer Motion + React Refs (`useScroll`)**: When binding `useScroll` to a custom React ref container (e.g., from `PageScaffold.tsx`), `scrollContainerRef.current` is `null` on the first render. Since refs don't trigger re-renders, `useScroll` fails silently and animations get stuck in production. Always wrap these components in a proxy that polls for the ref's attachment (e.g., using `setInterval`) before rendering the `useScroll` logic.

## Dev Commands
- Install deps: `npm install`
- Run dev server: `npm run dev`
- Production build: `npm run build`
- Preview build: `npm run preview`
