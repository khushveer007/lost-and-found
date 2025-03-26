import { useState, useEffect } from 'react';
import { supabase, Item } from '@/services/api';
import { useItems } from './useItems';

type ItemType = 'lost' | 'found';

interface UseRealtimeItemsResult {
  data: Item[];
  loading: boolean;
  error: any;
  refresh: () => Promise<void>;
}

export function useRealtimeItems(type?: ItemType): UseRealtimeItemsResult {
  const { data, loading, error, refresh } = useItems(type);
  
  useEffect(() => {
    // Subscribe to changes in the items table
    const subscription = supabase
      .channel('items-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'items',
        },
        (payload) => {
          console.log('Change received!', payload);
          // Refresh the items when a change occurs
          refresh();
        }
      )
      .subscribe();
    
    // Clean up subscription
    return () => {
      supabase.removeChannel(subscription);
    };
  }, [refresh]);
  
  return { data, loading, error, refresh };
}
