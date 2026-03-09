import { ShadowAssetId } from "../theme/shadowAssetRegistry";
import { ShadowMode } from "../theme/shadowMode";

export type PointerVector = {
  x: number;
  y: number;
};

export interface CenterpieceProps {
  activeSection: string | null;
  pointer: PointerVector;
  hovering: boolean;
  pressed: boolean;
  introProgress: number;
  shadowMode: ShadowMode;
  shadowAssetId?: ShadowAssetId;
}
