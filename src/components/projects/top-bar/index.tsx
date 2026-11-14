import styles from "./styles.module.scss";
import { useTranslation } from "react-i18next";
import { ProjectEmployer } from "../../../service/project/types";
import {
  projectEmployers,
  ProjectCategory,
} from "../../../service/project/selectors";
import { CustomSelect } from "../../common/custom-select";

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
      <CustomSelect
        label={t("projects.jobs.label")}
        onChange={(value) =>
          onEmployerChange(value as ProjectEmployer | "all")
        }
        options={projectEmployers.map((employer) => ({
          label: t(`projects.jobs.${employer}`),
          value: employer,
        }))}
        value={activeEmployer}
      />
    </div>
  );
};
