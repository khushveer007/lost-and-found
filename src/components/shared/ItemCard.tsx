import { Button } from "@/components/ui/button"
import { Item } from "@/services/api"

interface ItemCardProps {
  item: Item
  onClick?: () => void
  simplified?: boolean
}

export function ItemCard({ item, onClick, simplified = false }: ItemCardProps) {
  // Format the date
  const formattedDate = new Date(item.date).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
  
  // Generate badge style based on status
  const getBadgeStyle = (status: string) => {
    if (status === "Active" || status === "Waiting for owner") {
      return "bg-amber-100 text-amber-800";
    } else if (status === "Matched" || status === "Owner contacted") {
      return "bg-blue-100 text-blue-800";
    } else {
      return "bg-green-100 text-green-800";
    }
  };

  // Screen reader text for item type
  const itemTypeLabel = item.type === "lost" 
    ? "Lost item" 
    : "Found item";

  if (simplified) {
    // Simplified version for list views
    return (
      <div 
        className="flex items-center border rounded-md p-3 bg-background hover:bg-muted/50 transition-colors duration-300 hover:shadow-sm"
        tabIndex={onClick ? 0 : undefined}
        role={onClick ? "button" : undefined}
        onClick={onClick}
        onKeyDown={(e) => {
          if (onClick && (e.key === 'Enter' || e.key === ' ')) {
            e.preventDefault();
            onClick();
          }
        }}
        aria-label={`${itemTypeLabel}: ${item.name}, ${item.status}, in ${item.location}`}
      >
        <div className="w-12 h-12 bg-muted rounded overflow-hidden mr-3 flex-shrink-0">
          {item.image_url ? (
            <img 
              src={item.image_url} 
              alt="" // Decorative image, main content conveyed by text
              className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
              aria-hidden="true"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs" aria-hidden="true">
              No img
            </div>
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start">
            <h3 className="font-medium truncate">{item.name}</h3>
            <span 
              className={`text-xs px-2 py-0.5 rounded-full ml-2 flex-shrink-0 ${getBadgeStyle(item.status)}`}
              aria-label={`Status: ${item.status}`}
            >
              {item.status}
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1 truncate">
            {item.category} • {item.location} • {formattedDate}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div 
      className="border rounded-lg overflow-hidden bg-background shadow-sm hover:shadow transition-shadow group"
      onClick={onClick}
      tabIndex={onClick ? 0 : undefined}
      role={onClick ? "button" : undefined}
      onKeyDown={(e) => {
        if (onClick && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onClick();
        }
      }}
      aria-label={`${itemTypeLabel}: ${item.name}, ${item.status}, in ${item.location}`}
    >
      <div className="aspect-video bg-muted relative">
        {item.image_url ? (
          <img 
            src={item.image_url} 
            alt="" // Decorative image, main content conveyed by text
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            aria-hidden="true"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground" aria-hidden="true">
            No image available
          </div>
        )}
        <div className="absolute top-2 right-2">
          <span 
            className={`text-xs font-medium px-2 py-1 rounded-full ${
              item.type === "lost" ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"
            }`}
            aria-hidden="true" // Already conveyed in the parent's aria-label
          >
            {item.type === "lost" ? "Lost" : "Found"}
          </span>
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="font-bold text-lg truncate">{item.name}</h3>
        <p className="text-sm text-muted-foreground mb-2">
          {item.category} • {item.location}
        </p>
        <p className="text-sm mb-4 line-clamp-2">{item.description}</p>
        
        <div className="flex justify-between items-center">
          <span 
            className={`text-xs px-2 py-1 rounded-full ${getBadgeStyle(item.status)}`}
            aria-label={`Status: ${item.status}`}
          >
            {item.status}
          </span>
          
          <Button 
            size="sm" 
            variant="outline" 
            className="transition-transform duration-300 hover:scale-105"
            onClick={(e) => {
              e.stopPropagation(); // Prevent triggering parent onClick
              if (onClick) onClick();
            }}
          >
            View Details
          </Button>
        </div>
      </div>
    </div>
  )
}
