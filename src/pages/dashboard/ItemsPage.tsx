import { useState } from "react"
import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { AnimatedButton } from "@/components/ui/animated-button"
import { useItems } from "@/hooks/useItems"
import { Item } from "@/services/api"
import { ProtectedRoute } from "@/components/auth/ProtectedRoute"
import { ItemList } from "@/components/dashboard/ItemList"
import { Dialog } from "@/components/ui/dialog"
import { ItemForm } from "@/components/dashboard/ItemForm"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAnimationOnMount } from "@/components/ui/transitions"

export function ItemsPage() {
  const [activeTab, setActiveTab] = useState<'all' | 'lost' | 'found'>('all')
  const [isReportingLost, setIsReportingLost] = useState(false)
  const [isReportingFound, setIsReportingFound] = useState(false)
  const [selectedItem, setSelectedItem] = useState<Item | null>(null)
  const isVisible = useAnimationOnMount()
  
  const { data: items, loading } = useItems()
  
  const handleItemClick = (item: Item) => {
    setSelectedItem(item)
  }
  
  const handleCloseItemDetails = () => {
    setSelectedItem(null)
  }

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="p-6">
          <div className={`flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 transition-all duration-500 transform ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-8"
          }`}>
            <h1 className="text-3xl font-bold">My Items</h1>
            <div className="flex gap-2">
              <AnimatedButton 
                variant="outline" 
                onClick={() => setIsReportingFound(true)}
              >
                I Found Something
              </AnimatedButton>
              <AnimatedButton 
                onClick={() => setIsReportingLost(true)}
              >
                Report Lost Item
              </AnimatedButton>
            </div>
          </div>
          
          <div className={`transition-all duration-500 delay-100 transform ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}>
            <Tabs 
              value={activeTab} 
              onValueChange={(value) => setActiveTab(value as 'all' | 'lost' | 'found')}
              className="mb-6"
            >
              <TabsList className="grid w-full md:w-auto grid-cols-3">
                <TabsTrigger value="all">All Items</TabsTrigger>
                <TabsTrigger value="lost">Lost Items</TabsTrigger>
                <TabsTrigger value="found">Found Items</TabsTrigger>
              </TabsList>
              
              <TabsContent value="all" className="mt-6">
                <ItemList 
                  items={items} 
                  type="all" 
                  onItemClick={handleItemClick}
                  isLoading={loading}
                />
              </TabsContent>
              
              <TabsContent value="lost" className="mt-6">
                <ItemList 
                  items={items.filter(item => item.type === 'lost')} 
                  type="lost" 
                  onItemClick={handleItemClick}
                  isLoading={loading}
                />
              </TabsContent>
              
              <TabsContent value="found" className="mt-6">
                <ItemList 
                  items={items.filter(item => item.type === 'found')} 
                  type="found" 
                  onItemClick={handleItemClick}
                  isLoading={loading}
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>
        
        {/* Lost Item Form Dialog */}
        <Dialog
          isOpen={isReportingLost}
          onClose={() => setIsReportingLost(false)}
          title="Report a Lost Item"
        >
          <ItemForm 
            type="lost" 
            onSuccess={() => setIsReportingLost(false)}
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
            onSuccess={() => setIsReportingFound(false)}
            onCancel={() => setIsReportingFound(false)}
          />
        </Dialog>
        
        {/* Item Details Dialog */}
        <Dialog
          isOpen={!!selectedItem}
          onClose={handleCloseItemDetails}
          title={selectedItem?.name || "Item Details"}
        >
          {selectedItem && (
            <div className="space-y-6">
              <div className="aspect-video bg-muted relative rounded-lg overflow-hidden">
                {selectedItem.image_url ? (
                  <img 
                    src={selectedItem.image_url} 
                    alt={selectedItem.name} 
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                    No image available
                  </div>
                )}
                <div className="absolute top-2 right-2">
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                    selectedItem.type === "lost" ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"
                  }`}>
                    {selectedItem.type === "lost" ? "Lost" : "Found"}
                  </span>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-bold">{selectedItem.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {selectedItem.category} • {selectedItem.location}
                  </p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="transition-all duration-300 hover:bg-muted/20 rounded-md p-2 -mx-2">
                    <h4 className="text-sm font-medium">Date</h4>
                    <p>{new Date(selectedItem.date).toLocaleDateString()}</p>
                  </div>
                  <div className="transition-all duration-300 hover:bg-muted/20 rounded-md p-2 -mx-2">
                    <h4 className="text-sm font-medium">Status</h4>
                    <p className="transition-colors duration-300 hover:text-primary">{selectedItem.status}</p>
                  </div>
                </div>
                
                <div className="transition-all duration-300 hover:bg-muted/20 rounded-md p-2 -mx-2">
                  <h4 className="text-sm font-medium">Description</h4>
                  <p className="mt-1">{selectedItem.description}</p>
                </div>
              </div>
              
              <div className="flex justify-end">
                <AnimatedButton onClick={handleCloseItemDetails}>
                  Close
                </AnimatedButton>
              </div>
            </div>
          )}
        </Dialog>
      </DashboardLayout>
    </ProtectedRoute>
  )
}

export default ItemsPage
