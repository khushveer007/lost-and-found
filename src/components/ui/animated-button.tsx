import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Button, buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface AnimatedButtonProps 
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean
  loadingText?: string
  animateOnHover?: boolean
}

export function AnimatedButton({
  children,
  className,
  variant,
  size,
  isLoading = false,
  loadingText,
  animateOnHover = true,
  ...props
}: AnimatedButtonProps) {
  return (
    <Button
      className={cn(
        "transition-all duration-300 relative overflow-hidden",
        animateOnHover && "hover:shadow-md hover:-translate-y-0.5 active:translate-y-0",
        isLoading && "cursor-wait",
        className
      )}
      variant={variant}
      size={size}
      disabled={isLoading || props.disabled}
      {...props}
    >
      <span className={cn(
        "flex items-center justify-center transition-opacity",
        isLoading ? "opacity-0" : "opacity-100"
      )}>
        {children}
      </span>
      
      {isLoading && (
        <span className="absolute inset-0 flex items-center justify-center">
          <svg 
            className="animate-spin h-5 w-5 mr-2" 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24"
          >
            <circle 
              className="opacity-25" 
              cx="12" 
              cy="12" 
              r="10" 
              stroke="currentColor" 
              strokeWidth="4"
            ></circle>
            <path 
              className="opacity-75" 
              fill="currentColor" 
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          {loadingText}
        </span>
      )}
    </Button>
  )
}
