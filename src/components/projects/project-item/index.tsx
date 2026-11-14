import { useTranslation } from "react-i18next";
import { Project } from "../../../service/project/types";
import { getSkillsForProject } from "../../../service/project/selectors";
import styles from "./styles.module.scss";
import { Link } from "react-router-dom";
import { SkillPills } from "../../common/skill-pills";

interface ProjectItemProps {
  project: Project;
}

export const ProjectItem = ({ project }: ProjectItemProps) => {
  const { t } = useTranslation();
  const projectSkills = getSkillsForProject(project).slice(0, 3);

  return (
    <article className={styles.project}>
      <Link
        aria-label={t("projects.viewProject", { name: project.name })}
        className={styles.imageLink}
        to={`/project/${project.id}`}
      >
          <img
            alt=""
            className={styles.projectImage}
            src={project.img ?? "/images/projects/faro/dark_spiral.jpg"}
          />
      </Link>
        <div className={styles.projectDetails}>
        <h2>
          <Link className={styles.titleLink} to={`/project/${project.id}`}>
            {project.name.trim()}
          </Link>
        </h2>
          <p>{t(`data.projects.description.${project.id}`)}</p>
          <div className={styles.footer}>
          <SkillPills
              ariaLabel={t("projects.technologies", { name: project.name })}
            className={styles.skillPills}
            skills={projectSkills}
            />
          <Link
            aria-label={t("projects.viewProject", { name: project.name })}
            className={styles.arrow}
            to={`/project/${project.id}`}
          >
              &#8594;
          </Link>
          </div>
        </div>
    </article>
  );
};
