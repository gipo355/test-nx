/* eslint-disable unicorn/no-abusive-eslint-disable */
/* eslint-disable */

const defaultTheme = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
const config = {
  content: ['./src/**/*.{html,js,svelte,ts}'],

  darkMode: 'class',

  theme: {
    screens: {
      sm: '480px',
      md: '768px',
      lg: '976px',
      xl: '1440px',
    },
    // colors: {
    // ! THIS WILL REPLACE DEFAULTS, IF INSIDE EXTEND WILL ADD TO THEM
    // transparent: 'transparent',
    // current: 'currentColor',
    // primary: '#5c6ac4',
    // secondary: '#ecc94b',
    //  primary: colors.indigo,
    // secondary: colors.yellow,
    // neutral: colors.gray,
    // 'white': '#ffffff',
    // 'purple': '#3f3cbb',
    // 'midnight': '#121063',
    // can also rename defaults with gray: colors.slate
    // 'metal': '#565584',
    // 'tahiti': {
    // This will create classes like bg-tahiti, bg-tahiti-light, and bg-tahiti-dark
    // light: '#67e8f9',
    // DEFAULT: '#06b6d4',
    // dark: '#0e7490',
    // can even add shades like 50 and 950 and even add shades to default colors like slate
    //   100: '#cffafe',
    //   200: '#a5f3fc',
    //   300: '#67e8f9',
    //   400: '#22d3ee',
    //   500: '#06b6d4',
    //   600: '#0891b2',
    //   700: '#0e7490',
    //   800: '#155e75',
    //   900: '#164e63',
    // },
    // 'silver': '#ecebff',
    // 'bubble-gum': '#ff77e9',
    // 'bermuda': '#78dcca',
    // },
    extend: {
      // ! this under extend will add to defaults
      // colors: {
      // brown: {
      //   50: '#fdf8f6',
      //   100: '#f2e8e5',
      //   200: '#eaddd7',
      //   300: '#e0cec7',
      //   400: '#d2bab0',
      //   500: '#bfa094',
      //   600: '#a18072',
      //   700: '#977669',
      //   800: '#846358',
      //   900: '#43302b',
      // },
      // },
      blur: {
        xs: '2px',
      },
      keyframes: {
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
      },
      animation: {
        wiggle: 'wiggle 1s ease-in-out infinite',
      },
      fontFamily: {
        sans: ['Roboto', ...defaultTheme.fontFamily.sans],
      },
    },
    container: {
      center: true,
      padding: {
        DEFAULT: '1rem',
        // sm: '2rem',
        // lg: '4rem',
        // xl: '5rem',
        // '2xl': '6rem',
      },
    },
  },
  plugins: [
    // require('@tailwindcss/typography'),
    // require('tailwindcss-fluid-type'),
    // require('a17t'),
    // require('@tailwindcss/forms'),
    // require('nightwind'),
  ],
};

module.exports = config;
