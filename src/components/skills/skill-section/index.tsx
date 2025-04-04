import { SkillList } from "../skill-list";
import { DarkOverlay } from "../../common/dark-overlay";
import styles from "./styles.module.scss";
import { RefObject } from "react";
import { SkillType } from "../../../service/skillType/types";
import { Skill } from "../../../service/skill/types";
import { Dictionary } from "lodash";

interface SkillSectionProps {
  section: SkillType;
  ref: RefObject<HTMLDivElement | null>;
  activeSkillType: string | null;
  skillsByType: Dictionary<Skill[]>;
  loading: boolean;
}
export const SkillSection = (props: SkillSectionProps) => {
  const { section, ref, activeSkillType, skillsByType, loading } = props;
  return (
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
  );
};
