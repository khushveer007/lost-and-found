import { Button } from "@/components/ui/button"
import { useNavigation } from '@/contexts/NavigationContext';
import { CampusBanner } from "@/components/ui/campus-banner";

export function LandingCTA() {
  const { navigateTo } = useNavigation();
  
  return (
    <section className="py-16 md:py-24 bg-primary text-primary-foreground">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Join Our Campus Lost & Found Community</h2>
          <p className="text-lg text-primary-foreground/90 max-w-2xl mb-8">
            Help make our campus a better place by connecting lost items with their owners. 
            Free for all students and faculty members.
          </p>
          
          <CampusBanner className="mb-10 bg-white/10 text-white border-white/20">
            Free university service - No subscription or payment required
          </CampusBanner>
          
          <div className="space-x-4">
            <Button 
              size="lg" 
              onClick={() => navigateTo('register')}
              className="bg-white text-primary hover:bg-white/90"
            >
              Create Free Account
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              onClick={() => navigateTo('login')}
              className="border-white text-white hover:bg-white/10"
            >
              Log In
            </Button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mt-16">
            <div className="flex flex-col items-center p-5 bg-white/10 rounded-lg backdrop-blur-sm">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 mb-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.745 3.745 0 011.043 3.296A3.745 3.745 0 0121 12z" />
              </svg>
              <h3 className="font-bold mb-1">Campus Initiative</h3>
              <p className="text-sm opacity-90">Created by students for students</p>
            </div>
            <div className="flex flex-col items-center p-5 bg-white/10 rounded-lg backdrop-blur-sm">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 mb-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
              </svg>
              <h3 className="font-bold mb-1">Instant Matching</h3>
              <p className="text-sm opacity-90">Get notified when matches found</p>
            </div>
            <div className="flex flex-col items-center p-5 bg-white/10 rounded-lg backdrop-blur-sm">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 mb-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
              </svg>
              <h3 className="font-bold mb-1">Community Driven</h3>
              <p className="text-sm opacity-90">Help fellow students recover items</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
