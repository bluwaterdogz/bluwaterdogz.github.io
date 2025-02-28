import { useEffect, useMemo } from "react";
import styles from "./styles.module.scss";
import { Skill } from "../../service/skill/types";
import { useSkillsStore } from "../../service/skill/SkillStore";
import { groupBy } from "lodash";
import { Link } from "react-router";

export const SkillsPage = () => {
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
    <div className={styles.content}>
      {skillSections.map((section: any) => (
        <div key={section.id}>
          <div className={styles.skillSection} key={section.name}>
            <h2>{section.name}</h2>
            <div className={styles.skillList}>
              {section.skills?.map((skill: Skill) => (
                <div className={styles.skill} key={skill.name}>
                  <i className={`${skill.icon} ${styles.icon}`}></i>
                  <h3 className={styles.name}>{skill.name}</h3>
                  <p className={styles.detail}>{skill.level} years</p>
                  <>
                    {skill.projects.map((p) => (
                      <Link
                        key={p.id}
                        className={styles.projectLink}
                        to={`/project/${p.id}`}
                      >
                        {p.name}
                      </Link>
                    ))}
                  </>
                </div>
              ))}
            </div>
          </div>
          <hr className={styles.divider} />
        </div>
      ))}
    </div>
  );
};
