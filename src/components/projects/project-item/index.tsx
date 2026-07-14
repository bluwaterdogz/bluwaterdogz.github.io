import { useTranslation } from "react-i18next";
import { Project } from "../../../service/project/types";
import { getSkillsForProject } from "../../../service/project/selectors";
import styles from "./styles.module.scss";
import { LinkedCard } from "../../common/linked-card";
import { TagList } from "../../common/tag-list";

interface ProjectItemProps {
  project: Project;
}

export const ProjectItem = ({ project }: ProjectItemProps) => {
  const { t } = useTranslation();
  const projectSkills = getSkillsForProject(project).slice(0, 3);

  return (
    <LinkedCard
      ariaLabel={t("projects.viewProject", { name: project.name })}
      className={styles.projectLink}
      to={`/project/${project.id}`}
    >
      <article className={styles.project}>
        <div className={styles.imageLink}>
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
            <TagList
              ariaLabel={t("projects.technologies", { name: project.name })}
              items={projectSkills.map(({ id, name }) => ({ id, label: name }))}
            />
            <span className={styles.arrow} aria-hidden="true">
              &#8594;
            </span>
          </div>
        </div>
      </article>
    </LinkedCard>
  );
};
