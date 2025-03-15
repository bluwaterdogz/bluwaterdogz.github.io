import { create } from "zustand";
import { Skill } from "./types";
import skillService from "./SkillService";

interface SkillsState {
  skills: Skill[];
  loading: boolean;
  error?: string;
  fetchSkills: (ids?: string[]) => {};
}

export const useSkillsStore = create<SkillsState>((set) => ({
  skills: [],
  loading: false,
  error: undefined,
  fetchSkills: async (ids?: string[]) => {
    set({ loading: true });
    try {
      const skills = await skillService.list(ids);
      set({ skills, loading: false });
    } catch (e: any) {
      set({ error: e, loading: false });
    }
  },
}));
