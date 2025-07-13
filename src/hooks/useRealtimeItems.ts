import { useEffect } from 'react';
import { Item } from '@/services/api';
import { useItems } from './useItems';

type ItemType = 'lost' | 'found';

interface UseRealtimeItemsResult {
  data: Item[];
  loading: boolean;
  error: Error | null;
  refresh: () => Promise<void>;
}

export function useRealtimeItems(type?: ItemType): UseRealtimeItemsResult {
  const { data, loading, error, refresh } = useItems(type);
  
  useEffect(() => {
    // Set up a simple polling mechanism to simulate real-time updates
    const interval = setInterval(() => {
      refresh();
    }, 30000); // Every 30 seconds
    
    // Clean up subscription
    return () => {
      clearInterval(interval);
    };
  }, [refresh]);
  
  return { data, loading, error, refresh };
}
