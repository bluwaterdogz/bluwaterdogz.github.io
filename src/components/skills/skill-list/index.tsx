import { Skill } from "../../../service/skill/types";
import styles from "./styles.module.scss";
import { SkillItem } from "../skill-item";

interface SkillListProps {
  skills: Skill[];
}
export const SkillList = ({ skills }: SkillListProps) => (
  <div className={styles.skillList}>
    {skills?.map((skill: Skill) => (
      <SkillItem skill={skill} key={skill.name} />
    ))}
  </div>
);
