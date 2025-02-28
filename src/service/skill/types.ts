export interface Job {
  companyName: string;
  companyUrl: string;
  professionalTitle: string;
  logoImg: string;
}

export interface SkillType {
  name: string;
  icon: string;
  id: string;
}

export interface Skill {
  name: string;
  likes: number;
  id: string;
  type: string;
  icon: string;
  level: number;
  classes: string;
  projects: ProjectRef[];
}

export interface ProjectRef {
  name: string;
  id: number;
}
