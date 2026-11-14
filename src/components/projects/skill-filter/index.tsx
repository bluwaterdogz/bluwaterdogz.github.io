import { useState } from "react";
import { skills } from "../../../service/skill/data";
import { Badge } from "../../common/badge";
import { SkillPills } from "../../common/skill-pills";
import { useTranslation } from "react-i18next";
import styles from "./styles.module.scss";

interface SkillFilterProps {
  activeSkillIds: string[];
  label: string;
  onClear: () => void;
  onToggle: (skillId: string) => void;
}

export const SkillFilter = ({
  activeSkillIds,
  label,
  onClear,
  onToggle,
}: SkillFilterProps) => {
  const [isExpanded, setIsExpanded] = useState(activeSkillIds.length > 0);
  const { t } = useTranslation();

  return (
    <div className={styles.filter}>
      <button
        aria-expanded={isExpanded}
        className={styles.trigger}
        onClick={() => setIsExpanded((current) => !current)}
        type="button"
      >
        <span>{label}</span>
        {activeSkillIds.length > 0 && (
          <Badge
            ariaLabel={t("projects.skills.selected", {
              count: activeSkillIds.length,
            })}
          >
            {activeSkillIds.length}
          </Badge>
        )}
        <i className="fa fa-chevron-down" aria-hidden="true" />
      </button>
      {isExpanded && (
        <div className={styles.panel}>
          <div className={styles.heading}>
            {activeSkillIds.length > 0 && (
              <button onClick={onClear} type="button">
                {t("projects.skills.clear")}
              </button>
            )}
          </div>
          <SkillPills
            activeSkillIds={activeSkillIds}
            ariaLabel={label}
            className={styles.skills}
            onToggle={onToggle}
            skills={skills}
          />
        </div>
      )}
    </div>
  );
};
