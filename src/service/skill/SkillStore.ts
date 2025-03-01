import { create } from "zustand";
import { Skill, SkillType } from "./types";
import skillService from "./SkillService";
import { skillTypes } from "./data";

interface SkillsState {
  skills: Skill[];
  skillTypes: SkillType[];
  loading: boolean;
  error?: string;
  fetchSkills: (ids?: string[]) => {};
}

export const useSkillsStore = create<SkillsState>((set) => ({
  skills: [],
  loading: false,
  skillTypes,
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
