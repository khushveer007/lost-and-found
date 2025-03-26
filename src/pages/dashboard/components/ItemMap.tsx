import { Item } from "@/services/api"
import { useAnimationOnMount } from "@/components/ui/transitions"

interface ItemMapProps {
  lostItems?: Item[]
  foundItems?: Item[]
  isLoading?: boolean
}

export function ItemMap({ lostItems = [], foundItems = [], isLoading = false }: ItemMapProps) {
  const isVisible = useAnimationOnMount(300);

  if (isLoading) {
    return (
      <div className="bg-background border rounded-lg shadow-sm overflow-hidden">
        <div className="p-4 border-b">
          <div className="h-6 bg-muted rounded w-1/4 animate-pulse"></div>
        </div>
        <div className="bg-muted h-80 flex items-center justify-center">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-primary"></div>
        </div>
      </div>
    )
  }

  // Count items by location for visualization
  const locationCounts = [...lostItems, ...foundItems].reduce((acc, item) => {
    const location = item.location
    acc[location] = (acc[location] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  // Get top locations
  const topLocations = Object.entries(locationCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)

  return (
    <div 
      className={`bg-background border rounded-lg shadow-sm overflow-hidden transition-all duration-700 transform ${
        isVisible 
          ? "opacity-100 translate-y-0" 
          : "opacity-0 translate-y-20"
      }`}
    >
      <div className="p-4 border-b">
        <h2 className="text-xl font-semibold">Item Locations</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4">
        <div className="p-4 md:border-r">
          <h3 className="text-sm font-medium mb-3">Top Locations</h3>
          
          {topLocations.length > 0 ? (
            <div className="space-y-3">
              {topLocations.map(([location, count], index) => (
                <div 
                  key={location} 
                  className={`flex justify-between items-center transition-all duration-500 ${
                    isVisible 
                      ? "opacity-100 translate-x-0" 
                      : "opacity-0 -translate-x-10"
                  }`}
                  style={{ transitionDelay: `${index * 100 + 200}ms` }}
                >
                  <span className="text-sm truncate max-w-[200px]">{location}</span>
                  <span className="text-xs bg-primary/10 rounded-full px-2 py-1 transition-transform hover:scale-110 duration-300">{count} items</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No location data available yet</p>
          )}
        </div>
        
        <div className="bg-muted/50 col-span-3 h-80 flex items-center justify-center">
          <div className={`text-center p-6 transition-opacity duration-700 ${isVisible ? 'opacity-100' : 'opacity-0'}`} style={{ transitionDelay: '400ms' }}>
            <p className="text-muted-foreground mb-2">
              Map integration will be displayed here.
            </p>
            <p className="text-sm text-muted-foreground">
              (Google Maps or other mapping service integration)
            </p>
            <div className="mt-4 grid grid-cols-2 gap-4 text-center">
              <div className="transition-transform duration-500 hover:scale-105">
                <span className="inline-block w-3 h-3 rounded-full bg-red-500 mr-2 animate-pulse"></span>
                <span className="text-sm">Lost Items: {lostItems.length}</span>
              </div>
              <div className="transition-transform duration-500 hover:scale-105">
                <span className="inline-block w-3 h-3 rounded-full bg-green-500 mr-2 animate-pulse"></span>
                <span className="text-sm">Found Items: {foundItems.length}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
