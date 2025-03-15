import { useEffect, useMemo, useRef } from "react";
import { SkillList } from "../skill-list";
import styles from "./styles.module.scss";
import { groupBy } from "lodash";
import { useSkillsStore } from "../../../service/skill/SkillStore";
import { useSearchParams } from "react-router";
import { DarkOverlay } from "../../common/dark-overlay";
import { useSkillTypeStore } from "../../../service/skillType/SkillTypeStore";

export const SkillTypeList = () => {
  const { fetchSkills, skills } = useSkillsStore();
  const { fetchSkillTypes, skillTypes } = useSkillTypeStore();
  const [searchParams] = useSearchParams();
  const activeSkillType = searchParams.get("skillType");
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    Promise.all([fetchSkills(), fetchSkillTypes()]);
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
    console.log(skillTypes);
    return (
      skillTypes?.map((type) => ({
        ...type,
        skills: skillGroups[type.id],
      })) || []
    );
  }, [skills, skillTypes]);

  return (
    <div className={styles.skilLTypeList}>
      {skillSections.map((section: any, _i) => (
        <div
          style={{ backgroundImage: `url(${section.img})` }}
          className={styles.skillSectionContainer}
          key={section.id}
          ref={section.id === activeSkillType ? ref : null}
        >
          <DarkOverlay opacity={0.7} />
          <div className={styles.skillSection}>
            <h2>{section.name}</h2>
            <SkillList skills={section.skills} />
          </div>
        </div>
      ))}
    </div>
  );
};
