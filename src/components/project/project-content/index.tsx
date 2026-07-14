import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Project } from "../../../service/project/types";
import { CallToAction } from "../../common/call-to-action";
import styles from "./styles.module.scss";
import { getSkillsForProject } from "../../../service/project/selectors";
import { getSkillSectionId } from "../../../service/skill/data";

interface ProjectContentProps {
  project: Project;
}

export const ProjectContent = ({ project }: ProjectContentProps) => {
  const { t } = useTranslation();
  const projectSkills = getSkillsForProject(project);

  return (
    <section className={styles.projectContent}>
      <div className={styles.container}>
        <article
          className={styles.textContent}
          dangerouslySetInnerHTML={{
            __html: t(`data.projects.content.${project.id}`, ""),
          }}
        />
        <aside className={styles.skills}>
          <h2>Built with</h2>
          <div className={styles.skillList}>
            {projectSkills.map((skill) => (
              <Link key={skill.id} to={`/skills?skillType=${getSkillSectionId(skill.id)}`}>
                <i className={skill.icon} aria-hidden="true" />
                <span>{skill.name}</span>
              </Link>
            ))}
          </div>
        </aside>
        {project.quotes.map((quote) => (
          <blockquote className={styles.quote} key={quote.text}>
            <p>{quote.text}</p>
            {quote.author != null && <cite>{quote.author}</cite>}
          </blockquote>
        ))}
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
        <CallToAction
          description="I'm always open to interesting projects and collaborations."
          label="Let's build something"
          title="Have an idea in mind?"
          to="/about"
        />
      </div>
    </section>
  );
};
