import { createClient } from '@supabase/supabase-js'

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

export const supabase = createClient(supabaseUrl, supabaseKey)

// Type definitions
export interface User {
  id: string
  email: string
  first_name?: string
  last_name?: string
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
      // Prepare the profile data in advance to eliminate duplicate object creation
      const profileData = {
        first_name: firstName || null,
        last_name: lastName || null,
        created_at: new Date().toISOString()
      };
      
      // Create auth user with email confirmation
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          // Adding data to metadata speeds up the process by reducing a separate profile query
          data: {
            first_name: firstName,
            last_name: lastName
          },
          emailRedirectTo: window.location.origin + '/auth/callback', // Add this for better redirect handling
        }
      });
      
      if (authError) throw authError;
      
      // Check if email was sent
      const emailSent = !!authData?.user;
      
      if (authData?.user) {
        // Use upsert instead of insert to handle potential race conditions
        // and make the operation idempotent (can be safely retried)
        const { error: profileError } = await supabase
          .from('profiles')
          .upsert({
            id: authData.user.id,
            email,
            ...profileData
          }, {
            onConflict: 'id',
            ignoreDuplicates: true
          });
        
        if (profileError) {
          console.warn('Profile creation warning:', profileError);
          // Still return success even if profile creation has issues
          // The auth is the critical path, profile can be created later
        }
      }
      
      return { 
        success: true, 
        emailSent,
        user: authData?.user
      };
    } catch (error: any) {
      console.error('Sign up error:', error);
      return { success: false, error: error.message, emailSent: false };
    }
  },
  
  signIn: async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      
      if (error) throw error
      
      return { success: true }
    } catch (error: any) {
      console.error('Sign in error:', error)
      return { success: false, error: error.message }
    }
  },
  
  signOut: async () => {
    try {
      const { error } = await supabase.auth.signOut()
      
      if (error) throw error
      
      return { success: true }
    } catch (error: any) {
      console.error('Sign out error:', error)
      return { success: false, error: error.message }
    }
  },
  
  getCurrentUser: async () => {
    try {
      const { data, error } = await supabase.auth.getUser()
      
      if (error) throw error
      
      return { success: true, user: data.user }
    } catch (error: any) {
      console.error('Get current user error:', error)
      return { success: false, error: error.message }
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
