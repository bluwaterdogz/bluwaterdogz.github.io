import { useState } from "react";
import { Project, ProjectStorySection } from "../../../service/project/types";
import styles from "./styles.module.scss";

interface ProjectStoryProps {
  project: Project;
}

type TimelineSection = Extract<ProjectStorySection, { type: "timeline" }>;

const InteractiveTimeline = ({ section }: { section: TimelineSection }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeStep = section.steps[activeIndex];

  return (
    <section className={styles.timelineSection}>
      <h2>{section.title}</h2>
      <div className={styles.timelineLayout}>
        <div className={styles.timelineCopy} aria-live="polite">
          <p>{activeStep.label}</p>
          <h3>{activeStep.title}</h3>
          <p>{activeStep.content}</p>
        </div>
        <ol className={styles.timeline}>
          {section.steps.map((step, index) => (
            <li className={index === activeIndex ? styles.activeStep : undefined} key={step.label}>
              <button onClick={() => setActiveIndex(index)} type="button">
                <span className={styles.dot} aria-hidden="true" />
                <span>{step.label}</span>
              </button>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
};

const StorySection = ({ section }: { section: ProjectStorySection }) => {
  if (section.type === "timeline") {
    return <InteractiveTimeline section={section} />;
  }

  if (section.type === "architecture") {
    return (
      <section className={styles.architectureSection}>
        <h2>{section.title}</h2>
        <div className={styles.architecture}>
          {section.nodes.map((node, index) => (
            <article key={node.label}>
              <span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
              <h3>{node.label}</h3>
              <p>{node.detail}</p>
            </article>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className={`${styles.copySection} ${styles[section.type]}`}>
      {section.eyebrow != null && <p className={styles.eyebrow}>{section.eyebrow}</p>}
      <h2>{section.title}</h2>
      <p>{section.content}</p>
    </section>
  );
};

export const ProjectStory = ({ project }: ProjectStoryProps) => {
  if (project.story == null) return null;

  return (
    <div className={`${styles.story} ${styles[project.story.accent]}`}>
      {project.story.sections.map((section, index) => (
        <StorySection key={`${section.type}-${index}`} section={section} />
      ))}
    </div>
  );
};
