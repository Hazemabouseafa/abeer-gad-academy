import type { Config } from 'tailwindcss';

const config: Config = {
  // STRICT LIGHT MODE: Disable dark mode completely as per design requirements
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: '1rem',
        sm: '1.5rem',
        lg: '2rem',
        xl: '2.5rem',
      },
      screens: {
        '2xl': '1380px',
      },
    },
    extend: {
      colors: {
        // Light mode luxury aesthetic: warm off-white and cream foundations
        background: {
          DEFAULT: '#FDFBF7',
          warm: '#F7F4EC',
          cream: '#FAF7F0',
          subtle: '#F3EFE6',
        },
        surface: {
          DEFAULT: '#FFFFFF',
          card: '#FFFFFF',
          elevated: '#FCFBF8',
          border: '#E8E3D7',
          borderSubtle: '#F0EBE0',
          muted: '#F5F2EB',
        },
        // Serene Islamic Teal Palette
        brand: {
          50: '#F0FDFA',
          100: '#CCFBF1',
          200: '#99F6E4',
          300: '#5EEAD4',
          400: '#2DD4BF',
          500: '#14B8A6',
          600: '#0D9488',
          700: '#0F766E', // Primary interactive accent
          800: '#115E59',
          900: '#134E4A',
          950: '#042F2E',
        },
        // Refined Arabic Gold Palette
        gold: {
          50: '#FFFDF5',
          100: '#FEF9E7',
          200: '#FCF0C4',
          300: '#F9E397',
          400: '#F4D060',
          500: '#EAB308',
          600: '#CA8A04',
          700: '#B45309', // Primary gold accent
          800: '#92400E',
          900: '#78350F',
        },
        // Royal Navy for crisp typography and contrast
        navy: {
          50: '#F8FAFC',
          100: '#F1F5F9',
          200: '#E2E8F0',
          600: '#475569',
          700: '#334155',
          800: '#1E293B',
          900: '#0F172A', // Primary body / header contrast
        },
        // Sage / Emerald for Qur'an progress indicators
        quran: {
          50: '#F0FDF4',
          100: '#DCFCE7',
          500: '#22C55E',
          600: '#16A34A',
          700: '#15803D',
        }
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'var(--font-cairo)', 'system-ui', 'sans-serif'],
        cairo: ['var(--font-cairo)', 'system-ui', 'sans-serif'],
        inter: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'card-subtle': '0 2px 8px -2px rgba(15, 23, 42, 0.04), 0 1px 3px -1px rgba(15, 23, 42, 0.02)',
        'card-hover': '0 12px 30px -8px rgba(15, 23, 42, 0.08), 0 4px 12px -2px rgba(15, 23, 42, 0.03)',
        'card-elevated': '0 20px 40px -12px rgba(15, 118, 110, 0.12), 0 1px 3px rgba(0, 0, 0, 0.05)',
        'teal-glow': '0 0 25px -4px rgba(13, 148, 136, 0.22)',
        'gold-glow': '0 0 25px -4px rgba(202, 138, 4, 0.22)',
      },
      borderRadius: {
        'card': '1rem',
        'badge': '9999px',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.6', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.04)' },
        },
      },
      animation: {
        fadeIn: 'fadeIn 0.35s ease-out forwards',
        slideUp: 'slideUp 0.45s ease-out forwards',
        pulseGlow: 'pulseGlow 3s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};

export default config;
