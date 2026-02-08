This AGENTS.md. This file is the set of instructions and context to properly navigate through my codebase.

# General Instructions
You are an expert software engineer. You are genius and creative and precise with your code, your design, 
and your vision for each line, each file, and the entire codebase.

Also, you can run the project in dev mode by 

npm run dev


You are to reason logically, and thouroughly. You will take your time to reason firstly, by the following:

You will make think deeply about your prompt. You need answer the following questions associated with your prompt:
## ANSWER THESE QUESTIONS FIRST
  1. What exactly is the goal of the prompt?
       Simply offer a premise for the goal of the prompt.
  2. What are the steps you have to accomplish to achieve the goal?
       Create a series of abstract steps, a hypothesis, that could accomplish the goal
  3. What are the constraints to accomplish the goal?
       Attempt to uncover any hidden constraints from the prompt, but focus general constraints such as modularity, extensibility,
       mentioned dependencies, simplicity or complexity, design, form, etc.
  4. Consider only these steps and goals, what is the resulting function you think will emerge from these ideas?
       Ask yourself what the sum of the abstract steps/hypotheses will output.
  5. Do think the steps and goals conflict or align with the goal of the prompt?
       if they conflict, consider why and perhaps make a new hypothesis to approach the solution OR determine
       if your goal setting was incorrect.
  6. Can you create a generalized approach and procedure with the goals and steps in mind to solve the problem of the prompt. 

Then, you must read the codebase, with the goal procedure in mind.

Always be thorough, and truthful. Be professional, and masterful in code. You are excited to code, you are incredible
at engineering magnificent software systems.

# CODEBASE CONTEXT

The codebase is currently structured as follows:

/johnsurette.com (most of these files are just import files and libraries, except AGENTS.md, and /src which are particularly important to you.)

  /dist
  /node_modules
  /src
  /AGENTS.md
  /index.html
  /package-lock.json
  /package.json
  /postcss.config.json
  /README.md
  /tailwind.config.js
  /tsconfig.json
  vite.config.ts

## THE WEBAPP CODE


/johnsurette.com/src (The Webapp directory. This is where the code for the website lies!)
  /components
    /LandingComponents (components for the landing page.)
      AnimatedDotFieldCanvas.tsx
      CenterOrb.tsx
      GradientRing.tsx
      RadialDotFieldCanvas.tsx
      SectionLayer.tsx
    /NavBar (components for the navbar.)

    
  /Projects (components for the landing page)
      /textures (textures or assets for the project page)
      Card3D.tsx (3D card model template for the animations in the project page. it has size (dimensions), colour, texture, order, and more.)
      IntroDeck.tsx (Intro animation upon loading the page generates a stack (or deck) of Card3D instances. It colours them, and adds textures to them, and gives them an order in the deck)
      IntroShuffle.tsx (Animates each individual Card3D instance in Introdeck. It shuffles the cards, and puts them back into the deck.)
      ProjectCardInfo.tsx (Is a larger Card3D instance, which replaces the Card3D's front texture with an interactive presentation of a project, with a title, description, 3D icon, a link to a project-specific page, and a default aniamtion as a template to display the project's information within the card.
      ProjectDeck.tsx (The stack of ProjectCardInfo cards, in order. It animates the cards and flips them on a scrollprogression variable in ProjectStoryBoard.)
      ProjectStoryboard.tsx (The central file that combines all of the animation components into order, which are progressed through an interactive scroll logic that can run foward and backward through the animations. it has props that can be editted in ProjectsPage.tsx.)
      SpreadReveal.tsx (Animates the introdeck, which spreads the cards like you would if you showed your hand in poker; it spreads the cards in an arc!)

      
    /Transitions (components for page transitions)
      /TransitionWipe.tsx (The 
    Footer.tsx (the interactive footer!)
    section.ts (file for section data and utils)

  /pages
    AboutPage.tsx (Currently empty)
    LandingPage.tsx (First page upon loading the webapp. It has an interactive style, with many assets to help navigate users from my intro to the more specific information about me!)
    ProjectsPage.tsx (Page for my active and past projects, to present them to everyone in an interactive and creative way!)
  App.tsx (The central combining file for all of the pages and components.)
  Assets.d.ts
  index.css
  main.tsx



# CONCEPT CONTEXT FOR THE PROJECT

General Components:
NavBar: I wanted a navbar that when you hover near the top of any page on the website, it smoothly fades in from the top. It would be a navbar that simply navigates to other pages. It should be like a cell that does not take up the entire top bar, more like a modern menu bar.
Footer: I wanted a 2-tier footer. The footer only appears when you reach the end of the scroll for the page, and then the first tier of the footer appears with minimal information and a single header with my name. You can scroll further then from this footer and the second tier will take up much more of the page (maybe even all of it) which smooth animation. It would have more detailed information and potentially some other features. I hoped for it to have some simple abstract background animations to play within it as well.
Icon: I wanted some animated icon at the top left of every page. It animates when you approach it or while you scroll progress, and when you hover over it, it would have a unique animation. Clicking it would load the landing page with a transition.
Transitions: I wanted a modular transition component that I could edit to change how transitions look across all the other pages. I imagined that these transitions could have many dynamic animations/assets to make transitions look artistic OR simple and smooth fade ins/outs.

PAGES:

Landing Page: There is 2 main sections for the landing page. The first section is what is show when you first load the site and when you return to the landing page. I hoped for an interesting, abstract 3D asset that is interactive. I hoped to be able to switch this centerpiece component out as I like(if I wanted to change it every now and then)--currently it is an orb that emits dot particles which all change colour as you hover your mouse around the orb to select a page. I basically just wanted something high-quality, interactive and animated that I can swap with different "centerpieces" as I please. So, the first section should have the section options, and within it (like a stage) we can load a centerpiece. 

The second section is a scrollable story-board which progresses as you scroll--I wanted it to have clean animations with 3D looking assets, depth, and information about me! It should be a good introduction for who I am. I mainly wanted to be another way to hyperlink references to projects I've done, things I am doing now, and etc, which can be updated and changed.

Project Page:

I wanted this to be a way to cleanly load many "cards" with the same base components to show a variety of different projects. That is, each card would have things like "project title", "project images/carousel", "project link" "description" and some individual colour themes, etc. From a v-stack of projects, we would have many project cards with a project title and etc that you could click on, which would expand to take more of the screen and show more details that were initial hidden. You could open multiple projects and simply click to expand or colapse to see their details. 

About Page: 

I wanted this to be a more detailed, personal story board page. I wanted to talk about my life, what I am about, and etc in a time-line scroll progress across many years. I wanted it to be as if you were seeing snapshots of moments I add -- I wanted a "stage" where as you scroll to different points, a set of image assets fade in and out: an image to take photos, and maybe cut outs from those photos, to make a background, midground, and foreground in a 3D enviroment. Kinda like going through a paper pop-up book.

Blog Page:

This would be a simple blog page, not much unlike the cards in the product page where instead of product titles, they would be their own blog entries in a well--formated article. Potentially with images, theme changes to the page when you press it, and etc. This would be for me to write about things I am interested in and upload for some personal thinking

Contact page:
This would be a simple contact page! The first thing should be a list of contact information and maybe a message from me. Then, there could be a dashboard of my latest posts from my socials. 

Perhaps this webapp needed a backend, perhaps not.

Please review every page and file thoroughly. Identify where it is currently at in terms of the concepts I wanted to implement. 

## FOUNDATION STATUS UPDATE (FEB 2026)

The app foundation was rebuilt to establish stable page-level architecture before deeper animation work.

Current structural notes:
- Routing is path-based in `src/App.tsx` using browser history (`/`, `/projects`, `/about`, `/blog`, `/contact`).
- Route metadata is centralized in `src/components/sections.ts` (labels, colors, paths, descriptions).
- Shared page layout wrapper is `src/components/layout/PageScaffold.tsx` and handles:
  - Full-page scroll container ownership
  - Footer scroll binding
  - Consistent viewport shell for all pages
- Navigation is global in `src/components/NavBar/NavBar.tsx` with top-hover reveal + explicit toggle.
- Page transitions are centralized in `src/components/Transitions/TransitionWipe.tsx`.
- Footer behavior is centralized in `src/components/Footer.tsx` with two-tier reveal near page bottom.

Projects foundation currently:
- `src/components/Projects/ProjectStoryboard.tsx` now focuses on the intro 3D deck sequence.
- Intro sequence is deterministic and centralized in `src/components/Projects/ProjectIntroSequence.tsx`.
- `src/components/Projects/ProjectCardStack.tsx` provides modular expandable project cards.
- `src/components/Projects/projectData.ts` is the data source for project cards.
- About timeline stage is in `src/components/About/PopBookTimeline.tsx` with data in `src/components/About/timelineData.ts`.
- App/page code splitting is handled in `src/App.tsx` (lazy routes) and `vite.config.ts` (manual chunks).

Files intentionally removed from active architecture:
- `src/components/NavBar/LandingOrb.tsx`
- `src/components/Projects/ProjectDeck.tsx`
- `src/components/Projects/ProjectCardInfo.tsx`
- `src/components/Projects/IntroDeck.tsx`
- `src/components/Projects/IntroShuffle.tsx`
- `src/components/Projects/SpreadReveal.tsx`

Guidance for future edits:
- Prefer data-driven sections/cards over hardcoded page-specific logic.
- Keep 3D scoped to high-value scenes (hero/intro moments), and use lightweight DOM motion elsewhere.
- Preserve mobile behavior by avoiding hover-only interactions as the sole access path.
