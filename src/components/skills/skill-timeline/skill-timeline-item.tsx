import { useTranslation } from "react-i18next";
import { PopoverList } from "../../common/popover-list";
import { getProjectsForSkill } from "../../../service/project/selectors";
import { Skill } from "../../../service/skill/types";
import styles from "./skill-timeline-item.module.scss";

interface SkillTimelineItemProps {
  alignRight: boolean;
  skill: Skill;
}

export const SkillTimelineItem = ({
  alignRight,
  skill,
}: SkillTimelineItemProps) => {
  const { t } = useTranslation();
  const projects = getProjectsForSkill(skill.id);

  return (
    <li
      className={`${styles.item} ${alignRight ? styles.alignRight : ""}`}
      tabIndex={0}
    >
      <div className={styles.summary}>
        <i className={skill.icon} aria-hidden="true" />
        <span>{skill.name}</span>
      </div>
      {projects.length > 0 && (
        <PopoverList
          className={styles.projectMenu}
          items={projects.map((project) => ({
            id: project.id,
            label: project.name,
            to: `/project/${project.id}`,
          }))}
          label={t("skills.projectsMenu")}
        />
      )}
    </li>
  );
};
