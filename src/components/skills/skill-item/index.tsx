import { Skill } from "../../../service/skill/types";
import { Link } from "react-router";
import styles from "./styles.module.scss";

interface SkillItemProps {
  skill: Skill;
}
export const SkillItem = ({ skill }: SkillItemProps) => (
  <div className={styles.skill}>
    <div className={styles.iconContainer}>
      <i className={`${skill.icon} ${styles.icon}`}></i>
      <h3 className={styles.name}>{skill.name}</h3>
    </div>
    {skill.projects.length >= 1 && (
      <div className={styles.skillDetailsContainer}>
        <div className={styles.skillDetails}>
          <h4>Projects</h4>
          <hr />
          {skill.projects.map((p) => (
            <Link
              key={p.id}
              className={styles.projectLink}
              to={`/project/${p.id}`}
            >
              {p.name}
            </Link>
          ))}
        </div>
      </div>
    )}
  </div>
);
