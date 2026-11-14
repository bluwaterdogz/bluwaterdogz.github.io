export interface Project {
  employer: ProjectEmployer;
  name: string;
  id: string;
  img?: string;
  quotes: Quote[];
  skills: string[];
  previewImgs?: string[];
  previewVideos?: string[];
  story?: ProjectStory;
}

export interface ProjectStory {
  accent: "data" | "integration" | "platform" | "product" | "throughput";
  kicker: string;
  sections: ProjectStorySection[];
  summary: string;
}

export type ProjectStorySection =
  | {
      content: string;
      eyebrow?: string;
      title: string;
      type: "challenge" | "outcome" | "text";
    }
  | {
      steps: Array<{
        content: string;
        label: string;
        title: string;
      }>;
      title: string;
      type: "timeline";
    }
  | {
      nodes: Array<{ label: string; detail: string }>;
      title: string;
      type: "architecture";
    };

export type ProjectEmployer =
  | "faro"
  | "independent"
  | "launchBrigade"
  | "mobian"
  | "various";
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
