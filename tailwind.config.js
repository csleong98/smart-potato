/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Pastel color scheme
        'pastel-pink': '#FFE1F4',
        'pastel-purple': '#E1E1FF',
        'pastel-blue': '#E1F4FF',
        'pastel-green': '#E1FFE1',
        'pastel-yellow': '#FFFEE1',
        'pastel-orange': '#FFE9E1',
        'pastel-gray': '#F5F5F5',
      },
      fontFamily: {
        'sans': ['Inter', 'ui-sans-serif', 'system-ui'],
      },
    },
  },
  plugins: [],
} 