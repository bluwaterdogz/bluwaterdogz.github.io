import { useTranslation } from "react-i18next";
import { Project } from "../../../service/project/types";
import { DarkOverlay } from "../../common/dark-overlay";
import styles from "./styles.module.scss";
import { HTMLProps } from "react";
import { AnimationOnScroll } from "react-animation-on-scroll";
interface ProjectHeaderProps extends HTMLProps<HTMLDivElement> {
  project: Project;
}

export const ProjectHeader = (props: ProjectHeaderProps) => {
  const { project, className = "" } = props;
  const { t } = useTranslation();
  return (
    <header
      className={styles.hero}
      style={{
        backgroundImage:
          project != null
            ? `url(${project.img})`
            : 'url("https://picsum.photos/1500/800")',
      }}
    >
      <DarkOverlay />
      <div className={`${className} ${styles.container} ${styles.content}`}>
        <AnimationOnScroll
          duration={2}
          animateOnce={true}
          animateIn={`animate__fadeInUp`}
        >
          <h1 className={styles.heroHeader}>{project?.name}</h1>
          <p className={styles.heroSubheader}>
            {t(`data.projects.description.${project.id}`)}
          </p>
        </AnimationOnScroll>
      </div>
    </header>
  );
};
