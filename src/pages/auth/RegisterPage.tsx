import { useState } from "react"
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
import { NavigationButton } from '@/components/ui/navigation-button';
import { useNavigation } from '@/contexts/NavigationContext';

export function RegisterPage() {
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [authError, setAuthError] = useState<string | null>(null)
  const [authSuccess, setAuthSuccess] = useState(false)
  
  const { signUp } = useAuth()
  const { navigateTo } = useNavigation();

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (!firstName) {
      newErrors.firstName = "First name is required"
    }
    
    if (!lastName) {
      newErrors.lastName = "Last name is required"
    }
    
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
    
    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
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
      const result = await signUp(email, password, firstName, lastName)
      
      if (!result.success) {
        setAuthError(result.error || "Failed to sign up")
      } else {
        setAuthSuccess(true)
        // Navigate to dashboard or login after successful registration
        setTimeout(() => {
          navigateTo('login');
        }, 1500);
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
          <h1 className="text-3xl font-bold">Create an Account</h1>
          <p className="text-muted-foreground">Enter your information to get started</p>
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
                Your account has been created. Please check your email for verification.
              </ToastDescription>
            </div>
          </Toast>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormSection>
            <div className="grid grid-cols-2 gap-4">
              <FormItem>
                <FormLabel error={!!errors.firstName}>First name</FormLabel>
                <FormControl>
                  <Input
                    id="firstName"
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
                    id="lastName"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className={errors.lastName ? "border-destructive" : ""}
                  />
                </FormControl>
                {errors.lastName && <FormMessage>{errors.lastName}</FormMessage>}
              </FormItem>
            </div>
            
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
              <FormLabel error={!!errors.password}>Password</FormLabel>
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
            
            <FormItem>
              <FormLabel error={!!errors.confirmPassword}>Confirm Password</FormLabel>
              <FormControl>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={errors.confirmPassword ? "border-destructive" : ""}
                />
              </FormControl>
              {errors.confirmPassword && <FormMessage>{errors.confirmPassword}</FormMessage>}
            </FormItem>
          </FormSection>
          
          <Button 
            type="submit" 
            className="w-full" 
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creating account..." : "Create account"}
          </Button>
          
          <div className="text-center text-sm">
            Already have an account?{" "}
            <button 
              type="button"
              onClick={() => navigateTo('login')}
              className="text-primary hover:underline"
            >
              Log in
            </button>
          </div>
        </form>
      </div>
    </AuthLayout>
  )
}

export default RegisterPage
