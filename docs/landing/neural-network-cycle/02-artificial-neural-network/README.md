# Artificial Neural Network Stage

## Role in the Cycle

This stage is the expanded system-scale view.

The small opening model has now become a much larger artificial network with more density, more color separation, and a more advanced pulse language.

## Visual Target

The ANN should feel broad, layered, and luminous.

Visual notes:

- nodes are now glowing dots instead of small solid spheres
- edges are flowing sigmoid-like or bezier-like curves
- different layers carry different color identities
- the structure should read as much larger and more complex than Stage 1
- the camera is farther back, but still close enough to follow activation paths

The goal is not photorealism. The goal is a premium systems-diagram aesthetic.

## Full Scene Composition

The stage should contain:

- many more layers than Stage 1
- variable layer heights and widths so the graph feels designed rather than uniform
- a clear visual center for later neuron overlay
- enough empty depth and atmosphere that pulse packets can be tracked

Suggested count ranges:

- `high`: 10 to 16 layers
- `low`: 8 to 12 layers

Node density should increase from Stage 1, but remain capped so edges do not become unreadable noise.

## Pulse Behavior

This stage upgrades from broad edge glow to visible signal travel.

Rules:

- pulses should move as packets down edges
- the edge should remain visible, but the packet should be brighter than the base line
- different layers can tint pulse packets differently
- multiple pulses may coexist, but only if the scene remains readable
- packet speed should be slightly slower than Stage 1 so the travel is visible

The viewer should be able to follow motion from one layer to the next and understand that the system is carrying computation.

## Neuron Overlay Transition

After several ANN pulses, one neuron should emerge as the next focus.

Transition behavior:

- one neuron near the visual center becomes the selected anchor
- its glow intensifies beyond surrounding nodes
- a large neuron silhouette or detailed neuron structure fades in aligned to that anchor
- the broader ANN fades back while the neuron fills the frame
- pulse traffic transfers from many graph edges into the neuron's dendritic and axonal paths

This is the main bridge into the cortical column stage.

## Implementation Strategy

## Layout Model

Represent the ANN with a denser but still data-driven graph:

- `layers[]`
- per-layer node positions
- adjacency lists between neighboring layers
- per-edge control points for curved routing

The layer palette should be part of the graph data, not embedded directly into JSX conditionals.

## Render Strategy

Recommended primitives:

- point sprites or tiny instanced discs / spheres for nodes
- derived bezier curves for edges
- moving pulse markers that traverse normalized path progress

Important constraint:

Do not jump straight to a huge fully connected graph if it destroys readability or performance. A curated dense network is better than a maximal one.

## Pulse Packets

A pulse packet should have:

- `edgeId`
- `progress`
- `speed`
- `color`
- `intensity`
- optional `trail`

Packets should advance independently while reading as part of the global cadence.

## Overlay Neuron Bridge

The neuron overlay should be treated as a staged crossfade, not as an unrelated second scene.

Recommended approach:

- keep the selected anchor neuron in the ANN data
- spawn a larger neuron structure at the same screen-space focus
- blend ANN opacity down while neuron opacity rises
- preserve at least one shared pulse color through the transition

## Suggested Acceptance Criteria

This stage is successful when:

- the ANN clearly feels like the grown-up form of Stage 1
- pulse packets visibly travel along the edges
- layer colors improve legibility instead of looking arbitrary
- the selected neuron emerges as a strong focal transition into biology
