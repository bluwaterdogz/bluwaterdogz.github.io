export interface Project {
  employer: ProjectEmployer;
  id: string;
  img?: string;
  nameKey: string;
  skills: string[];
  previewImgs?: string[];
  previewVideos?: string[];
  story: ProjectStory;
}

export interface ProjectStory {
  bodyLayout: "cards" | "concise" | "timeline";
  heroLayout: "split" | "stacked";
  sections: ProjectStorySection[];
}

export type ProjectStorySection =
  | {
      id: string;
      type: "challenge" | "outcome" | "text";
    }
  | {
      id: string;
      steps: string[];
      type: "timeline";
    }
  | {
      id: string;
      nodes: string[];
      type: "architecture";
    };

export interface LocalizedProject extends Project {
  name: string;
}

export type ProjectEmployer =
  | "faro"
  | "independent"
  | "launchBrigade"
  | "mobian"
  | "various";
