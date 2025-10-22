/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'kakao-bg': '#F7F8FA',
        'kakao-yellow': '#FFE812',
        'kakao-gray': '#E5E5EA',
        'bot-bubble': '#FFFFFF',
        'user-bubble': '#FFE812',
        'btn-gray': '#F2F3F5',
      },
    },
  },
  plugins: [],
}
