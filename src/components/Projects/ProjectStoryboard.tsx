import React from "react";
import StoryboardSection from "./StoryboardSection";
import IntroShuffle from "./IntroShuffle";
import SpreadReveal from "./SpreadReveal";
import ProjectDeck from "./ProjectDeck";
import ProjectCardInfo from "./ProjectCardInfo";

interface ProjectStoryboardProps {
  scrollContainer: React.RefObject<HTMLElement>;
}

const ProjectStoryboard: React.FC<ProjectStoryboardProps> = ({ scrollContainer }) => {
  return (
    <>
      <StoryboardSection container={scrollContainer}>
        {(p) => <IntroShuffle progress={p} />}
      </StoryboardSection>
      <StoryboardSection container={scrollContainer}>
        {(p) => <SpreadReveal progress={p} />}
      </StoryboardSection>
      <StoryboardSection container={scrollContainer}>
        {(p) => <ProjectDeck progress={p} />}
      </StoryboardSection>
      <StoryboardSection container={scrollContainer}>
        {(p) => <ProjectCardInfo progress={p} />}
      </StoryboardSection>
    </>
  );
};

export default ProjectStoryboard;
