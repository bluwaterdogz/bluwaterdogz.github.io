import styles from "./styles.module.scss";
import { useCallback, useEffect, useMemo } from "react";
import { useProjectStore } from "../../../service/project/ProjectStore";
import { Loader } from "../../common/loader";
import { ProjectItem } from "../project-item";
import Fuse from "fuse.js";
import { Project } from "../../../service/project/types";
import { TopBar } from "../top-bar";
import { useTranslation } from "react-i18next";
import { DynamicList } from "../../common/dynamic-list";

export const ProjectList = () => {
  const { projects, fetchProjectList, loadingList, searchTerm, filters } =
    useProjectStore();

  useEffect(() => {
    fetchProjectList();
  }, []);

  const { t } = useTranslation();

  const skillFilterMap = useMemo(
    () => new Map(filters.skills.map((x) => [x.value, true])),
    [filters.skills]
  );

  const filterProjects = useCallback(
    (project: Project) => {
      if (filters.skills.length <= 0) {
        return true;
      }

      return (
        project.skills.filter((skill) => skillFilterMap.has(skill)).length ===
        filters.skills.length
      );
    },
    [projects, skillFilterMap]
  );

  const formatProjects = useCallback(
    (project: Project) => ({
      ...project,
      description: t(`data.projects.description.${project.id}`),
      content: t(`data.projects.content.${project.id}`),
    }),
    []
  );

  const formattedProjectList = useMemo(
    () => projects.filter(filterProjects).map(formatProjects),
    [projects, skillFilterMap]
  );

  const searchedProjectList: Project[] = useMemo(() => {
    const hasSearchTerm = searchTerm != null && searchTerm != "";

    if (!hasSearchTerm) {
      return formattedProjectList;
    }

    const options = {
      includeScore: true,
      keys: [{ name: "name", weight: 2 }, "description", "content"],
    };

    const fuse = new Fuse(formattedProjectList, options);
    const results = fuse?.search(searchTerm!);

    return results.map((result) => result.item) as any as Project[];
  }, [formattedProjectList, searchTerm]);

  return (
    <>
      <TopBar />
      <div className={styles.projectList}>
        <DynamicList<Project>
          loading={loadingList}
          data={searchedProjectList}
          renderListItem={(project: Project) => (
            <ProjectItem
              project={project}
              className={styles.projectItem}
              key={project.id}
            />
          )}
        />
      </div>
    </>
  );
};
