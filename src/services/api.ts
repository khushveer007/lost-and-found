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
  id: string; // Changed from number to string (UUID)
  name: string;
  description: string;
  category: string;
  location: string;
  date: string;
  type: 'lost' | 'found';
  status: string;
  user_id: string;
  created_at: string;
  image_url?: string;
  reward?: number;
  is_resolved?: boolean;
  is_claimed?: boolean;
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
  },

  register: async (email: string, password: string, firstName?: string, lastName?: string) => {
    try {
      console.log('Signing up user:', email);
      
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
      
      // Create profile for user - updated to match table schema
      try {
        const fullName = [firstName, lastName].filter(Boolean).join(' ');
        // Generate a username based on email (at least 3 chars)
        const baseUsername = email.split('@')[0];
        const username = baseUsername.length >= 3 ? baseUsername : `user_${baseUsername}`;
        
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: authData.user.id,
            username: username,
            full_name: fullName || null,
            email: email,
            // Do not include fields that don't exist in the table
          });
        
        if (profileError) {
          console.error('Profile creation error:', profileError);
          // Try a different username if it's a unique constraint error
          if (profileError.code === '23505') { // Unique constraint error code
            const usernameWithRandom = `${username}_${Math.floor(Math.random() * 1000)}`;
            const { error: retryError } = await supabase
              .from('profiles')
              .insert({
                id: authData.user.id,
                username: usernameWithRandom,
                full_name: fullName || null,
                email: email
              });
              
            if (retryError) {
              console.error('Profile creation retry failed:', retryError);
            } else {
              console.log('Profile created successfully on retry');
            }
          }
        } else {
          console.log('Profile created successfully');
        }
      } catch (profileErr) {
        console.error('Failed to create profile, but auth succeeded:', profileErr);
      }
      
      return { success: true, user: authData.user };
    } catch (error: any) {
      console.error('Sign up error:', error);
      return { success: false, error: error.message || 'Failed to sign up' };
    }
  }
}

// Add a profiles service to ensure user profile exists
export const profiles = {
  ensureProfileExists: async () => {
    try {
      // Get current user
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;
      if (!userData.user) throw new Error('No authenticated user found');
      
      // Check if profile exists
      const { data: existingProfile, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', userData.user.id)
        .single();
      
      // Create profile if it doesn't exist
      if (!existingProfile && profileError?.code === 'PGRST116') {
        // Generate username from email or a random string
        const email = userData.user.email || '';
        const baseUsername = email.split('@')[0];
        const username = baseUsername.length >= 3 ? baseUsername : `user_${Math.random().toString(36).substring(2, 8)}`;
        
        // Get user metadata for names
        const firstName = userData.user.user_metadata?.first_name || '';
        const lastName = userData.user.user_metadata?.last_name || '';
        const fullName = [firstName, lastName].filter(Boolean).join(' ');
        
        const { error: insertError } = await supabase
          .from('profiles')
          .insert({
            id: userData.user.id,
            username: username,
            full_name: fullName || null,
            email: email
          });
        
        if (insertError) {
          // If username already exists, try with a random suffix
          if (insertError.code === '23505') {
            const randomUsername = `user_${Math.random().toString(36).substring(2, 10)}`;
            const { error: retryError } = await supabase
              .from('profiles')
              .insert({
                id: userData.user.id,
                username: randomUsername,
                full_name: fullName || null,
                email: email
              });
            
            if (retryError) throw retryError;
          } else {
            throw insertError;
          }
        }
      } else if (profileError && profileError.code !== 'PGRST116') {
        throw profileError;
      }
      
      return { success: true, userId: userData.user.id };
    } catch (error: any) {
      console.error('Error ensuring profile exists:', error);
      return { success: false, error: error.message };
    }
  }
};

// Item functions
export const items = {
  // Get all items (combining lost and found)
  getItems: async (type?: 'lost' | 'found') => {
    try {
      let lostItems = [];
      let foundItems = [];
      
      // Get lost items
      if (!type || type === 'lost') {
        const { data: lostData, error: lostError } = await supabase
          .from('lost_items')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (lostError) throw lostError;
        
        lostItems = lostData.map(item => ({
          ...item,
          name: item.title, // Map title to name for consistency
          type: 'lost',
          status: item.is_resolved ? 'Resolved' : 'Active'
        }));
      }
      
      // Get found items
      if (!type || type === 'found') {
        const { data: foundData, error: foundError } = await supabase
          .from('found_items')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (foundError) throw foundError;
        
        foundItems = foundData.map(item => ({
          ...item,
          name: item.title, // Map title to name for consistency
          type: 'found',
          status: item.is_claimed ? 'Claimed' : 'Waiting for owner'
        }));
      }
      
      // Combine results
      const combinedItems = [...lostItems, ...foundItems];
      
      return { success: true, data: combinedItems };
    } catch (error: any) {
      console.error('Get items error:', error);
      return { success: false, error: error.message, data: [] };
    }
  },
  
  // Create a new item
  createItem: async (item: Omit<Item, 'id' | 'created_at'>) => {
    try {
      // First ensure the user profile exists
      const profileResult = await profiles.ensureProfileExists();
      if (!profileResult.success) {
        throw new Error(profileResult.error || 'Failed to ensure profile exists');
      }
      
      // Use the confirmed userId from the profile
      const userId = profileResult.userId;
      
      // Prepare data based on item type
      const itemData = {
        title: item.name,
        description: item.description,
        category: item.category,
        image_url: item.image_url,
        user_id: userId
      };
      
      let result;
      
      // Insert into the appropriate table
      if (item.type === 'lost') {
        const lostItemData = {
          ...itemData,
          lost_date: item.date,
          lost_location: item.location,
          is_resolved: false,
          reward: item.reward || null
        };
        
        result = await supabase.from('lost_items').insert(lostItemData).select();
      } else {
        const foundItemData = {
          ...itemData,
          found_date: item.date,
          found_location: item.location,
          is_claimed: false
        };
        
        result = await supabase.from('found_items').insert(foundItemData).select();
      }
      
      const { data, error } = result;
      
      if (error) throw error;
      
      // Return formatted item
      const newItem = {
        ...data[0],
        name: data[0].title,
        location: data[0].lost_location || data[0].found_location,
        date: data[0].lost_date || data[0].found_date,
        type: item.type,
        status: item.type === 'lost' ? 'Active' : 'Waiting for owner'
      };
      
      return { success: true, data: newItem as Item };
    } catch (error: any) {
      console.error('Create item error:', error);
      return { success: false, error: error.message };
    }
  },
  
  // Update an existing item
  updateItem: async (id: string, updates: Partial<Item>, type: 'lost' | 'found') => {
    try {
      const table = type === 'lost' ? 'lost_items' : 'found_items';
      const updateData: any = {};
      
      // Map fields to the appropriate table fields
      if (updates.name) updateData.title = updates.name;
      if (updates.description) updateData.description = updates.description;
      if (updates.category) updateData.category = updates.category;
      if (updates.image_url) updateData.image_url = updates.image_url;
      
      if (type === 'lost') {
        if (updates.location) updateData.lost_location = updates.location;
        if (updates.date) updateData.lost_date = updates.date;
        if (updates.status) updateData.is_resolved = updates.status === 'Resolved';
        if (updates.reward !== undefined) updateData.reward = updates.reward;
      } else {
        if (updates.location) updateData.found_location = updates.location;
        if (updates.date) updateData.found_date = updates.date;
        if (updates.status) updateData.is_claimed = updates.status === 'Claimed';
      }
      
      const { data, error } = await supabase
        .from(table)
        .update(updateData)
        .eq('id', id)
        .select();
      
      if (error) throw error;
      
      // Return formatted item
      const updatedItem = {
        ...data[0],
        name: data[0].title,
        location: data[0].lost_location || data[0].found_location,
        date: data[0].lost_date || data[0].found_date,
        type,
        status: type === 'lost' 
          ? (data[0].is_resolved ? 'Resolved' : 'Active') 
          : (data[0].is_claimed ? 'Claimed' : 'Waiting for owner')
      };
      
      return { success: true, data: updatedItem as Item };
    } catch (error: any) {
      console.error('Update item error:', error);
      return { success: false, error: error.message };
    }
  },
  
  // Delete an item
  deleteItem: async (id: string, type: 'lost' | 'found') => {
    try {
      const table = type === 'lost' ? 'lost_items' : 'found_items';
      
      const { error } = await supabase.from(table).delete().eq('id', id);
      
      if (error) throw error;
      
      return { success: true };
    } catch (error: any) {
      console.error('Delete item error:', error);
      return { success: false, error: error.message };
    }
  },
  
  // Search items
  searchItems: async (query: string) => {
    try {
      // Search in lost_items
      const { data: lostData, error: lostError } = await supabase
        .from('lost_items')
        .select('*')
        .or(`title.ilike.%${query}%,description.ilike.%${query}%,lost_location.ilike.%${query}%`)
        .order('created_at', { ascending: false });
      
      if (lostError) throw lostError;
      
      // Search in found_items
      const { data: foundData, error: foundError } = await supabase
        .from('found_items')
        .select('*')
        .or(`title.ilike.%${query}%,description.ilike.%${query}%,found_location.ilike.%${query}%`)
        .order('created_at', { ascending: false });
      
      if (foundError) throw foundError;
      
      // Format and combine results
      const lostItems = lostData.map(item => ({
        ...item,
        name: item.title,
        location: item.lost_location,
        date: item.lost_date,
        type: 'lost',
        status: item.is_resolved ? 'Resolved' : 'Active'
      }));
      
      const foundItems = foundData.map(item => ({
        ...item,
        name: item.title,
        location: item.found_location,
        date: item.found_date,
        type: 'found',
        status: item.is_claimed ? 'Claimed' : 'Waiting for owner'
      }));
      
      return { success: true, data: [...lostItems, ...foundItems] as Item[] };
    } catch (error: any) {
      console.error('Search items error:', error);
      return { success: false, error: error.message, data: [] };
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
