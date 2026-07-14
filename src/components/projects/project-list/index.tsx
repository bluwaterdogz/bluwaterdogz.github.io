import Fuse from "fuse.js";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { CallToAction } from "../../common/call-to-action";
import { DynamicList } from "../../common/dynamic-list";
import { useProjectStore } from "../../../service/project/ProjectStore";
import { Project } from "../../../service/project/types";
import { ProjectEmployer } from "../../../service/project/types";
import {
  filterProjectsByCategory,
  ProjectCategory,
} from "../../../service/project/selectors";
import { ProjectItem } from "../project-item";
import { TopBar } from "../top-bar";
import styles from "./styles.module.scss";
import { PageHeading } from "../../common/page-heading";

export const ProjectList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { projects, fetchProjectList, loadingList } = useProjectStore();
  const [activeCategory, setActiveCategory] =
    useState<ProjectCategory>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const requestedEmployer = searchParams.get("job") as ProjectEmployer | null;
  const [activeEmployer, setActiveEmployer] = useState<
    ProjectEmployer | "all"
  >(requestedEmployer ?? "all");
  const { t } = useTranslation();

  useEffect(() => {
    fetchProjectList();
  }, [fetchProjectList]);

  useEffect(() => {
    setActiveEmployer(requestedEmployer ?? "all");
  }, [requestedEmployer]);

  const handleEmployerChange = (employer: ProjectEmployer | "all") => {
    setActiveEmployer(employer);
    const nextParams = new URLSearchParams(searchParams);
    if (employer === "all") nextParams.delete("job");
    else nextParams.set("job", employer);
    setSearchParams(nextParams, { replace: true });
  };

  const formattedProjects = useMemo(
    () =>
      projects.map((project) => ({
        ...project,
        content: t(`data.projects.content.${project.id}`),
        description: t(`data.projects.description.${project.id}`),
      })),
    [projects, t]
  );

  const filteredProjects = useMemo(() => {
    const categoryFiltered = filterProjectsByCategory(
      formattedProjects,
      activeCategory
    );

    const employerFiltered =
      activeEmployer === "all"
        ? categoryFiltered
        : categoryFiltered.filter(
            (project) => project.employer === activeEmployer
          );

    if (searchTerm.trim() === "") return employerFiltered;

    const fuse = new Fuse(employerFiltered, {
      keys: [{ name: "name", weight: 2 }, "description", "content"],
    });

    return fuse.search(searchTerm).map((result) => result.item);
  }, [activeCategory, activeEmployer, formattedProjects, searchTerm]);

  return (
    <>
      <div className={styles.header}>
        <PageHeading
          className={styles.introduction}
          description={t("projects.introduction")}
          eyebrow={t("projects.eyebrow")}
          title={t("projects.title")}
        />
        <TopBar
          activeCategory={activeCategory}
          activeEmployer={activeEmployer}
          onCategoryChange={setActiveCategory}
          onEmployerChange={handleEmployerChange}
          onSearchChange={setSearchTerm}
          searchTerm={searchTerm}
        />
      </div>
      <div className={styles.projectList}>
        <DynamicList<Project>
          data={filteredProjects}
          loading={loadingList}
          renderListItem={(project) => (
            <ProjectItem key={project.id} project={project} />
          )}
        />
      </div>
      <CallToAction
        description={t("projects.cta.description")}
        label={t("projects.cta.label")}
        title={t("projects.cta.title")}
        to="/about"
      />
    </>
  );
};
