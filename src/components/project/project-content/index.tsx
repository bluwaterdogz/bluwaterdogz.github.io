import { useTranslation } from "react-i18next";
import { Project } from "../../../service/project/types";
import styles from "./styles.module.scss";
import { HTMLProps, useEffect } from "react";
import { useSkillsStore } from "../../../service/skill/SkillStore";
import { Link } from "react-router";
import { Loader } from "../../common/loader";

interface ProjectContentProps extends HTMLProps<HTMLDivElement> {
  project: Project;
}

export const ProjectContent = (props: ProjectContentProps) => {
  const { project, className = "" } = props;
  const { t } = useTranslation();

  const { skills, fetchSkills, loading } = useSkillsStore();

  useEffect(() => {
    fetchSkills(project?.skills);
  }, [project]);

  return (
    <section className={`${className} ${styles.projectContent}`}>
      <div className={styles.container}>
        <div className={styles.textBlock}>
          <div
            className={styles.textContent}
            dangerouslySetInnerHTML={{
              __html: t(`data.projects.content.${project.id}`, ""),
            }}
          ></div>
          <div className={styles.textBlock}>
            {loading ? (
              <Loader />
            ) : (
              skills?.map((skill) => (
                <Link key={skill.name} to={`/skills?skillType=${skill.type}`}>
                  <div className={styles.skill}>
                    <i className={`${skill.icon} ${styles.icon}`}></i>
                    <p className={styles.name}>{skill.name}</p>
                  </div>
                </Link>
              ))
            )}
          </div>
          {project.quotes.length > 0 && (
            <div className={styles.quotes}>
              {project.quotes.map((q) => (
                <div className={styles.quote}>
                  <p className={styles.text}>{q.text}</p>
                  {q.author != null && (
                    <p className={styles.author}>{q.author}</p>
                  )}
                </div>
              ))}
            </div>
          )}
          <div className={styles.previews}>
            {project.previewVideos?.map((url) => {
              return (
                <video
                  loop
                  muted
                  controls={false}
                  autoPlay
                  src={url}
                  className={styles.previewVideo}
                  key={url + project.id}
                ></video>
              );
            })}
            {project.previewImgs?.map((imgSrc) => (
              <img src={imgSrc} width="100%" className={styles.previewImg} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
