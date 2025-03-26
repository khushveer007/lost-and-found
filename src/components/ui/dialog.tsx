import { ReactNode, useEffect, useState } from "react"

interface DialogProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: ReactNode
}

export function Dialog({ isOpen, onClose, title, children }: DialogProps) {
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    if (isOpen) {
      setMounted(true)
      // Prevent scrolling on body when dialog is open
      document.body.style.overflow = 'hidden'
    } else {
      const timer = setTimeout(() => {
        setMounted(false)
        // Restore scrolling
        document.body.style.overflow = ''
      }, 300) // Match transition duration
      
      return () => clearTimeout(timer)
    }
    
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])
  
  if (!mounted) return null
  
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop with fade transition */}
      <div 
        className={`fixed inset-0 bg-background/80 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
      />
      
      {/* Dialog with scale and fade transition */}
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <div 
          className={`relative bg-background rounded-lg shadow-lg max-w-xl w-full max-h-[90vh] overflow-y-auto 
            transition-all duration-300 transform
            ${isOpen 
              ? "opacity-100 scale-100" 
              : "opacity-0 scale-95"
            }`}
        >
          {/* Header */}
          {title && (
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-xl font-semibold">{title}</h2>
              <button 
                onClick={onClose}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}
          
          {/* Body */}
          <div className="p-6">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
