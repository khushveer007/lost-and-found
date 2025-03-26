import { Item } from "@/services/api"
import { Button } from "@/components/ui/button"
import { useNavigation } from '@/contexts/NavigationContext'

interface RecentItemsProps {
  type: "lost" | "found"
  items?: Item[]
  isLoading?: boolean
}

export function RecentItems({ type, items = [], isLoading = false }: RecentItemsProps) {
  const { navigateTo } = useNavigation();

  if (isLoading) {
    return (
      <div className="bg-background border rounded-lg shadow-sm overflow-hidden">
        <div className="p-4 border-b">
          <div className="h-6 bg-muted rounded w-1/3 animate-pulse"></div>
        </div>
        <div className="divide-y">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="p-4">
              <div className="flex justify-between mb-2">
                <div className="h-5 bg-muted rounded w-1/4 animate-pulse"></div>
                <div className="h-5 bg-muted rounded w-1/5 animate-pulse"></div>
              </div>
              <div className="space-y-2">
                <div className="h-4 bg-muted rounded w-4/5 animate-pulse"></div>
                <div className="h-4 bg-muted rounded w-3/5 animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-background border rounded-lg shadow-sm overflow-hidden">
      <div className="p-4 border-b">
        <h2 className="text-xl font-semibold">Recent {type === "lost" ? "Lost" : "Found"} Items</h2>
      </div>
      <div className="divide-y">
        {items.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-muted-foreground">No {type} items reported yet</p>
          </div>
        ) : (
          items.map((item) => (
            <div 
              key={item.id} 
              className="p-4 hover:bg-muted/50 transition-colors cursor-pointer"
              onClick={() => navigateTo('items')}
            >
              <div className="flex justify-between">
                <h3 className="font-medium">{item.name}</h3>
                <span className={`text-sm px-2 py-1 rounded-full ${
                  item.status === "Active" || item.status === "Waiting for owner" 
                    ? "bg-amber-100 text-amber-800" 
                    : item.status === "Matched" || item.status === "Owner contacted"
                    ? "bg-blue-100 text-blue-800"
                    : "bg-green-100 text-green-800"
                }`}>
                  {item.status}
                </span>
              </div>
              <div className="text-sm text-muted-foreground mt-1">
                <p>Location: {item.location}</p>
                <p>Date: {new Date(item.date).toLocaleDateString()}</p>
              </div>
            </div>
          ))
        )}
      </div>
      <div className="p-4 border-t">
        <Button 
          variant="link" 
          className="px-0 text-sm"
          onClick={() => navigateTo('items')}
        >
          View all {type} items →
        </Button>
      </div>
    </div>
  )
}
