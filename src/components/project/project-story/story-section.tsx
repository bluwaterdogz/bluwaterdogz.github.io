import { ProjectStorySection } from "../../../service/project/types";
import { ArchitectureSection } from "./architecture-section";
import { CopySection } from "./copy-section";
import { InteractiveTimeline } from "./interactive-timeline";
import { OutcomeSection } from "./outcome-section";

interface StorySectionProps {
  projectId: string;
  section: ProjectStorySection;
}

export const StorySection = ({ projectId, section }: StorySectionProps) => {
  switch (section.type) {
    case "architecture":
      return <ArchitectureSection projectId={projectId} section={section} />;
    case "timeline":
      return <InteractiveTimeline projectId={projectId} section={section} />;
    case "outcome":
      return <OutcomeSection projectId={projectId} sectionId={section.id} />;
    default:
      return <CopySection projectId={projectId} section={section} />;
  }
};
