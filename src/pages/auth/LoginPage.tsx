import { useState, useEffect } from "react"
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

  // Improve the redirect logic to avoid the loading issue
  useEffect(() => {
    let isMounted = true;
    
    const checkAuthAndRedirect = async () => {
      // Only redirect if component is still mounted
      if (isAuthenticated && !authLoading && isMounted) {
        console.log("User already authenticated, redirecting to dashboard");
        navigateTo('dashboard');
      }
    };
    
    checkAuthAndRedirect();
    
    return () => {
      isMounted = false;
    };
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
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters"
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Don't proceed if already authenticated
    if (isAuthenticated) {
      navigateTo('dashboard');
      return;
    }
    
    if (!validateForm()) return
    
    try {
      setIsSubmitting(true)
      setAuthError(null)
      
      console.log("Attempting to sign in with email:", email);
      const result = await signIn(email, password)
      
      if (!result.success) {
        console.error("Login failed:", result.error);
        setAuthError(result.error || "Failed to sign in")
        setIsSubmitting(false)
      } else {
        console.log("Login successful, setting success state");
        setAuthSuccess(true)
        
        // Set a timeout to navigate to dashboard
        setTimeout(() => {
          navigateTo('dashboard');
        }, 1000);
      }
    } catch (error: any) {
      console.error("Unexpected login error:", error);
      setAuthError(error.message || "An unexpected error occurred")
      setIsSubmitting(false)
    }
  }

  return (
    <AuthLayout>
      <div className="space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">Welcome back</h1>
          <p className="text-muted-foreground">Enter your credentials to access your account</p>
        </div>
        
        {authError && (
          <Toast variant="destructive" className="mb-4">
            <div>
              <ToastTitle>Error</ToastTitle>
              <ToastDescription>{authError}</ToastDescription>
            </div>
          </Toast>
        )}
        
        {authSuccess && (
          <Toast variant="success" className="mb-4">
            <div>
              <ToastTitle>Success!</ToastTitle>
              <ToastDescription>You have successfully logged in. Redirecting to dashboard...</ToastDescription>
            </div>
          </Toast>
        )}
        
        <form onSubmit={handleLogin} className="space-y-4">
          <FormSection>
            <FormItem>
              <FormLabel error={!!errors.email}>Email</FormLabel>
              <FormControl>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={errors.email ? "border-destructive" : ""}
                  disabled={isSubmitting || authSuccess}
                />
              </FormControl>
              {errors.email && <FormMessage>{errors.email}</FormMessage>}
            </FormItem>
            
            <FormItem>
              <div className="flex items-center justify-between">
                <FormLabel error={!!errors.password}>Password</FormLabel>
                <a href="#" className="text-sm text-primary hover:underline">
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
                  disabled={isSubmitting || authSuccess}
                />
              </FormControl>
              {errors.password && <FormMessage>{errors.password}</FormMessage>}
            </FormItem>
          </FormSection>
          
          <Button 
            type="submit" 
            className="w-full" 
            disabled={isSubmitting || authSuccess}
          >
            {isSubmitting ? "Logging in..." : authSuccess ? "Redirecting..." : "Log in"}
          </Button>
          
          <div className="text-center text-sm">
            Don't have an account?{" "}
            <button 
              type="button"
              onClick={() => navigateTo('register')}
              className="text-primary hover:underline"
              disabled={isSubmitting || authSuccess}
            >
              Sign up
            </button>
          </div>
        </form>
      </div>
    </AuthLayout>
  )
}

export default LoginPage
