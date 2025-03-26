import { useRef, useState, useEffect } from "react"

export function LandingAbout() {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1 }
    )
    
    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }
    
    return () => {
      observer.disconnect()
    }
  }, [])

  return (
    <section id="about" ref={sectionRef} className="py-16 md:py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold">About Our Campus Lost & Found</h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            A free service dedicated to helping our university community reconnect with their lost belongings.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className={`transition-all duration-1000 transform ${
            isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"
          }`}>
            <h3 className="text-2xl font-bold mb-4">Our Mission</h3>
            <p className="text-muted-foreground mb-6">
              We created this platform to streamline the lost and found process on campus, 
              making it easier for students and staff to report lost items and for those who 
              find items to return them to their rightful owners.
            </p>
            
            <h3 className="text-2xl font-bold mb-4">How It Started</h3>
            <p className="text-muted-foreground mb-6">
              This project began as a student initiative after noticing how difficult it was to 
              locate lost items through traditional campus lost and found services. Our platform 
              uses technology to create a more efficient, accessible system for everyone.
            </p>
            
            <h3 className="text-2xl font-bold mb-4">Campus-wide Support</h3>
            <p className="text-muted-foreground">
              This service is proudly supported by the Student Council and University Administration,
              available to all students and faculty at no cost. We're committed to making our
              campus community stronger and more connected.
            </p>
          </div>
          
          <div className={`relative transition-all duration-1000 ease-out delay-300 transform ${
            isVisible 
              ? 'opacity-100 translate-x-0'
              : 'opacity-0 translate-x-10'
          }`}>
            <div className="rounded-xl overflow-hidden shadow-lg bg-background p-6 border">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold mr-4">
                  <span>L&F</span>
                </div>
                <div>
                  <h4 className="font-bold">Campus Lost & Found</h4>
                  <p className="text-sm text-muted-foreground">Serving our university since 2023</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="p-4 bg-muted/50 rounded-lg">
                  <h5 className="font-medium mb-2">By the Numbers</h5>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xl font-bold">500+</p>
                      <p className="text-sm text-muted-foreground">Items Found</p>
                    </div>
                    <div>
                      <p className="text-xl font-bold">350+</p>
                      <p className="text-sm text-muted-foreground">Items Returned</p>
                    </div>
                    <div>
                      <p className="text-xl font-bold">98%</p>
                      <p className="text-sm text-muted-foreground">Satisfaction</p>
                    </div>
                    <div>
                      <p className="text-xl font-bold">5000+</p>
                      <p className="text-sm text-muted-foreground">Campus Users</p>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <blockquote className="text-sm italic">
                    "The campus lost and found system has been transformed by this platform, 
                    making it significantly easier for students to recover their belongings."
                  </blockquote>
                  <p className="text-sm font-medium mt-2">— University Dean of Students</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
