import { useTranslation } from "react-i18next";
import { LocalizedProject } from "../../../service/project/types";
import { getSkillsForProject } from "../../../service/project/selectors";
import styles from "./styles.module.scss";
import { Link } from "react-router-dom";
import { SkillPills } from "../../common/skill-pills";

interface ProjectItemProps {
  project: LocalizedProject;
}

export const ProjectItem = ({ project }: ProjectItemProps) => {
  const { t } = useTranslation();
  const projectSkills = getSkillsForProject(project).slice(0, 3);

  return (
    <article className={styles.project}>
      <Link
        aria-label={t("projects.viewProject", { name: project.name })}
        className={styles.card}
        to={`/project/${project.id}`}
      >
        <div className={styles.imageWrapper}>
          <img
            alt=""
            className={styles.projectImage}
            src={project.img ?? "/images/projects/faro/dark_spiral.jpg"}
          />
        </div>
        <div className={styles.projectDetails}>
          <h2>{project.name.trim()}</h2>
          <p>{t(`data.projects.description.${project.id}`)}</p>
          <div className={styles.footer}>
            <SkillPills
              ariaLabel={t("projects.technologies", { name: project.name })}
              className={styles.skillPills}
              linkTo={null}
              skills={projectSkills}
            />
          </div>
        </div>
      </Link>
    </article>
  );
};
