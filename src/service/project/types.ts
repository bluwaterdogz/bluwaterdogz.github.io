export interface Project {
  name: string;
  id: string;
  img?: string;
  quotes: Quote[];
  skills: string[];
  previewImgs?: string[];
  previewVideos?: string[];
}
export interface Quote {
  text: string;
  author?: string;
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
