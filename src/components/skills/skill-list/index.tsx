import { Skill } from "../../../service/skill/types";
import styles from "./styles.module.scss";
import { SkillItem } from "../skill-item";
import { DynamicList } from "../../common/dynamic-list";

interface SkillListProps {
  skills: Skill[];
  loading?: boolean;
}
export const SkillList = (props: SkillListProps) => {
  const { skills, loading = false } = props;
  return (
    <div className={styles.skillList}>
      <DynamicList<Skill>
        loading={loading}
        data={skills}
        renderListItem={(skill: Skill) => (
          <SkillItem skill={skill} key={skill.name} />
        )}
      />
    </div>
  );
};
