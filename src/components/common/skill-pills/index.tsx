import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Skill } from "../../../service/skill/types";
import styles from "./styles.module.scss";

interface SkillPillsProps {
  activeSkillIds?: string[];
  ariaLabel: string;
  className?: string;
  linkTo?: "projects" | "skills" | null;
  onToggle?: (skillId: string) => void;
  skills: Skill[];
}

export const SkillPills = ({
  activeSkillIds = [],
  ariaLabel,
  className = "",
  linkTo = "projects",
  onToggle,
  skills,
}: SkillPillsProps) => {
  const { t } = useTranslation();

  const renderContent = (skill: Skill) => (
    <>
      <i className={skill.icon} aria-hidden="true" />
      <span>{t(`skills.names.${skill.id}`)}</span>
    </>
  );

  return (
    <ul aria-label={ariaLabel} className={`${styles.pills} ${className}`}>
      {skills.map((skill) => (
        <li key={skill.id}>
          {onToggle != null ? (
            <button
              aria-pressed={activeSkillIds.includes(skill.id)}
              onClick={() => onToggle(skill.id)}
              type="button"
            >
              {renderContent(skill)}
            </button>
          ) : linkTo != null ? (
            <Link
              to={
                linkTo === "projects"
                  ? `/projects?skill=${skill.id}`
                  : `/skills?skill=${skill.id}`
              }
            >
              {renderContent(skill)}
            </Link>
          ) : (
            <span>{renderContent(skill)}</span>
          )}
        </li>
      ))}
    </ul>
  );
};
