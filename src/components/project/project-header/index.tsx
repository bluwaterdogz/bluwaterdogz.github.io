import { useTranslation } from "react-i18next";
import { Project } from "../../../service/project/types";
import { DarkOverlay } from "../../common/dark-overlay";
import styles from "./styles.module.scss";
interface ProjectHeaderProps {
  project: Project;
}

export const ProjectHeader = ({ project }: ProjectHeaderProps) => {
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
      <div className={`${styles.container} ${styles.content}`}>
        <h1 className={styles.heroHeader}>{project?.name}</h1>
        <p className={styles.heroSubheader}>
          {t(`data.projects.description.${project.id}`)}
        </p>
      </div>
    </header>
  );
};
