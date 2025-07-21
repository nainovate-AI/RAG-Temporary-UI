import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';

interface Job {
  id: string;
  type: 'ingestion' | 'pipeline_deployment' | 'reindexing';
  module: 'ingest' | 'pipeline';
  targetId: string; // ID of the collection or pipeline
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

const initialState: JobsState = {
  entities: {},
  ids: [],
  activeJobs: [],
  loading: false,
  error: null,
};

const jobsSlice = createSlice({
  name: 'jobs',
  initialState,
  reducers: {
    setJobs: (state, action: PayloadAction<Job[]>) => {
      state.entities = {};
      state.ids = [];
      state.activeJobs = [];
      action.payload.forEach(job => {
        state.entities[job.id] = job;
        state.ids.push(job.id);
        if (['processing', 'pending'].includes(job.status)) {
          state.activeJobs.push(job.id);
        }
      });
      state.loading = false;
      state.error = null;
    },
    addJob: (state, action: PayloadAction<Omit<Job, 'id' | 'createdAt' | 'updatedAt'>>) => {
      const id = `job_${uuidv4()}`;
      const now = new Date().toISOString();
      const newJob: Job = {
        ...action.payload,
        id,
        createdAt: now,
        updatedAt: now,
      };
      state.entities[id] = newJob;
      state.ids.push(id);
      if (['processing', 'pending'].includes(newJob.status)) {
        state.activeJobs.push(id);
      }
    },
    updateJob: (state, action: PayloadAction<{ id: string; updates: Partial<Job> }>) => {
      const { id, updates } = action.payload;
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
          state.activeJobs = state.activeJobs.filter(jobId => jobId !== id);
        }
      }
    },
    updateJobProgress: (state, action: PayloadAction<{ id: string; current: number; total: number }>) => {
      const { id, current, total } = action.payload;
      if (state.entities[id]) {
        state.entities[id].stateDetails.progress = { current, total };
        state.entities[id].updatedAt = new Date().toISOString();
      }
    },
    completeJob: (state, action: PayloadAction<{ id: string; results?: any }>) => {
      const { id, results } = action.payload;
      if (state.entities[id]) {
        state.entities[id].status = 'completed';
        state.entities[id].state = 'completed';
        state.entities[id].stateDetails.completedAt = new Date().toISOString();
        if (results) {
          state.entities[id].results = results;
        }
        state.entities[id].updatedAt = new Date().toISOString();
        state.activeJobs = state.activeJobs.filter(jobId => jobId !== id);
      }
    },
    failJob: (state, action: PayloadAction<{ id: string; error: string }>) => {
      const { id, error } = action.payload;
      if (state.entities[id]) {
        state.entities[id].status = 'failed';
        state.entities[id].state = 'failed';
        state.entities[id].error = error;
        state.entities[id].updatedAt = new Date().toISOString();
        state.activeJobs = state.activeJobs.filter(jobId => jobId !== id);
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  setJobs,
  addJob,
  updateJob,
  updateJobProgress,
  completeJob,
  failJob,
  setLoading,
  setError,
} = jobsSlice.actions;

export default jobsSlice.reducer;