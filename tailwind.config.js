/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1F2937',    // dark blue
        secondary: '#3B82F6',  // blue
        accent: '#F59E0B',     // orange
        background: '#F3F4F6', // light gray
        surface: '#FFFFFF',    // white
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['Courier New', 'monospace'],
      },
      borderRadius: {
        '2xl': '1rem',
      },
      fontSize: {
        'h1': '32px',
        'h2': '28px',
        'h3': '24px',
        'body': '16px',
        'small': '14px',
        'mono': '12px',
      },
      boxShadow: {
        'md': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      }
    },
  },
  plugins: [],
}
