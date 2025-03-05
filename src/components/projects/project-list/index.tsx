import styles from "./styles.module.scss";
import { useEffect } from "react";
import { useProjectStore } from "../../../service/project/ProjectStore";
import { Loader } from "../../common/loader";
import { ProjectItem } from "../project-item";

export const ProjectList = () => {
  const { projects, fetchProjectList, loadingList } = useProjectStore();

  useEffect(() => {
    fetchProjectList();
  }, []);
  return (
    <div className={styles.projectList}>
      {loadingList ? (
        <Loader />
      ) : (
        projects?.map((project) => (
          <ProjectItem
            project={project}
            className={styles.projectItem}
            key={project.id}
          />
        ))
      )}
    </div>
  );
};
