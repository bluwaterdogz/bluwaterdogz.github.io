import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Project, ProjectStorySection } from "../../../service/project/types";
import { Statement } from "../../common/statement";
import styles from "./styles.module.scss";

interface ProjectStoryProps {
  project: Project;
}

interface StorySectionProps {
  projectId: string;
  section: ProjectStorySection;
}

type TimelineSection = Extract<ProjectStorySection, { type: "timeline" }>;

const InteractiveTimeline = ({
  projectId,
  section,
}: {
  projectId: string;
  section: TimelineSection;
}) => {
  const { t } = useTranslation();
  const [activeIndex, setActiveIndex] = useState(0);
  const sectionKey = `data.projects.stories.${projectId}.sections.${section.id}`;
  const activeStepKey = `${sectionKey}.steps.${section.steps[activeIndex]}`;

  return (
    <section className={styles.timelineSection}>
      <h2>{t(`${sectionKey}.title`)}</h2>
      <div className={styles.timelineLayout}>
        <div className={styles.timelineCopy} aria-live="polite">
          <p>{t(`${activeStepKey}.label`)}</p>
          <h3>{t(`${activeStepKey}.title`)}</h3>
          <p>{t(`${activeStepKey}.content`)}</p>
        </div>
        <ol className={styles.timeline}>
          {section.steps.map((stepId, index) => (
            <li
              className={index === activeIndex ? styles.activeStep : undefined}
              key={stepId}
            >
              <button
                aria-current={index === activeIndex ? "step" : undefined}
                onClick={() => setActiveIndex(index)}
                type="button"
              >
                <span className={styles.dot} aria-hidden="true" />
                <span>{t(`${sectionKey}.steps.${stepId}.label`)}</span>
              </button>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
};

const StorySection = ({ projectId, section }: StorySectionProps) => {
  const { t } = useTranslation();
  const sectionKey = `data.projects.stories.${projectId}.sections.${section.id}`;

  if (section.type === "timeline") {
    return <InteractiveTimeline projectId={projectId} section={section} />;
  }

  if (section.type === "architecture") {
    return (
      <section className={styles.architectureSection}>
        <h2>{t(`${sectionKey}.title`)}</h2>
        <div className={styles.architecture}>
          {section.nodes.map((nodeId, index) => (
            <article key={nodeId}>
              <span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
              <h3>{t(`${sectionKey}.nodes.${nodeId}.label`)}</h3>
              <p>{t(`${sectionKey}.nodes.${nodeId}.detail`)}</p>
            </article>
          ))}
        </div>
      </section>
    );
  }

  if (section.type === "outcome") {
    return (
      <Statement as="blockquote" className={styles.outcome}>
        {t(`${sectionKey}.content`)}
      </Statement>
    );
  }

  const eyebrow = t(`${sectionKey}.eyebrow`, { defaultValue: "" });

  return (
    <section className={`${styles.copySection} ${styles[section.type]}`}>
      {eyebrow !== "" && <p className={styles.eyebrow}>{eyebrow}</p>}
      <h2>{t(`${sectionKey}.title`)}</h2>
      <p>{t(`${sectionKey}.content`)}</p>
    </section>
  );
};

export const ProjectStory = ({ project }: ProjectStoryProps) => {
  return (
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
};
