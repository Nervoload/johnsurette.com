import React from "react";
import CenterpieceStage from "../components/LandingComponents/CenterpieceStage";
import DepthRainBackdrop from "../components/LandingComponents/DepthRainBackdrop";
import {
  centerpieceRegistry,
  defaultCenterpieceId,
} from "../components/LandingComponents/centerpieces/centerpieceRegistry";
import LandingStoryboard from "../components/LandingStory/LandingStoryboard";
import { WipeOptions } from "../components/Transitions/TransitionWipe";
import PageScaffold from "../components/layout/PageScaffold";

export interface LandingPageProps {
  onNavigate: (path: string, opts?: WipeOptions) => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  const ActiveCenterpiece = centerpieceRegistry[defaultCenterpieceId].component;

  return (
    <PageScaffold
      backgroundClassName="bg-[radial-gradient(circle_at_20%_0%,rgba(186,230,253,0.55),rgba(224,231,255,0.42)_34%,rgba(248,250,252,1)_78%)]"
      footerBackgroundColor="#ffffff"
    >
      {() => (
        <>
          <section className="relative flex min-h-screen items-center justify-center">
            <DepthRainBackdrop />
            <div className="relative z-10 px-4 sm:px-6">
              <CenterpieceStage activeSection={null} centerpiece={ActiveCenterpiece} />
            </div>
          </section>

          <LandingStoryboard onNavigate={onNavigate} />
        </>
      )}
    </PageScaffold>
  );
};

export default LandingPage;
