import { createClient } from '@supabase/supabase-js'

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

// Validate Supabase credentials
if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials. Make sure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set in your .env file.');
}

export const supabase = createClient(supabaseUrl, supabaseKey)

// Type definitions
export interface User {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
}

export interface Item {
  id: number
  name: string
  description: string
  category: string
  location: string
  date: string
  type: 'lost' | 'found'
  status: string
  image_url?: string
  user_id: string
  created_at: string
}

// Auth functions
export const auth = {
  signUp: async (email: string, password: string, firstName?: string, lastName?: string) => {
    try {
      console.log('Signing up user:', email);
      
      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName
          }
        }
      });
      
      if (authError) {
        console.error('Auth error during signup:', authError);
        throw authError;
      }
      
      if (!authData?.user?.id) {
        throw new Error('No user ID returned from signup');
      }
      
      console.log('User created successfully, creating profile');
      
      // Create profile for user
      try {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: authData.user.id,
            email,
            first_name: firstName || null,
            last_name: lastName || null,
            created_at: new Date().toISOString()
          });
        
        if (profileError) {
          console.warn('Profile creation warning:', profileError);
        }
      } catch (profileErr) {
        console.warn('Failed to create profile, but auth succeeded:', profileErr);
        // We don't throw here since the auth part succeeded
      }
      
      return { success: true, user: authData.user };
    } catch (error: any) {
      console.error('Sign up error:', error);
      return { success: false, error: error.message || 'Failed to sign up' };
    }
  },
  
  signIn: async (email: string, password: string) => {
    try {
      console.log('Signing in user:', email);
      
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) {
        console.error('Sign in error:', error);
        throw error;
      }
      
      if (!data.session || !data.user) {
        throw new Error('No session or user returned from login');
      }
      
      console.log('User signed in successfully');
      
      return { 
        success: true,
        user: data.user,
        session: data.session
      };
    } catch (error: any) {
      console.error('Sign in error:', error);
      return { success: false, error: error.message || 'Failed to sign in' };
    }
  },
  
  signOut: async () => {
    try {
      console.log('Signing out user');
      const { error } = await supabase.auth.signOut();
      
      if (error) throw error;
      
      return { success: true };
    } catch (error: any) {
      console.error('Sign out error:', error);
      return { success: false, error: error.message };
    }
  },
  
  getCurrentUser: async () => {
    try {
      const { data, error } = await supabase.auth.getUser();
      
      if (error) throw error;
      
      return { success: true, user: data.user };
    } catch (error: any) {
      console.error('Get current user error:', error);
      return { success: false, error: error.message };
    }
  },

  // Check if a user's email is verified
  checkEmailVerified: async (email: string) => {
    try {
      // This is an approximation - Supabase doesn't provide a direct way to check
      // email verification status without signing in
      const { data, error } = await supabase.auth.getUser();
      
      if (error) throw error;
      
      return { 
        success: true, 
        verified: data?.user?.email === email && data?.user?.email_confirmed_at != null
      };
    } catch (error: any) {
      console.error('Check email verification error:', error);
      return { success: false, error: error.message, verified: false };
    }
  },
  
  // Resend verification email
  resendVerificationEmail: async (email: string) => {
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email,
      });
      
      if (error) throw error;
      
      return { success: true };
    } catch (error: any) {
      console.error('Resend verification error:', error);
      return { success: false, error: error.message };
    }
  },

  // Add a session check function
  getSession: async () => {
    try {
      const { data, error } = await supabase.auth.getSession()
      
      if (error) throw error
      
      return { 
        success: true, 
        session: data.session,
        hasSession: !!data.session
      }
    } catch (error: any) {
      console.error('Get session error:', error)
      return { success: false, error: error.message, hasSession: false }
    }
  }
}

// Item functions
export const items = {
  // Get all items (with optional filters)
  getItems: async (type?: 'lost' | 'found', status?: string, userId?: string) => {
    try {
      let query = supabase.from('items').select('*')
      
      if (type) {
        query = query.eq('type', type)
      }
      
      if (status) {
        query = query.eq('status', status)
      }
      
      if (userId) {
        query = query.eq('user_id', userId)
      }
      
      const { data, error } = await query.order('created_at', { ascending: false })
      
      if (error) throw error
      
      return { success: true, data: data as Item[] }
    } catch (error: any) {
      console.error('Get items error:', error)
      return { success: false, error: error.message, data: [] }
    }
  },
  
  // Get a single item by ID
  getItem: async (id: number) => {
    try {
      const { data, error } = await supabase.from('items').select('*').eq('id', id).single()
      
      if (error) throw error
      
      return { success: true, data: data as Item }
    } catch (error: any) {
      console.error('Get item error:', error)
      return { success: false, error: error.message }
    }
  },
  
  // Create a new item
  createItem: async (item: Omit<Item, 'id' | 'created_at'>) => {
    try {
      const { data, error } = await supabase.from('items').insert(item).select()
      
      if (error) throw error
      
      return { success: true, data: data[0] as Item }
    } catch (error: any) {
      console.error('Create item error:', error)
      return { success: false, error: error.message }
    }
  },
  
  // Update an existing item
  updateItem: async (id: number, updates: Partial<Item>) => {
    try {
      const { data, error } = await supabase.from('items').update(updates).eq('id', id).select()
      
      if (error) throw error
      
      return { success: true, data: data[0] as Item }
    } catch (error: any) {
      console.error('Update item error:', error)
      return { success: false, error: error.message }
    }
  },
  
  // Delete an item
  deleteItem: async (id: number) => {
    try {
      const { error } = await supabase.from('items').delete().eq('id', id)
      
      if (error) throw error
      
      return { success: true }
    } catch (error: any) {
      console.error('Delete item error:', error)
      return { success: false, error: error.message }
    }
  },
  
  // Search items
  searchItems: async (query: string) => {
    try {
      const { data, error } = await supabase
        .from('items')
        .select('*')
        .or(`name.ilike.%${query}%,description.ilike.%${query}%,location.ilike.%${query}%`)
        .order('created_at', { ascending: false })
      
      if (error) throw error
      
      return { success: true, data: data as Item[] }
    } catch (error: any) {
      console.error('Search items error:', error)
      return { success: false, error: error.message, data: [] }
    }
  }
}

// Messages functions
export const messages = {
  // Get messages for an item or conversation
  getMessages: async (itemId?: number, userId?: string) => {
    try {
      let query = supabase.from('messages').select('*')
      
      if (itemId) {
        query = query.eq('item_id', itemId)
      }
      
      if (userId) {
        query = query.or(`sender_id.eq.${userId},recipient_id.eq.${userId}`)
      }
      
      const { data, error } = await query.order('created_at', { ascending: true })
      
      if (error) throw error
      
      return { success: true, data }
    } catch (error: any) {
      console.error('Get messages error:', error)
      return { success: false, error: error.message, data: [] }
    }
  },
  
  // Send a message
  sendMessage: async (message: { item_id: number, sender_id: string, recipient_id: string, content: string }) => {
    try {
      const { data, error } = await supabase.from('messages').insert(message).select()
      
      if (error) throw error
      
      return { success: true, data: data[0] }
    } catch (error: any) {
      console.error('Send message error:', error)
      return { success: false, error: error.message }
    }
  },
  
  // Mark messages as read
  markAsRead: async (messageIds: number[]) => {
    try {
      const { error } = await supabase
        .from('messages')
        .update({ read: true })
        .in('id', messageIds)
      
      if (error) throw error
      
      return { success: true }
    } catch (error: any) {
      console.error('Mark as read error:', error)
      return { success: false, error: error.message }
    }
  }
}
