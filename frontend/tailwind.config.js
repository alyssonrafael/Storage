/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      
      colors:{
        'blaze-orange': {
        '50': '#fff8ec',
        '100': '#ffefd3',
        '200': '#ffdba5',
        '300': '#ffc06d',
        '400': '#ff9a32',
        '500': '#ff7b0a',
        '600': '#ff6200',
        '700': '#cc4502',
        '800': '#a1360b',
        '900': '#822f0c',
        '950': '#461504',
    },},

    },
  },
  plugins: [],
}

