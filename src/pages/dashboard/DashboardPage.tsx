import { useState, useEffect } from "react"
import { AnimatedButton } from "@/components/ui/animated-button"
import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { DashboardStats } from "./components/DashboardStats"
import { RecentItems } from "./components/RecentItems"
import { ItemMap } from "./components/ItemMap"
import { useRealtimeItems } from '@/hooks/useRealtimeItems'
import { ProtectedRoute } from "@/components/auth/ProtectedRoute"
import { ItemForm } from "@/components/dashboard/ItemForm"
import { Dialog } from "@/components/ui/dialog"
import { useAnimationOnMount } from "@/components/ui/transitions"

export function DashboardPage() {
  const [isReportingLost, setIsReportingLost] = useState(false)
  const [isReportingFound, setIsReportingFound] = useState(false)
  const [initializingDashboard, setInitializingDashboard] = useState(true)
  const isVisible = useAnimationOnMount()
  
  const { data: lostItems, loading: loadingLost } = useRealtimeItems('lost')
  const { data: foundItems, loading: loadingFound } = useRealtimeItems('found')
  
  const activeLostCount = lostItems.filter(item => item.status === 'Active').length
  const waitingForOwnerCount = foundItems.filter(item => item.status === 'Waiting for owner').length
  const matchedCount = [...lostItems, ...foundItems].filter(item => 
    item.status === 'Matched' || item.status === 'Owner contacted'
  ).length
  const claimedCount = [...lostItems, ...foundItems].filter(item => 
    item.status === 'Claimed' || item.status === 'Returned'
  ).length

  const handleLostFormSubmit = () => {
    setIsReportingLost(false)
  }
  
  const handleFoundFormSubmit = () => {
    setIsReportingFound(false)
  }

  useEffect(() => {
    const initDashboard = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 300))
      } finally {
        setInitializingDashboard(false)
      }
    }
    
    initDashboard()
  }, [])

  return (
    <ProtectedRoute>
      <DashboardLayout>
        {initializingDashboard ? (
          <div className="flex justify-center items-center h-[calc(100vh-80px)]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary"></div>
          </div>
        ) : (
          <div className="p-6 space-y-6">
            <div className={`flex justify-between items-center transition-all duration-500 transform ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-8"
            }`}>
              <h1 className="text-3xl font-bold">Dashboard</h1>
              <div className="flex gap-2">
                <AnimatedButton 
                  variant="outline" 
                  onClick={() => setIsReportingFound(true)}
                  animateOnHover={true}
                >
                  I Found Something
                </AnimatedButton>
                <AnimatedButton 
                  onClick={() => setIsReportingLost(true)}
                  animateOnHover={true}
                >
                  Report Lost Item
                </AnimatedButton>
              </div>
            </div>
            
            <div className={`transition-all duration-500 delay-100 transform ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}>
              <DashboardStats 
                stats={[
                  { label: "Active Lost Items", value: activeLostCount },
                  { label: "Items Waiting for Owner", value: waitingForOwnerCount },
                  { label: "Matched Items", value: matchedCount },
                  { label: "Claimed Items", value: claimedCount }
                ]}
                isLoading={loadingLost || loadingFound}
              />
            </div>
            
            <div className={`grid grid-cols-1 lg:grid-cols-2 gap-6 transition-all duration-500 delay-200 transform ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}>
              <RecentItems 
                type="lost" 
                items={lostItems.slice(0, 3)} 
                isLoading={loadingLost}
              />
              <RecentItems 
                type="found" 
                items={foundItems.slice(0, 3)} 
                isLoading={loadingFound}
              />
            </div>
            
            <div className={`transition-all duration-500 delay-300 transform ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}>
              <ItemMap 
                lostItems={lostItems}
                foundItems={foundItems}
                isLoading={loadingLost || loadingFound}
              />
            </div>
          </div>
        )}
        
        {/* Lost Item Form Dialog */}
        <Dialog
          isOpen={isReportingLost}
          onClose={() => setIsReportingLost(false)}
          title="Report a Lost Item"
        >
          <ItemForm 
            type="lost" 
            onSuccess={handleLostFormSubmit}
            onCancel={() => setIsReportingLost(false)}
          />
        </Dialog>
        
        {/* Found Item Form Dialog */}
        <Dialog
          isOpen={isReportingFound}
          onClose={() => setIsReportingFound(false)}
          title="Report a Found Item"
        >
          <ItemForm 
            type="found" 
            onSuccess={handleFoundFormSubmit}
            onCancel={() => setIsReportingFound(false)}
          />
        </Dialog>
      </DashboardLayout>
    </ProtectedRoute>
  )
}

export default DashboardPage
