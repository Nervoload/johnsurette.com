# Origin Asset Slots

This manifest now acts as the canonical contract for the cinematic `/origin` route.

## Expected folders

- `public/models/origin/` for chapter GLBs
- `public/hdr/origin/` for chapter HDR environments

## Current slot map

- `observatory-workbench`
- `longevity-bio-lab`
- `neural-atlas-lab`
- `studio-prototype-bench`
- `augmentation-chamber`
- `orbital-future-bridge`

## Integration notes

1. Keep the slot id stable; scene components are wired against it.
2. Drop optimized `.glb` assets into `public/models/origin/` and point `glbUrl` at the file.
3. Drop matching `.hdr` environments into `public/hdr/origin/` and point `environmentUrl` at the file.
4. Tune the slot transform in `originAssetManifest.ts` rather than hard-coding offsets inside the scene component.
5. If an asset is missing or fails to load, the scene falls back to its authored procedural version.
