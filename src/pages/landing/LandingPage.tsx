import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { LandingHero } from "./components/LandingHero"
import { LandingFeatures } from "./components/LandingFeatures"
import { LandingTestimonials } from "./components/LandingTestimonials"
import { LandingCTA } from "./components/LandingCTA"
import { MobileNav } from "./components/MobileNav"
import { useNavigation } from '@/contexts/NavigationContext';
import { LandingAbout } from "./components/LandingAbout";
import { useAuth } from '@/contexts/AuthContext';

export function LandingPage() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false)
  const { navigateTo } = useNavigation();
  const { isAuthenticated } = useAuth();

  // Add scroll effect for header
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }
    
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])
  
  // Function to handle anchor scrolling
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <header className={`sticky top-0 z-40 w-full transition-all duration-200 ${
        isScrolled ? "bg-background/80 backdrop-blur-md shadow-sm" : ""
      }`}>
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <a href="#" className="flex items-center gap-2 font-semibold text-lg">
            <span className="bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center">
              LF
            </span>
            <span>LostFound</span>
          </a>
          
          <nav className="hidden md:flex items-center gap-4">
            <button 
              onClick={() => scrollToSection('features')} 
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition"
            >
              Features
            </button>
            <button 
              onClick={() => scrollToSection('testimonials')} 
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition"
            >
              Testimonials
            </button>
            <button 
              onClick={() => scrollToSection('about')} 
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition"
            >
              About
            </button>
            
            {isAuthenticated ? (
              <Button className="ml-2 shadow-md hover:shadow-lg transition-shadow" onClick={() => navigateTo('dashboard')}>
                Dashboard
              </Button>
            ) : (
              <>
                <Button variant="outline" className="ml-2" onClick={() => navigateTo('login')}>Log in</Button>
                <Button className="shadow-md hover:shadow-lg transition-shadow" onClick={() => navigateTo('register')}>Sign up</Button>
              </>
            )}
          </nav>
          
          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2" 
            onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
            aria-label="Toggle menu"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24" 
              strokeWidth={1.5} 
              stroke="currentColor" 
              className="w-6 h-6"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                d={isMobileNavOpen 
                  ? "M6 18L18 6M6 6l12 12" 
                  : "M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5"
                } 
              />
            </svg>
          </button>
        </div>
      </header>
      
      {/* Mobile Navigation */}
      <MobileNav isOpen={isMobileNavOpen} onClose={() => setIsMobileNavOpen(false)} />
      
      <main className="flex-1">
        <LandingHero />
        <div id="features">
          <LandingFeatures />
        </div>
        <div id="testimonials">
          <LandingTestimonials />
        </div>
        <div id="about">
          <LandingAbout />
        </div>
        <LandingCTA />
      </main>
      
      <footer className="mt-auto border-t py-8 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <img src="/Logo.svg" alt="LostLink Logo" className="w-8 h-8" />
                <h3 className="text-lg font-bold">LostLink</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Reconnecting students with their lost belongings across campus since 2023.
              </p>
            </div>
            
            <div>
              <h4 className="font-medium mb-3">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                <li><button onClick={() => scrollToSection('features')} className="text-muted-foreground hover:text-foreground">Features</button></li>
                <li><button onClick={() => scrollToSection('testimonials')} className="text-muted-foreground hover:text-foreground">Testimonials</button></li>
                <li><button onClick={() => scrollToSection('about')} className="text-muted-foreground hover:text-foreground">About</button></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium mb-3">Resources</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-muted-foreground hover:text-foreground">Help Center</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground">Contact Support</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground">Privacy & Terms</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium mb-3">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-muted-foreground hover:text-foreground">Privacy Policy</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground">Terms of Service</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground">Code of Conduct</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} LostLink. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage
