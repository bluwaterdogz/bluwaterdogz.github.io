import { useSearchParams } from "react-router-dom";
import { skills } from "../../../service/skill/data";
import {
  ProjectCategory,
  ProjectFilters,
} from "../../../service/project/selectors";
import { ProjectEmployer } from "../../../service/project/types";

const categories: ProjectCategory[] = ["all", "backend", "data", "mobile", "web"];
const employers: Array<ProjectEmployer | "all"> = [
  "all",
  "faro",
  "independent",
  "launchBrigade",
  "mobian",
  "various",
];

export const useProjectFilters = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get("category") as ProjectCategory | null;
  const employerParam = searchParams.get("job") as ProjectEmployer | "all" | null;
  const filters: ProjectFilters = {
    category: categoryParam != null && categories.includes(categoryParam)
      ? categoryParam
      : "all",
    employer: employerParam != null && employers.includes(employerParam)
      ? employerParam
      : "all",
    searchTerm: searchParams.get("search") ?? "",
    skillIds: searchParams
      .getAll("skill")
      .filter((id) => skills.some((skill) => skill.id === id)),
  };

  const updateParam = (key: string, value: string, defaultValue = "") => {
    const nextParams = new URLSearchParams(searchParams);
    if (value === defaultValue) nextParams.delete(key);
    else nextParams.set(key, value);
    setSearchParams(nextParams, { replace: true });
  };

  const toggleSkill = (skillId: string) => {
    const nextParams = new URLSearchParams(searchParams);
    const nextSkills = filters.skillIds.includes(skillId)
      ? filters.skillIds.filter((id) => id !== skillId)
      : [...filters.skillIds, skillId];
    nextParams.delete("skill");
    nextSkills.forEach((id) => nextParams.append("skill", id));
    setSearchParams(nextParams, { replace: true });
  };

  return {
    clearSkills: () => {
      const nextParams = new URLSearchParams(searchParams);
      nextParams.delete("skill");
      setSearchParams(nextParams, { replace: true });
    },
    filters,
    setCategory: (category: ProjectCategory) =>
      updateParam("category", category, "all"),
    setEmployer: (employer: ProjectEmployer | "all") =>
      updateParam("job", employer, "all"),
    setSearchTerm: (searchTerm: string) =>
      updateParam("search", searchTerm),
    toggleSkill,
  };
};
