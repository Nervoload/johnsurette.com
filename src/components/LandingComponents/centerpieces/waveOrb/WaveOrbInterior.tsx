import React, { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import {
  clamp01,
  createSeededRandom,
  perpendicularTo,
  pickRange,
  randomUnitVectorFrom,
  smoothStep,
} from "./shared";
import {
  WaveOrbDynamicColors,
  WaveOrbLoadProfile,
} from "./types";

const UP_AXIS = new THREE.Vector3(0, 1, 0);
type InternalOrganelleMaterial = THREE.MeshPhysicalMaterial;

interface NucleusDatum {
  position: THREE.Vector3;
  driftAxis: THREE.Vector3;
  spinAxis: THREE.Vector3;
  twist: number;
  phase: number;
  radius: number;
  baseOpacity: number;
  color: THREE.Color;
}

interface MitochondrionDatum {
  position: THREE.Vector3;
  driftAxis: THREE.Vector3;
  spinAxis: THREE.Vector3;
  twist: number;
  phase: number;
  scale: number;
  stretch: number;
  color: THREE.Color;
}

interface VesicleDatum {
  position: THREE.Vector3;
  driftAxis: THREE.Vector3;
  spinAxis: THREE.Vector3;
  tangent: THREE.Vector3;
  bitangent: THREE.Vector3;
  twist: number;
  phase: number;
  baseRadius: number;
  escapeRadius: number;
  velocity: number;
  scale: number;
  curveRadiusA: number;
  curveRadiusB: number;
  color: THREE.Color;
}

interface InteriorLayout {
  nucleus: NucleusDatum;
  mitochondria: MitochondrionDatum[];
  vesicles: VesicleDatum[];
}

export interface WaveOrbInteriorProps {
  introProgress: number;
  hovering: boolean;
  pressed: boolean;
  loadProfile: WaveOrbLoadProfile;
  dynamicColors: WaveOrbDynamicColors;
}

const createOrientedQuaternion = (direction: THREE.Vector3, twist: number) => {
  const orientation = new THREE.Quaternion().setFromUnitVectors(
    UP_AXIS,
    direction.clone().normalize()
  );
  const twistQuaternion = new THREE.Quaternion().setFromAxisAngle(
    direction.clone().normalize(),
    twist
  );
  return orientation.multiply(twistQuaternion);
};

const tintColor = (source: THREE.Color, target: THREE.Color, amount: number) =>
  source.clone().lerp(target, clamp01(amount));

const buildInteriorLayout = (
  loadProfile: WaveOrbLoadProfile,
  dynamicColors: WaveOrbDynamicColors
): InteriorLayout => {
  const random = createSeededRandom(loadProfile.seed ^ 0x4b1d_00ab);
  const shellRadius = Math.max(0.001, loadProfile.shell.radius);
  const innerRadius = shellRadius * 0.84;
  const nucleusRadius = Math.min(
    Math.max(loadProfile.interior.nucleusRadius, shellRadius * 0.22),
    shellRadius * 0.36
  );
  const mitochondriaRadius = Math.min(
    Math.max(loadProfile.interior.mitochondriaRadius, shellRadius * 0.07),
    shellRadius * 0.16
  );
  const vesicleRadiusMin = Math.min(
    Math.max(loadProfile.interior.vesicleRadiusMin, shellRadius * 0.03),
    shellRadius * 0.11
  );
  const vesicleRadiusMax = Math.min(
    Math.max(loadProfile.interior.vesicleRadiusMax, vesicleRadiusMin),
    shellRadius * 0.18
  );
  const mitochondriaCount = Math.max(1, Math.floor(loadProfile.interior.mitochondriaCount));
  const vesicleCount = Math.max(1, Math.floor(loadProfile.interior.vesicleCount));
  const escapeProbability = clamp01(loadProfile.interior.vesicleEscapeProbability);
  const mitochondriaPalette =
    dynamicColors.organelles.mitochondria.length > 0
      ? dynamicColors.organelles.mitochondria
      : [dynamicColors.shellPalette.accentColor];
  const vesiclePalette =
    dynamicColors.organelles.vesicles.length > 0
      ? dynamicColors.organelles.vesicles
      : [dynamicColors.shellPalette.glowColor];

  const nucleusDirection = randomUnitVectorFrom(random);
  nucleusDirection.y *= 0.48;
  nucleusDirection.normalize();

  const nucleus = {
    position: nucleusDirection.multiplyScalar(shellRadius * 0.045),
    driftAxis: randomUnitVectorFrom(random).normalize(),
    spinAxis: randomUnitVectorFrom(random).normalize(),
    twist: random() * Math.PI * 2,
    phase: random() * Math.PI * 2,
    radius: nucleusRadius,
    baseOpacity: loadProfile.interior.glowOpacity,
    color: tintColor(dynamicColors.organelles.nucleus, dynamicColors.shellPalette.accentColor, 0.05),
  };

  const mitochondria: MitochondrionDatum[] = [];

  for (let index = 0; index < mitochondriaCount; index++) {
    const direction = randomUnitVectorFrom(random);
    const distanceBias = Math.pow(random(), 1.22);
    const radialDistance = innerRadius * pickRange(random, 0.44, 0.98) * (0.9 + distanceBias * 0.18);
    const position = direction.clone().multiplyScalar(radialDistance);
    position.y *= pickRange(random, 0.9, 1.16);
    position.x *= pickRange(random, 0.92, 1.1);
    position.z *= pickRange(random, 0.92, 1.1);

    if (position.length() > shellRadius * 0.78) {
      position.setLength(shellRadius * 0.78);
    }

    const baseColor = mitochondriaPalette[index % mitochondriaPalette.length];

    mitochondria.push({
      position,
      driftAxis: randomUnitVectorFrom(random).normalize(),
      spinAxis: randomUnitVectorFrom(random).normalize(),
      twist: random() * Math.PI * 2,
      phase: random() * Math.PI * 2,
      scale: pickRange(random, 0.92, 1.16),
      stretch: pickRange(random, 1.18, 1.68),
      color: tintColor(
        baseColor,
        dynamicColors.organelles.nucleus,
        0.03 + index * 0.008
      ),
    });
  }

  const vesicles: VesicleDatum[] = [];

  for (let index = 0; index < vesicleCount; index++) {
    const direction = randomUnitVectorFrom(random);
    const escaped = random() < escapeProbability;
    const baseRadius = escaped
      ? pickRange(random, shellRadius * 0.86, shellRadius * 1.01)
      : pickRange(random, shellRadius * 0.36, shellRadius * 0.96);
    const escapeRadius = escaped
      ? pickRange(random, shellRadius * 0.08, shellRadius * 0.22)
      : pickRange(random, shellRadius * 0.04, shellRadius * 0.14);
    const position = direction.clone().multiplyScalar(baseRadius);
    position.y *= pickRange(random, 0.82, 1.14);
    position.x *= pickRange(random, 0.9, 1.12);
    position.z *= pickRange(random, 0.9, 1.12);
    const tangent = perpendicularTo(direction);
    const bitangent = new THREE.Vector3().crossVectors(direction, tangent).normalize();
    const sizeBias = Math.pow(random(), 1.95);

    const baseColor = vesiclePalette[index % vesiclePalette.length];

    vesicles.push({
      position,
      driftAxis: randomUnitVectorFrom(random).normalize(),
      spinAxis: randomUnitVectorFrom(random).normalize(),
      tangent,
      bitangent,
      twist: random() * Math.PI * 2,
      phase: random() * Math.PI * 2,
      baseRadius,
      escapeRadius,
      velocity: pickRange(random, 0.24, 0.82),
      scale: (vesicleRadiusMin * 0.45 + sizeBias * (vesicleRadiusMax - vesicleRadiusMin * 0.45)) / shellRadius,
      curveRadiusA: pickRange(random, shellRadius * 0.035, shellRadius * 0.13),
      curveRadiusB: pickRange(random, shellRadius * 0.02, shellRadius * 0.1),
      color: tintColor(baseColor, dynamicColors.organelles.nucleus, 0.02 + index * 0.006),
    });
  }

  return {
    nucleus,
    mitochondria,
    vesicles,
  };
};

const updateMaterialColor = (
  material: InternalOrganelleMaterial | null,
  color: THREE.Color,
  opacity: number,
  emissiveIntensity: number
) => {
  if (!material) return;

  material.color.copy(color);
  material.emissive.copy(color);
  material.emissiveIntensity = emissiveIntensity;
  material.opacity = opacity;
};

export const WaveOrbInterior: React.FC<WaveOrbInteriorProps> = ({
  introProgress,
  hovering,
  pressed,
  loadProfile,
  dynamicColors,
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const nucleusRef = useRef<THREE.Mesh>(null);
  const nucleusMaterialRef = useRef<InternalOrganelleMaterial>(null);
  const mitochondriaRefs = useRef<Array<THREE.Mesh | null>>([]);
  const mitochondriaMaterialRefs = useRef<Array<InternalOrganelleMaterial | null>>([]);
  const vesicleRefs = useRef<Array<THREE.Mesh | null>>([]);
  const vesicleMaterialRefs = useRef<Array<InternalOrganelleMaterial | null>>([]);

  const layout = useMemo(
    () => buildInteriorLayout(loadProfile, dynamicColors),
    [dynamicColors, loadProfile]
  );

  useFrame(({ clock }) => {
    const group = groupRef.current;
    const time = clock.elapsedTime;
    const intro = smoothStep(clamp01(introProgress));
    const hoverFactor = hovering ? 1 : 0;
    const pressFactor = pressed ? 1 : 0;
    const shellRadius = Math.max(0.001, loadProfile.shell.radius);
    const cycleSpeed = loadProfile.colors.cycleSpeed;
    const cyclePhase = dynamicColors.cyclePhase;
    const interaction = dynamicColors.interactionAmount;
    const clickBurst = dynamicColors.clickBurst;
    const energy = 0.4 + intro * 0.6 + interaction * 0.35 + hoverFactor * 0.12 + pressFactor * 0.16;

    if (group) {
      group.rotation.y = Math.sin(time * 0.12 + loadProfile.seed) * 0.08 * energy;
      group.rotation.x = Math.cos(time * 0.1 + loadProfile.seed * 0.5) * 0.06 * energy;
      group.rotation.z = Math.sin(time * 0.07 + loadProfile.seed * 0.33) * 0.03 * energy;
      group.position.y = Math.sin(time * 0.34 + loadProfile.seed) * 0.02 * intro;
      group.position.x = Math.cos(time * 0.29 + loadProfile.seed * 0.67) * 0.012 * intro;
      group.position.z = Math.sin(time * 0.25 + loadProfile.seed * 0.44) * 0.01 * intro;
      group.scale.setScalar(0.92 + intro * 0.08 + hoverFactor * 0.02 + pressFactor * 0.03);
    }

    if (nucleusRef.current) {
      const nucleus = layout.nucleus;
      const pulse = Math.sin(time * (0.82 + cycleSpeed * 0.18) + nucleus.phase) * 0.018;
      const hoverLift = hovering ? 0.03 : 0;
      const pressLift = pressed ? 0.05 : 0;
      const drift = nucleus.driftAxis.clone().multiplyScalar(
        (0.018 + loadProfile.interior.driftStrength * 0.12) * intro
      );

      nucleusRef.current.position.copy(nucleus.position).add(drift);
      nucleusRef.current.position.addScaledVector(nucleus.spinAxis, Math.sin(time * 0.22 + nucleus.phase) * 0.012);
      nucleusRef.current.quaternion.copy(createOrientedQuaternion(nucleus.spinAxis, nucleus.twist));
      nucleusRef.current.rotateY(time * 0.18 + nucleus.phase * 0.2);
      nucleusRef.current.rotateZ(Math.sin(time * 0.14 + nucleus.phase) * 0.18);
      nucleusRef.current.scale.setScalar(
        nucleus.radius * (1 + pulse + hoverLift + pressLift + interaction * 0.03)
      );

      updateMaterialColor(
        nucleusMaterialRef.current,
        dynamicColors.organelles.nucleus.clone().lerp(dynamicColors.shellPalette.accentColor, cyclePhase * 0.08),
        (0.54 + nucleus.baseOpacity * 0.42) * (0.72 + intro * 0.28),
        0.58 + interaction * 0.18 + hoverFactor * 0.12
      );
    }

    layout.mitochondria.forEach((mitochondrion, index) => {
      const mesh = mitochondriaRefs.current[index];
      const material = mitochondriaMaterialRefs.current[index];
      if (!mesh || !material) return;

      const wave = Math.sin(time * (0.72 + cycleSpeed * 0.22) + mitochondrion.phase) * 0.052;
      const wobble = Math.cos(time * 0.9 + mitochondrion.phase * 1.3) * 0.042;
      const clickDrift = Math.sin(time * 3.9 + mitochondrion.phase * 1.4) * shellRadius * 0.06 * clickBurst;
      const clickOrbit = Math.cos(time * 3.2 + mitochondrion.phase * 0.9) * shellRadius * 0.04 * clickBurst;
      const driftAmount =
        (loadProfile.interior.driftStrength * 0.42 + 0.052) *
        (0.48 + intro * 0.68 + interaction * 0.42);
      const position = mitochondrion.position
        .clone()
        .addScaledVector(mitochondrion.driftAxis, wave * shellRadius * driftAmount)
        .addScaledVector(mitochondrion.spinAxis, wobble * shellRadius * 0.032)
        .addScaledVector(mitochondrion.driftAxis, clickDrift)
        .addScaledVector(mitochondrion.spinAxis, clickOrbit);
      const maxDistance = shellRadius * 0.72;

      if (position.length() > maxDistance) {
        position.setLength(maxDistance);
      }

      mesh.position.copy(position);
      mesh.quaternion.copy(createOrientedQuaternion(mitochondrion.spinAxis, mitochondrion.twist));
      mesh.rotateY(
        time * 0.56 +
        mitochondrion.phase * 0.18 +
        Math.sin(time * 2.2 + mitochondrion.phase * 0.8) * clickBurst * 0.35
      );
      mesh.rotateX(
        Math.sin(time * 0.38 + mitochondrion.phase + Math.sin(time * 1.7 + mitochondrion.phase) * clickBurst * 0.28) *
          0.16
      );
      mesh.rotateZ(
        Math.cos(time * 0.44 + mitochondrion.phase * 0.75 + Math.cos(time * 1.3 + mitochondrion.phase) * clickBurst * 0.22) *
          0.12
      );
      mesh.scale.set(
        mitochondrion.scale * loadProfile.interior.mitochondriaRadius * 0.86,
        mitochondrion.scale * loadProfile.interior.mitochondriaRadius * mitochondrion.stretch * 1.04,
        mitochondrion.scale * loadProfile.interior.mitochondriaRadius * 0.86
      );

      const materialColor = tintColor(
        dynamicColors.organelles.mitochondria[index % dynamicColors.organelles.mitochondria.length] ?? mitochondrion.color,
        dynamicColors.highlightTone,
        0.08 + hoverFactor * 0.06 + pressFactor * 0.08
      );
      updateMaterialColor(
        material,
        materialColor,
        0.68 * (0.72 + intro * 0.28),
        0.4 + hoverFactor * 0.1 + pressFactor * 0.12
      );
    });

    layout.vesicles.forEach((vesicle, index) => {
      const mesh = vesicleRefs.current[index];
      const material = vesicleMaterialRefs.current[index];
      if (!mesh || !material) return;

      const outwardPhase = Math.max(0, Math.sin(time * (0.54 + vesicle.velocity) + vesicle.phase));
      const outward =
        vesicle.baseRadius +
        outwardPhase * vesicle.escapeRadius * (0.45 + loadProfile.interior.vesicleEscapeProbability + clickBurst * 0.18);
      const radial = vesicle.position.clone().setLength(outward);
      const lift = Math.sin(time * 0.76 + vesicle.phase) * shellRadius * 0.02 * intro;
      const drift = vesicle.driftAxis.clone().multiplyScalar(
        Math.sin(time * (0.52 + vesicle.velocity * 0.3) + vesicle.phase) *
          shellRadius *
          loadProfile.interior.driftStrength *
          0.16
      );
      const curveOffset = vesicle.tangent
        .clone()
        .multiplyScalar(Math.sin(time * (0.8 + vesicle.velocity * 0.84) + vesicle.phase) * vesicle.curveRadiusA * (1 + clickBurst * 0.38))
        .add(
          vesicle.bitangent
            .clone()
            .multiplyScalar(Math.cos(time * (1.08 + vesicle.velocity * 0.58) + vesicle.phase * 1.4) * vesicle.curveRadiusB * (1 + clickBurst * 0.46))
        )
        .add(
          vesicle.spinAxis
            .clone()
            .multiplyScalar(Math.sin(time * (0.58 + vesicle.velocity * 0.34) + vesicle.phase * 0.8) * shellRadius * 0.022 * (1 + clickBurst * 0.28))
        );
      const escapedBoost = outward > shellRadius ? (outward - shellRadius) / shellRadius : 0;
      const maxOutward = shellRadius * (1.08 + loadProfile.interior.vesicleEscapeProbability * 0.08);

      radial.add(drift);
      radial.add(curveOffset);
      radial.y += lift;
      if (radial.length() > maxOutward) {
        radial.setLength(maxOutward);
      }

      mesh.position.copy(radial);
      mesh.quaternion.copy(createOrientedQuaternion(vesicle.spinAxis, vesicle.twist));
      mesh.rotateY(time * 0.24 + vesicle.phase * 0.18);
      mesh.rotateX(Math.sin(time * 0.38 + vesicle.phase) * 0.2);
      mesh.rotateZ(Math.cos(time * 0.31 + vesicle.phase * 0.7) * 0.16);
      mesh.scale.setScalar(
        vesicle.scale *
          shellRadius *
          (1 + intro * 0.08 + hoverFactor * 0.03 + pressFactor * 0.05 + escapedBoost * 0.12)
      );

      const materialColor = tintColor(
        dynamicColors.organelles.vesicles[index % dynamicColors.organelles.vesicles.length] ?? vesicle.color,
        dynamicColors.highlightTone,
        0.04 + cyclePhase * 0.05
      );
      updateMaterialColor(
        material,
        materialColor,
        0.62 * (0.68 + intro * 0.32),
        0.42 + hoverFactor * 0.08 + pressFactor * 0.1 + escapedBoost * 0.14
      );
    });
  });

  return (
    <group ref={groupRef} renderOrder={2}>
      <mesh ref={nucleusRef} frustumCulled={false}>
        <sphereGeometry args={[1, 40, 28]} />
        <meshPhysicalMaterial
          ref={nucleusMaterialRef}
          color={layout.nucleus.color}
          emissive={layout.nucleus.color}
          emissiveIntensity={0.58}
          transparent
          opacity={0.68}
          transmission={0.4}
          thickness={1.4}
          roughness={0.28}
          metalness={0}
          ior={1.23}
          clearcoat={0.18}
          clearcoatRoughness={0.42}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>

      {layout.mitochondria.map((mitochondrion, index) => (
        <mesh
          // eslint-disable-next-line react/no-array-index-key
          key={`mitochondrion-${index}`}
          ref={(node) => {
            mitochondriaRefs.current[index] = node;
          }}
          frustumCulled={false}
        >
          <capsuleGeometry args={[0.92, 1.45, 10, 18]} />
          <meshPhysicalMaterial
            ref={(node) => {
              mitochondriaMaterialRefs.current[index] = node;
            }}
            color={mitochondrion.color}
            emissive={mitochondrion.color}
            emissiveIntensity={0.4}
            transparent
            opacity={0.72}
            transmission={0.24}
            thickness={0.82}
            roughness={0.4}
            metalness={0}
            ior={1.18}
            clearcoat={0.12}
            clearcoatRoughness={0.5}
            depthWrite={false}
            toneMapped={false}
          />
        </mesh>
      ))}

      {layout.vesicles.map((vesicle, index) => (
        <mesh
          // eslint-disable-next-line react/no-array-index-key
          key={`vesicle-${index}`}
          ref={(node) => {
            vesicleRefs.current[index] = node;
          }}
          frustumCulled={false}
        >
          <sphereGeometry args={[1, 18, 14]} />
          <meshPhysicalMaterial
            ref={(node) => {
              vesicleMaterialRefs.current[index] = node;
            }}
            color={vesicle.color}
            emissive={vesicle.color}
            emissiveIntensity={0.42}
            transparent
            opacity={0.66}
            transmission={0.42}
            thickness={0.56}
            roughness={0.22}
            metalness={0}
            ior={1.18}
            clearcoat={0.1}
            clearcoatRoughness={0.38}
            depthWrite={false}
            toneMapped={false}
          />
        </mesh>
      ))}
    </group>
  );
};

export default WaveOrbInterior;
