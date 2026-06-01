/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      colors: {
        white: '#ffffff',
        beige: {
          50: '#f5f1ed',
          100: '#ebe4dd',
          200: '#d9ccc0',
        },
        brown: {
          light: '#8b6f47',
          base: '#6b4423',
          dark: '#4a2c1a',
        },
        status: {
          success: '#2d6a4f',
          error: '#c1121f',
          warning: '#fca311',
        }
      },
      fontSize: {
        xs: ['12px', '1.5'],
        sm: ['14px', '1.5'],
        base: ['16px', '1.6'],
        lg: ['18px', '1.6'],
        xl: ['24px', '1.4'],
        '2xl': ['36px', '1.2'],
        '3xl': ['48px', '1.2'],
      },
      fontFamily: {
        serif: ['Merriweather', 'Georgia', 'serif'],
        sans: ['system-ui', '-apple-system', 'sans-serif'],
      },
      borderRadius: {
        none: '0',
        sm: '4px',
        md: '6px',
      }
    }
  },
  plugins: []
}
