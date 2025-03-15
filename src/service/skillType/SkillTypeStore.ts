import { create } from "zustand";
import { SkillType } from "./types";
import skillTypeService from "./SkillTypeService";

interface SkillTypeState {
  skillTypes: SkillType[];
  loading: boolean;
  error?: string;
  fetchSkillTypes: (ids?: string[]) => {};
}

export const useSkillTypeStore = create<SkillTypeState>((set) => ({
  skillTypes: [],
  loading: false,
  error: undefined,
  fetchSkillTypes: async (ids?: string[]) => {
    set({ loading: true });
    try {
      const skillTypes = await skillTypeService.list(ids);
      set({ skillTypes, loading: false });
    } catch (e: any) {
      set({ error: e, loading: false });
    }
  },
}));
