import { Skill } from "../../../service/skill/types";
import styles from "./skill-timeline-item.module.scss";
import { SkillPills } from "../../common/skill-pills";

interface SkillTimelineItemProps {
  skill: Skill;
}

export const SkillTimelineItem = ({ skill }: SkillTimelineItemProps) => (
    <li className={styles.item}>
      <SkillPills
        ariaLabel={skill.name}
        className={styles.summary}
        skills={[skill]}
      />
    </li>
);
