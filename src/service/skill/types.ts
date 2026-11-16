export interface Skill {
  icon: string;
  id: string;
}

export interface SkillGrouping {
  id: string;
  i18nKey: string;
  skillIds: string[];
}

export interface SkillSection {
  groupIds: string[];
  i18nKey: string;
  id: string;
}
