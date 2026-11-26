import { useTranslation } from "react-i18next";
import { ProjectStorySection } from "../../../service/project/types";
import { getSectionKey } from "./section-key";
import styles from "./styles.module.scss";

type ArchitectureSectionData = Extract<
  ProjectStorySection,
  { type: "architecture" }
>;

interface ArchitectureSectionProps {
  projectId: string;
  section: ArchitectureSectionData;
}

export const ArchitectureSection = ({
  projectId,
  section,
}: ArchitectureSectionProps) => {
  const { t } = useTranslation();
  const sectionKey = getSectionKey(projectId, section.id);

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
};
