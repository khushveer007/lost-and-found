import { useState, useEffect } from 'react'
import LandingPage from './pages/landing/LandingPage'
import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'
import DashboardPage from './pages/dashboard/DashboardPage'
import ItemsPage from './pages/dashboard/ItemsPage'
import ProfilePage from './pages/dashboard/ProfilePage'
import { Button } from '@/components/ui/button'
import { AuthProvider } from '@/contexts/AuthContext'
import { NavigationProvider } from '@/contexts/NavigationContext'
import { initSessionWatcher } from '@/utils/session-util';

function App() {
  // Set document title
  useEffect(() => {
    document.title = "LostLink - Campus Lost and Found";
  }, []);

  // Make sure to set the initial page based on current path
  const [currentPage, setCurrentPage] = useState<string>(() => {
    // Get path from URL (for a real SPA)
    const path = window.location.pathname.split('/').pop() || '';
    return path || 'landing';
  });
  
  const navigateTo = (page: string) => {
    console.log(`Navigating to: ${page}`); // Debug navigation
    setCurrentPage(page);
  };
  
  // Initialize session watcher for debugging
  useEffect(() => {
    const cleanup = initSessionWatcher();
    return cleanup;
  }, []);
  
  // This is a simple demonstration - in a real app, you'd use React Router
  const renderPage = () => {
    switch (currentPage) {
      case 'landing':
        return <LandingPage />
      case 'login':
        return <LoginPage />
      case 'register':
      case 'signup': // Add handling for "signup" route
        return <RegisterPage />
      case 'dashboard':
        return <DashboardPage />
      case 'items':
        return <ItemsPage />
      case 'profile':
        return <ProfilePage />
      default:
        // Instead of "Page not found", redirect to landing
        console.log(`Route "${currentPage}" not found, redirecting to landing`);
        setTimeout(() => navigateTo('landing'), 0); // Redirect on next tick
        return <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-2">Redirecting...</h1>
            <p>The page you requested could not be found.</p>
          </div>
        </div>
    }
  }
  
  return (
    <AuthProvider>
      <NavigationProvider navigateTo={navigateTo} currentPage={currentPage}>
        <div>
          {/* Demo navigation - would be replaced by React Router */}
          <div className="fixed bottom-4 right-4 bg-background shadow-lg rounded-lg p-2 z-50">
            <div className="flex flex-col space-y-2">
              <Button 
                size="sm" 
                variant={currentPage === 'landing' ? 'default' : 'outline'}
                onClick={() => navigateTo('landing')}
              >
                Landing Page
              </Button>
              <Button 
                size="sm" 
                variant={currentPage === 'login' ? 'default' : 'outline'}
                onClick={() => navigateTo('login')}
              >
                Login Page
              </Button>
              <Button 
                size="sm" 
                variant={currentPage === 'register' ? 'default' : 'outline'}
                onClick={() => navigateTo('register')}
              >
                Register Page
              </Button>
              <Button 
                size="sm" 
                variant={currentPage === 'dashboard' ? 'default' : 'outline'}
                onClick={() => navigateTo('dashboard')}
              >
                Dashboard
              </Button>
              <Button 
                size="sm" 
                variant={currentPage === 'items' ? 'default' : 'outline'}
                onClick={() => navigateTo('items')}
              >
                Items Management
              </Button>
              <Button 
                size="sm" 
                variant={currentPage === 'profile' ? 'default' : 'outline'}
                onClick={() => navigateTo('profile')}
              >
                Profile
              </Button>
            </div>
          </div>
          
          {/* Render the selected page */}
          {renderPage()}
        </div>
      </NavigationProvider>
    </AuthProvider>
  )
}

export default App
