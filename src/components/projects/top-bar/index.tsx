import styles from "./styles.module.scss";
import { useTranslation } from "react-i18next";
import { ProjectEmployer } from "../../../service/project/types";
import {
  projectEmployers,
  ProjectCategory,
} from "../../../service/project/selectors";


interface TopBarProps {
  activeCategory: ProjectCategory;
  activeEmployer: ProjectEmployer | "all";
  onCategoryChange: (category: ProjectCategory) => void;
  onEmployerChange: (employer: ProjectEmployer | "all") => void;
  onSearchChange: (value: string) => void;
  searchTerm: string;
}

const categories: ProjectCategory[] = ["all", "web", "mobile", "backend", "data"];
export const TopBar = ({
  activeCategory,
  activeEmployer,
  onCategoryChange,
  onEmployerChange,
  onSearchChange,
  searchTerm,
}: TopBarProps) => {
  const { t } = useTranslation();
  return (
    <div className={styles.topBar}>
      <label className={styles.search}>
        <i className="fa fa-search" aria-hidden="true" />
        <span className={styles.srOnly}>{t("projects.search")}</span>
        <input
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder={t("projects.search")}
          type="search"
          value={searchTerm}
        />
      </label>
      <div className={styles.categories} aria-label={t("projects.categories.label")}>
        {categories.map((category) => (
          <button
            aria-pressed={activeCategory === category}
            className={
              activeCategory === category ? styles.active : undefined
            }
            key={category}
            onClick={() => onCategoryChange(category)}
            type="button"
          >
            {t(`projects.categories.${category}`)}
          </button>
        ))}
      </div>
      <label className={styles.jobFilter}>
        <span>{t("projects.jobs.label")}</span>
        <select
          onChange={(event) =>
            onEmployerChange(event.target.value as ProjectEmployer | "all")
          }
          value={activeEmployer}
        >
          {projectEmployers.map((employer) => (
            <option key={employer} value={employer}>
              {t(`projects.jobs.${employer}`)}
            </option>
          ))}
        </select>
      </label>
      <a
        className={styles.githubLink}
        href="https://github.com/bluwaterdogz"
        rel="noreferrer"
        target="_blank"
      >
        <i className="devicon-github-original" aria-hidden="true" />
        {t("projects.github")}
        <span aria-hidden="true">&#8594;</span>
      </a>
    </div>
  );
};
