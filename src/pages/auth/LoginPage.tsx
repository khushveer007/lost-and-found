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
import { Link } from '@/components/ui/link';
import { useNavigation } from '@/contexts/NavigationContext';
import { NavigationButton } from '@/components/ui/navigation-button';

export function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [authError, setAuthError] = useState<string | null>(null)
  const [authSuccess, setAuthSuccess] = useState(false)
  const [redirecting, setRedirecting] = useState(false)
  
  const { signIn, isAuthenticated } = useAuth()
  const { navigateTo } = useNavigation();

  // Redirect to dashboard if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigateTo('dashboard');
    }
  }, [isAuthenticated, navigateTo]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setIsSubmitting(true)
    setAuthError(null)
    
    try {
      const result = await signIn(email, password)
      
      if (!result.success) {
        setAuthError(result.error || "Failed to sign in")
      } else {
        setAuthSuccess(true)
        setRedirecting(true)
        
        // Wait a bit to show success message before navigating
        setTimeout(() => {
          navigateTo('dashboard');
        }, 1000);
      }
    } catch (error) {
      setAuthError("An unexpected error occurred")
      console.error(error)
    } finally {
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
              <ToastDescription>
                {redirecting 
                  ? "You have successfully logged in. Redirecting to dashboard..." 
                  : "You have successfully logged in."}
              </ToastDescription>
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
                  placeholder="m@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={errors.email ? "border-destructive" : ""}
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
                />
              </FormControl>
              {errors.password && <FormMessage>{errors.password}</FormMessage>}
            </FormItem>
          </FormSection>
          
          <Button 
            type="submit" 
            className="w-full" 
            disabled={isSubmitting || redirecting}
          >
            {isSubmitting ? "Logging in..." : redirecting ? "Redirecting..." : "Log in"}
          </Button>
          
          <div className="text-center text-sm">
            Don't have an account?{" "}
            <button 
              type="button"
              onClick={() => navigateTo('register')}
              className="text-primary hover:underline"
              disabled={redirecting}
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
