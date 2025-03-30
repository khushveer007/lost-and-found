import { useAuth } from '@/contexts/AuthContext'
import { useNavigation } from '@/contexts/NavigationContext'

// ...existing code...

export function LandingPage() {
  const { isAuthenticated } = useAuth();
  const { navigateTo } = useNavigation();

  // ...existing code...

  // In the header section, replace the Login/Register buttons with:
  return (
    <div>
      {/* ...existing code... */}
      
      <header className="...">
        <div className="...">
          <div className="...">
            {/* Logo and other elements */}
          </div>
          
          <div className="...">
            {isAuthenticated ? (
              <Button onClick={() => navigateTo('dashboard')}>
                Dashboard
              </Button>
            ) : (
              <>
                <Button 
                  variant="ghost" 
                  onClick={() => navigateTo('login')}
                >
                  Login
                </Button>
                <Button onClick={() => navigateTo('register')}>
                  Get Started
                </Button>
              </>
            )}
          </div>
        </div>
      </header>
      
      {/* ...existing code... */}
    </div>
  )
}
