import { Project } from "../../../service/project/types";
import { StorySection } from "./story-section";
import styles from "./styles.module.scss";

interface ProjectStoryProps {
  project: Project;
}

export const ProjectStory = ({ project }: ProjectStoryProps) => (
  <div className={styles.story}>
    {project.story.sections.map((section) => (
      <StorySection
        key={`${section.type}-${section.id}`}
        projectId={project.id}
        section={section}
      />
    ))}
  </div>
);
