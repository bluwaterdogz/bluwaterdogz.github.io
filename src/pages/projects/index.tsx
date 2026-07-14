import { ProjectList } from "../../components/projects/project-list";
import styles from "./styles.module.scss";
import { PageShell } from "../../components/common/page-shell";

export const ProjectsPage = () => {
  return (
    <PageShell className={styles.projectsPage}>
      <ProjectList />
    </PageShell>
  );
};
