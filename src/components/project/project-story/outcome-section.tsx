import { useTranslation } from "react-i18next";
import { Statement } from "../../common/statement";
import { getSectionKey } from "./section-key";
import styles from "./styles.module.scss";

interface OutcomeSectionProps {
  projectId: string;
  sectionId: string;
}

export const OutcomeSection = ({ projectId, sectionId }: OutcomeSectionProps) => {
  const { t } = useTranslation();
  const sectionKey = getSectionKey(projectId, sectionId);

  return (
    <Statement as="blockquote" className={styles.outcome}>
      {t(`${sectionKey}.content`)}
    </Statement>
  );
};
