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
  id: string;
}
