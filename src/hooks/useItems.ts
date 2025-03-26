import { useState, useEffect, useCallback } from 'react';
import { Item } from '@/services/api';

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
      // Simulate API call with mock data
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mock data for testing
      const mockItems: Item[] = [
        // You can replace this with actual API calls
        {
          id: 1,
          name: "Laptop",
          description: "Silver MacBook Pro",
          category: "Electronics",
          location: "Library",
          date: "2023-05-15",
          type: "lost",
          status: "Active",
          user_id: "user1",
          created_at: "2023-05-15T10:30:00Z"
        },
        {
          id: 2,
          name: "Water Bottle",
          description: "Blue Hydro Flask",
          category: "Accessories",
          location: "Gym",
          date: "2023-05-16",
          type: "found",
          status: "Waiting for owner",
          user_id: "user2",
          created_at: "2023-05-16T14:20:00Z"
        }
      ];
      
      // Filter by type if specified
      const filteredItems = type 
        ? mockItems.filter(item => item.type === type) 
        : mockItems;
      
      setData(filteredItems);
      setError(null);
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
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // In a real app, you'd call your API here
      // For now, just add it to the local state
      const newItem: Item = {
        ...item,
        id: Math.floor(Math.random() * 10000),
        created_at: new Date().toISOString()
      };
      
      setData(prev => [...prev, newItem]);
      
      return { success: true };
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
