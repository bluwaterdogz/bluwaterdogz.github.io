import { useCallback, useEffect, useState } from "react";
import { useServiceContext } from "../../service";
import styles from "./styles.module.scss";
import { Skill, SkillSection } from "../../service/skills/types";

const Skills = () => {
  const [skillSections, setSkillSections] = useState<any>([]);
  const { skillService } = useServiceContext();

  const getData = useCallback(async () => {
    const data = await skillService.list();
    setSkillSections(data);
    // console.log(data);
  }, [skillService]);

  useEffect(() => {
    getData();
  }, [getData]);
  return (
    <div className={styles.content}>
      {skillSections.map((section: SkillSection) => (
        <div className={styles.skillSection} key={section.name}>
          <h2>{section.name}</h2>
          <div className={styles.skillList}>
            {section.skills?.map((skill: Skill) => (
              <div className={styles.skill} key={skill.name}>
                <i className={`${skill.icon} ${styles.icon}`}></i>
                <h3>{skill.name}</h3>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Skills;
