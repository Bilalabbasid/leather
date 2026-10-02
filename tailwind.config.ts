import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#FFFFFF",
        foreground: "#111111",
        noir: {
          950: '#080808',
          900: '#0f0f0f',
          850: '#141414',
          800: '#1c1c1c',
          700: '#2a2a2a',
          600: '#3d3d3d',
        },
        ivory: {
          50: '#fcfbf8',
          100: '#f8f6f0',
          200: '#f0ece1',
          300: '#e5dfd0',
          400: '#cfc6b2',
        },
        leather: {
          espresso: '#2b1e16',
          cognac: '#8c5835',
          saddle: '#a06a3b',
          tan: '#c29b6e',
          sand: '#dfcfbe',
        },
        champagne: {
          400: '#dfc278',
          500: '#c5a869',
          600: '#ad9051',
        },
        luxury: {
          black: "#0D0D0D",
          noir: "#141414",
          charcoal: "#262626",
          gray: "#767676",
          muted: "#A3A3A3",
          border: "#E5E5E5",
          hairline: "#EFEFEF",
          sand: "#F8F7F5",
          cognac: "#8B5A2B",
          tan: "#C19A6B",
          champagne: "#E8DFD8",
          bronze: "#9A7B56"
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "var(--font-cormorant)", "Cormorant Garamond", "serif"],
        heading: ["var(--font-heading)", "Outfit", "sans-serif"],
        body: ["var(--font-body)", "var(--font-inter)", "Inter", "sans-serif"],
        serif: ["var(--font-display)", "var(--font-cormorant)", "Playfair Display", "Georgia", "serif"],
        sans: ["var(--font-body)", "var(--font-inter)", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "sans-serif"],
      },
      letterSpacing: {
        widest: "0.25em",
        extrawide: "0.35em",
      },
      boxShadow: {
        'luxury': '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
        'luxury-lg': '0 12px 30px -4px rgba(0, 0, 0, 0.08)',
        'drawer': '-10px 0 40px rgba(0, 0, 0, 0.12)',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(6px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideLeft: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        slowZoom: {
          '0%': { transform: 'scale(1)' },
          '100%': { transform: 'scale(1.06)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      animation: {
        fadeIn: 'fadeIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        slideLeft: 'slideLeft 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        slowZoom: 'slowZoom 20s cubic-bezier(0.25, 1, 0.5, 1) infinite alternate',
        marquee: 'marquee 30s linear infinite',
      },
    },
  },
  plugins: [],
};
export default config;
