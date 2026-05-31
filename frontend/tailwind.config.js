/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      colors: {
        obsidian: {
          950: '#0f0f0f',
          900: '#1a1a1a',
          800: '#333333',
          700: '#e0e0e0',
          600: '#999999',
        },
        accent: {
          success: '#2d5016',
          error: '#8B3A3A',
          warning: '#5c4033',
        }
      },
      fontSize: {
        xs: ['12px', '1.5'],
        sm: ['14px', '1.5'],
        base: ['14px', '1.5'],
        lg: ['16px', '1.5'],
      },
      borderRadius: {
        none: '0',
        sm: '2px',
      }
    }
  },
  plugins: []
}
