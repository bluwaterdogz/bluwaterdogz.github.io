import { useNavigate, useParams } from "react-router-dom";
import { useProjectStore } from "../../service/project/ProjectStore";
import { useCallback, useEffect } from "react";
import styles from "./styles.module.scss";
import { Loader } from "../../components/loader";
import { useSkillsStore } from "../../service/skill/SkillStore";

export const ProjectPage = () => {
  const { id } = useParams();
  if (id == null) {
    const navigate = useNavigate();
    navigate("/404");
  }
  const { project, fetchProject } = useProjectStore();
  const { skills, fetchSkills } = useSkillsStore();
  const init = useCallback(async () => {
    await fetchProject(id!);
  }, []);

  useEffect(() => {
    init();
  }, [init]);

  useEffect(() => {
    fetchSkills(project?.skills);
  }, [project]);

  return (
    <div>
      {project == null ? (
        <Loader />
      ) : (
        <>
          <header
            className={styles.hero}
            style={{
              backgroundImage:
                project != null
                  ? `url(${project.img})`
                  : 'url("https://picsum.photos/1500/800")',
            }}
          >
            <div className={styles.container}>
              <h1 className={styles.heroHeader}>{project?.name}</h1>
              <p className={styles.heroSubheader}>{project?.description}</p>
              <a href="#explore" className={styles.heroButton}>
                Explore Now
              </a>
            </div>
          </header>

          <section id="explore" className={styles.content}>
            <div className={styles.container}>
              <div className={styles.textBlock}>
                {project?.content.map((d, i) => (
                  <div key={i}>{d}</div>
                ))}
              </div>
              <div className={styles.textBlock}>
                {skills?.map((skill) => (
                  <div className={styles.skill} key={skill.name}>
                    <i className={`${skill.icon} ${styles.icon}`}></i>
                    <p className={styles.name}>{skill.name}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  );
};
