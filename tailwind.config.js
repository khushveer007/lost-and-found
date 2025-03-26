/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "pulse-animation": {
          "0%, 100%": { 
            transform: "scale(1)",
            opacity: 1
          },
          "50%": { 
            transform: "scale(1.5)",
            opacity: 0.5
          },
        },
        "bounce-slow": {
          "0%, 100%": {
            transform: "translateY(0)",
            animationTimingFunction: "cubic-bezier(0.8, 0, 1, 1)"
          },
          "50%": {
            transform: "translateY(-15px)",
            animationTimingFunction: "cubic-bezier(0, 0, 0.2, 1)"
          }
        },
        "float": {
          "0%, 100%": {
            transform: "translateY(0)",
          },
          "50%": {
            transform: "translateY(-10px)",
          }
        },
        "enter": {
          "0%": { 
            transform: "translateY(16px)",
            opacity: 0 
          },
          "100%": { 
            transform: "translateY(0)",
            opacity: 1 
          },
        },
        "leave": {
          "0%": { 
            transform: "translateY(0)",
            opacity: 1 
          },
          "100%": { 
            transform: "translateY(16px)",
            opacity: 0 
          },
        },
        "scale-in": {
          "0%": { 
            transform: "scale(0.95)",
            opacity: 0 
          },
          "100%": { 
            transform: "scale(1)",
            opacity: 1 
          },
        },
        "scale-out": {
          "0%": { 
            transform: "scale(1)",
            opacity: 1 
          },
          "100%": { 
            transform: "scale(0.95)",
            opacity: 0 
          },
        },
        "fade-in": {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 },
        },
        "fade-out": {
          "0%": { opacity: 1 },
          "100%": { opacity: 0 },
        },
        "shake": {
          "0%, 100%": { transform: "translateX(0)" },
          "10%, 30%, 50%, 70%, 90%": { transform: "translateX(-5px)" },
          "20%, 40%, 60%, 80%": { transform: "translateX(5px)" },
        }
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "pulse-animation": "pulse-animation 2s infinite",
        "bounce-slow": "bounce-slow 3s infinite",
        "float": "float 4s ease-in-out infinite",
        "enter": "enter 0.3s ease-out",
        "leave": "leave 0.3s ease-in",
        "scale-in": "scale-in 0.2s ease-out",
        "scale-out": "scale-out 0.2s ease-in",
        "fade-in": "fade-in 0.3s ease-out",
        "fade-out": "fade-out 0.3s ease-in",
        "shake": "shake 0.5s ease-in-out"
      },
    },
  },
  plugins: [],
}
