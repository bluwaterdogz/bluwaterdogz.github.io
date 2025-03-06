import { create } from "zustand";
import { Job } from "./types";
import JobService from "./JobService";

interface JobState {
  jobList: Job[];
  job?: Job;
  loading: boolean;
  loadingList: boolean;
  error?: string;
  errorList?: string;
  fetchJobList: () => {};
  fetchJob: (id: string) => {};
}

export const useJobStore = create<JobState>((set) => ({
  job: undefined,
  jobList: [],
  loading: false,
  loadingList: false,
  error: undefined,
  errorList: undefined,
  fetchJobList: async () => {
    set({ loadingList: true });
    try {
      const jobList = await JobService.list();
      set({ jobList, loadingList: false });
    } catch (e: any) {
      set({ errorList: e, loadingList: false });
    }
  },
  fetchJob: async (id: string) => {
    set({ loading: true });
    try {
      const job = await JobService.get(id);
      set({ job, loading: false });
    } catch (e: any) {
      set({ error: e, loading: false });
    }
  },
}));
