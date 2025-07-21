import modulesConfig from '@/config/modules.json';
import { 
  ModulesConfig, 
  ModuleConfig, 
  StepConfig, 
  StatusConfig,
  ModuleName 
} from '@/types/modules.types';

class ModuleService {
  private config: ModulesConfig;

  constructor() {
    this.config = modulesConfig as ModulesConfig;
  }

  /**
   * Get module configuration
   */
  getModuleConfig(module: ModuleName): ModuleConfig {
    const moduleConfig = this.config.modules[module];
    if (!moduleConfig) {
      throw new Error(`Module ${module} not found in configuration`);
    }
    return moduleConfig;
  }

  /**
   * Get flow steps for a specific module and flow type
   */
  getModuleFlow(module: ModuleName, flowType: string): StepConfig[] {
    const moduleConfig = this.getModuleConfig(module);
    const flow = moduleConfig.flow[flowType];
    
    if (!flow) {
      throw new Error(`Flow ${flowType} not found in module ${module}`);
    }
    
    // Return only enabled steps, sorted by order
    return flow.steps
      .filter(step => step.enabled)
      .sort((a, b) => a.order - b.order);
  }

  /**
   * Get all steps including disabled ones
   */
  getAllModuleSteps(module: ModuleName, flowType: string): StepConfig[] {
    const moduleConfig = this.getModuleConfig(module);
    const flow = moduleConfig.flow[flowType];
    
    if (!flow) {
      throw new Error(`Flow ${flowType} not found in module ${module}`);
    }
    
    return flow.steps.sort((a, b) => a.order - b.order);
  }

  /**
   * Get module status definitions
   */
  getModuleStatuses(module: ModuleName): Record<string, StatusConfig> {
    const moduleConfig = this.getModuleConfig(module);
    return moduleConfig.status || {};
  }

  /**
   * Get module state definitions
   */
  getModuleStates(module: ModuleName): Record<string, string> {
    const moduleConfig = this.getModuleConfig(module);
    return moduleConfig.states || {};
  }

  /**
   * Validate if a status is valid for a module
   */
  validateStatus(module: ModuleName, status: string): boolean {
    const statuses = this.getModuleStatuses(module);
    return status in statuses;
  }

  /**
   * Validate if a state is valid for a module
   */
  validateState(module: ModuleName, state: string): boolean {
    const states = this.getModuleStates(module);
    return state in states;
  }

  /**
   * Get status config by key
   */
  getStatusConfig(module: ModuleName, statusKey: string): StatusConfig | null {
    const statuses = this.getModuleStatuses(module);
    return statuses[statusKey] || null;
  }

  /**
   * Get state description
   */
  getStateDescription(module: ModuleName, stateKey: string): string | null {
    const states = this.getModuleStates(module);
    return states[stateKey] || null;
  }

  /**
   * Get step by ID
   */
  getStepById(module: ModuleName, flowType: string, stepId: string): StepConfig | null {
    const steps = this.getAllModuleSteps(module, flowType);
    return steps.find(step => step.id === stepId) || null;
  }

  /**
   * Get next enabled step
   */
  getNextStep(module: ModuleName, flowType: string, currentStepId: string): StepConfig | null {
    const steps = this.getModuleFlow(module, flowType);
    const currentIndex = steps.findIndex(step => step.id === currentStepId);
    
    if (currentIndex === -1 || currentIndex === steps.length - 1) {
      return null;
    }
    
    return steps[currentIndex + 1];
  }

  /**
   * Get previous enabled step
   */
  getPreviousStep(module: ModuleName, flowType: string, currentStepId: string): StepConfig | null {
    const steps = this.getModuleFlow(module, flowType);
    const currentIndex = steps.findIndex(step => step.id === currentStepId);
    
    if (currentIndex <= 0) {
      return null;
    }
    
    return steps[currentIndex - 1];
  }

  /**
   * Check if step is the last enabled step
   */
  isLastStep(module: ModuleName, flowType: string, stepId: string): boolean {
    const steps = this.getModuleFlow(module, flowType);
    const lastStep = steps[steps.length - 1];
    return lastStep?.id === stepId;
  }

  /**
   * Check if step is the first enabled step
   */
  isFirstStep(module: ModuleName, flowType: string, stepId: string): boolean {
    const steps = this.getModuleFlow(module, flowType);
    const firstStep = steps[0];
    return firstStep?.id === stepId;
  }
}

// Export singleton instance
export const moduleService = new ModuleService();

// Export class for testing
export default ModuleService;