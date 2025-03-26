import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface ItemSearchProps {
  onSearch: (params: SearchParams) => void
  initialParams?: SearchParams
}

export interface SearchParams {
  query: string
  category?: string
  dateFrom?: string
  dateTo?: string
  status?: string
}

export function ItemSearch({ onSearch, initialParams }: ItemSearchProps) {
  const [query, setQuery] = useState(initialParams?.query || "")
  const [category, setCategory] = useState(initialParams?.category || "")
  const [dateFrom, setDateFrom] = useState(initialParams?.dateFrom || "")
  const [dateTo, setDateTo] = useState(initialParams?.dateTo || "")
  const [status, setStatus] = useState(initialParams?.status || "")
  const [showFilters, setShowFilters] = useState(false)
  
  const categories = [
    "Electronics", "Clothing", "Accessories", "Documents", 
    "Keys", "Bags", "Jewelry", "Other"
  ]
  
  const statuses = [
    "Active", "Waiting for owner", "Matched", "Claimed", "Returned", "Closed"
  ]
  
  useEffect(() => {
    // Check if any filter is applied to correctly show the filter panel
    if (category || dateFrom || dateTo || status) {
      setShowFilters(true)
    }
  }, [category, dateFrom, dateTo, status])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch({
      query,
      category: category || undefined,
      dateFrom: dateFrom || undefined,
      dateTo: dateTo || undefined,
      status: status || undefined
    })
  }
  
  const handleReset = () => {
    setQuery("")
    setCategory("")
    setDateFrom("")
    setDateTo("")
    setStatus("")
    
    onSearch({ query: "" })
  }

  return (
    <div className="bg-background rounded-lg border shadow-sm p-4 mb-6">
      <form onSubmit={handleSearch}>
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1">
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name, description, or location..."
              className="w-full"
            />
          </div>
          <div className="flex gap-2">
            <Button type="submit" variant="default">
              Search
            </Button>
            <Button 
              type="button" 
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
            >
              {showFilters ? "Hide Filters" : "Show Filters"}
            </Button>
          </div>
        </div>
        
        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-1 block">From Date</label>
              <Input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
              />
            </div>
            
            <div>
              <label className="text-sm font-medium mb-1 block">To Date</label>
              <Input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                min={dateFrom}
              />
            </div>
            
            <div>
              <label className="text-sm font-medium mb-1 block">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="">All Statuses</option>
                {statuses.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>
        )}
        
        {showFilters && (
          <div className="flex justify-end mt-4">
            <Button 
              type="button" 
              variant="ghost" 
              onClick={handleReset}
              className="text-sm"
            >
              Reset All Filters
            </Button>
          </div>
        )}
      </form>
    </div>
  )
}
