import { useNavigate, useParams } from "react-router-dom";
import { useProjectStore } from "../../service/project/ProjectStore";
import { useEffect } from "react";
import styles from "./styles.module.scss";

export const ProjectPage = () => {
  const { id } = useParams();
  if (id == null) {
    const navigate = useNavigate();
    navigate("/404");
  }
  const { project, fetchProject } = useProjectStore();
  useEffect(() => {
    fetchProject(id!);
  }, []);

  return (
    <div>
      <h2 className={styles.title}>{project?.name}</h2>
    </div>
  );
};
