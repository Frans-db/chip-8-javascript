module.exports = {
  content: ['./index.html', './index_desktop.html'],
  theme: {
    extend: {},
  },
  plugins: [
    require('tailwindcss-debug-screens'),
  ],
}
