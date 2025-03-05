import { useEffect, useMemo } from "react";
import { SkillList } from "../skill-list";
import styles from "./styles.module.scss";
import { groupBy } from "lodash";
import { useSkillsStore } from "../../../service/skill/SkillStore";

export const SkillTypeList = () => {
  const { fetchSkills, skills, skillTypes } = useSkillsStore();

  useEffect(() => {
    fetchSkills();
  }, []);

  const skillSections = useMemo(() => {
    const skillGroups = groupBy(skills, "type");
    return skillTypes.map((type) => ({
      ...type,
      skills: skillGroups[type.id],
    }));
  }, [skills]);

  return (
    <>
      {skillSections.map((section: any) => (
        <div key={section.id}>
          <div className={styles.skillSection} key={section.name}>
            <h2>{section.name}</h2>
            <SkillList skills={section.skills} />
          </div>
          <hr className={styles.divider} />
        </div>
      ))}
    </>
  );
};
