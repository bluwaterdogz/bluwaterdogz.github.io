import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Project } from "../../../service/project/types";
import styles from "./styles.module.scss";
import { PageHeading } from "../../common/page-heading";

interface ProjectHeaderProps {
  project: Project;
}

export const ProjectHeader = ({ project }: ProjectHeaderProps) => {
  const { t } = useTranslation();

  return (
    <header className={styles.hero}>
      <div className={styles.container}>
        <PageHeading
          className={styles.copy}
          description={t(`data.projects.description.${project.id}`)}
          descriptionClassName={styles.description}
          eyebrow={t("projects.detail.eyebrow")}
          title={project.name.trim()}
        >
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
