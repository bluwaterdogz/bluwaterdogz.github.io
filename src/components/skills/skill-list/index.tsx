import { Skill } from "../../../service/skill/types";
import styles from "./styles.module.scss";
import { SkillItem } from "../skill-item";
import { Loader } from "../../common/loader";

interface SkillListProps {
  skills: Skill[];
  loading?: boolean;
}
export const SkillList = (props: SkillListProps) => {
  const { skills, loading } = props;
  return (
    <div className={styles.skillList}>
      {loading && skills == null ? (
        <Loader />
      ) : (
        skills.map((skill: Skill) => (
          <SkillItem skill={skill} key={skill.name} />
        ))
      )}
    </div>
  );
};
