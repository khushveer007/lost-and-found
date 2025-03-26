import React, { useState, useEffect, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface FadeProps {
  show: boolean;
  children: ReactNode;
  duration?: number;
  className?: string;
}

export function FadeIn({ 
  show, 
  children, 
  duration = 200, 
  className 
}: FadeProps) {
  const [shouldRender, setShouldRender] = useState(show);

  useEffect(() => {
    if (show) setShouldRender(true);
    
    // If hiding, wait for animation to complete before unmounting
    const timer = !show && setTimeout(() => {
      setShouldRender(false);
    }, duration);

    return () => clearTimeout(timer);
  }, [show, duration]);

  if (!shouldRender) return null;

  return (
    <div
      className={cn(
        "transition-opacity",
        show ? "opacity-100" : "opacity-0", 
        className
      )}
      style={{ transitionDuration: `${duration}ms` }}
    >
      {children}
    </div>
  );
}

interface SlideProps {
  show: boolean;
  children: ReactNode;
  duration?: number;
  direction?: "up" | "down" | "left" | "right";
  className?: string;
}

export function SlideIn({
  show,
  children,
  duration = 300,
  direction = "up",
  className
}: SlideProps) {
  const [shouldRender, setShouldRender] = useState(show);

  useEffect(() => {
    if (show) setShouldRender(true);
    
    const timer = !show && setTimeout(() => {
      setShouldRender(false);
    }, duration);

    return () => clearTimeout(timer);
  }, [show, duration]);

  if (!shouldRender) return null;

  // Define translations based on direction
  const enterTranslate = {
    up: "translate-y-10",
    down: "-translate-y-10",
    left: "translate-x-10",
    right: "-translate-x-10"
  };

  return (
    <div
      className={cn(
        "transition-all",
        show 
          ? "opacity-100 transform-none" 
          : `opacity-0 ${enterTranslate[direction]}`,
        className
      )}
      style={{ transitionDuration: `${duration}ms` }}
    >
      {children}
    </div>
  );
}

export function AnimatePresence({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

export function useAnimationOnMount(delay = 0) {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);
    
    return () => clearTimeout(timer);
  }, [delay]);
  
  return isVisible;
}
