/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{ts,tsx}'],
  corePlugins: { preflight: false }, // 기존 CSS 리셋 충돌 방지
  theme: {
    extend: {},
  },
  plugins: [],
}
