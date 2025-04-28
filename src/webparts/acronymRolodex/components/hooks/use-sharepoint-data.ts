import { useState, useEffect } from 'react';
import { SharePointService, SharePointError, ISharePointServiceConfig } from '../../services/sharepoint.service';
import { AcronymData } from '../types';

interface UseSharePointDataState {
  data: AcronymData[];
  isLoading: boolean;
  error: SharePointError | null;
}

interface UseSharePointDataResult extends UseSharePointDataState {
  refreshData: () => Promise<void>;
}

export function useSharePointData(
  service: SharePointService,
  config: ISharePointServiceConfig
): UseSharePointDataResult {
  const [state, setState] = useState<UseSharePointDataState>({
    data: [],
    isLoading: true,
    error: null,
  });

  const fetchData = async () => {
    // Skip if no service or invalid configuration
    if (!service || !config || !config.listUrl) {
      setState(prev => ({ 
        ...prev, 
        isLoading: false,
        error: new SharePointError('SharePoint service or configuration is missing') 
      }));
      return;
    }

    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      // Validate field mappings
      const { fieldMappings } = config;
      if (!fieldMappings.acronym || !fieldMappings.definition) {
        setState(prev => ({ 
          ...prev, 
          isLoading: false,
          error: new SharePointError('Required field mappings are missing (acronym or definition)') 
        }));
        return;
      }

      // Fetch data from SharePoint
      const items = await service.getListItems(config.fieldMappings);
      
      // Validate items
      if (!Array.isArray(items)) {
        setState(prev => ({ 
          ...prev, 
          isLoading: false,
          error: new SharePointError('Received invalid data format from SharePoint') 
        }));
        return;
      }
      
      // Update state with the items
      setState(prev => ({ ...prev, data: items, isLoading: false, error: null }));
    } catch (error) {
      console.error('Error in useSharePointData:', error);
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof SharePointError 
          ? error 
          : new SharePointError(error instanceof Error ? error.message : 'Unknown error occurred'),
      }));
    }
  };

  useEffect(() => {
    if (service && config.listUrl) {
      fetchData();
    } else {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: !service 
          ? new SharePointError('SharePoint service is not available') 
          : !config.listUrl 
            ? new SharePointError('SharePoint list URL is not configured')
            : null
      }));
    }
  }, [service, config.listUrl]);

  return {
    ...state,
    refreshData: fetchData,
  };
} 