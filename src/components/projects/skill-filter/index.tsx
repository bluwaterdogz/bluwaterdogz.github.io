import { useRef, useState } from "react";
import { skills } from "../../../service/skill/data";
import { useOutsideClick } from "../../../hooks/useOutsideClick";
import { Badge } from "../../common/badge";
import { InputGroup } from "../../common/input-group";
import { SkillPills } from "../../common/skill-pills";
import { useTranslation } from "react-i18next";
import styles from "./styles.module.scss";

const skillPriority = [
  "3",
  "9",
  "1",
  "2",
  "4",
  "5",
  "29",
  "17",
  "32",
  "26",
  "24",
  "7",
  "8",
  "38",
  "20",
  "34",
  "33",
  "27",
  "28",
  "35",
  "37",
  "19",
  "16",
  "11",
  "12",
  "10",
  "13",
  "15",
  "18",
  "36",
  "30",
  "31",
  "6",
  "14",
  "25",
  "23",
  "22",
  "21",
  "39",
  "40",
  "41",
];

const prioritizedSkills = skillPriority
  .map((id) => skills.find((skill) => skill.id === id))
  .filter((skill): skill is (typeof skills)[number] => skill != null);

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
  const rootRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();

  useOutsideClick(rootRef, () => setIsExpanded(false));

  return (
    <InputGroup className={styles.field} label={label}>
      <div ref={rootRef}>
        <div className={styles.control}>
          <button
            aria-expanded={isExpanded}
            className={styles.trigger}
            onClick={() => setIsExpanded((current) => !current)}
            type="button"
          >
            <span>{t("projects.skills.all")}</span>
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
                skills={prioritizedSkills}
              />
            </div>
          )}
        </div>
      </div>
    </InputGroup>
  );
};
