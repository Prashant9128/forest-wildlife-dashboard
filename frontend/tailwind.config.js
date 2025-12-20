/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        // Wildlife Theme Colors (Custom Hex Codes)
        forest: {
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981', // Main Primary Color (Emerald)
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
          950: '#022c22', // Deep Dark Green for Backgrounds
        },
        nature: {
          50: '#fefce8',
          100: '#fef9c3',
          200: '#fef08a',
          300: '#fde047',
          400: '#facc15',
          500: '#eab308', // Warning/Vulnerable Status
          600: '#ca8a04',
          700: '#a16207',
          800: '#854d0e',
          900: '#713f12',
          950: '#422006',
        },
        ocean: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6', // Info/Action Blue
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
          950: '#172554',
        },
        // Slate is included by default in 'extend', but explicit mention helps if needed
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
      },
      // Animation Keyframes match your CSS perfectly
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1)', // Thora smoother 'spring' feel
        'slide-down': 'slideDown 0.3s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      backgroundImage: {
        'gradient-forest': 'linear-gradient(135deg, #064e3b 0%, #065f46 50%, #047857 100%)',
        'gradient-nature': 'linear-gradient(135deg, #422006 0%, #713f12 50%, #a16207 100%)',
        'gradient-ocean': 'linear-gradient(135deg, #172554 0%, #1e3a8a 50%, #1d4ed8 100%)',
        'card-gradient': 'linear-gradient(to bottom right, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.02))',
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        'neon': '0 0 10px rgba(16, 185, 129, 0.5), 0 0 20px rgba(16, 185, 129, 0.3)',
      }
    },
  },
  plugins: [],
}