import { ComponentType } from "react";
import { CenterpieceProps } from "../centerpieceTypes";
import WaveOrbCenterpiece from "./WaveOrbCenterpiece";

export type CenterpieceId = "waveOrb";

export interface CenterpieceEntry {
  id: CenterpieceId;
  label: string;
  component: ComponentType<CenterpieceProps>;
}

export const centerpieceRegistry: Record<CenterpieceId, CenterpieceEntry> = {
  waveOrb: {
    id: "waveOrb",
    label: "Wave Orb",
    component: WaveOrbCenterpiece,
  },
};

export const defaultCenterpieceId: CenterpieceId = "waveOrb";
