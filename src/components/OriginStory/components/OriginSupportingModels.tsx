import React from "react";
import OriginAssetModel from "./OriginAssetModel";
import { OriginQualityTier, OriginSupportingModel } from "../types";

interface OriginSupportingModelsProps {
  models: OriginSupportingModel[];
  qualityTier: OriginQualityTier;
}

const OriginSupportingModels: React.FC<OriginSupportingModelsProps> = ({ models, qualityTier }) => {
  return (
    <>
      {models.map((model) => {
        if (model.qualityTiers && !model.qualityTiers.includes(qualityTier)) {
          return null;
        }

        return (
          <group
            key={model.id}
            position={model.transform.position}
            rotation={model.transform.rotation}
            scale={model.transform.scale}
          >
            <OriginAssetModel
              url={model.url}
              qualityTier={qualityTier}
              fitHeight={model.fitHeight}
              anchor={model.anchor}
            />
          </group>
        );
      })}
    </>
  );
};

export default OriginSupportingModels;
