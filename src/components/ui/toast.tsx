import * as React from "react"
import { cn } from "@/lib/utils"

export interface ToastProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "destructive" | "success" | "warning" | "info"
  autoClose?: boolean
  duration?: number
  onClose?: () => void
}

const Toast = React.forwardRef<HTMLDivElement, ToastProps>(
  ({ className, variant = "default", autoClose = true, duration = 5000, onClose, ...props }, ref) => {
    React.useEffect(() => {
      if (autoClose && onClose) {
        const timer = setTimeout(() => {
          onClose();
        }, duration);
        
        return () => clearTimeout(timer);
      }
    }, [autoClose, duration, onClose]);
    
    return (
      <div
        ref={ref}
        role="alert"
        aria-live={variant === "destructive" ? "assertive" : "polite"}
        className={cn(
          "group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-4 shadow-lg transition-all animate-enter",
          variant === "default" && "bg-background",
          variant === "destructive" && "border-destructive bg-destructive text-destructive-foreground",
          variant === "success" && "border-green-600 bg-green-600 text-white",
          variant === "warning" && "border-amber-500 bg-amber-500 text-white",
          variant === "info" && "border-blue-500 bg-blue-500 text-white",
          className
        )}
        {...props}
      >
        {props.children}
        
        {onClose && (
          <button 
            onClick={onClose} 
            className="ml-auto pl-2 text-foreground/50 hover:text-foreground transition-colors"
            aria-label="Close"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    )
  }
)
Toast.displayName = "Toast"

const ToastTitle = React.forwardRef<
  HTMLParagraphElement, 
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn("text-sm font-medium", className)}
    {...props}
  />
))
ToastTitle.displayName = "ToastTitle"

const ToastDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm opacity-90", className)}
    {...props}
  />
))
ToastDescription.displayName = "ToastDescription"

export { Toast, ToastTitle, ToastDescription }
