import { useEffect } from 'react';
import { Routes } from '@/components/Routes';
import { ThemeProvider } from '@/components/ThemeProvider';
import { AuthProvider } from '@/contexts/AuthContext';
import { NavigationProvider } from '@/contexts/NavigationContext';
import { checkEnvironment } from '@/utils/env-check';

function App() {
  useEffect(() => {
    // Check environment on app start
    checkEnvironment().then(checks => {
      if (!checks.supabaseUrl || !checks.supabaseKey) {
        console.error('⚠️ Missing Supabase environment variables. Authentication will not work correctly.');
      }
      
      if (!checks.supabaseConnection) {
        console.error('⚠️ Could not connect to Supabase. Check your credentials and network connection.');
      }
    });
  }, []);

  return (
    <ThemeProvider>
      <AuthProvider>
        <NavigationProvider>
          <Routes />
        </NavigationProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
