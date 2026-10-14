"""Build the whole-brain point cloud used by the landing "Scales of mind" scene.

Source data: the MNI ICBM152 2009a nonlinear symmetric grey- and white-matter probability maps
(Fonov et al. 2009/2011; Collins et al. 1999), as bundled in the nilearn Python package. They are
distributed under the permissive MNI notice reproduced in public/models/brain-points.v1.LICENSE.txt.

Get the two volumes:
    python3 -m pip download nilearn --no-deps -d /tmp/nilearn
    unzip -j /tmp/nilearn/nilearn-*.whl \
      'nilearn/datasets/data/mni_icbm152_gm_tal_nlin_sym_09a_converted.nii.gz' \
      'nilearn/datasets/data/mni_icbm152_wm_tal_nlin_sym_09a_converted.nii.gz' -d /tmp/icbm

Then, from the repo root:
    python3 scripts/assets/build_brain_points.py /tmp/icbm/mni_icbm152_gm_*.nii.gz /tmp/icbm/mni_icbm152_wm_*.nii.gz

What it does: thresholds grey + white matter into a tissue mask, flood-fills the outside of the head
volume (so ventricles and deep structures are excluded), keeps tissue voxels that touch that outside
(the outer cortical surface, including the walls of open sulci), estimates outward normals from the
smoothed tissue map, tags each point with an approximate lobe from its MNI coordinates, shuffles with a
fixed seed (so any prefix is spatially uniform), and writes a quantized binary. Requires numpy only.

Binary layout (little-endian), version 1:
    0   char[4]   magic "BRP1"
    4   uint32    count
    8   float32x3 bbox min (MNI mm)
    20  float32x3 bbox max (MNI mm)
    32  uint16x3  positions, quantized over the bbox, count entries
    ..  int8x3    unit normals * 127, count entries
    ..  uint8     region = lobe | (hemisphere << 3); lobe: 0 frontal, 1 parietal, 2 temporal,
                  3 occipital, 4 cerebellum, 5 brainstem; hemisphere: 0 left, 1 right
"""

import gzip
import struct
import sys
from pathlib import Path

import numpy as np

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / "public" / "models" / "brain-points.v1.bin"
POINT_COUNT = 20000
SEED = 1952  # Hodgkin & Huxley


def read_nifti(path: str) -> tuple[np.ndarray, np.ndarray]:
    raw = gzip.open(path).read()
    header = raw[:348]
    dims = struct.unpack("<8h", header[40:56])[1:4]
    datatype = struct.unpack("<h", header[70:72])[0]
    vox_offset = int(struct.unpack("<f", header[108:112])[0])
    slope, inter = struct.unpack("<2f", header[112:120])
    srow = np.array([struct.unpack("<4f", header[280 + 16 * i : 296 + 16 * i]) for i in range(3)])
    dtype = {2: np.uint8, 4: np.int16, 16: np.float32}[datatype]
    data = np.frombuffer(raw, dtype=dtype, offset=vox_offset, count=int(np.prod(dims)))
    volume = data.reshape(dims[::-1]).transpose(2, 1, 0).astype(np.float32)  # -> [i, j, k]
    if slope not in (0.0, 1.0):
        volume = volume * slope + inter
    return volume, srow


def dilate(mask: np.ndarray) -> np.ndarray:
    out = mask.copy()
    out[1:] |= mask[:-1]
    out[:-1] |= mask[1:]
    out[:, 1:] |= mask[:, :-1]
    out[:, :-1] |= mask[:, 1:]
    out[:, :, 1:] |= mask[:, :, :-1]
    out[:, :, :-1] |= mask[:, :, 1:]
    return out


def flood_outside(free: np.ndarray, seed: np.ndarray, max_iter: int) -> np.ndarray:
    outside = seed & free
    for _ in range(max_iter):
        grown = dilate(outside) & free
        if np.array_equal(grown, outside):
            break
        outside = grown
    return outside


def box_blur(volume: np.ndarray, radius: int, passes: int) -> np.ndarray:
    out = volume
    for _ in range(passes):
        for axis in range(3):
            padded = np.pad(out, [(radius, radius) if a == axis else (0, 0) for a in range(3)], mode="edge")
            csum = np.cumsum(padded, axis=axis, dtype=np.float64)
            size = 2 * radius + 1
            hi = np.take(csum, np.arange(size - 1, padded.shape[axis]), axis=axis)
            lo = np.concatenate(
                [np.zeros_like(np.take(csum, [0], axis=axis)), np.take(csum, np.arange(0, padded.shape[axis] - size), axis=axis)],
                axis=axis,
            )
            out = ((hi - lo) / size).astype(np.float32)
    return out


def lobe_for(x: np.ndarray, y: np.ndarray, z: np.ndarray) -> np.ndarray:
    lobe = np.full(x.shape, 1, dtype=np.uint8)  # parietal by default
    lobe[y > -22] = 0  # frontal: anterior to the central sulcus (approximate)
    lobe[(z < 2) & (np.abs(x) > 28) & (y > -72) & (y < 22)] = 2  # temporal
    lobe[y < -72] = 3  # occipital
    lobe[(y < -42) & (z < -18)] = 4  # cerebellum
    lobe[(np.abs(x) < 14) & (z < -20) & (y >= -42)] = 5  # brainstem
    return lobe


def main() -> None:
    if len(sys.argv) != 3:
        raise SystemExit(__doc__)
    gm, srow = read_nifti(sys.argv[1])
    wm, _ = read_nifti(sys.argv[2])
    tissue = gm + wm
    if tissue.max() > 2.0:  # stored as 0..255
        tissue /= 255.0
    mask = tissue > 0.5

    # Outside region: flood at 2 mm for speed, then refine at 1 mm so open sulci count as outside.
    coarse = mask[::2, ::2, ::2]
    border = np.zeros_like(coarse)
    border[[0, -1], :, :] = True
    border[:, [0, -1], :] = True
    border[:, :, [0, -1]] = True
    outside_coarse = flood_outside(~coarse, border, 400)
    upsampled = outside_coarse.repeat(2, 0).repeat(2, 1).repeat(2, 2)[: mask.shape[0], : mask.shape[1], : mask.shape[2]]
    outside = flood_outside(~mask, upsampled, 8)
    surface = mask & dilate(outside)

    ijk = np.argwhere(surface)
    rng = np.random.default_rng(SEED)
    rng.shuffle(ijk)
    ijk = ijk[:POINT_COUNT]

    smooth = box_blur(tissue, 2, 2)
    gi = np.gradient(smooth)
    grad = np.stack([g[ijk[:, 0], ijk[:, 1], ijk[:, 2]] for g in gi], axis=1)
    normals = -grad / np.maximum(np.linalg.norm(grad, axis=1, keepdims=True), 1e-6)

    jitter = rng.uniform(-0.5, 0.5, size=ijk.shape)
    voxel = ijk.astype(np.float64) + jitter
    mni = voxel @ srow[:, :3].T + srow[:, 3]
    x, y, z = mni[:, 0], mni[:, 1], mni[:, 2]
    region = lobe_for(x, y, z) | ((x >= 0).astype(np.uint8) << 3)

    lo = mni.min(axis=0)
    hi = mni.max(axis=0)
    quantized = np.round((mni - lo) / (hi - lo) * 65535).astype("<u2")
    normals_q = np.clip(np.round(normals * 127), -127, 127).astype("i1")

    OUT.parent.mkdir(parents=True, exist_ok=True)
    with OUT.open("wb") as handle:
        handle.write(b"BRP1")
        handle.write(struct.pack("<I", len(mni)))
        handle.write(struct.pack("<3f", *lo))
        handle.write(struct.pack("<3f", *hi))
        handle.write(quantized.tobytes())
        handle.write(normals_q.tobytes())
        handle.write(region.astype("u1").tobytes())

    counts = np.bincount(region & 7, minlength=6)
    print(f"surface voxels: {int(surface.sum())}, kept: {len(mni)}")
    print(f"bbox mm: {lo.round(1)} .. {hi.round(1)}")
    print("lobes (frontal, parietal, temporal, occipital, cerebellum, brainstem):", counts.tolist())
    print(f"wrote {OUT.relative_to(ROOT)} ({OUT.stat().st_size} bytes)")


if __name__ == "__main__":
    main()
