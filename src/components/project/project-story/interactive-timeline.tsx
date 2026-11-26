import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ProjectStorySection } from "../../../service/project/types";
import { getSectionKey } from "./section-key";
import styles from "./styles.module.scss";

type TimelineSection = Extract<ProjectStorySection, { type: "timeline" }>;

interface InteractiveTimelineProps {
  projectId: string;
  section: TimelineSection;
}

export const InteractiveTimeline = ({
  projectId,
  section,
}: InteractiveTimelineProps) => {
  const { t } = useTranslation();
  const [activeIndex, setActiveIndex] = useState(0);
  const sectionKey = getSectionKey(projectId, section.id);
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
