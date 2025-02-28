import { useEffect } from "react";
import { useProjectStore } from "../../service/project/ProjectStore";
import styles from "./styles.module.scss";
import { Link } from "react-router";
import { Loader } from "../../components/loader";
export const ProjectsPage = () => {
  const { projects, fetchProjectList, loadingList } = useProjectStore();
  useEffect(() => {
    fetchProjectList();
  }, []);
  return (
    <div className={styles.content}>
      <div className={styles.projectList}>
        {loadingList ? (
          <Loader />
        ) : (
          projects?.map((p) => (
            <Link to={`/project/${p.id}`} className={styles.project} key={p.id}>
              <div className={styles.projectDetails}>
                <h3>{p.name}</h3>
              </div>
              <div
                className={styles.projectImage}
                style={{
                  backgroundImage: 'url("https://placedog.net/500")',
                  backgroundOrigin: "center",
                  backgroundSize: "cover",
                }}
              ></div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
};
