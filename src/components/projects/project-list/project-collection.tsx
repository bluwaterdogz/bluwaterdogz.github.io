import { useTranslation } from "react-i18next";
import { LocalizedProject } from "../../../service/project/types";
import { ProjectItem } from "../project-item";

interface ProjectCollectionProps {
  projects: LocalizedProject[];
}

export const ProjectCollection = ({ projects }: ProjectCollectionProps) => {
  const { t } = useTranslation();

  if (projects.length === 0) {
    return <h2>{t("common.noneFound")}</h2>;
  }

  return projects.map((project) => (
    <ProjectItem key={project.id} project={project} />
  ));
};
