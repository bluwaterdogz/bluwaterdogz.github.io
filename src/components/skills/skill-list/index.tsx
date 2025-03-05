import { Skill } from "../../../service/skill/types";
import { Link } from "react-router";
import styles from "./styles.module.scss";

interface SkillListProps {
  skills: Skill[];
}
export const SkillList = ({ skills }: SkillListProps) => (
  <div className={styles.skillList}>
    {skills?.map((skill: Skill) => (
      <div className={styles.skill} key={skill.name}>
        <i className={`${skill.icon} ${styles.icon}`}></i>
        <h3 className={styles.name}>{skill.name}</h3>
        <p className={styles.detail}>{skill.level} years</p>

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
    ))}
  </div>
);
