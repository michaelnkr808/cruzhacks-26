/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'cyber-green': '#00ff87',
        'cyber-cyan': '#64ffda',
        'cyber-blue': '#00d9ff',
        'deep-space': '#0a0e27',
        'dark-blue': '#16213e',
        'darker-blue': '#0f3460',
      },
      fontFamily: {
        'mono': ['Courier New', 'monospace'],
      },
      animation: {
        'glow': 'glow 3s ease-in-out infinite',
        'pulse-green': 'pulseGreen 2s ease-in-out infinite',
      },
      keyframes: {
        glow: {
          '0%, 100%': { filter: 'drop-shadow(0 0 20px #00ff87)' },
          '50%': { filter: 'drop-shadow(0 0 35px #64ffda)' },
        },
        pulseGreen: {
          '0%, 100%': { opacity: '1', boxShadow: '0 0 15px #00ff87' },
          '50%': { opacity: '0.5', boxShadow: '0 0 25px #00ff87' },
        },
      },
    },
  },
  plugins: [],
}
