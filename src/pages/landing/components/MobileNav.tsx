import { Button } from "@/components/ui/button";

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
  isAuthenticated?: boolean;
  authChecked?: boolean;
  navigateTo: (page: string) => void;
}

export function MobileNav({ isOpen, onClose, isAuthenticated, authChecked, navigateTo }: MobileNavProps) {
  const handleNavClick = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 md:hidden bg-background/80 backdrop-blur-sm">
      <div className="fixed inset-y-0 right-0 w-full max-w-xs bg-background shadow-lg p-6 flex flex-col h-full">
        <div className="flex justify-between items-center mb-8">
          <div className="font-semibold">Menu</div>
          <button onClick={onClose} className="p-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="flex flex-col space-y-4">
          <button 
            onClick={() => handleNavClick('features')} 
            className="py-2 text-left hover:text-primary transition"
          >
            Features
          </button>
          <button 
            onClick={() => handleNavClick('testimonials')} 
            className="py-2 text-left hover:text-primary transition"
          >
            Testimonials
          </button>
          <button 
            onClick={() => handleNavClick('about')} 
            className="py-2 text-left hover:text-primary transition"
          >
            About
          </button>
        </div>
        
        <div className="mt-auto pt-6 border-t space-y-4">
          {authChecked && (
            isAuthenticated ? (
              <Button 
                className="w-full"
                onClick={() => {
                  navigateTo('dashboard');
                  onClose();
                }}
              >
                Dashboard
              </Button>
            ) : (
              <>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => {
                    navigateTo('login');
                    onClose();
                  }}
                >
                  Log in
                </Button>
                <Button 
                  className="w-full"
                  onClick={() => {
                    navigateTo('register');
                    onClose();
                  }}
                >
                  Sign up
                </Button>
              </>
            )
          )}
        </div>
      </div>
    </div>
  );
}
