import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { LandingHero } from "./components/LandingHero"
import { LandingFeatures } from "./components/LandingFeatures"
import { LandingTestimonials } from "./components/LandingTestimonials"
import { LandingCTA } from "./components/LandingCTA"
import { MobileNav } from "./components/MobileNav"
import { useNavigation } from '@/contexts/NavigationContext';
import { LandingAbout } from "./components/LandingAbout";

export function LandingPage() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false)
  const { navigateTo } = useNavigation();

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
        isScrolled ? 'bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm' : 'bg-background'
      }`}>
        <div className="container mx-auto flex justify-between items-center py-4">
          <div className="flex items-center space-x-2">
            <img src="/Logo.svg" alt="LostLink Logo" className="w-8 h-8" />
            <h1 className="text-xl font-bold">LostLink</h1>
          </div>
          
          {/* Desktop Navigation */}
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
            <Button variant="outline" className="ml-2" onClick={() => navigateTo('login')}>Log in</Button>
            <Button className="shadow-md hover:shadow-lg transition-shadow" onClick={() => navigateTo('register')}>Sign up</Button>
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
                Connecting people who have lost items with those who have found them.
              </p>
            </div>
            
            <div>
              <h4 className="font-medium mb-3">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><button onClick={() => scrollToSection('features')} className="text-muted-foreground hover:text-foreground">Features</button></li>
                <li><button onClick={() => scrollToSection('about')} className="text-muted-foreground hover:text-foreground">About</button></li>
                <li><button onClick={() => scrollToSection('faq')} className="text-muted-foreground hover:text-foreground">FAQ</button></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium mb-3">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><button onClick={() => scrollToSection('about')} className="text-muted-foreground hover:text-foreground">About</button></li>
                <li><button onClick={() => navigateTo('blog')} className="text-muted-foreground hover:text-foreground">Blog</button></li>
                <li><button onClick={() => navigateTo('careers')} className="text-muted-foreground hover:text-foreground">Careers</button></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium mb-3">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><button onClick={() => navigateTo('privacy-policy')} className="text-muted-foreground hover:text-foreground">Privacy Policy</button></li>
                <li><button onClick={() => navigateTo('terms-of-service')} className="text-muted-foreground hover:text-foreground">Terms of Service</button></li>
                <li><button onClick={() => navigateTo('cookie-policy')} className="text-muted-foreground hover:text-foreground">Cookie Policy</button></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-muted-foreground">© 2023 LostLink. All rights reserved.</p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <a href="#" className="text-muted-foreground hover:text-foreground">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage
