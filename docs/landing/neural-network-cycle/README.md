# Landing Neural Network Cycle

## Purpose

This document defines the replacement for the current landing-page computational placeholder scene.

The target experience is a single continuous 4-part loop that feels like a progressive zoom-out through multiple scales of intelligence:

1. Small neural network
2. Artificial neural network
3. Cortical column
4. Brain slice

The transitions should feel continuous rather than like hard cuts. The viewer should perceive that each phase is revealing a larger biological or computational context around the previous one.

## Current Repo Context

The current landing computation visual lives in:

- `src/components/LandingStory/visuals/computation/ComputationalScene.tsx`
- `src/components/LandingStory/visuals/ComputationalCanvasPlaceholder.tsx`
- `src/components/LandingStory/runtime/StorySceneCanvas.tsx`

Today, `ComputationalScene.tsx` contains a compact 3-phase procedural placeholder:

- `SmallMlpPhase`
- `TransformerPhase`
- `BrainSlicePhase`

That file already establishes the right architectural direction:

- Procedural scene authored in React Three Fiber
- Quality tiers via `StorySceneQualityTier`
- Viewport-aware canvas mounting and frame throttling
- Continuous animation with a loop clock

The next version should keep those runtime patterns while upgrading the scene design, structure, and continuity.

## Narrative Goal

The computational scene should communicate this story:

`simple model -> expanded artificial system -> neuron-scale biology -> coordinated brain-scale structure`

The scene should feel scientific, cinematic, and legible rather than decorative. At every stage, the pulse behavior is the narrative device. The viewer should understand that information or activation is traveling through a structure, not merely that objects are glowing.

## Global Visual Direction

The entire cycle should share one visual language:

- Dark spatial background with restrained atmospheric haze
- Bright emissive pulses with clearly readable travel direction
- Distinct stage palettes, but a shared cyan / electric blue / indigo family
- Minimal ornamental geometry outside what supports the story
- Crisp silhouettes at rest and richer emissive behavior during activation

The scene should avoid looking like:

- Generic "AI network" stock art
- A literal scientific simulator
- A dense soup of lines with no hierarchy

It should instead feel like a stylized but intentional research-cinematic diagram.

## Core Technical Strategy

## 1. Keep the Scene Procedural-First

This cycle should be implemented primarily in code rather than as a heavy authored 3D asset.

Reasons:

- The forms are diagrammatic and pulse-driven.
- The most important motion is graph logic, signal timing, and camera continuity.
- Smooth random growth and dynamic pulse routing are easier to control procedurally.
- The scene must adapt to quality tiers without shipping multiple large files.

Authored textures or small helper meshes are acceptable, but the main system should stay data-driven.

## 2. Split the Current Single File into a Small Scene System

The current `ComputationalScene.tsx` should eventually become an orchestrator rather than a monolith.

Suggested structure:

- `src/components/LandingStory/visuals/computation/NeuralCycleScene.tsx`
- `src/components/LandingStory/visuals/computation/cycleConfig.ts`
- `src/components/LandingStory/visuals/computation/cycleTimeline.ts`
- `src/components/LandingStory/visuals/computation/pulseEngine.ts`
- `src/components/LandingStory/visuals/computation/stages/SmallNetworkStage.tsx`
- `src/components/LandingStory/visuals/computation/stages/ArtificialNetworkStage.tsx`
- `src/components/LandingStory/visuals/computation/stages/CorticalColumnStage.tsx`
- `src/components/LandingStory/visuals/computation/stages/BrainSliceStage.tsx`
- `src/components/LandingStory/visuals/computation/transitions/zoomContinuity.ts`

The existing `ComputationalCanvasPlaceholder.tsx` can keep owning the canvas shell while pointing at the new orchestrator scene.

## 3. Use a Shared Pulse Engine Across All Stages

Each stage should not invent its own pulse logic from scratch.

Create one shared pulse model that supports:

- cadence
- seeded randomness
- stage-specific palette rules
- travel mode
- per-layer activation windows
- branching pulses
- synchronized multi-tract pulses

Recommended pulse modes:

- `layerStep`
- `edgeTravel`
- `branchingColumn`
- `parallelTracts`

Each stage can interpret the same pulse scheduler differently.

## 4. Fake the Zoom-Out with Matched Structure, Not Only Camera Motion

The transition should not be "camera moves back and we swap everything."

Each handoff should include a structural bridge:

- Stage 1 to Stage 2: the small network overgrows into the larger ANN
- Stage 2 to Stage 3: one neuron emerges from the ANN and overtakes the frame
- Stage 3 to Stage 4: the cortical column widens into a broader brain slice
- Stage 4 back to Stage 1: one bright local region becomes the next micro-scale network entry point

This continuity is what will make the zoom-out illusion feel high-end.

## 5. Build for Existing Runtime Constraints

The new scene must keep working with the current landing runtime:

- high / low / static quality tiers
- `frameloop="always"` only when primary-active
- idle fallback when off-screen
- mobile-safe density and motion

Guidelines by tier:

- `high`: full pulse travel, richer counts, secondary glows, more branching detail
- `low`: fewer nodes, fewer edges, shorter trails, simplified branching
- `static`: no continuous pulse simulation, only a readable frozen composition with minimal shimmer

## Shared System Design

## Scene Graph Model

Represent each stage as a data model plus renderer:

- layout data
- activation data
- transition state
- render primitives

Do not hardcode every visible object directly into JSX when the graph can be described as data.

## Timing Model

Use one loop clock with named windows:

- intro
- active
- transition
- settle

This is easier to reason about than many unrelated sine-wave timings.

## Randomness Model

Use seeded pseudo-random generation so the cycle is stable per session but still feels alive.

That allows:

- repeatable debugging
- consistent growth behavior
- smoother transition tuning

## Rendering Model

Use the lightest geometry that still looks intentional:

- instanced spheres or point sprites for nodes
- line strips, bezier curves, or shader-driven curves for edges
- traveling pulse markers rather than full mesh growth where possible
- atmospheric planes and lights only where they improve depth perception

Avoid expensive full-screen post-processing as the main way to create polish.

## Recommended Build Order

1. Replace the current phase timing with an orchestrated 4-stage timeline.
2. Build Stage 1 with the new growth logic.
3. Build Stage 2 and make the Stage 1 to 2 transition continuous.
4. Build Stage 3 with a strong neuron-to-column handoff.
5. Build Stage 4 with synchronized tract pulses.
6. Close the loop from Stage 4 back to Stage 1.
7. Tune counts and fallback behavior for `low` and `static`.

## Acceptance Criteria

The cycle is successful when:

- every stage is readable within 1 to 2 seconds
- pulses clearly communicate direction and activation
- the camera transitions feel like one world at changing scales
- the scene looks intentional on both desktop and mobile
- the runtime stays compatible with the current landing quality-tier system
- the implementation is split enough that future edits do not require one giant scene file

## Stage Specs

Detailed per-stage specs live here:

- `docs/landing/neural-network-cycle/01-small-neural-network/README.md`
- `docs/landing/neural-network-cycle/02-artificial-neural-network/README.md`
- `docs/landing/neural-network-cycle/03-cortical-column/README.md`
- `docs/landing/neural-network-cycle/04-brain-slice/README.md`
