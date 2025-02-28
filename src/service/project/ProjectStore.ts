import { create } from "zustand";
import { Project } from "./types";
import projectService from "./ProjectService";

interface ProjectState {
  projects: Project[];
  project?: Project;
  loading: boolean;
  loadingList: boolean;
  error?: string;
  errorList?: string;
  fetchProjectList: () => {};
  fetchProject: (id: string) => {};
}

export const useProjectStore = create<ProjectState>((set) => ({
  project: undefined,
  projects: [],
  loading: false,
  loadingList: false,
  error: undefined,
  fetchProjectList: async () => {
    set({ loadingList: true });
    try {
      const projects = await projectService.list();
      set({ projects, loadingList: false });
    } catch (e: any) {
      set({ errorList: e, loadingList: false });
    }
  },
  fetchProject: async (id: string) => {
    set({ loading: true });
    try {
      const project = await projectService.get(id);
      set({ project, loading: false });
    } catch (e: any) {
      set({ error: e, loading: false });
    }
  },
}));
