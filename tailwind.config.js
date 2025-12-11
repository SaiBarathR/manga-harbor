/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // Enable class-based dark mode
  theme: {
    extend: {
      colors: {
        // Light Mode Palette (Bold & Crisp)
        light: {
          bg: '#ffffff',       // Pure White
          surface: '#f8fafc',  // Very light gray/blue for cards
          text: {
             primary: '#0f172a',   // Slate 900 (Mask Black)
             secondary: '#475569', // Slate 600
          },
          border: '#e2e8f0',   // Slate 200
        },
        // Dark Mode Palette (True Black/Deep)
        dark: {
          bg: '#020617',       // Slate 950 (Deepest)
          surface: '#0f172a',  // Slate 900
          text: {
             primary: '#f8fafc',   // Slate 50
             secondary: '#94a3b8', // Slate 400
          },
          border: '#1e293b',   // Slate 800
        },
        // Brand Accents
        brand: {
          500: '#0284c7', // Sky 600 (Primary Action)
          600: '#0369a1', // Sky 700 (Hover)
          accent: '#38bdf8', // Sky 400 (Dark mode accent)
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      animation: {
        'appear': 'appear 0.4s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
      },
      keyframes: {
        appear: {
          '0%': { opacity: 0, transform: 'scale(0.98)' },
          '100%': { opacity: 1, transform: 'scale(1)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: 0 },
          '100%': { transform: 'translateY(0)', opacity: 1 },
        },
      },
    },
  },
  plugins: [],
}