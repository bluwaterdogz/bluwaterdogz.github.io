import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Project } from "../../../service/project/types";
import styles from "./styles.module.scss";
import { PageHeading } from "../../common/page-heading";
import { getSkillsForProject } from "../../../service/project/selectors";
import { SkillPills } from "../../common/skill-pills";

interface ProjectHeaderProps {
  project: Project;
}

export const ProjectHeader = ({ project }: ProjectHeaderProps) => {
  const { t } = useTranslation();
  const projectSkills = getSkillsForProject(project);
  const projectName = t(project.nameKey);

  return (
    <header className={styles.hero}>
      <div className={styles.container}>
        <PageHeading
          className={styles.copy}
          description={t(`data.projects.stories.${project.id}.kicker`)}
          descriptionClassName={styles.description}
          eyebrow={t("projects.detail.eyebrow")}
          title={projectName}
        >
          <p className={styles.summary}>
            {t(`data.projects.stories.${project.id}.summary`)}
          </p>
          <SkillPills
            ariaLabel={t("projects.technologies", { name: projectName })}
            className={styles.skills}
            skills={projectSkills}
          />
          <Link className={styles.backLink} to="/projects">
            <span aria-hidden="true">&#8592;</span>
            {t("projects.detail.back")}
          </Link>
        </PageHeading>
        <img
          alt=""
          className={styles.image}
          src={project.img ?? "/images/projects/faro/dark_spiral.jpg"}
        />
      </div>
    </header>
  );
};
