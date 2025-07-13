import { useState, useCallback, useEffect } from "react"
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
import { useNavigation } from '@/contexts/NavigationContext'
import { debounce } from '@/utils/performance'
import { EmailVerificationAlert } from "@/components/auth/EmailVerificationAlert"

export function RegisterPage() {
  // Form state
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  
  // UI state
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [registrationStage, setRegistrationStage] = useState<'idle' | 'validating' | 'creating-account' | 'verification-sent'>('idle')
  const [authError, setAuthError] = useState<string | null>(null)
  const [authSuccess, setAuthSuccess] = useState(false)
  
  const { signUp, isAuthenticated } = useAuth()
  const { navigateTo } = useNavigation()

  // If already authenticated, redirect to dashboard
  useEffect(() => {
    let isMounted = true;
    
    if (isAuthenticated && isMounted) {
      navigateTo('dashboard');
    }
    
    return () => {
      isMounted = false;
    };
  }, [isAuthenticated, navigateTo]);

  // Debounced field validation for better performance
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const validateField = useCallback(
    debounce((field: string, value: string) => {
      const newErrors = { ...errors }
      
      switch (field) {
        case 'email':
          if (!value) {
            newErrors.email = "Email is required"
          } else if (!/\S+@\S+\.\S+/.test(value)) {
            newErrors.email = "Email is invalid"
          } else {
            delete newErrors.email
          }
          break
          
        case 'password':
          if (!value) {
            newErrors.password = "Password is required"
          } else if (value.length < 6) {
            newErrors.password = "Password must be at least 6 characters"
          } else {
            delete newErrors.password
          }
          
          // Also check confirm password if it exists
          if (confirmPassword && value !== confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match"
          } else if (confirmPassword) {
            delete newErrors.confirmPassword
          }
          break
          
        case 'confirmPassword':
          if (password !== value) {
            newErrors.confirmPassword = "Passwords do not match"
          } else {
            delete newErrors.confirmPassword
          }
          break
          
        case 'firstName':
          if (!value) {
            newErrors.firstName = "First name is required"
          } else {
            delete newErrors.firstName
          }
          break
          
        case 'lastName':
          if (!value) {
            newErrors.lastName = "Last name is required"
          } else {
            delete newErrors.lastName
          }
          break
      }
      
      setErrors(newErrors)
    }, 300),
    [errors, confirmPassword, password]
  )

  // Handle input changes with optimized validation
  const handleInputChange = (field: string, value: string) => {
    switch (field) {
      case 'firstName':
        setFirstName(value)
        break
      case 'lastName':
        setLastName(value)
        break
      case 'email':
        setEmail(value)
        break
      case 'password':
        setPassword(value)
        break
      case 'confirmPassword':
        setConfirmPassword(value)
        break
    }
    
    validateField(field, value)
  }

  // Validate entire form
  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (!firstName) newErrors.firstName = "First name is required"
    if (!lastName) newErrors.lastName = "Last name is required"
    
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
    e.preventDefault();
    
    // Don't proceed if already authenticated
    if (isAuthenticated) {
      navigateTo('dashboard');
      return;
    }
    
    console.log("Registration form submitted");
    setRegistrationStage('validating')
    
    if (!validateForm()) {
      console.log("Form validation failed");
      setRegistrationStage('idle')
      return
    }
    
    try {
      setIsSubmitting(true)
      setAuthError(null)
      
      console.log("Creating account...");
      setRegistrationStage('creating-account')
      
      const result = await signUp(email, password, firstName, lastName)
      
      if (!result.success) {
        console.error("Registration failed:", result.error);
        throw new Error(result.error || "Failed to sign up")
      }
      
      console.log("Registration successful");
      setAuthSuccess(true)
      setRegistrationStage('verification-sent')
    } catch (error: unknown) {
      console.error("Registration error:", error);
      const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
      setAuthError(errorMessage);
      setRegistrationStage('idle')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Pre-validating fields as they are filled improves perceived performance
  useEffect(() => {
    if (firstName) validateField('firstName', firstName)
    if (lastName) validateField('lastName', lastName)
    if (email) validateField('email', email)
    if (password) validateField('password', password)
    if (confirmPassword) validateField('confirmPassword', confirmPassword)
  }, [validateField, firstName, lastName, email, password, confirmPassword])

  return (
    <AuthLayout>
      <div className="space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">Create an Account</h1>
          <p className="text-muted-foreground">Enter your information to get started</p>
        </div>
        
        {/* Email verification notification */}
        {registrationStage === 'verification-sent' && (
          <EmailVerificationAlert email={email} />
        )}
        
        {authError && (
          <Toast variant="destructive" className="mb-4">
            <div>
              <ToastTitle>Error</ToastTitle>
              <ToastDescription>{authError}</ToastDescription>
            </div>
          </Toast>
        )}
        
        {authSuccess && registrationStage !== 'verification-sent' && (
          <Toast variant="success" className="mb-4">
            <div>
              <ToastTitle>Success!</ToastTitle>
              <ToastDescription>
                Your account has been created. Please check your email for verification.
              </ToastDescription>
            </div>
          </Toast>
        )}
        
        {registrationStage === 'verification-sent' ? (
          <div className="mt-6 space-y-4">
            <p className="text-center">
              Need to access your account? Go to the login page once you've verified your email.
            </p>
            <Button 
              onClick={() => navigateTo('login')}
              className="w-full"
            >
              Go to Login
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <FormSection>
              <div className="grid grid-cols-2 gap-4">
                <FormItem>
                  <FormLabel error={!!errors.firstName}>First name</FormLabel>
                  <FormControl>
                    <Input
                      id="firstName"
                      value={firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      className={errors.firstName ? "border-destructive" : ""}
                      autoComplete="given-name"
                      disabled={isSubmitting}
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
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      className={errors.lastName ? "border-destructive" : ""}
                      autoComplete="family-name"
                      disabled={isSubmitting}
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
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className={errors.email ? "border-destructive" : ""}
                    autoComplete="email"
                    disabled={isSubmitting}
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
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className={errors.password ? "border-destructive" : ""}
                    autoComplete="new-password"
                    disabled={isSubmitting}
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
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    className={errors.confirmPassword ? "border-destructive" : ""}
                    autoComplete="new-password"
                    disabled={isSubmitting}
                  />
                </FormControl>
                {errors.confirmPassword && <FormMessage>{errors.confirmPassword}</FormMessage>}
              </FormItem>
            </FormSection>
            
            <Button 
              type="submit" 
              className="w-full relative" 
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="opacity-0">Create account</span>
                  <span className="absolute inset-0 flex items-center justify-center">
                    {registrationStage === 'validating' && "Validating..."}
                    {registrationStage === 'creating-account' && "Creating Account..."}
                  </span>
                </>
              ) : "Create account"}
            </Button>
            
            <div className="text-center text-sm">
              Already have an account?{" "}
              <button 
                type="button"
                onClick={() => navigateTo('login')}
                className="text-primary hover:underline"
                disabled={isSubmitting}
              >
                Log in
              </button>
            </div>
          </form>
        )}
      </div>
    </AuthLayout>
  )
}

export default RegisterPage
