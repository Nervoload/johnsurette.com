# Small Neural Network Stage

## Role in the Cycle

This is the entry point of the computational sequence.

It should feel compact, legible, and rhythmic. The viewer is introduced to a simple network whose behavior is easy to read before the scene scales into more complex systems.

## Visual Target

The opening network is a fully connected 3-layer ANN rendered as a clean volumetric diagram.

Initial layer sizes:

- input layer: `4 x 4`
- hidden layer: `3 x 3`
- output layer: `4 x 4`

The layers should read as stacked 2D lattices in depth rather than as a flat front-facing chart.

Visual notes:

- nodes are small luminous spheres
- edges are direct connections between adjacent layers
- the scene is sparse enough to read every pulse
- the glow is restrained when idle and intensifies during activation
- the camera should feel close, as if studying a small contained model

## Full Scene Composition

The stage should contain:

- three layer planes arranged along the x-axis or z-axis, whichever best supports the later zoom-out
- a subtle backing haze or panel only if needed for contrast
- a faint depth drift so the network does not feel pinned flat
- slight hover-driven parallax so the viewer can inspect the network as a 3D object
- enough empty negative space around the network to allow visible growth

The scene should not include decorative extra geometry that competes with the graph itself.

## Pulse Behavior

The pulse behavior is the main storytelling device.

Each pulse should progress in readable steps:

1. a subset of nodes in the active source layer glow
2. the connecting edges light up next
3. the destination layer activates next
4. the pulse continues layer by layer through the network

Rules:

- only one layer step should dominate at a time
- not all nodes should activate on every pulse
- each pulse should choose a different sparse activation pattern
- the activation mask should feel meaningful, not noisy
- edge glow in this stage can illuminate most of the segment at once rather than showing a packet traveling through the line

## Growth Behavior

This stage needs living structural change.

### Node Growth

New nodes appear occasionally beside existing nodes inside a layer.

Rules:

- additions should respect an internal grid or lattice logic
- a new node should "pop" in with scale and emissive animation
- its edges should grow outward from the new node until they fully connect to adjacent layers
- newly added nodes should be eligible for pulse activation shortly after appearing

### Layer Growth

Less frequently, the network should add an entire new layer.

Rules:

- the new layer fades and scales in between existing end layers
- spacing between all layers should smoothly re-equalize
- the network margins should remain visually balanced after insertion
- the re-layout should not snap

### Transition to Stage 2

The handoff to the larger ANN happens through runaway growth.

Behavior:

- node additions accelerate
- new layers appear faster
- layer spacing compresses as the full structure widens
- the camera begins a subtle pullback
- the graph density crosses from intimate to system-scale

The audience should feel that the small network becomes the larger one, not that a new asset replaces it.

## Implementation Strategy

## Layout Model

Represent the network as data, not handwritten JSX.

Suggested model:

- `layers[]`
- each layer has `id`, `gridWidth`, `gridHeight`, `nodes[]`, `color`
- each node has `id`, `gridX`, `gridY`, `spawnProgress`, `activation`
- edges are derived from adjacent layers, not permanently hand-authored

This makes it possible to:

- insert nodes
- insert layers
- recalculate spacing
- animate growth without rewriting scene code

## Render Strategy

Recommended render primitives:

- instanced spheres for nodes
- derived line segments or curves for edges
- one or two soft lights only

At this scale, CPU-side layout updates are acceptable because counts remain modest.

## Motion Strategy

Use spring or eased interpolation for:

- node spawn scale
- emissive intensity
- edge growth amount
- layer positions during re-layout

Avoid per-frame React state churn for every node. Keep animated values in refs or a simulation layer where possible.

## Suggested Acceptance Criteria

This stage is successful when:

- the opening `4 x 4 -> 3 x 3 -> 4 x 4` structure is immediately readable
- the pulse order reads as a forward pass
- random node additions feel organic but controlled
- new layer additions do not cause layout snapping
- the transition into the larger ANN feels like accelerated growth, not a scene cut
