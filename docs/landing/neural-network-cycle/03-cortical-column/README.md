# Cortical Column Stage

## Role in the Cycle

This stage is the biological handoff.

The viewer has moved from an abstract ANN into a neuron-scale biological scene, then continues pulling back until that neuron becomes part of a full cortical column slice.

## Visual Target

The cortical column should read as a stylized single-cell-depth slice through layered cortex.

Visual notes:

- the scene is vertically organized into 6 layers
- each layer has a distinct color identity
- neuron silhouettes differ by layer
- smaller upper-layer cells contrast with larger lower-layer pyramidal forms
- one dominant vertical activation path runs through the column
- branch pulses diverge outward into local cells

The result should feel biologically inspired and recognizable, but not so literal that the scene becomes cluttered or textbook-like.

## Full Scene Composition

The stage should contain:

- six visible laminar bands
- a sparse but intentional population of neuron archetypes per band
- a primary vertical pulse corridor through the center
- lateral dendritic and axonal branching
- just enough depth thickness to avoid the scene feeling perfectly flat

The column should be one cell deep or only slightly thicker than that. This stage is a slice, not a volumetric full cortex block.

## Pulse Behavior

This stage changes from layer-to-layer graph flow to biologically inspired branching.

Rules:

- a main pulse rises or falls through the central column
- branch pulses peel off into surrounding neurons
- not every branch needs to fire every cycle
- pulse timing should feel coordinated rather than random
- the viewer should understand that one shared activation event is being distributed through a layered tissue structure

The pulse still needs to remain readable from a distance, since the scene is beginning to zoom out again.

## Transition from Neuron to Column

The incoming neuron from Stage 2 should be the bridge object.

Transition behavior:

- the single large neuron remains visible initially
- neighboring cells fade in around it
- laminar color bands appear behind the neuron
- the camera keeps pulling back
- the original neuron stops being "the whole scene" and becomes one participant inside the column

This transition should feel like context being revealed around the neuron.

## Transition to Stage 4

The column widens into a broader tissue slice.

Behavior:

- more parallel fiber paths become visible around the column
- the outer cortical silhouette expands
- the scene shifts emphasis from local branching to coordinated long-range threads
- the pulse becomes more synchronized across many routes

## Implementation Strategy

## Layout Model

Represent this stage with layered biological archetypes rather than a freeform random cloud.

Suggested data:

- `layers[]` with `id`, `label`, `yMin`, `yMax`, `color`
- `cells[]` with `layerId`, `cellType`, `position`, `orientation`, `scale`
- `branches[]` with spline definitions
- `trunkRoutes[]` for the main vertical pulse path

This gives the scene a designed anatomical logic.

## Render Strategy

Recommended primitives:

- instanced simplified neuron silhouettes or spline-built neuron forms
- translucent layer planes or fog bands
- pulse markers moving along trunk and branch splines

The cell forms do not need micro-detail. Strong silhouettes are more important than tiny geometry detail.

## Scientific Fidelity Note

This stage is intentionally stylized.

If later work needs stronger anatomical fidelity, refine:

- exact cell-type distribution by lamina
- the relative proportions of layer thicknesses
- apical dendrite and axon routing

For the landing page, readability and elegance are more important than exhaustive histological accuracy.

## Suggested Acceptance Criteria

This stage is successful when:

- the 6-layer column reads immediately
- the incoming neuron clearly becomes part of a larger biological structure
- pulse flow feels coordinated and branching rather than arbitrary
- the zoom out into the broader brain slice feels motivated
