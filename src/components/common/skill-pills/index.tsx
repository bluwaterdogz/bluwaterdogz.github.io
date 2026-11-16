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

interface SkillPillLabelProps {
  skill: Skill;
}

const SkillPillLabel = ({ skill }: SkillPillLabelProps) => {
  const { t } = useTranslation();

  return (
    <>
      <i className={skill.icon} aria-hidden="true" />
      <span>{t(`skills.names.${skill.id}`)}</span>
    </>
  );
};

export const SkillPills = ({
  activeSkillIds = [],
  ariaLabel,
  className = "",
  linkTo = "projects",
  onToggle,
  skills,
}: SkillPillsProps) => {
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
              <SkillPillLabel skill={skill} />
            </button>
          ) : linkTo != null ? (
            <Link
              to={
                linkTo === "projects"
                  ? `/projects?skill=${skill.id}`
                  : `/skills?skill=${skill.id}`
              }
            >
              <SkillPillLabel skill={skill} />
            </Link>
          ) : (
            <span>
              <SkillPillLabel skill={skill} />
            </span>
          )}
        </li>
      ))}
    </ul>
  );
};
