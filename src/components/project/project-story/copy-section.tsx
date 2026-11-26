import { useTranslation } from "react-i18next";
import { ProjectStorySection } from "../../../service/project/types";
import { getSectionKey } from "./section-key";
import styles from "./styles.module.scss";

type CopySectionData = Extract<
  ProjectStorySection,
  { type: "challenge" | "text" }
>;

interface CopySectionProps {
  projectId: string;
  section: CopySectionData;
}

export const CopySection = ({ projectId, section }: CopySectionProps) => {
  const { t } = useTranslation();
  const sectionKey = getSectionKey(projectId, section.id);
  const eyebrow = t(`${sectionKey}.eyebrow`, { defaultValue: "" });

  return (
    <section className={`${styles.copySection} ${styles[section.type]}`}>
      {eyebrow !== "" && <p className={styles.eyebrow}>{eyebrow}</p>}
      <h2>{t(`${sectionKey}.title`)}</h2>
      <p>{t(`${sectionKey}.content`)}</p>
    </section>
  );
};
