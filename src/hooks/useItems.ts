import { useState, useEffect, useCallback } from 'react';
import { Item, items as itemsApi } from '@/services/api';

interface UseItemsResult {
  data: Item[];
  loading: boolean;
  error: Error | null;
  refresh: () => Promise<void>;
  createItem: (item: Omit<Item, 'id' | 'created_at'>) => Promise<{ success: boolean; error?: string }>;
}

export function useItems(type?: 'lost' | 'found'): UseItemsResult {
  const [data, setData] = useState<Item[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchItems = useCallback(async () => {
    try {
      setLoading(true);
      const result = await itemsApi.getItems(type);
      
      if (result.success) {
        setData(result.data);
        setError(null);
      } else {
        throw new Error(result.error);
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch items'));
    } finally {
      setLoading(false);
    }
  }, [type]);

  const refresh = useCallback(async () => {
    await fetchItems();
  }, [fetchItems]);

  const createItem = useCallback(async (item: Omit<Item, 'id' | 'created_at'>) => {
    try {
      const result = await itemsApi.createItem(item);
      
      if (result.success) {
        // Add the new item to the local state
        setData(prev => [...prev, result.data]);
        return { success: true };
      } else {
        return { success: false, error: result.error };
      }
    } catch (err) {
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'Failed to create item' 
      };
    }
  }, []);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  return { data, loading, error, refresh, createItem };
}
