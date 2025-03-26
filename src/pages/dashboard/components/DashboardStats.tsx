import { useAnimationOnMount } from "@/components/ui/transitions"

interface Stat {
  label: string
  value: number
}

interface DashboardStatsProps {
  stats: Stat[]
  isLoading?: boolean
}

export function DashboardStats({ stats, isLoading = false }: DashboardStatsProps) {
  const isVisible = useAnimationOnMount();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, index) => (
          <div key={index} className="bg-background border rounded-lg p-4 shadow-sm animate-pulse">
            <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
            <div className="h-8 bg-muted rounded w-1/4"></div>
          </div>
        ))}
      </div>
    )
  }
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <div 
          key={index} 
          className={`bg-background border rounded-lg p-4 shadow-sm transition-all duration-500 transform ${
            isVisible 
              ? "opacity-100 translate-y-0" 
              : "opacity-0 translate-y-10"
          }`}
          style={{ transitionDelay: `${index * 100}ms` }}
        >
          <p className="text-muted-foreground">{stat.label}</p>
          <p className="text-3xl font-bold transition-transform duration-300 hover:scale-105 origin-left">{stat.value}</p>
        </div>
      ))}
    </div>
  )
}
