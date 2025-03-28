import { useState, useEffect } from 'react';
import { auth, User, supabase, profiles } from '@/services/api';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session) {
          // Get user data from session
          const userData: User = {
            id: session.user.id,
            email: session.user.email || '',
          };
          
          // Try to get additional profile data from a profiles table if it exists
          try {
            const { data } = await supabase
              .from('profiles')
              .select('first_name, last_name')
              .eq('user_id', session.user.id)
              .single();
              
            if (data) {
              userData.first_name = data.first_name;
              userData.last_name = data.last_name;
            }
          } catch (error) {
            console.log('No profile data found or profiles table doesn\'t exist');
          }
          
          setUser(userData);
        } else {
          setUser(null);
        }
        
        setLoading(false);
      }
    );
    
    // Check for initial session
    const checkUser = async () => {
      try {
        setLoading(true);
        const result = await auth.getCurrentUser();
        
        if (!result.success) {
          throw result.error;
        }
        
        if (result.user) {
          const userData: User = {
            id: result.user.id,
            email: result.user.email || '',
          };
          
          try {
            const { data: profileData } = await supabase
              .from('profiles')
              .select('first_name, last_name')
              .eq('user_id', result.user.id)
              .single();
              
            if (profileData) {
              userData.first_name = profileData.first_name;
              userData.last_name = profileData.last_name;
            }
          } catch (error) {
            console.log('No profile data found');
          }
          
          setUser(userData);
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error('Auth error:', err);
        setError('Authentication failed');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    
    checkUser();
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);
  
  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      const result = await auth.signIn(email, password);
      
      if (!result.success) {
        throw result.error;
      }
      
      // Ensure user profile exists
      await profiles.ensureProfileExists();
      
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message || 'Failed to login' };
    } finally {
      setLoading(false);
    }
  };
  
  const register = async (email: string, password: string, userData?: Partial<User>) => {
    try {
      setLoading(true);
      const result = await auth.register(email, password);
      
      if (!result.success) {
        throw result.error;
      }
      
      // Ensure user profile exists
      await profiles.ensureProfileExists();
      
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message || 'Failed to register' };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async (): Promise<void> => {
    try {
      setLoading(true);
      await auth.signOut();
      setUser(null);
    } catch (err: any) {
      setError(err.message || 'Sign out failed');
    } finally {
      setLoading(false);
    }
  };
  
  return {
    user,
    loading,
    error,
    login,
    register,
    signOut,
    isAuthenticated: !!user
  };
}
