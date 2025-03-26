import { useEffect, useState, useRef } from "react"

export function LandingTestimonials() {
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
  
  const testimonials = [
    {
      quote: "I lost my laptop at the airport and thought it was gone forever. Thanks to this platform, I was connected with the person who found it within hours!",
      author: "Sarah Johnson",
      role: "Student",
      avatar: "SJ"
    },
    {
      quote: "As someone who frequently finds items others have lost, this platform makes it so easy to return them to their rightful owners.",
      author: "Mark Turner",
      role: "Community Volunteer",
      avatar: "MT"
    },
    {
      quote: "The lost and found service at our university was inefficient. Now we use this platform to manage everything and it's been a game-changer.",
      author: "Professor Williams",
      role: "University Administrator",
      avatar: "PW"
    }
  ]
  
  return (
    <section ref={sectionRef} className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold">What People Say</h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Hear from people who have successfully recovered their lost items through our platform.
          </p>
        </div>
        
        {/* Quote decoration */}
        <div className="relative">
          <svg className="absolute left-0 top-0 h-16 w-16 text-muted/20 -translate-x-1/2 -translate-y-1/2" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
            <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
          </svg>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index}
              className={`border rounded-xl shadow-sm p-8 bg-background transition-all duration-700 transform ${
                isVisible 
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-12'
              }`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-medium mr-4">
                  {testimonial.avatar}
                </div>
                <div>
                  <div className="font-semibold">{testimonial.author}</div>
                  <div className="text-muted-foreground text-sm">{testimonial.role}</div>
                </div>
              </div>
              <blockquote className="text-lg italic mb-4">"{testimonial.quote}"</blockquote>
              <div className="flex text-yellow-500 mt-4">
                {[...Array(5)].map((_, i) => (
                  <svg 
                    key={i} 
                    xmlns="http://www.w3.org/2000/svg" 
                    viewBox="0 0 24 24" 
                    fill="currentColor" 
                    className="w-5 h-5"
                  >
                    <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                  </svg>
                ))}
              </div>
            </div>
          ))}
        </div>
        
        {/* Stats section */}
        <div className={`mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 text-center transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`} style={{ transitionDelay: '500ms' }}>
          <div className="p-8 bg-background border rounded-xl shadow-sm">
            <div className="text-4xl font-bold text-primary mb-2">2,500+</div>
            <div className="text-muted-foreground">Items Successfully Recovered</div>
          </div>
          <div className="p-8 bg-background border rounded-xl shadow-sm">
            <div className="text-4xl font-bold text-primary mb-2">15,000+</div>
            <div className="text-muted-foreground">Registered Users</div>
          </div>
          <div className="p-8 bg-background border rounded-xl shadow-sm">
            <div className="text-4xl font-bold text-primary mb-2">92%</div>
            <div className="text-muted-foreground">Satisfaction Rate</div>
          </div>
        </div>
      </div>
    </section>
  )
}
