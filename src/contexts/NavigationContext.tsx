import { createContext, ReactNode, useContext, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

interface NavigationContextType {
  navigateTo: (page: string) => void;
  currentPage: string;
}

const NavigationContext = createContext<NavigationContextType>({
  navigateTo: () => {},
  currentPage: 'landing'
});

export const NavigationProvider = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Convert path to page name
  const getCurrentPage = () => {
    const path = location.pathname;
    if (path === '/') return 'landing';
    if (path.startsWith('/dashboard')) {
      // Extract the last part of the path or return 'dashboard' if it's just /dashboard
      const parts = path.split('/').filter(Boolean);
      return parts.length > 1 ? parts[parts.length - 1] : 'dashboard';
    }
    // Remove leading slash to get page name
    return path.substring(1);
  };

  const navigateTo = useCallback((page: string) => {
    // Convert page name to path
    let path = '';
    switch (page) {
      case 'landing':
        path = '/';
        break;
      case 'login':
        path = '/login';
        break;
      case 'register':
        path = '/register';
        break;
      case 'dashboard':
        path = '/dashboard';
        break;
      case 'profile':
        path = '/dashboard/profile';
        break;
      case 'items':
        path = '/dashboard/items';
        break;
      default:
        if (page.startsWith('/')) {
          path = page;
        } else {
          path = `/${page}`;
        }
    }
    navigate(path);
  }, [navigate]);

  return (
    <NavigationContext.Provider value={{ 
      navigateTo, 
      currentPage: getCurrentPage() 
    }}>
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigation = () => useContext(NavigationContext);
