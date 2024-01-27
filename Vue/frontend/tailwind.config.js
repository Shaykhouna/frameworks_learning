/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  content: [
  	"./index.html",
	"./src/**/*.{js,ts,jsx,vue}"
	],
	darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter var', ...defaultTheme.fontFamily.sans],
        poppins: ['Poppins', 'sans-serif']
      },
	},
  },
  plugins: [
      require('@tailwindcss/typography'),
	],
}

