import { create } from "zustand";
import { Skill, SkillType } from "./types";
import skillService from "./SkillService";
import { skillTypes } from "./data";

interface SkillsState {
  skills: Skill[];
  skillTypes: SkillType[];
  loading: boolean;
  error?: string;
  fetchSkills: () => {};
}

export const useSkillsStore = create<SkillsState>((set) => ({
  skills: [],
  loading: false,
  skillTypes,
  error: undefined,
  fetchSkills: async () => {
    set({ loading: true });
    try {
      const skills = await skillService.list();
      set({ skills, loading: false });
    } catch (e: any) {
      set({ error: e, loading: false });
    }
  },
}));
