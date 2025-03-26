import { createContext, ReactNode, useContext } from 'react';

interface NavigationContextType {
  navigateTo: (page: string) => void;
  currentPage: string;
}

const NavigationContext = createContext<NavigationContextType>({
  navigateTo: () => {},
  currentPage: 'landing'
});

export const NavigationProvider = ({ 
  children, 
  navigateTo, 
  currentPage 
}: { 
  children: ReactNode, 
  navigateTo: (page: string) => void, 
  currentPage: string 
}) => {
  return (
    <NavigationContext.Provider value={{ navigateTo, currentPage }}>
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigation = () => useContext(NavigationContext);
