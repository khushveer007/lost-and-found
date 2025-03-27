import { useEffect } from 'react';
import { ThemeProvider } from '@/components/ThemeProvider';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { NavigationProvider } from '@/contexts/NavigationContext';
import { checkEnvironment } from '@/utils/env-check';
import { initSessionWatcher } from '@/utils/session-util';

// Page components
import LandingPage from '@/pages/landing/LandingPage';
import LoginPage from '@/pages/auth/LoginPage';
import RegisterPage from '@/pages/auth/RegisterPage';
import DashboardPage from '@/pages/dashboard/DashboardPage';
import ProfilePage from '@/pages/dashboard/ProfilePage';
import ItemsPage from '@/pages/dashboard/ItemsPage';

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
    
    // Initialize session watcher for debugging
    const cleanup = initSessionWatcher();
    return cleanup;
  }, []);

  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <NavigationProvider>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/dashboard/profile" element={<ProfilePage />} />
              <Route path="/dashboard/items" element={<ItemsPage />} />
            </Routes>
          </NavigationProvider>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
