/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#f6be39',
        'primary-variant': '#d4a017',
        'primary-container': '#d4a017',
        'on-primary': '#402d00',
        background: '#0e131d',
        'on-background': '#dee2f1',
        'surface-container': '#1b202a',
        'surface-container-low': '#171c26',
        'surface-container-lowest': '#090e18',
        'surface-container-high': '#252a35',
        'surface-container-highest': '#303540',
        'on-surface': '#dee2f1',
        'on-surface-variant': '#d3c5ae',
        'tertiary-container': '#fd8b00',
      },
      fontFamily: {
        sans: ["Inter", "Poppins", "sans-serif"],
        display: ["Montserrat", "sans-serif"],
      },
      boxShadow: {
        'gold-glow': '0 0 20px rgba(246, 190, 57, 0.25)',
      },
      animation: {
        'bounce-subtle': 'bounce-subtle 3s infinite ease-in-out',
      },
      keyframes: {
        'bounce-subtle': {
          '0%, 100%': { transform: 'translateY(-3%)' },
          '50%': { transform: 'translateY(0)' },
        }
      }
    },
  },
  darkMode: "class",
  plugins: [],
};
