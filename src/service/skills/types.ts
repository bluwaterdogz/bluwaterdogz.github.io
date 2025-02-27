export interface Job {
  companyName: string;
  companyUrl: string;
  professionalTitle: string;
  logoImg: string;
}

export interface SkillSection {
  name: string;
  icon: string;
  skills: Skill[];
}

export interface Skill {
  name: string;
  likes: number;
  icon: string;
  level: number;
  classes: string;
}
