import { skillGroupings } from "../../../service/skill/data";
import { SkillGrouping } from "../../../service/skill/types";
import styles from "./styles.module.scss";
import { SkillTimelineGroup } from "./skill-timeline-group";

interface SkillTimelineProps {
  groups?: SkillGrouping[];
}

export const SkillTimeline = ({
  groups = skillGroupings,
}: SkillTimelineProps) => {
  return (
    <div className={styles.timeline}>
      {groups.map((group, index) => (
        <SkillTimelineGroup
          grouping={group}
          isLast={index === groups.length - 1}
          key={group.id}
        />
      ))}
    </div>
  );
};
