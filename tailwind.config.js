/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#FF7A00',
        secondary: '#003366',
        'gray-light': '#F1F5F9',
      },
    },
  },
  plugins: [],
};
