import { SkillTypeList } from "../../components/skills/skill-type-list";
import styles from "./styles.module.scss";
export const SkillsPage = () => {
  return (
    <div className={styles.content}>
      <SkillTypeList />
    </div>
  );
};
