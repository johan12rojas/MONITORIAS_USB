/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        usb: {
          green: '#00843D',
          darkgreen: '#006630',
          lightgreen: '#E8F5E9',
          gold: '#FFB81C',
        },
      },
    },
  },
  plugins: [],
}
