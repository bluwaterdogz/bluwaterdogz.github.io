import { useEffect, useMemo, useRef } from "react";
import styles from "./styles.module.scss";
import { groupBy } from "lodash";
import { useSkillsStore } from "../../../service/skill/SkillStore";
import { useSearchParams } from "react-router";
import { useSkillTypeStore } from "../../../service/skillType/SkillTypeStore";
import { SkillType } from "../../../service/skillType/types";
import { DynamicList } from "../../common/dynamic-list";
import { SkillSection } from "../skill-section";

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
      <DynamicList<SkillType>
        loading={loadingTypes}
        data={skillTypes}
        renderListItem={(section) => (
          <SkillSection
            loading={loading}
            ref={ref}
            key={section.id}
            section={section}
            skillsByType={skillsByType}
            activeSkillType={activeSkillType}
          />
        )}
      />
    </div>
  );
};
