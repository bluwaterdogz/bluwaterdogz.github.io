import { ProjectContent } from "./project-content";
import { ProjectHeader } from "./project-header";
import { PageShell } from "../common/page-shell";
import { projects } from "../../service/project/data";
import { Navigate } from "react-router-dom";
import styles from "./styles.module.scss";

interface ProjectProps {
  id: string;
}
export const Project = ({ id }: ProjectProps) => {
  const project = projects.find((item) => item.id === id);

  if (project == null) {
    return <Navigate replace to="/404" />;
  }

  return (
    <PageShell
      className={styles.projectPage}
      contentClassName={styles.pageContainer}
    >
      <ProjectHeader project={project} />
      <ProjectContent project={project} />
    </PageShell>
  );
};
