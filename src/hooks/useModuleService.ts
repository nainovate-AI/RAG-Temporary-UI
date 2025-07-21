import { useMemo } from 'react';
import { moduleService } from '@/services/module.service';
import { ModuleName } from '@/types/modules.types';

export function useModuleService() {
  return moduleService;
}

export function useModuleFlow(module: ModuleName, flowType: string) {
  const steps = useMemo(() => {
    try {
      return moduleService.getModuleFlow(module, flowType);
    } catch (error) {
      console.error(`Error loading module flow: ${error}`);
      return [];
    }
  }, [module, flowType]);

  return steps;
}

export function useModuleStatus(module: ModuleName) {
  const statuses = useMemo(() => {
    try {
      return moduleService.getModuleStatuses(module);
    } catch (error) {
      console.error(`Error loading module statuses: ${error}`);
      return {};
    }
  }, [module]);

  return statuses;
}

export function useModuleStates(module: ModuleName) {
  const states = useMemo(() => {
    try {
      return moduleService.getModuleStates(module);
    } catch (error) {
      console.error(`Error loading module states: ${error}`);
      return {};
    }
  }, [module]);

  return states;
}