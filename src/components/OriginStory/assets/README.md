# Origin Asset Slots

This manifest reserves high-fidelity model slots for each Origin Lab chapter.

## How to add a model

1. Place the `.glb` file under a static asset folder (for example, `public/models/origin/`).
2. Add `glbUrl` to the matching slot in `originAssetManifest.ts`.
3. Adjust `transform` (`position`, `rotation`, `scale`) to fit the scene.
4. Keep `fallbackSceneId` unchanged so procedural scenes remain available.

## Notes

- This pass does not load GLBs yet.
- The manifest exists to keep the asset contract stable for future integration.
