import { Skill, SkillGrouping, SkillSection } from "./types";

export const skills: Skill[] = [
  { id: "1", name: "Python", icon: "devicon-python-plain" },
  { id: "2", name: "JavaScript", icon: "devicon-javascript-plain" },
  { id: "3", name: "TypeScript", icon: "devicon-typescript-plain" },
  { id: "4", name: "Node.js", icon: "devicon-nodejs-plain-wordmark" },
  { id: "5", name: "PostgreSQL", icon: "devicon-postgresql-plain" },
  { id: "6", name: "PHP", icon: "devicon-php-plain" },
  { id: "7", name: "HTML5", icon: "devicon-html5-plain" },
  { id: "8", name: "CSS/SCSS", icon: "devicon-sass-plain" },
  { id: "9", name: "React", icon: "devicon-react-original" },
  { id: "10", name: "Angular", icon: "devicon-angular-plain" },
  { id: "11", name: "Express", icon: "devicon-express-original" },
  { id: "12", name: "Flask", icon: "devicon-flask-original" },
  { id: "13", name: "RxJS", icon: "devicon-rxjs-plain" },
  { id: "14", name: "Vue", icon: "devicon-vuejs-plain" },
  { id: "15", name: "Storybook", icon: "devicon-storybook-plain" },
  { id: "16", name: "Vite", icon: "devicon-vite-original" },
  { id: "17", name: "Git", icon: "devicon-git-plain" },
  { id: "18", name: "Webpack", icon: "devicon-webpack-plain" },
  { id: "19", name: "Azure", icon: "devicon-azure-plain" },
  { id: "20", name: "GitHub Actions", icon: "devicon-githubactions-plain" },
  { id: "21", name: "Photoshop", icon: "devicon-photoshop-plain" },
  { id: "22", name: "Bootstrap", icon: "devicon-bootstrap-plain" },
  { id: "23", name: "Figma", icon: "devicon-figma-plain" },
  { id: "24", name: "Next.js", icon: "devicon-nextjs-plain" },
  { id: "25", name: "Material UI", icon: "devicon-materialui-plain" },
  { id: "26", name: "FastAPI", icon: "devicon-fastapi-plain" },
  { id: "27", name: "OpenSearch", icon: "fa fa-search" },
  { id: "28", name: "Redis", icon: "devicon-redis-plain" },
  { id: "29", name: "AWS", icon: "devicon-amazonwebservices-plain-wordmark" },
  { id: "30", name: "Snowflake", icon: "fa fa-snowflake-o" },
  { id: "31", name: "Dagster", icon: "fa fa-circle-o-notch" },
  { id: "32", name: "Docker", icon: "devicon-docker-plain" },
  { id: "33", name: "Jest", icon: "devicon-jest-plain" },
  { id: "34", name: "Playwright", icon: "devicon-playwright-plain" },
  { id: "35", name: "Terraform", icon: "devicon-terraform-plain" },
  { id: "36", name: "Cypress", icon: "devicon-cypressio-plain" },
  { id: "37", name: "CloudWatch", icon: "fa fa-line-chart" },
];

export const skillGroupings: SkillGrouping[] = [
  { id: "frameworks", i18nKey: "Frameworks", name: "Frameworks", skillIds: ["9", "10", "11", "12", "13", "14", "24", "25"] },
  { id: "languages", i18nKey: "Languages", name: "Languages", skillIds: ["1", "2", "3", "6"] },
  { id: "backend-data", i18nKey: "BackendData", name: "Backend & Data", skillIds: ["4", "5", "26", "27", "28"] },
  { id: "frontend", i18nKey: "Frontend", name: "Frontend", skillIds: ["9", "24", "7", "8", "25"] },
  { id: "dev-tools", i18nKey: "DevTools", name: "Dev Tools", skillIds: ["15", "16", "17", "18", "27", "28", "30", "31", "32", "33", "34", "36"] },
  { id: "cloud-tools", i18nKey: "CloudTools", name: "Cloud & Tools", skillIds: ["29", "32", "17", "33", "31", "30"] },
  { id: "it", i18nKey: "IT", name: "IT", skillIds: ["19", "20", "29", "35", "37"] },
  { id: "design", i18nKey: "Design", name: "Design", skillIds: ["21", "22", "23"] },
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
