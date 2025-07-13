import React, { ReactNode } from "react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/AuthContext"
import { useNavigation } from '@/contexts/NavigationContext';

interface DashboardLayoutProps {
  children: ReactNode;
}

interface NavItem {
  label: string;
  path: string;
  icon: React.ReactElement;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, signOut } = useAuth()
  const { navigateTo, currentPage } = useNavigation()
  
  // Updated navigation handling
  const handleNavigation = (path: string) => {
    const pageName = path.split('/').pop() || 'dashboard';
    navigateTo(pageName);
  }
  
  // Update how active state is determined
  const isActive = (path: string) => {
    const pageName = path.split('/').pop() || 'dashboard';
    return currentPage === pageName;
  }
  
  const navItems: NavItem[] = [
    { 
      label: "Dashboard", 
      path: "/dashboard", 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
        </svg>
      )
    },
    { 
      label: "My Items", 
      path: "/dashboard/items", 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
        </svg>
      )
    },
    { 
      label: "Messages", 
      path: "/dashboard/messages", 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
        </svg>
      )
    },
    { 
      label: "Profile", 
      path: "/dashboard/profile", 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
        </svg>
      )
    },
    { 
      label: "Settings", 
      path: "/dashboard/settings", 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      )
    }
  ]
  
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b bg-background sticky top-0 z-10">
        <div className="container mx-auto flex justify-between items-center py-4">
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => navigateTo('landing')}>
            <img src="/Logo.svg" alt="LostLink Logo" className="w-8 h-8" />
            <h1 className="text-xl font-bold">LostLink</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            {user && (
              <>
                <span className="text-sm bg-primary/10 px-3 py-1 rounded-full text-primary font-medium hidden md:inline-block">
                  Campus Service
                </span>
                <span className="text-sm text-muted-foreground hidden md:inline-block">
                  Welcome, {user.first_name || user.email?.split('@')[0] || 'User'}
                </span>
              </>
            )}
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => {
                signOut();
                navigateTo('landing');
              }}
              className="text-sm"
            >
              Log out
            </Button>
          </div>
        </div>
      </header>
      
      <div className="flex flex-1">
        <aside className="w-64 border-r bg-muted/30 hidden md:block sticky top-[65px] h-[calc(100vh-65px)] overflow-y-auto">
          <nav className="p-4 space-y-1">
            {navItems.map((item, index) => (
              <button 
                key={index}
                className={`flex w-full items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
                  isActive(item.path)
                    ? "bg-accent text-accent-foreground font-medium" 
                    : "hover:bg-muted text-foreground"
                }`}
                onClick={() => handleNavigation(item.path)}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </aside>
        
        {/* Mobile Navigation */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 border-t bg-background z-10">
          <nav className="flex justify-around py-2">
            {navItems.slice(0, 4).map((item, index) => (
              <button 
                key={index}
                className={`flex flex-col items-center p-2 ${
                  isActive(item.path) ? "text-primary" : "text-muted-foreground"
                }`}
                onClick={() => handleNavigation(item.path)}
              >
                <span>{item.icon}</span>
                <span className="text-xs mt-1">{item.label}</span>
              </button>
            ))}
          </nav>
        </div>
        
        <main className="flex-1 bg-background/50 pb-16 md:pb-0">
          {children}
        </main>
      </div>
    </div>
  )
}
