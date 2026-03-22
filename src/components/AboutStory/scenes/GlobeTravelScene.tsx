import React, { useMemo } from "react";
import { Line } from "@react-three/drei";
import * as THREE from "three";
import type { AboutGlobeTravelSceneProps } from "../../../content/aboutStory";
import type { AboutSceneComponentProps } from "../types";

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

const smoothStep = (value: number) => {
  const t = clamp01(value);
  return t * t * (3 - 2 * t);
};

const latLonToVector3 = (latitude: number, longitude: number, radius: number) => {
  const phi = ((90 - latitude) * Math.PI) / 180;
  const theta = ((longitude + 180) * Math.PI) / 180;

  return new THREE.Vector3(
    -(radius * Math.sin(phi) * Math.cos(theta)),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta),
  );
};

const GlobeTravelScene: React.FC<AboutSceneComponentProps> = ({ node, mix, nodeProgress, pointer, qualityMode }) => {
  const sceneProps = node.sceneProps as AboutGlobeTravelSceneProps;
  const globeRadius = 1.72;
  const focusProgress = smoothStep(clamp01(nodeProgress / 0.34));
  const flightProgress = smoothStep(clamp01((nodeProgress - 0.32) / 0.4));
  const arrivalProgress = smoothStep(clamp01((nodeProgress - 0.72) / 0.28));

  const originVector = useMemo(
    () => latLonToVector3(sceneProps.origin.latitude, sceneProps.origin.longitude, globeRadius),
    [sceneProps.origin.latitude, sceneProps.origin.longitude],
  );
  const destinationVector = useMemo(
    () => latLonToVector3(sceneProps.destination.latitude, sceneProps.destination.longitude, globeRadius),
    [sceneProps.destination.latitude, sceneProps.destination.longitude],
  );

  const routeCurve = useMemo(() => {
    const start = originVector.clone().multiplyScalar(1.02);
    const end = destinationVector.clone().multiplyScalar(1.02);
    const middle = start.clone().lerp(end, 0.5).normalize().multiplyScalar(globeRadius * 1.78);
    return new THREE.CatmullRomCurve3([start, middle, end]);
  }, [destinationVector, originVector]);

  const routePoints = useMemo(() => routeCurve.getPoints(72).map((point) => point.toArray() as [number, number, number]), [routeCurve]);
  const planeProgress = flightProgress;
  const planePoint = routeCurve.getPointAt(planeProgress);
  const planeLookAhead = routeCurve.getPointAt(Math.min(0.999, planeProgress + 0.02));
  const planeQuaternion = useMemo(() => {
    const direction = planeLookAhead.clone().sub(planePoint).normalize();
    return new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction);
  }, [planeLookAhead, planePoint]);

  const baseOpacity = 0.16 + mix * 0.84;
  const globeOffset = new THREE.Vector3()
    .copy(originVector)
    .multiplyScalar(-0.28 * focusProgress)
    .lerp(destinationVector.clone().multiplyScalar(-0.72), arrivalProgress);

  const globeRotationY = 0.44 + focusProgress * 0.82 + flightProgress * 0.92 + pointer.x * 0.12;
  const globeRotationX = -0.12 + pointer.y * 0.08;
  const globeScale = 1 + focusProgress * 0.18 + arrivalProgress * 0.52;
  const planeVisible = nodeProgress > 0.34 && nodeProgress < 0.94;
  const starOpacity = qualityMode === "reduced" ? 0.22 : 0.36;

  const markerScale = 0.12 + focusProgress * 0.06;
  const destinationScale = 0.12 + arrivalProgress * 0.1;

  return (
    <group position={[globeOffset.x, globeOffset.y, globeOffset.z]} rotation={[globeRotationX, globeRotationY, 0]} scale={globeScale}>
      <mesh scale={[12, 7, 1]} position={[0, 0, -4.8]}>
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial color="#eff6ff" transparent opacity={starOpacity * mix} />
      </mesh>

      {qualityMode === "full" && (
        <>
          {Array.from({ length: 18 }).map((_, index) => {
            const angle = (index / 18) * Math.PI * 2;
            const radius = 3.4 + (index % 3) * 0.34;
            return (
              <mesh
                key={`star-${index}`}
                position={[Math.cos(angle) * radius, Math.sin(angle * 1.2) * 1.8, -2.8 + (index % 5) * 0.14]}
                scale={0.015 + (index % 4) * 0.005}
              >
                <sphereGeometry args={[1, 10, 10]} />
                <meshBasicMaterial color="#ffffff" transparent opacity={(0.16 + (index % 3) * 0.08) * mix} />
              </mesh>
            );
          })}
        </>
      )}

      <mesh>
        <sphereGeometry args={[globeRadius, 48, 48]} />
        <meshStandardMaterial color="#1d4ed8" roughness={0.74} metalness={0.06} transparent opacity={0.96 * baseOpacity} />
      </mesh>

      <mesh scale={1.045}>
        <sphereGeometry args={[globeRadius, 32, 32]} />
        <meshBasicMaterial color={sceneProps.atmosphereColor} transparent opacity={0.22 * baseOpacity} />
      </mesh>

      <mesh rotation={[0.18, 0.1, 0]} scale={[1.004, 1.004, 1.004]}>
        <sphereGeometry args={[globeRadius, 26, 26]} />
        <meshBasicMaterial color="#ffffff" wireframe transparent opacity={0.08 * baseOpacity} />
      </mesh>

      <mesh position={originVector.toArray()} scale={markerScale}>
        <sphereGeometry args={[1, 18, 18]} />
        <meshStandardMaterial color={sceneProps.origin.accent} emissive={sceneProps.origin.accent} emissiveIntensity={0.72} transparent opacity={baseOpacity} />
      </mesh>
      <mesh position={destinationVector.toArray()} scale={destinationScale}>
        <sphereGeometry args={[1, 18, 18]} />
        <meshStandardMaterial
          color={sceneProps.destination.accent}
          emissive={sceneProps.cityGlowColor}
          emissiveIntensity={1 + arrivalProgress * 1.4}
          transparent
          opacity={baseOpacity}
        />
      </mesh>

      <Line
        points={routePoints}
        color={sceneProps.routeColor}
        lineWidth={1.2}
        transparent
        opacity={(0.18 + flightProgress * 0.72) * mix}
      />

      {planeVisible && (
        <group position={planePoint.toArray()} quaternion={planeQuaternion}>
          <mesh rotation={[Math.PI / 2, 0, Math.PI / 2]}>
            <coneGeometry args={[0.08, 0.28, 10]} />
            <meshStandardMaterial color="#f8fafc" emissive="#f8fafc" emissiveIntensity={0.24} transparent opacity={0.94 * mix} />
          </mesh>
          <mesh rotation={[Math.PI / 2, 0, Math.PI / 2]} position={[-0.04, 0, 0]}>
            <boxGeometry args={[0.04, 0.16, 0.18]} />
            <meshStandardMaterial color="#7dd3fc" transparent opacity={0.5 * mix} />
          </mesh>
        </group>
      )}

      {arrivalProgress > 0.04 && (
        <mesh position={destinationVector.clone().multiplyScalar(1.04).toArray()} scale={0.18 + arrivalProgress * 0.24}>
          <sphereGeometry args={[1, 18, 18]} />
          <meshBasicMaterial color={sceneProps.cityGlowColor} transparent opacity={0.16 + arrivalProgress * 0.2} />
        </mesh>
      )}
    </group>
  );
};

export default GlobeTravelScene;
