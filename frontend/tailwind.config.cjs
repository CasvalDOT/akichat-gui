/** @type {import('tailwindcss').Config} */
import colors from 'tailwindcss/colors'
export default {
  content: ['./src/**/*.vue'],
  theme: {
    extend: {
      colors: {
        primary: {
          dark: colors.gray[900],
          light: colors.gray[800],
        },
      },
    },
  },
  plugins: [],
}
