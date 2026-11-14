import { useTranslation } from "react-i18next";
import { getSkillsForGrouping } from "../../../service/skill/data";
import { SkillGrouping } from "../../../service/skill/types";
import { SkillPills } from "../../common/skill-pills";
import styles from "./skill-timeline-group.module.scss";

interface SkillTimelineGroupProps {
  grouping: SkillGrouping;
  isLast: boolean;
}

export const SkillTimelineGroup = ({
  grouping,
  isLast,
}: SkillTimelineGroupProps) => {
  const { t } = useTranslation();
  const skills = getSkillsForGrouping(grouping);

  return (
    <section className={`${styles.group} ${isLast ? styles.last : ""}`}>
      <h2>{t(`skills.groups.${grouping.i18nKey}`, { defaultValue: grouping.name })}</h2>
      <SkillPills
        ariaLabel={t(`skills.groups.${grouping.i18nKey}`, {
          defaultValue: grouping.name,
        })}
        className={styles.skills}
        linkTo="skills"
        skills={skills}
      />
    </section>
  );
};
