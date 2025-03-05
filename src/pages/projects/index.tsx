import styles from "./styles.module.scss";
import { ProjectList } from "../../components/projects/project-list";

export const ProjectsPage = () => {
  return (
    <div className={styles.content}>
      <ProjectList />
    </div>
  );
};
