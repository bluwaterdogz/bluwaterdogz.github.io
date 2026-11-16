import { Skill, SkillGrouping, SkillSection } from "./types";

export const skills: Skill[] = [
  { id: "1", icon: "devicon-python-plain" },
  { id: "2", icon: "devicon-javascript-plain" },
  { id: "3", icon: "devicon-typescript-plain" },
  { id: "4", icon: "devicon-nodejs-plain-wordmark" },
  { id: "5", icon: "devicon-postgresql-plain" },
  { id: "6", icon: "devicon-php-plain" },
  { id: "7", icon: "devicon-html5-plain" },
  { id: "8", icon: "devicon-sass-plain" },
  { id: "9", icon: "devicon-react-original" },
  { id: "10", icon: "devicon-angular-plain" },
  { id: "11", icon: "devicon-express-original" },
  { id: "12", icon: "devicon-flask-original" },
  { id: "13", icon: "devicon-rxjs-plain" },
  { id: "14", icon: "devicon-vuejs-plain" },
  { id: "15", icon: "devicon-storybook-plain" },
  { id: "16", icon: "devicon-vite-original" },
  { id: "17", icon: "devicon-git-plain" },
  { id: "18", icon: "devicon-webpack-plain" },
  { id: "19", icon: "devicon-azure-plain" },
  { id: "20", icon: "devicon-githubactions-plain" },
  { id: "21", icon: "devicon-photoshop-plain" },
  { id: "22", icon: "devicon-bootstrap-plain" },
  { id: "23", icon: "devicon-figma-plain" },
  { id: "24", icon: "devicon-nextjs-plain" },
  { id: "25", icon: "devicon-materialui-plain" },
  { id: "26", icon: "devicon-fastapi-plain" },
  { id: "27", icon: "fa fa-search" },
  { id: "28", icon: "devicon-redis-plain" },
  { id: "29", icon: "devicon-amazonwebservices-plain-wordmark" },
  { id: "30", icon: "fa fa-snowflake-o" },
  { id: "31", icon: "fa fa-circle-o-notch" },
  { id: "32", icon: "devicon-docker-plain" },
  { id: "33", icon: "devicon-jest-plain" },
  { id: "34", icon: "devicon-playwright-plain" },
  { id: "35", icon: "devicon-terraform-plain" },
  { id: "36", icon: "devicon-cypressio-plain" },
  { id: "37", icon: "fa fa-line-chart" },
  { id: "38", icon: "fa fa-magic" },
  { id: "39", icon: "devicon-github-original" },
  { id: "40", icon: "fa fa-comments" },
  { id: "41", icon: "fa fa-terminal" },
];

export const skillGroupings: SkillGrouping[] = [
  { id: "frameworks", i18nKey: "Frameworks", skillIds: ["9", "10", "11", "12", "13", "14", "24", "25"] },
  { id: "languages", i18nKey: "Languages", skillIds: ["1", "2", "3", "6"] },
  { id: "backend-data", i18nKey: "BackendData", skillIds: ["4", "5", "26", "27", "28"] },
  { id: "frontend", i18nKey: "Frontend", skillIds: ["9", "24", "7", "8", "25"] },
  { id: "dev-tools", i18nKey: "DevTools", skillIds: ["15", "16", "17", "18", "27", "28", "30", "31", "32", "33", "34", "36", "38", "39", "40", "41"] },
  { id: "cloud-tools", i18nKey: "CloudTools", skillIds: ["29", "32", "17", "33", "31", "30"] },
  { id: "it", i18nKey: "IT", skillIds: ["19", "20", "29", "35", "37"] },
  { id: "design", i18nKey: "Design", skillIds: ["21", "22", "23"] },
];

export const skillSections: SkillSection[] = [
  { id: "development", i18nKey: "development", groupIds: ["frameworks", "languages", "backend-data", "frontend"] },
  { id: "infrastructure", i18nKey: "infrastructure", groupIds: ["dev-tools", "cloud-tools", "it"] },
  { id: "design", i18nKey: "design", groupIds: ["design"] },
];

export const getSkillsForGrouping = (grouping: SkillGrouping) =>
  grouping.skillIds
    .map((id) => skills.find((skill) => skill.id === id))
    .filter((skill): skill is Skill => skill != null);

export const getSkillGroupingsForSection = (section: SkillSection) =>
  section.groupIds
    .map((id) => skillGroupings.find((grouping) => grouping.id === id))
    .filter((grouping): grouping is SkillGrouping => grouping != null);

export const getSkillSectionId = (skillId: string) =>
  skillSections.find((section) =>
    getSkillGroupingsForSection(section).some((grouping) =>
      grouping.skillIds.includes(skillId)
    )
  )?.id ?? skillSections[0].id;
