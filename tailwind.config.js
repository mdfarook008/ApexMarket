/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: "#0B0E14",
        surface: {
          50: "#1E293B",
          100: "#182232",
          200: "#121824",
          300: "#0F1520",
          400: "#0B0E14"
        },
        border: "#1E293B",
        brand: {
          50: "#ECFDF5",
          100: "#D1FAE5",
          500: "#10B981",
          600: "#059669",
          700: "#047857",
        },
        gain: {
          DEFAULT: "#10B981",
          light: "#34D399",
          dark: "#059669",
          glow: "rgba(16, 185, 129, 0.15)"
        },
        loss: {
          DEFAULT: "#EF4444",
          light: "#F87171",
          dark: "#DC2626",
          glow: "rgba(239, 68, 68, 0.15)"
        },
        accent: {
          blue: "#3B82F6",
          purple: "#8B5CF6",
          cyan: "#06B6D4",
          amber: "#F59E0B"
        }
      },
      fontFamily: {
        sans: ['Inter', 'Outfit', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace']
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'tick-up': 'flashGreen 0.6s ease-out',
        'tick-down': 'flashRed 0.6s ease-out'
      },
      keyframes: {
        flashGreen: {
          '0%': { backgroundColor: 'rgba(16, 185, 129, 0.4)' },
          '100%': { backgroundColor: 'transparent' }
        },
        flashRed: {
          '0%': { backgroundColor: 'rgba(239, 68, 68, 0.4)' },
          '100%': { backgroundColor: 'transparent' }
        }
      }
    },
  },
  plugins: [],
}
