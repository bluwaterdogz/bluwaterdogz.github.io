import { useEffect, useMemo, useRef } from "react";
import { SkillList } from "../skill-list";
import styles from "./styles.module.scss";
import { groupBy } from "lodash";
import { useSkillsStore } from "../../../service/skill/SkillStore";
import { useSearchParams } from "react-router";
import { DarkOverlay } from "../../common/dark-overlay";
import { useSkillTypeStore } from "../../../service/skillType/SkillTypeStore";
import { SkillType } from "../../../service/skillType/types";
import { Loader } from "../../common/loader";

export const SkillTypeList = () => {
  const { fetchSkills, skills, loading } = useSkillsStore();
  let {
    fetchSkillTypes,
    skillTypes,
    loading: loadingTypes,
  } = useSkillTypeStore();
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

  const skillsByType = useMemo(() => groupBy(skills, "type"), [skills]);

  return (
    <div className={styles.skilLTypeList}>
      {loadingTypes ? (
        <Loader />
      ) : (
        skillTypes.map((section: SkillType) => (
          <div
            style={{ backgroundImage: `url(${section.img})` }}
            className={styles.skillSectionContainer}
            key={section.id}
            ref={section.id === activeSkillType ? ref : null}
          >
            <DarkOverlay opacity={0.7} />
            <div className={styles.skillSection}>
              <h2>{section.name}</h2>
              <SkillList skills={skillsByType[section.id]} loading={loading} />
            </div>
          </div>
        ))
      )}
    </div>
  );
};
