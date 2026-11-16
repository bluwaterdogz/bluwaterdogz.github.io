import Fuse from "fuse.js";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { DynamicList } from "../../common/dynamic-list";
import { useProjectStore } from "../../../service/project/ProjectStore";
import {
  LocalizedProject,
  ProjectEmployer,
} from "../../../service/project/types";
import {
  filterProjectsByCategory,
  ProjectCategory,
} from "../../../service/project/selectors";
import { ProjectItem } from "../project-item";
import { TopBar } from "../top-bar";
import styles from "./styles.module.scss";
import { PageHeading } from "../../common/page-heading";
import { skills } from "../../../service/skill/data";
import { SkillFilter } from "../skill-filter";
import { githubProfileUrl } from "../../../service/consts";

export const ProjectList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { projects, fetchProjectList, loadingList } = useProjectStore();
  const [activeCategory, setActiveCategory] =
    useState<ProjectCategory>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const requestedEmployer = searchParams.get("job") as ProjectEmployer | null;
  const activeSkills = searchParams
    .getAll("skill")
    .filter((skillId) => skills.some(({ id }) => id === skillId));
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

  const handleSkillChange = (skillId: string) => {
    const nextParams = new URLSearchParams(searchParams);
    const nextSkills = activeSkills.includes(skillId)
      ? activeSkills.filter((activeSkill) => activeSkill !== skillId)
      : [...activeSkills, skillId];
    nextParams.delete("skill");
    nextSkills.forEach((activeSkill) => nextParams.append("skill", activeSkill));
    setSearchParams(nextParams, { replace: true });
  };

  const clearSkills = () => {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.delete("skill");
    setSearchParams(nextParams, { replace: true });
  };

  const formattedProjects = useMemo(
    () =>
      projects.map((project) => ({
        ...project,
        description: t(`data.projects.description.${project.id}`),
        name: t(project.nameKey),
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

    const skillFiltered = activeSkills.length > 0
      ? employerFiltered.filter((project) =>
          activeSkills.every((skillId) => project.skills.includes(skillId))
        )
      : employerFiltered;

    if (searchTerm.trim() === "") return skillFiltered;

    const fuse = new Fuse(skillFiltered, {
      keys: [{ name: "name", weight: 2 }, "description"],
    });

    return fuse.search(searchTerm).map((result) => result.item);
  }, [
    activeCategory,
    activeEmployer,
    activeSkills,
    formattedProjects,
    searchTerm,
  ]);

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
            activeCategory={activeCategory}
            activeEmployer={activeEmployer}
            onCategoryChange={setActiveCategory}
            onEmployerChange={handleEmployerChange}
            onSearchChange={setSearchTerm}
            searchTerm={searchTerm}
          />
          <SkillFilter
            activeSkillIds={activeSkills}
            label={t("projects.skills.label")}
            onClear={clearSkills}
            onToggle={handleSkillChange}
          />
        </div>
      </div>
      <div className={styles.projectList}>
        <DynamicList<LocalizedProject>
          data={filteredProjects}
          loading={loadingList}
          renderListItem={(project) => (
            <ProjectItem key={project.id} project={project} />
          )}
        />
      </div>
    </>
  );
};
