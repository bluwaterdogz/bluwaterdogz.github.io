import { useEffect, useMemo, useRef } from "react";
import { SkillList } from "../skill-list";
import styles from "./styles.module.scss";
import { groupBy } from "lodash";
import { useSkillsStore } from "../../../service/skill/SkillStore";
import { useSearchParams } from "react-router";

export const SkillTypeList = () => {
  const { fetchSkills, skills, skillTypes } = useSkillsStore();
  const [searchParams] = useSearchParams();
  const activeSkillType = searchParams.get("skillType");
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    fetchSkills();
  }, []);

  useEffect(() => {
    if (ref.current != null) {
      setTimeout(function () {
        ref.current?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }, 100);
    }
  }, [ref]);

  const skillSections = useMemo(() => {
    const skillGroups = groupBy(skills, "type");
    return skillTypes.map((type) => ({
      ...type,
      skills: skillGroups[type.id],
    }));
  }, [skills]);

  return (
    <div className={styles.skilLTypeList}>
      {skillSections.map((section: any, i) => (
        <div
          className={styles.skillSectionContainer}
          key={section.id}
          ref={section.id === activeSkillType ? ref : null}
        >
          <div className={styles.skillSection}>
            <h2>{section.name}</h2>
            <SkillList skills={section.skills} />
          </div>
          {i !== skillSections.length - 1 ? (
            <hr className={styles.divider} />
          ) : null}
        </div>
      ))}
    </div>
  );
};
