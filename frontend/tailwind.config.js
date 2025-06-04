/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'chat-bg': '#212121',
        'chat-sidebar': '#171717', 
        'chat-input': '#2f2f2f',
        'chat-border': '#4a5568',
        'chat-text': '#e2e8f0',
      }
    },
  },
  plugins: [],
} 