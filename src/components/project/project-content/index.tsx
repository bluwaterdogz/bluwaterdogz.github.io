import { useTranslation } from "react-i18next";
import { Project } from "../../../service/project/types";
import styles from "./styles.module.scss";
import { useEffect } from "react";
import { useSkillsStore } from "../../../service/skill/SkillStore";
import { Link } from "react-router";

interface ProjectContentProps {
  project: Project;
}

export const ProjectContent = ({ project }: ProjectContentProps) => {
  const { t } = useTranslation();

  const { skills, fetchSkills } = useSkillsStore();

  useEffect(() => {
    fetchSkills(project?.skills);
  }, [project]);

  return (
    <section id="explore" className={styles.content}>
      <div className={styles.container}>
        <div className={styles.textBlock}>
          <div
            className={styles.textContent}
            dangerouslySetInnerHTML={{
              __html: t(`data.projects.content.${project.id}`),
            }}
          ></div>
        </div>
        <div className={styles.textBlock}>
          {skills?.map((skill) => (
            <Link key={skill.name} to={`/skills?skillType=${skill.type}`}>
              <div className={styles.skill}>
                <i className={`${skill.icon} ${styles.icon}`}></i>
                <p className={styles.name}>{skill.name}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
