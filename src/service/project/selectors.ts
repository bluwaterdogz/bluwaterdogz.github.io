import { skills } from "../skill/data";
import { Skill } from "../skill/types";
import { Project, ProjectEmployer } from "./types";

export type ProjectCategory = "all" | "backend" | "data" | "mobile" | "web";

export interface ProjectFilters {
  category: ProjectCategory;
  employer: ProjectEmployer | "all";
  searchTerm: string;
  skillIds: string[];
}

export const projectEmployers: Array<ProjectEmployer | "all"> = [
  "all",
  "mobian",
  "faro",
  "independent",
  "various",
  "launchBrigade",
];

const categoryProjectIds: Record<Exclude<ProjectCategory, "all">, string[]> = {
  backend: ["1", "5", "6", "8", "9", "10", "11", "12"],
  data: ["1", "5", "9", "10", "11"],
  mobile: [],
  web: ["1", "2", "3", "4", "7", "8", "9", "11", "12"],
};

export const filterProjectsByCategory = <T extends Project>(
  items: T[],
  category: ProjectCategory
): T[] =>
  category === "all"
    ? items
    : items.filter((project) =>
        categoryProjectIds[category].includes(project.id)
      );

export const getSkillsForProject = (project: Project): Skill[] =>
  skills.filter((skill) => project.skills.includes(skill.id));

export const filterProjects = <T extends Project>(
  items: T[],
  filters: ProjectFilters
): T[] => {
  const categoryMatches = filterProjectsByCategory(items, filters.category);
  return categoryMatches.filter((project) => {
    const matchesEmployer =
      filters.employer === "all" || project.employer === filters.employer;
    const matchesSkills = filters.skillIds.every((skillId) =>
      project.skills.includes(skillId)
    );
    return matchesEmployer && matchesSkills;
  });
};
