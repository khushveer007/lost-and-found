import { useState } from "react"
import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  FormItem, 
  FormLabel, 
  FormControl, 
  FormMessage,
  FormSection 
} from "@/components/ui/form"
import { Toast, ToastTitle, ToastDescription } from "@/components/ui/toast"
import { useAuth } from "@/contexts/AuthContext"
import { ProtectedRoute } from "@/components/auth/ProtectedRoute"
import { useItems } from "@/hooks/useItems"

export function ProfilePage() {
  const { user } = useAuth()
  const { data: userItems } = useItems()
  
  const [firstName, setFirstName] = useState(user?.first_name || "")
  const [lastName, setLastName] = useState(user?.last_name || "")
  const [email] = useState(user?.email || "")
  
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [formSuccess, setFormSuccess] = useState(false)

  // Stats about user activity
  const lostItems = userItems.filter(item => item.type === 'lost')
  const foundItems = userItems.filter(item => item.type === 'found')
  const resolvedItems = userItems.filter(item => 
    item.status === 'Claimed' || 
    item.status === 'Returned' || 
    item.status === 'Closed'
  )

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (!firstName.trim()) {
      newErrors.firstName = "First name is required"
    }
    
    if (!lastName.trim()) {
      newErrors.lastName = "Last name is required"
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setIsSubmitting(true)
    setFormError(null)
    
    try {
      // In a real app, update the user profile
      // await updateUserProfile({ firstName, lastName })
      
      setFormSuccess(true)
      setTimeout(() => setFormSuccess(false), 3000)
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Failed to update profile";
      setFormError(errorMessage);
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="p-6">
          <h1 className="text-3xl font-bold mb-6">My Profile</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Profile form */}
            <div className="md:col-span-2 bg-background border rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-6">Profile Information</h2>
              
              {formError && (
                <Toast variant="destructive" className="mb-4">
                  <div>
                    <ToastTitle>Error</ToastTitle>
                    <ToastDescription>{formError}</ToastDescription>
                  </div>
                </Toast>
              )}
              
              {formSuccess && (
                <Toast variant="success" className="mb-4">
                  <div>
                    <ToastTitle>Success!</ToastTitle>
                    <ToastDescription>
                      Your profile has been updated successfully.
                    </ToastDescription>
                  </div>
                </Toast>
              )}
              
              <form onSubmit={handleSubmit}>
                <FormSection>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <FormItem>
                      <FormLabel error={!!errors.firstName}>First name</FormLabel>
                      <FormControl>
                        <Input
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          className={errors.firstName ? "border-destructive" : ""}
                        />
                      </FormControl>
                      {errors.firstName && <FormMessage>{errors.firstName}</FormMessage>}
                    </FormItem>
                    
                    <FormItem>
                      <FormLabel error={!!errors.lastName}>Last name</FormLabel>
                      <FormControl>
                        <Input
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          className={errors.lastName ? "border-destructive" : ""}
                        />
                      </FormControl>
                      {errors.lastName && <FormMessage>{errors.lastName}</FormMessage>}
                    </FormItem>
                  </div>
                  
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        value={email}
                        disabled
                        className="bg-muted/50"
                      />
                    </FormControl>
                    <p className="text-xs text-muted-foreground mt-1">
                      Your email cannot be changed
                    </p>
                  </FormItem>
                </FormSection>
                
                <div className="flex justify-end mt-6">
                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </form>
            </div>
            
            {/* User stats */}
            <div className="space-y-6">
              <div className="bg-background border rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4">Activity Summary</h2>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Lost Items</span>
                    <span className="font-medium">{lostItems.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Found Items</span>
                    <span className="font-medium">{foundItems.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Resolved Items</span>
                    <span className="font-medium">{resolvedItems.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Success Rate</span>
                    <span className="font-medium">
                      {userItems.length > 0 
                        ? `${Math.round((resolvedItems.length / userItems.length) * 100)}%` 
                        : "N/A"}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="bg-background border rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4">Account Settings</h2>
                <div className="space-y-4">
                  <Button variant="outline" className="w-full justify-start">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                    </svg>
                    Change Password
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Notification Settings
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}

export default ProfilePage
