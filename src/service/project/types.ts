export interface Project {
  name: string;
  id: string;
  img?: string;
  skills: string[];
  previewImgs?: string[];
  previewVideos?: string[];
}

export interface SkillOption {
  readonly value: string;
  readonly label: string;
  readonly color: string;
  readonly isFixed?: boolean;
  readonly isDisabled?: boolean;
}

export interface ProjectFilters {
  skills: SkillOption[];
}
