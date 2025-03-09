import { Skill } from "../../../service/skill/types";
import { Link } from "react-router";
import styles from "./styles.module.scss";
import { useRef, useState } from "react";
import { useOutsideClick } from "../../../hooks/useOutsideClick";

interface SkillItemProps {
  skill: Skill;
}
export const SkillItem = ({ skill }: SkillItemProps) => {
  const [projectListOpen, setProjectListOpen] = useState(false);
  const ref = useRef(null);
  useOutsideClick(ref, () => {
    setProjectListOpen(false);
  });
  return (
    <div className={styles.skill} ref={ref}>
      <div
        className={styles.iconContainer}
        onClick={() => setProjectListOpen(!projectListOpen)}
      >
        <i className={`${skill.icon} ${styles.icon}`}></i>
        <h3 className={styles.name}>{skill.name}</h3>
      </div>
      {skill.projects.length >= 1 && (
        <div
          className={`${styles.skillDetailsContainer} ${
            projectListOpen ? styles.open : ""
          }`}
        >
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
};
