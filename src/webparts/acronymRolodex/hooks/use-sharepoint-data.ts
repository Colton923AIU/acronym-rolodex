import { useState, useEffect } from 'react';
import { SharePointService, SharePointError, ISharePointServiceConfig } from '../services/sharepoint.service';
import { AcronymData } from '../components/types';

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
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      const items = await service.getListItems(config.fieldMappings);
      setState(prev => ({ ...prev, data: items, isLoading: false }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof SharePointError ? error : new SharePointError('Unknown error occurred'),
      }));
    }
  };

  useEffect(() => {
    fetchData();
  }, [service, config.listUrl]);

  return {
    ...state,
    refreshData: fetchData,
  };
} 