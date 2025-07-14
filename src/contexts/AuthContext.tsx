import { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { supabase } from '@/services/api';
import { User, auth } from '@/services/api';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  signUp: (email: string, password: string, firstName?: string, lastName?: string) => Promise<{ success: boolean, error?: string }>;
  signIn: (email: string, password: string) => Promise<{ success: boolean, error?: string }>;
  signOut: () => Promise<void>;
  checkEmailVerification: (email: string) => Promise<boolean>;
  resendVerificationEmail: (email: string) => Promise<{ success: boolean, error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize auth state - Check session on mount
  useEffect(() => {
    let mounted = true;

    const getInitialSession = async () => {
      try {
        console.log("Checking initial session");
        setLoading(true);
        // Check if there's an active session
        const { data: { session } } = await supabase.auth.getSession();

        if (session && mounted) {
          console.log("Active session found", session);
          const { data } = await supabase.auth.getUser();
          if (data.user) {
            // Get user profile
            const { data: profile } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', data.user.id)
              .single();

            // Set user data
            setUser({
              id: data.user.id,
              email: data.user.email || '',
              first_name: profile?.first_name || '',
              last_name: profile?.last_name || ''
            });
            setIsAuthenticated(true);
          }
        } else if (mounted) {
          setUser(null);
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error("Session initialization error:", error);
        if (mounted) {
          setUser(null);
          setIsAuthenticated(false);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    getInitialSession();

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth state changed:", event, !!session);

        if (session && mounted) {
          try {
            // Get user profile
            const { data: profile } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single();

            // Update user state
            setUser({
              id: session.user.id,
              email: session.user.email || '',
              first_name: profile?.first_name || '',
              last_name: profile?.last_name || ''
            });
            setIsAuthenticated(true);
          } catch (err) {
            console.error("Error fetching user profile:", err);
            // Still set basic user info even without profile
            if (mounted) {
              setUser({
                id: session.user.id,
                email: session.user.email || '',
              });
              setIsAuthenticated(true);
            }
          }
        } else if (mounted) {
          // Clear user state when logged out
          setUser(null);
          setIsAuthenticated(false);
        }

        if (mounted) {
          setLoading(false);
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // Sign up function
  const signUp = async (
    email: string, 
    password: string, 
    firstName?: string, 
    lastName?: string
  ): Promise<{ success: boolean, error?: string }> => {
    try {
      setLoading(true);
      setError(null);

      // Call API service's signUp function
      const result = await auth.signUp(email, password, firstName, lastName);

      if (!result.success) {
        throw new Error(result.error || "Failed to sign up");
      }

      return { success: true };
    } catch (err: unknown) {
      console.error("Sign up error:", err);
      const errorMessage = err instanceof Error ? err.message : "Failed to sign up";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Sign in function
  const signIn = async (
    email: string, 
    password: string
  ): Promise<{ success: boolean, error?: string }> => {
    try {
      setLoading(true);
      setError(null);

      // Call API service's signIn function
      const result = await auth.signIn(email, password);

      if (!result.success) {
        throw new Error(result.error || "Failed to sign in");
      }

      // The auth state listener will handle setting the user
      return { success: true };
    } catch (err: unknown) {
      console.error("Sign in error:", err);
      const errorMessage = err instanceof Error ? err.message : "Failed to sign in";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Sign out function with force refresh to ensure clean state
  const signOut = async (): Promise<void> => {
    try {
      setLoading(true);
      await auth.signOut();

      // Force a clear state
      setUser(null);
      setIsAuthenticated(false);

      // Optionally force page refresh to clear any lingering state
      // window.location.href = '/';
    } catch (err: unknown) {
      console.error("Sign out error:", err);
      const errorMessage = err instanceof Error ? err.message : "Failed to sign out";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Check email verification status
  const checkEmailVerification = async (email: string): Promise<boolean> => {
    try {
      // This is a simplified implementation
      const { data } = await supabase.auth.signInWithOtp({
        email,
        options: { shouldCreateUser: false }
      });

      // Check if user has confirmed email
      return !!data?.user && !!(data.user as { email_confirmed_at?: string }).email_confirmed_at;
    } catch (error) {
      console.error("Error checking email verification:", error);
      return false;
    }
  };

  // Resend verification email
  const resendVerificationEmail = async (email: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email,
      });

      if (error) throw error;
      return { success: true };
    } catch (err: unknown) {
      console.error("Error resending verification email:", err);
      const errorMessage = err instanceof Error ? err.message : "Failed to resend verification email";
      return { success: false, error: errorMessage };
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated, 
      loading, 
      error,
      signUp, 
      signIn, 
      signOut,
      checkEmailVerification,
      resendVerificationEmail
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
