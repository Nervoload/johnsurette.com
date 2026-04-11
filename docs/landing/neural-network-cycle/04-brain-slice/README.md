# Brain Slice Stage

## Role in the Cycle

This is the widest-scale view in the loop.

The emphasis shifts from individual neurons and local branching to synchronized signal travel across many parallel tracts that suggest a living brain-wide substrate.

## Visual Target

The brain slice should feel like a stylized cross-section with strong thread-like connectivity.

Visual notes:

- many wire-like tracts run in parallel or sweeping bundles
- pulses travel repeatedly down the tracts
- the repeated motion suggests synchrony and coordinated propagation
- the overall silhouette should suggest brain tissue without requiring a literal medical illustration
- the palette can be slightly calmer than earlier stages so the pulses dominate

The "wires" should feel closer to axonal bundles or white matter threads than to generic neon cables.

## Full Scene Composition

The stage should contain:

- a slice-like outer silhouette or layered tissue envelope
- multiple tract bundles with differing curvature
- a limited number of focal bright regions where pulses originate or intensify
- enough spacing between tracts that the viewer can read many simultaneous traveling signals

The scene should prioritize flow lines over dense mesh detail.

## Pulse Behavior

This stage is about coordinated parallel travel.

Rules:

- many tracts can carry pulses at once
- neighboring tracts may have slight phase offsets
- packets should feel wave-like when viewed together
- some bundles can brighten in response to a shared synchronized event
- the motion should read as alive and coherent, not as random blinking

The effect should evoke synchronicity without requiring literal EEG-style graphics.

## Loop Closure Back to Stage 1

This stage must hand the cycle back to the opening network.

Recommended transition:

- one local bright region becomes the next focal anchor
- surrounding tracts and tissue fade into darkness
- the camera dives back toward that region
- the complex tract field simplifies into a smaller graph-like structure
- the first-stage small neural network resolves from that focal point

This closes the loop while preserving the zoom-continuity illusion.

## Implementation Strategy

## Layout Model

Represent the slice as tract bundles and envelope surfaces.

Suggested data:

- `bundles[]`
- each bundle has `id`, `routes[]`, `color`, `thickness`, `pulseCadence`
- `routes[]` are spline paths
- optional `regions[]` define brighter focal anchors for transition timing

This stage should be more about route systems than about discrete cell nodes.

## Render Strategy

Recommended primitives:

- spline curves or lightweight tubular representations for the tracts
- pulse markers moving with normalized route progress
- subtle slice geometry or layered planes for tissue silhouette

Do not spend the budget on a high-polygon brain mesh. The motion design matters more than literal anatomical surface detail here.

## Performance Guidance

This stage can become expensive if every tract is a unique heavy mesh.

Prefer:

- shared route logic
- moderate bundle counts
- instanced or batched pulse markers
- restrained fog and glow

The wide-scale view should feel rich because of coordination, not because of raw object count.

## Suggested Acceptance Criteria

This stage is successful when:

- the scene reads as a broader brain slice rather than another abstract network
- synchronized tract pulses are the clear focal motion
- the viewer can still track directionality
- the transition back to the opening small network feels intentional and loopable
