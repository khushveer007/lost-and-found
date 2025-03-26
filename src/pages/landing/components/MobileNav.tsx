import { Button } from "@/components/ui/button"
import { useNavigation } from '@/contexts/NavigationContext';

interface MobileNavProps {
  isOpen: boolean
  onClose: () => void
}

export function MobileNav({ isOpen, onClose }: MobileNavProps) {
  const { navigateTo } = useNavigation();
  
  // Add scroll to section function
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      onClose(); // Close mobile nav after clicking
    }
  };

  return (
    <div 
      className={`fixed inset-0 bg-background/80 backdrop-blur-sm z-30 lg:hidden transition-opacity duration-300 ${
        isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      <div className="fixed inset-y-0 right-0 w-3/4 max-w-sm bg-background shadow-xl p-6 transition-transform duration-300 ease-in-out transform-gpu">
        <div className={`h-full flex flex-col transition-transform duration-300 ${isOpen ? "translate-x-0" : "translate-x-full"}`}>
          <div className="flex justify-end mb-6">
            <button className="p-2" onClick={onClose}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <nav className="flex flex-col gap-4">
            <button 
              onClick={() => scrollToSection('features')} 
              className="py-2 text-foreground font-medium hover:text-primary transition"
            >
              Features
            </button>
            <button 
              onClick={() => scrollToSection('testimonials')} 
              className="py-2 text-foreground font-medium hover:text-primary transition"
            >
              Testimonials
            </button>
            <button 
              onClick={() => scrollToSection('about')} 
              className="py-2 text-foreground font-medium hover:text-primary transition"
            >
              About
            </button>
          </nav>
          
          <div className="space-y-3 pt-4 border-t mt-auto">
            <Button variant="outline" className="w-full" onClick={() => {
              navigateTo('login');
              onClose();
            }}>Log in</Button>
            <Button className="w-full" onClick={() => {
              navigateTo('register');
              onClose();
            }}>Sign up</Button>
          </div>
        </div>
      </div>
    </div>
  )
}
