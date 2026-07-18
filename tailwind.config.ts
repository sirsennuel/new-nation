import { type Config } from 'tailwindcss';
export default {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        ink: 'var(--ink)',
        bg: 'var(--bg)',
        bg2: 'var(--bg-2)',
        accent: 'var(--accent)',
        ink2: 'var(--ink-2)',
        ink3: 'var(--ink-3)',
        ink4: 'var(--ink-4)',
        border: 'var(--border)',
      },
      fontFamily: {
        display: ['var(--font-display)', 'Georgia', 'serif'],
        body: ['var(--font-body)', 'system-ui', 'sans-serif'],
      },
      borderRadius: { '2xl': '1rem', '3xl': '1.5rem' },
      boxShadow: {
        soft: '0 20px 40px rgba(0,0,0,0.06)',
        glow: '0 12px 30px rgba(255,107,53,0.25)',
      },
      keyframes: {
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        slideUp: { '0%': { opacity: '0', transform: 'translateY(20px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
      },
      animation: {
        'fade-in': 'fadeIn .6s ease-out forwards',
        'slide-up': 'slideUp .6s ease-out forwards',
      },
    },
  },
  plugins: [],
} satisfies Config;