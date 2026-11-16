import { Project } from "../../../service/project/types";
import styles from "./styles.module.scss";
import { ProjectStory } from "../project-story";

interface ProjectContentProps {
  project: Project;
}

export const ProjectContent = ({ project }: ProjectContentProps) => {
  return (
    <section className={styles.projectContent}>
      <div className={styles.container}>
        <ProjectStory project={project} />
        <div className={styles.previews}>
          {project.previewVideos?.map((url) => (
            <video
              autoPlay
              className={styles.previewVideo}
              controls={false}
              key={url}
              loop
              muted
              src={url}
            />
          ))}
          {project.previewImgs?.map((imgSrc) => (
            <img alt="" className={styles.previewImg} key={imgSrc} src={imgSrc} />
          ))}
        </div>
      </div>
    </section>
  );
};
