import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

export interface Job {
  id: string;
  type: 'ingestion' | 'pipeline_deployment' | 'reindexing';
  module: 'ingest' | 'pipeline';
  targetId: string;
  status: string;
  state: string;
  stateDetails: {
    message: string;
    startedAt: string;
    completedAt?: string;
    progress?: {
      current: number;
      total: number;
    };
  };
  config: any;
  results?: any;
  error?: string;
  createdAt: string;
  updatedAt: string;
}

interface JobsState {
  entities: Record<string, Job>;
  ids: string[];
  activeJobs: string[];
  loading: boolean;
  error: string | null;
}

interface JobsActions {
  setJobs: (jobs: Job[]) => void;
  addJob: (job: Omit<Job, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateJob: (id: string, updates: Partial<Job>) => void;
  updateJobProgress: (id: string, current: number, total: number) => void;
  updateJobState: (id: string, state: string, message: string) => void;
  completeJob: (id: string, results?: any) => void;
  failJob: (id: string, error: string) => void;
  deleteJob: (id: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  getJobById: (id: string) => Job | undefined;
  getJobsArray: () => Job[];
  getActiveJobsArray: () => Job[];
  getJobsByType: (type: Job['type']) => Job[];
  getJobsByTarget: (targetId: string) => Job[];
  getJobsByStatus: (status: string) => Job[];
}

export const useJobsStore = create<JobsState & JobsActions>()(
  immer((set, get) => ({
    // State
    entities: {},
    ids: [],
    activeJobs: [],
    loading: false,
    error: null,

    // Actions
    setJobs: (jobs) =>
      set((state) => {
        state.entities = {};
        state.ids = [];
        state.activeJobs = [];
        jobs.forEach((job) => {
          state.entities[job.id] = job;
          state.ids.push(job.id);
          if (['processing', 'pending'].includes(job.status)) {
            state.activeJobs.push(job.id);
          }
        });
        state.loading = false;
        state.error = null;
      }),

    addJob: (jobData) =>
      set((state) => {
        const id = `job_${crypto.randomUUID()}`;
        const now = new Date().toISOString();
        const newJob = {
          ...jobData,
          id,
          createdAt: now,
          updatedAt: now,
        } as Job;
        
        state.entities[id] = newJob;
        state.ids.push(id);
        if (['processing', 'pending'].includes(newJob.status)) {
          state.activeJobs.push(id);
        }
      }),

    updateJob: (id, updates) =>
      set((state) => {
        if (state.entities[id]) {
          state.entities[id] = {
            ...state.entities[id],
            ...updates,
            updatedAt: new Date().toISOString(),
          };
          
          // Update activeJobs list
          const isActive = ['processing', 'pending'].includes(state.entities[id].status);
          const inActiveList = state.activeJobs.includes(id);
          
          if (isActive && !inActiveList) {
            state.activeJobs.push(id);
          } else if (!isActive && inActiveList) {
            state.activeJobs = state.activeJobs.filter((jobId) => jobId !== id);
          }
        }
      }),

    updateJobProgress: (id, current, total) =>
      set((state) => {
        if (state.entities[id]) {
          state.entities[id].stateDetails.progress = { current, total };
          state.entities[id].updatedAt = new Date().toISOString();
        }
      }),

    updateJobState: (id, stateValue, message) =>
      set((state) => {
        if (state.entities[id]) {
          state.entities[id].state = stateValue;
          state.entities[id].stateDetails.message = message;
          state.entities[id].updatedAt = new Date().toISOString();
        }
      }),

    completeJob: (id, results) =>
      set((state) => {
        if (state.entities[id]) {
          state.entities[id].status = 'completed';
          state.entities[id].state = 'completed';
          state.entities[id].stateDetails.completedAt = new Date().toISOString();
          if (results) {
            state.entities[id].results = results;
          }
          state.entities[id].updatedAt = new Date().toISOString();
          state.activeJobs = state.activeJobs.filter((jobId) => jobId !== id);
        }
      }),

    failJob: (id, error) =>
      set((state) => {
        if (state.entities[id]) {
          state.entities[id].status = 'failed';
          state.entities[id].state = 'failed';
          state.entities[id].error = error;
          state.entities[id].updatedAt = new Date().toISOString();
          state.activeJobs = state.activeJobs.filter((jobId) => jobId !== id);
        }
      }),

    deleteJob: (id) =>
      set((state) => {
        delete state.entities[id];
        state.ids = state.ids.filter((i) => i !== id);
        state.activeJobs = state.activeJobs.filter((jobId) => jobId !== id);
      }),

    setLoading: (loading) =>
      set((state) => {
        state.loading = loading;
      }),

    setError: (error) =>
      set((state) => {
        state.error = error;
      }),

    // Computed values
    getJobById: (id) => get().entities[id],
    getJobsArray: () => Object.values(get().entities),
    getActiveJobsArray: () => get().activeJobs.map(id => get().entities[id]).filter(Boolean),
    getJobsByType: (type) => Object.values(get().entities).filter(job => job.type === type),
    getJobsByTarget: (targetId) => Object.values(get().entities).filter(job => job.targetId === targetId),
    getJobsByStatus: (status) => Object.values(get().entities).filter(job => job.status === status),
  }))
);