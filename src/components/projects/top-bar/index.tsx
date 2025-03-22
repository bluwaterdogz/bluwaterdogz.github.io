import styles from "./styles.module.scss";
import { useCallback, useEffect, useMemo } from "react";
import { useProjectStore } from "../../../service/project/ProjectStore";
import Select from "react-select";
import { useSkillsStore } from "../../../service/skill/SkillStore";
import { debounce } from "lodash";
import { getColor } from "./consts";
import { SkillOption } from "../../../service/project/types";
import { Input } from "../../common/input";

export const TopBar = () => {
  const { skills, fetchSkills } = useSkillsStore();
  const { filters, setSearchTerm, setFilters } = useProjectStore();

  useEffect(() => {
    fetchSkills();
  }, []);

  const onInputChange = useCallback(
    debounce((e) => {
      setSearchTerm(e.target.value);
    }, 500),
    []
  );

  const skillOptions: SkillOption[] = useMemo(() => {
    return skills.map((skill) => ({
      label: skill.name,
      value: skill.id,
      color: getColor(),
    }));
  }, [skills]);

  const onSelectSkillsChange = useCallback(
    (selectedSkills: SkillOption[]) => {
      setFilters({
        ...filters,
        skills: selectedSkills,
      });
    },
    [filters, skills]
  );

  return (
    <div className={styles.topBar}>
      <div className={styles.searchContainer}>
        <Input type="text" onChange={onInputChange} placeholder="Search" />
      </div>
      <div className={styles.filtersContainer}>
        <Select
          className={styles.searchInput}
          closeMenuOnSelect={false}
          defaultValue={[] as SkillOption[]}
          onChange={onSelectSkillsChange as any}
          isMulti
          options={skillOptions}
          placeholder={"Filter by Skills"}
        />
      </div>
    </div>
  );
};
