/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cyber: {
          dark: '#0a0a0a',
          darker: '#050505',
          light: '#1a1a1a',
          primary: '#00ffcc',
          secondary: '#7000ff',
          danger: '#ff003c',
          warning: '#ffb300',
          text: '#e0e0e0',
          muted: '#808080'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['Fira Code', 'monospace']
      }
    },
  },
  plugins: [],
}
