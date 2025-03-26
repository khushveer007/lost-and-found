import { useState, useEffect } from 'react'
import { items as itemsApi, Item } from '@/services/api'
import { useAuth } from '@/contexts/AuthContext'

export function useItems(type?: 'lost' | 'found') {
  const [data, setData] = useState<Item[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth()
  
  const fetchItems = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await itemsApi.getItems(type)
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch items')
      }
      
      setData(response.data)
    } catch (error: any) {
      console.error('Error fetching items:', error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }
  
  useEffect(() => {
    fetchItems()
  }, [type])
  
  const createItem = async (item: Omit<Item, 'id' | 'created_at'>) => {
    try {
      const response = await itemsApi.createItem(item)
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to create item')
      }
      
      // Refresh the list after creating
      fetchItems()
      
      return { success: true }
    } catch (error: any) {
      console.error('Error creating item:', error)
      return { success: false, error: error.message }
    }
  }
  
  const updateItem = async (id: number, updates: Partial<Item>) => {
    try {
      const response = await itemsApi.updateItem(id, updates)
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to update item')
      }
      
      // Refresh the list after updating
      fetchItems()
      
      return { success: true }
    } catch (error: any) {
      console.error('Error updating item:', error)
      return { success: false, error: error.message }
    }
  }
  
  const deleteItem = async (id: number) => {
    try {
      const response = await itemsApi.deleteItem(id)
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to delete item')
      }
      
      // Refresh the list after deleting
      fetchItems()
      
      return { success: true }
    } catch (error: any) {
      console.error('Error deleting item:', error)
      return { success: false, error: error.message }
    }
  }
  
  const searchItems = async (query: string) => {
    try {
      const response = await itemsApi.searchItems(query)
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to search items')
      }
      
      return { success: true, data: response.data }
    } catch (error: any) {
      console.error('Error searching items:', error)
      return { success: false, error: error.message, data: [] }
    }
  }
  
  const getUserItems = async () => {
    if (!user) return { success: false, error: 'User not authenticated', data: [] }
    
    try {
      const response = await itemsApi.getItems(undefined, undefined, user.id)
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch user items')
      }
      
      return { success: true, data: response.data }
    } catch (error: any) {
      console.error('Error fetching user items:', error)
      return { success: false, error: error.message, data: [] }
    }
  }
  
  return {
    data,
    loading,
    error,
    refresh: fetchItems,
    createItem,
    updateItem,
    deleteItem,
    searchItems,
    getUserItems
  }
}
