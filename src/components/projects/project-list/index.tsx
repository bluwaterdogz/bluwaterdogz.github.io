import Fuse from "fuse.js";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { projects } from "../../../service/project/data";
import { filterProjects } from "../../../service/project/selectors";
import { TopBar } from "../top-bar";
import styles from "./styles.module.scss";
import { PageHeading } from "../../common/page-heading";
import { githubProfileUrl } from "../../../service/consts";
import { ProjectCollection } from "./project-collection";
import { useProjectFilters } from "./use-project-filters";

export const ProjectList = () => {
  const { filters, setCategory, setEmployer, setSearchTerm, toggleSkill, clearSkills } =
    useProjectFilters();
  const { t } = useTranslation();

  const formattedProjects = useMemo(
    () =>
      projects.map((project) => ({
        ...project,
        description: t(`data.projects.description.${project.id}`),
        name: t(project.nameKey),
      })),
    [t]
  );

  const filteredProjects = useMemo(() => {
    const matchingProjects = filterProjects(formattedProjects, filters);
    if (filters.searchTerm.trim() === "") return matchingProjects;

    const fuse = new Fuse(matchingProjects, {
      keys: [{ name: "name", weight: 2 }, "description"],
    });

    return fuse.search(filters.searchTerm).map((result) => result.item);
  }, [filters, formattedProjects]);

  return (
    <>
      <div className={styles.header}>
        <PageHeading
          className={styles.introduction}
          description={t("projects.introduction")}
          eyebrow={t("projects.eyebrow")}
          title={t("projects.title")}
        >
          <a
            className={styles.githubLink}
            href={githubProfileUrl}
            rel="noreferrer"
            target="_blank"
          >
            <i className="devicon-github-original" aria-hidden="true" />
            {t("projects.github")}
            <span aria-hidden="true">&#8594;</span>
          </a>
        </PageHeading>
        <div className={styles.controls}>
          <TopBar
            activeCategory={filters.category}
            activeEmployer={filters.employer}
            onCategoryChange={setCategory}
            onEmployerChange={setEmployer}
            onSearchChange={setSearchTerm}
            searchTerm={filters.searchTerm}
            activeSkills={filters.skillIds}
            clearSkills={clearSkills}
            handleSkillChange={toggleSkill}
          />
        </div>
      </div>
      <div className={styles.projectList}>
        <ProjectCollection projects={filteredProjects} />
      </div>
    </>
  );
};
