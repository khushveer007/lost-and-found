import { ReactNode } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { useNavigation } from "@/contexts/NavigationContext"
import { Button } from "@/components/ui/button"

interface ProtectedRouteProps {
  children: ReactNode
  fallback?: ReactNode
}

export function ProtectedRoute({ children, fallback }: ProtectedRouteProps) {
  const { isAuthenticated, loading } = useAuth()
  const { navigateTo } = useNavigation()
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary"></div>
      </div>
    )
  }
  
  if (!isAuthenticated) {
    return fallback || (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="bg-background border rounded-lg p-8 max-w-md w-full">
          <h1 className="text-2xl font-bold mb-4">Authentication Required</h1>
          <p className="text-muted-foreground mb-6">
            You need to be logged in to access this page.
          </p>
          <div className="flex gap-4">
            <Button 
              onClick={() => navigateTo('login')}
              className="inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground px-4 py-2 text-sm font-medium"
            >
              Log in
            </Button>
            <Button 
              variant="outline"
              onClick={() => navigateTo('register')}
              className="inline-flex items-center justify-center rounded-md border border-input px-4 py-2 text-sm font-medium"
            >
              Sign up
            </Button>
          </div>
        </div>
      </div>
    )
  }
  
  return <>{children}</>
}
