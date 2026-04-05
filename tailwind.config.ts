import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: {
          primary: '#0a0a0f',
          secondary: '#12121a',
          card: '#1a1a2e',
          input: '#16213e',
        },
        accent: {
          primary: '#00d4ff',
          secondary: '#7c3aed',
          success: '#00e676',
          warning: '#ffab00',
          error: '#ff3b5c',
        },
        text: {
          primary: '#ffffff',
          secondary: '#a0a0b0',
          muted: '#666680',
        },
      },
      borderColor: {
        DEFAULT: '#2a2a3e',
      },
      spacing: {
        'tap': '44px',
      },
      fontSize: {
        'h1': ['28px', { lineHeight: '36px', fontWeight: '800' }],
        'h2': ['22px', { lineHeight: '30px', fontWeight: '700' }],
        'h3': ['18px', { lineHeight: '26px', fontWeight: '600' }],
        'body': ['16px', { lineHeight: '24px', fontWeight: '400' }],
        'small': ['14px', { lineHeight: '20px', fontWeight: '400' }],
        'xs': ['12px', { lineHeight: '16px', fontWeight: '400' }],
      },
      borderRadius: {
        'xl': '16px',
        '2xl': '20px',
        '3xl': '24px',
      },
      boxShadow: {
        'glow': '0 0 15px rgba(0, 212, 255, 0.3), 0 0 30px rgba(0, 212, 255, 0.1)',
        'glow-success': '0 0 15px rgba(0, 230, 118, 0.3), 0 0 30px rgba(0, 230, 118, 0.1)',
        'glow-warning': '0 0 15px rgba(255, 171, 0, 0.3), 0 0 30px rgba(255, 171, 0, 0.1)',
        'glow-error': '0 0 15px rgba(255, 59, 92, 0.3), 0 0 30px rgba(255, 59, 92, 0.1)',
        'card': '0 4px 20px rgba(0, 0, 0, 0.3)',
        'card-hover': '0 8px 30px rgba(0, 0, 0, 0.4)',
        'button': '0 4px 15px rgba(0, 212, 255, 0.3)',
        'button-hover': '0 6px 20px rgba(0, 212, 255, 0.4)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'fade-in-up': 'fadeInUp 0.5s ease-out',
        'fade-in-down': 'fadeInDown 0.5s ease-out',
        'fade-in-left': 'fadeInLeft 0.5s ease-out',
        'fade-in-right': 'fadeInRight 0.5s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'pulse-slow': 'pulse 2s ease-in-out infinite',
        'bounce-slow': 'bounce 2s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite',
        'shimmer': 'shimmer 1.5s infinite',
        'spin': 'spin 1s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInDown: {
          '0%': { opacity: '0', transform: 'translateY(-20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInLeft: {
          '0%': { opacity: '0', transform: 'translateX(-20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        fadeInRight: {
          '0%': { opacity: '0', transform: 'translateX(20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(0)' },
        },
        pulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
        bounce: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glow: {
          '0%, 100%': { boxShadow: '0 0 5px rgba(0, 212, 255, 0.2)' },
          '50%': { boxShadow: '0 0 20px rgba(0, 212, 255, 0.4)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        spin: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #00d4ff 0%, #7c3aed 100%)',
        'gradient-primary-hover': 'linear-gradient(135deg, #00b8e6 0%, #6d28d9 100%)',
        'gradient-success': 'linear-gradient(135deg, #00e676 0%, #00bfa5 100%)',
        'gradient-card': 'linear-gradient(145deg, #1a1a2e 0%, #12121a 100%)',
        'gradient-header': 'linear-gradient(180deg, #12121a 0%, #0a0a0f 100%)',
      },
      transitionDuration: {
        '200': '200ms',
        '300': '300ms',
        '400': '400ms',
        '500': '500ms',
      },
    },
  },
  plugins: [],
};

export default config;
