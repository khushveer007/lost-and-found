import { ReactNode, useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigation } from "@/contexts/NavigationContext";
import { supabase } from "@/services/api";

interface ProtectedRouteProps {
  children: ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, loading } = useAuth();
  const { navigateTo } = useNavigation();
  const [directSessionCheck, setDirectSessionCheck] = useState<boolean | null>(null);
  const [checkingSession, setCheckingSession] = useState(true);

  // Check session directly for immediate response after page refresh
  useEffect(() => {
    let mounted = true;
    
    const checkSession = async () => {
      try {
        console.log("ProtectedRoute: Checking direct session");
        setCheckingSession(true);
        const { data } = await supabase.auth.getSession();
        
        if (mounted) {
          setDirectSessionCheck(!!data.session);
          console.log("Direct session check result:", !!data.session);
        }
      } catch (error) {
        console.error("Session check error:", error);
        if (mounted) {
          setDirectSessionCheck(false);
        }
      } finally {
        if (mounted) {
          setCheckingSession(false);
        }
      }
    };
    
    checkSession();
    
    return () => {
      mounted = false;
    };
  }, []);

  // Combined auth state from context and direct check
  const userAuthenticated = isAuthenticated || directSessionCheck;
  
  // KEY CHANGE: Use OR instead of AND for checking state to prevent getting stuck
  const isChecking = loading || checkingSession;

  // Redirect unauthenticated users to login
  useEffect(() => {
    // Only redirect if we've confirmed user is not authenticated
    if (!isChecking && !userAuthenticated && directSessionCheck === false) {
      console.log("User not authenticated, redirecting to login");
      navigateTo('login');
    }
  }, [userAuthenticated, isChecking, directSessionCheck, navigateTo]);

  // IMPORTANT: Prioritize showing content if we've detected authentication
  if (userAuthenticated) {
    console.log("User is authenticated, showing protected content");
    return <>{children}</>;
  }

  // Show loading state only if we're still checking and haven't determined auth state
  if (isChecking) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary"></div>
          </div>
          <p className="text-muted-foreground">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // This would only briefly show before redirect happens
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary"></div>
        </div>
        <p className="text-muted-foreground">Redirecting to login...</p>
      </div>
    </div>
  );
}
