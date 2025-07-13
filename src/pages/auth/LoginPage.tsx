import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { AuthLayout } from "@/components/layout/AuthLayout"
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
import { useNavigation } from '@/contexts/NavigationContext';
import { supabase } from "@/services/api"

export function LoginPage() {
  // Form state
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [errors, setErrors] = useState<Record<string, string>>({})
  
  // UI state
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [authError, setAuthError] = useState<string | null>(null)
  const [authSuccess, setAuthSuccess] = useState(false)
  
  const { signIn, isAuthenticated, loading: authLoading } = useAuth()
  const { navigateTo } = useNavigation();
  const hasRedirected = useRef(false);

  // Check for session on mount, regardless of context state
  useEffect(() => {
    if (hasRedirected.current) return;
    
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      
      if (data.session) {
        console.log("Session found, redirecting to dashboard");
        hasRedirected.current = true;
        navigateTo('dashboard');
      }
    };
    
    checkSession();
  }, [navigateTo]);

  // Also use context auth state to redirect if authenticated
  useEffect(() => {
    if (hasRedirected.current) return;
    
    if (isAuthenticated && !authLoading) {
      console.log("User authenticated via context, redirecting to dashboard");
      hasRedirected.current = true;
      navigateTo('dashboard');
    }
  }, [isAuthenticated, authLoading, navigateTo]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (!email) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email is invalid"
    }
    
    if (!password) {
      newErrors.password = "Password is required"
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Prevent submitting if already redirected or redirecting
    if (hasRedirected.current) return;
    
    if (!validateForm()) return;
    
    try {
      setIsSubmitting(true);
      setAuthError(null);
      
      // Check if already authenticated before trying to login again
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        console.log("Already has session, redirecting...");
        hasRedirected.current = true;
        navigateTo('dashboard');
        return;
      }
      
      // Otherwise proceed with login
      const result = await signIn(email, password);
      
      if (!result.success) {
        throw new Error(result.error || "Failed to sign in");
      }
      
      setAuthSuccess(true);
      hasRedirected.current = true;
      navigateTo('dashboard');
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      setAuthError(errorMessage);
      setIsSubmitting(false);
    }
  }

  // Only render the form if not already authenticated
  return (
    <AuthLayout>
      <div className="space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">Welcome Back</h1>
          <p className="text-muted-foreground">Enter your credentials to access your account</p>
        </div>
        
        {authError && (
          <Toast variant="destructive">
            <div>
              <ToastTitle>Error</ToastTitle>
              <ToastDescription>{authError}</ToastDescription>
            </div>
          </Toast>
        )}
        
        {authSuccess && (
          <Toast variant="success">
            <div>
              <ToastTitle>Success!</ToastTitle>
              <ToastDescription>Logging you in...</ToastDescription>
            </div>
          </Toast>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormSection>
            <FormItem>
              <FormLabel error={!!errors.email}>Email</FormLabel>
              <FormControl>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={errors.email ? "border-destructive" : ""}
                  disabled={isSubmitting}
                  autoComplete="email"
                />
              </FormControl>
              {errors.email && <FormMessage>{errors.email}</FormMessage>}
            </FormItem>
            
            <FormItem>
              <div className="flex justify-between items-center">
                <FormLabel error={!!errors.password}>Password</FormLabel>
                <a 
                  href="#" 
                  className="text-xs text-primary hover:underline"
                  onClick={(e) => {
                    e.preventDefault();
                    // Handle forgot password
                  }}
                >
                  Forgot password?
                </a>
              </div>
              <FormControl>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={errors.password ? "border-destructive" : ""}
                  disabled={isSubmitting}
                  autoComplete="current-password"
                />
              </FormControl>
              {errors.password && <FormMessage>{errors.password}</FormMessage>}
            </FormItem>
          </FormSection>
          
          <Button 
            type="submit" 
            className="w-full relative" 
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="opacity-0">Log in</span>
                <span className="absolute inset-0 flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Logging in...
                </span>
              </>
            ) : "Log in"}
          </Button>
          
          <div className="text-center text-sm">
            Don't have an account?{" "}
            <button 
              type="button"
              onClick={() => navigateTo('register')}
              className="text-primary hover:underline"
              disabled={isSubmitting}
            >
              Create account
            </button>
          </div>
        </form>
      </div>
    </AuthLayout>
  )
}

export default LoginPage
