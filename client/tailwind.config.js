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
        ocean: {
          50: '#f0fdff',
          100: '#e0fafe',
          200: '#baf1fa',
          300: '#7de8f4',
          400: '#44d8ec',
          500: '#1fc1d8',
          600: '#0891b2',
          700: '#0e7490',
          800: '#155e75',
          900: '#164e63',
          950: '#083344',
        },
        sand: {
          50: '#fbf9f2',
          100: '#f7f3e3',
          200: '#efe4c7',
          300: '#e6d1a5',
          400: '#dab676',
          500: '#d09a54',
          600: '#c17d44',
          700: '#a0633b',
          800: '#825035',
          900: '#6b432f',
          950: '#3a2116',
        },
        coral: {
          50: '#fff1f0',
          100: '#ffe0dd',
          200: '#ffc7c1',
          300: '#ffa299',
          400: '#ff7063',
          500: '#fe4936',
          600: '#ee2d1c',
          700: '#c91f10',
          800: '#a61c10',
          900: '#891d13',
          950: '#4b0a06',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Merriweather', 'serif'],
      },
      backgroundImage: {
        'ocean-pattern': "url('/src/assets/wave-pattern.svg')",
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'bounce-slow': 'bounce 3s infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      transitionProperty: {
        'height': 'height',
        'spacing': 'margin, padding',
      },
    },
  },
  future: {
    hoverOnlyWhenSupported: true,
  },
  plugins: [],
}