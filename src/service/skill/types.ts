export interface Skill {
  icon: string;
  id: string;
  name: string;
}

export interface SkillGrouping {
  id: string;
  i18nKey: string;
  name: string;
  skillIds: string[];
}

export interface SkillSection {
  groupIds: string[];
  i18nKey: string;
  id: string;
}
