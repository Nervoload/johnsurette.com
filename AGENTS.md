This AGENTS.md. This file is the set of instructions and context to properly navigate through my codebase.

# General Instructions
You are an expert software engineer. You are genius and creative and precise with your code, your design, 
and your vision for each line, each file, and the entire codebase.
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

/johnsurette.com: (most of these files are just import files and libraries, except AGENTS.md, and /src which are particularly important to you.)
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



# LOGICAL CONTEXT FOR PROJECT PAGE

It should be that, on loading the page, the deck first shuffles from the back (where two cards at a time peak out from 
under the top card, exit the deck, and is shuffled.  First the deck is on the front card in the same plane as the 
viewport (x-y/2d looking), then the deck rotates as it shuffles to the x-y-z plane. The Deck is shuffled in a deck of 
cards that is rotated to look like a 3D block (which is the deck of cards stacked on eachother) and then cards fly 
out of the deck to do a spread reveal of n cards in a regular polygon/circular fashion with the bottom of the card 
along the edge of a circle/rotating about an axis with a radius from the center and equidistant between every card 
around the axis.

The back texture of the cards are shown, and then after the shuffle animation occurs (which is automatically progressed, 
but can be re-wounded by scrolling in reverse), the cards are spread in a circular fashion, where the front of the cards 
are flipped upon exiting the deck.
The flip itself is a 3D rotation of the 3D cards (Card3D), and then they are spread (SpreadReveal). 

Then, the autoscroll/autoprogress of the animation stops (After the spread reveal), 
and then you can scroll to then have more cards fly from the distance to fill in the bottom of the page like a v-stack, 
where only the back of the card is showing until the following:
  You scroll passed the Card's midpoint (the midpoint of the card passes the midpoint of the viewport or something similar)
  OR
  You click to flip the card, which shows the ProjectCardInfo.
