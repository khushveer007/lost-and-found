import { useState, useEffect } from "react"
import { ItemCard } from "@/components/shared/ItemCard"
import { Item } from "@/services/api"
import { ItemSearch, SearchParams } from "./ItemSearch"

interface ItemListProps {
  items: Item[]
  type: 'lost' | 'found' | 'all'
  onItemClick?: (item: Item) => void
  isLoading?: boolean
}

export function ItemList({ items, type, onItemClick, isLoading }: ItemListProps) {
  const [filteredItems, setFilteredItems] = useState<Item[]>(items)
  const [searchParams, setSearchParams] = useState<SearchParams>({ query: "" })
  
  useEffect(() => {
    if (!searchParams.query && !searchParams.category && !searchParams.dateFrom && 
        !searchParams.dateTo && !searchParams.status) {
      setFilteredItems(items)
      return
    }
    
    let results = [...items]
    
    // Filter by query (name, description, location)
    if (searchParams.query) {
      const query = searchParams.query.toLowerCase()
      results = results.filter(item => 
        item.name.toLowerCase().includes(query) || 
        item.description.toLowerCase().includes(query) || 
        item.location.toLowerCase().includes(query)
      )
    }
    
    // Filter by category
    if (searchParams.category) {
      results = results.filter(item => 
        item.category === searchParams.category
      )
    }
    
    // Filter by date range
    if (searchParams.dateFrom) {
      const fromDate = new Date(searchParams.dateFrom)
      results = results.filter(item => 
        new Date(item.date) >= fromDate
      )
    }
    
    if (searchParams.dateTo) {
      const toDate = new Date(searchParams.dateTo)
      toDate.setHours(23, 59, 59, 999) // End of the day
      results = results.filter(item => 
        new Date(item.date) <= toDate
      )
    }
    
    // Filter by status
    if (searchParams.status) {
      results = results.filter(item => 
        item.status === searchParams.status
      )
    }
    
    setFilteredItems(results)
  }, [items, searchParams])

  const handleSearch = (params: SearchParams) => {
    setSearchParams(params)
  }

  // Filter by type if needed
  const displayItems = type === 'all' 
    ? filteredItems 
    : filteredItems.filter(item => item.type === type)

  return (
    <div>
      <ItemSearch onSearch={handleSearch} />
      
      {isLoading ? (
        <div className="flex justify-center p-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary"></div>
        </div>
      ) : displayItems.length === 0 ? (
        <div className="bg-background border rounded-lg p-12 text-center">
          <h3 className="text-lg font-medium mb-2">No items found</h3>
          <p className="text-muted-foreground">
            {searchParams.query || searchParams.category || searchParams.status ? 
              "Try adjusting your search filters" : 
              type === 'lost' ? 
                "No lost items have been reported yet" : 
                "No found items have been reported yet"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayItems.map((item) => (
            <div 
              key={item.id} 
              onClick={() => onItemClick && onItemClick(item)}
              className={onItemClick ? "cursor-pointer" : ""}
            >
              <ItemCard item={item} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
