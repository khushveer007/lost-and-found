import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { useNavigation } from '@/contexts/NavigationContext';
import { CampusBanner } from "@/components/ui/campus-banner";

export function LandingHero() {
  const [isVisible, setIsVisible] = useState(false)
  const { navigateTo } = useNavigation();
  
  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <section className="py-12 md:py-20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className={`transition-all duration-1000 ease-out transform ${
            isVisible 
              ? 'opacity-100 translate-x-0'
              : 'opacity-0 -translate-x-10'
          }`}>
            <div className="mb-6">
              <img src="/Logo+tg.svg" alt="LostLink" className="h-16 md:h-20" />
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4">
              Recover Lost Items on Campus with Ease
            </h1>
            <p className="text-lg text-muted-foreground mb-6">
              Our university's dedicated lost and found platform helps you reconnect with your lost belongings 
              or return found items to their rightful owners.
            </p>
            
            <CampusBanner className="mb-6">
              Free university service - Available to all students and staff
            </CampusBanner>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Button 
                size="lg" 
                onClick={() => navigateTo('register')}
                className="text-base"
              >
                Create Account
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                onClick={() => navigateTo('login')}
                className="text-base"
              >
                Sign In
              </Button>
            </div>
            
            <div className="flex flex-col gap-2">
              <div className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5 mr-2 text-primary"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                No credit card required
              </div>
              <div className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5 mr-2 text-primary"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Free campus service
              </div>
              <div className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5 mr-2 text-primary"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                University approved
              </div>
            </div>
          </div>
          
          <div className={`relative transition-all duration-1000 ease-out delay-300 transform ${
            isVisible 
              ? 'opacity-100 translate-x-0'
              : 'opacity-0 translate-x-10'
          }`}>
            <div className="aspect-square w-full max-w-lg mx-auto relative">
              {/* Decorative elements */}
              <div className="absolute -top-4 -left-4 w-72 h-72 bg-primary/5 rounded-full filter blur-xl"></div>
              <div className="absolute -bottom-4 -right-4 w-72 h-72 bg-blue-500/5 rounded-full filter blur-xl"></div>
              
              {/* Illustration placeholder - in a real app, you'd use an actual image */}
              <div className="relative bg-background rounded-2xl shadow-xl border overflow-hidden w-full h-full p-4">
                <div className="p-2 border-b">
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                </div>
                <div className="p-4 space-y-4">
                  <div className="h-8 bg-muted rounded-md w-3/4"></div>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="h-24 bg-muted/70 rounded-md"></div>
                    <div className="h-24 bg-muted/50 rounded-md"></div>
                    <div className="h-24 bg-muted/30 rounded-md"></div>
                  </div>
                  <div className="h-8 bg-primary/20 rounded-md"></div>
                  <div className="h-12 bg-muted/60 rounded-md"></div>
                </div>
              </div>
              
              {/* Floating elements */}
              <div className="absolute top-1/4 -right-6 p-2 bg-background rounded-lg shadow-lg border animate-bounce-slow">
                <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-red-500">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
                  </svg>
                </div>
              </div>
              <div className="absolute -bottom-2 left-1/4 p-2 bg-background rounded-lg shadow-lg border animate-pulse">
                <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-green-500">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
