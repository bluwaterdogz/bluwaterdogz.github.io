import { skills } from "../skill/data";
import { Skill } from "../skill/types";
import { projects } from "./data";
import { Project, ProjectEmployer } from "./types";

export type ProjectCategory = "all" | "backend" | "data" | "mobile" | "web";

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

export const filterProjectsByCategory = (
  items: Project[],
  category: ProjectCategory
) =>
  category === "all"
    ? items
    : items.filter((project) =>
        categoryProjectIds[category].includes(project.id)
      );

export const getProjectsForSkill = (skillId: string) =>
  projects
    .filter((project) => project.skills.includes(skillId))
    .map(({ id, name }) => ({ id, name: name.trim() }));

export const getSkillsForProject = (project: Project): Skill[] =>
  skills.filter((skill) => project.skills.includes(skill.id));
