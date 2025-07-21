export interface StepConfig {
  id: string;
  title: string;
  component: string;
  enabled: boolean;
  required: boolean;
  order: number;
  description: string;
}

export interface FlowConfig {
  steps: StepConfig[];
}

export interface StatusConfig {
  label: string;
  color: string;
  icon: string;
  description: string;
}

export interface ModuleConfig {
  flow: {
    [flowType: string]: FlowConfig;
  };
  status: {
    [statusKey: string]: StatusConfig;
  };
  states: {
    [stateKey: string]: string;
  };
}

export interface ModulesConfig {
  modules: {
    [moduleName: string]: ModuleConfig;
  };
}

export type ModuleName = 'pipeline' | 'ingest';
export type PipelineFlowType = 'rag' | 'llm';
export type IngestFlowType = 'document';