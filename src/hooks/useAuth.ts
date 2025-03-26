import { useState, useEffect } from 'react';
import { auth, User, supabase } from '@/services/api';

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
        const { data, error } = await auth.getCurrentUser();
        
        if (error) {
          throw error;
        }
        
        if (data?.user) {
          const userData: User = {
            id: data.user.id,
            email: data.user.email || '',
          };
          
          try {
            const { data: profileData } = await supabase
              .from('profiles')
              .select('first_name, last_name')
              .eq('user_id', data.user.id)
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
  
  const signIn = async (email: string, password: string): Promise<{success: boolean, error?: string}> => {
    try {
      setLoading(true);
      setError(null);
      const { data, error } = await auth.signIn(email, password);
      
      if (error) {
        throw error;
      }
      
      if (data.user) {
        // Auth state listener will handle setting the user
        return { success: true };
      } else {
        return { success: false, error: "Login failed" };
      }
    } catch (err: any) {
      setError(err.message || 'Sign in failed');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };
  
  const signUp = async (
    email: string, 
    password: string, 
    firstName?: string, 
    lastName?: string
  ): Promise<{success: boolean, error?: string}> => {
    try {
      setLoading(true);
      setError(null);
      
      // Create the user account
      const { data, error } = await auth.signUp(email, password);
      
      if (error) {
        throw error;
      }
      
      // If first name and last name are provided, store them in a profiles table
      if (data?.user && (firstName || lastName)) {
        // Check if profiles table exists and create profile
        try {
          await supabase
            .from('profiles')
            .insert({
              user_id: data.user.id,
              first_name: firstName,
              last_name: lastName,
              created_at: new Date().toISOString()
            });
        } catch (profileError) {
          console.error('Error creating profile:', profileError);
          // We don't want to fail signup if profile creation fails
        }
      }
      
      return { success: true };
    } catch (err: any) {
      setError(err.message || 'Sign up failed');
      return { success: false, error: err.message };
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
    signIn,
    signUp,
    signOut,
    isAuthenticated: !!user
  };
}
