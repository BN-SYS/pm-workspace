/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#5B4E8C',
        secondary: '#6B9AC4',
        success: '#4CAF50',
        warning: '#FF9800',
        neutral: '#F5F5F5',
      },
    },
  },
  plugins: [],
}
