import { createContext, useState, useEffect, useContext, ReactNode } from 'react'
import { supabase, User, auth } from '@/services/api'

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  loading: boolean
  signUp: (email: string, password: string, firstName?: string, lastName?: string) => Promise<{ success: boolean, error?: string }>
  signIn: (email: string, password: string) => Promise<{ success: boolean, error?: string }>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    // Check active session
    const getSession = async () => {
      setLoading(true)
      
      try {
        // Check if there is an active session
        const { data: { session } } = await supabase.auth.getSession()
        
        if (session) {
          const { data: { user: authUser } } = await supabase.auth.getUser()
          
          if (authUser) {
            // Fetch user profile from profiles table
            const { data: profile } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', authUser.id)
              .single()
              
            if (profile) {
              setUser({
                id: authUser.id,
                email: authUser.email || '',
                first_name: profile.first_name,
                last_name: profile.last_name
              })
              setIsAuthenticated(true)
            }
          }
        }
      } catch (error) {
        console.error('Session error:', error)
      } finally {
        setLoading(false)
      }
    }
    
    getSession()
    
    // Listen for auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session && session.user) {
        // Fetch user profile
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single()
          
        if (profile) {
          setUser({
            id: session.user.id,
            email: session.user.email || '',
            first_name: profile.first_name,
            last_name: profile.last_name
          })
          setIsAuthenticated(true)
        }
      } else {
        setUser(null)
        setIsAuthenticated(false)
      }
      
      setLoading(false)
    })
    
    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [])

  const signUp = async (email: string, password: string, firstName?: string, lastName?: string) => {
    return auth.signUp(email, password, firstName, lastName)
  }

  const signIn = async (email: string, password: string) => {
    return auth.signIn(email, password)
  }

  const signOut = async () => {
    await auth.signOut()
    setUser(null)
    setIsAuthenticated(false)
  }

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated, 
      loading, 
      signUp, 
      signIn, 
      signOut 
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  
  return context
}
