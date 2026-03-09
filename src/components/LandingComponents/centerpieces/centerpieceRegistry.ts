import { ComponentType } from "react";
import { CenterpieceProps } from "../centerpieceTypes";
import WaveOrbCenterpiece from "./WaveOrbCenterpiece";
import { ShadowAssetId } from "../../theme/shadowAssetRegistry";

export type CenterpieceId = "waveOrb";

export interface CenterpieceEntry {
  id: CenterpieceId;
  label: string;
  component: ComponentType<CenterpieceProps>;
  shadowAssetId?: ShadowAssetId;
}

export const centerpieceRegistry: Record<CenterpieceId, CenterpieceEntry> = {
  waveOrb: {
    id: "waveOrb",
    label: "Wave Orb",
    component: WaveOrbCenterpiece,
    shadowAssetId: "heroCenterpiece",
  },
};

export const defaultCenterpieceId: CenterpieceId = "waveOrb";
