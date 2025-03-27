import { ReactNode, useEffect } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { useNavigation } from "@/contexts/NavigationContext"
import { Button } from "@/components/ui/button"
import { useState } from "react"

interface ProtectedRouteProps {
  children: ReactNode;
  fallback?: ReactNode;
  redirectAfterMs?: number;
}

export function ProtectedRoute({ children, fallback, redirectAfterMs = 0 }: ProtectedRouteProps) {
  const { isAuthenticated, loading, user } = useAuth()
  const { navigateTo } = useNavigation()
  const [showAuthMessage, setShowAuthMessage] = useState(false)
  
  // Prevent flashing unauthorized message during loading
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    // Only show auth message if still not authenticated after a short delay
    if (!loading && !isAuthenticated) {
      timer = setTimeout(() => {
        setShowAuthMessage(true);
      }, 300); // Small delay to prevent flash
    } else {
      // Clear timeout if we become authenticated
      setShowAuthMessage(false);
    }
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [loading, isAuthenticated]);
  
  // Show loading state while auth is initializing
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary"></div>
        <p className="mt-4 text-muted-foreground">Checking authentication...</p>
      </div>
    )
  }
  
  // Show children if authenticated
  if (isAuthenticated && user) {
    console.log("User is authenticated, showing protected content", user);
    return <>{children}</>
  }
  
  // Show auth message if not authenticated and not loading
  if (showAuthMessage) {
    // Auto-redirect after delay if specified
    if (redirectAfterMs > 0) {
      setTimeout(() => {
        navigateTo('login');
      }, redirectAfterMs);
    }
    
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
  
  // Return an empty loading state if auth message isn't ready to show yet
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary"></div>
    </div>
  );
}
