/**
 * Utility to check environment variables and Supabase connection
 */
import { supabase } from '@/services/api';

export async function checkEnvironment() {
  const checks = {
    supabaseUrl: !!import.meta.env.VITE_SUPABASE_URL,
    supabaseKey: !!import.meta.env.VITE_SUPABASE_ANON_KEY,
    supabaseConnection: false
  };
  
  console.log('Environment check:');
  console.log('- VITE_SUPABASE_URL:', checks.supabaseUrl ? 'Present' : 'Missing');
  console.log('- VITE_SUPABASE_ANON_KEY:', checks.supabaseKey ? 'Present' : 'Missing');
  
  // Check Supabase connection
  try {
    const { error } = await supabase.from('profiles').select('count', { count: 'exact', head: true });
    checks.supabaseConnection = !error;
    console.log('- Supabase Connection:', checks.supabaseConnection ? 'Success' : `Failed: ${error?.message || 'Unknown error'}`);
  } catch (err) {
    console.error('- Supabase Connection Failed:', err);
  }
  
  return checks;
}
