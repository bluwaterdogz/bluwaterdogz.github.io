import { ProjectContent } from "./project-content";
import { ProjectHeader } from "./project-header";
import { useProjectStore } from "../../service/project/ProjectStore";
import { useEffect } from "react";
import { Loader } from "../common/loader";
import { PageShell } from "../common/page-shell";
import styles from "./styles.module.scss";

interface ProjectProps {
  id: string;
}
export const Project = ({ id }: ProjectProps) => {
  const { project, fetchProject, loading } = useProjectStore();

  useEffect(() => {
    fetchProject(id);
  }, [fetchProject, id]);

  if (loading || project == null) {
    return (
      <main>
        <Loader />
      </main>
    );
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
