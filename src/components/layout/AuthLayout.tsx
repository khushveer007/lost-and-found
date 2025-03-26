import { ReactNode } from "react"
import { useNavigation } from '@/contexts/NavigationContext'
import { CampusBanner } from "@/components/ui/campus-banner"

interface AuthLayoutProps {
  children: ReactNode
}

export function AuthLayout({ children }: AuthLayoutProps) {
  const { navigateTo } = useNavigation();
  
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b bg-background py-4">
        <div className="container flex justify-between items-center">
          <div 
            className="flex items-center space-x-2 cursor-pointer" 
            onClick={() => navigateTo('landing')}
          >
            <img src="/Logo.svg" alt="LostLink Logo" className="w-8 h-8" />
            <h1 className="text-xl font-bold">LostLink</h1>
          </div>
        </div>
      </header>
      
      <main className="flex-1 flex items-center justify-center p-4 bg-background/50">
        <div className="w-full max-w-md space-y-8 bg-background border rounded-lg p-8 shadow-sm">
          <CampusBanner className="mb-2" />
          {children}
        </div>
      </main>
      
      <footer className="border-t py-4 text-center text-sm text-muted-foreground">
        <div className="container">
          © 2023 LostLink. All rights reserved.
        </div>
      </footer>
    </div>
  )
}
