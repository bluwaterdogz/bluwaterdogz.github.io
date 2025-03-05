import styles from "./styles.module.scss";
import { Link } from "react-router";
import { useTranslation } from "react-i18next";
import { Project } from "../../../service/project/types";
interface ProjectItemProps {
  project: Project;
  className?: string;
}
export const ProjectItem = ({ project, className = "" }: ProjectItemProps) => {
  const { t } = useTranslation();
  return (
    <Link
      to={`/project/${project.id}`}
      className={`${styles.project} ${className}`}
      key={project.id}
    >
      <div className={styles.projectDetails}>
        <h2>{project.name}</h2>
        <p>{t(`data.projects.description.${project.id}`)}</p>
      </div>
      <div
        className={styles.projectImage}
        style={{
          backgroundImage: `url("${
            project.img || "https://placedog.net/500"
          }")`,
          backgroundOrigin: "center",
          backgroundSize: "cover",
        }}
      ></div>
    </Link>
  );
};
