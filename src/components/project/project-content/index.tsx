import { useTranslation } from "react-i18next";
import { Project } from "../../../service/project/types";
import styles from "./styles.module.scss";
import { ProjectStory } from "../project-story";
import { getSkillsForProject } from "../../../service/project/selectors";
import { SkillPills } from "../../common/skill-pills";

interface ProjectContentProps {
  project: Project;
}

export const ProjectContent = ({ project }: ProjectContentProps) => {
  const { t } = useTranslation();
  const additionalSkills = getSkillsForProject(project).slice(5);
  return (
    <section className={styles.projectContent}>
      <div className={styles.container}>
        <ProjectStory project={project} />
        {additionalSkills.length > 0 && (
          <aside className={styles.additionalSkills}>
            <p>{t("projects.detail.additionalTechnologies")}</p>
            <SkillPills
              ariaLabel={t("projects.technologies", {
                name: t(project.nameKey),
              })}
              className={styles.skillList}
              linkTo={null}
              skills={additionalSkills}
            />
          </aside>
        )}
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
