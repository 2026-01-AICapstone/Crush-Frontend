import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: '#090a0f',
          secondary: '#11121a',
          card: '#1a1b26',
          hover: '#22233a',
        },
        crush: {
          purple: '#7c6ff7',
          purple2: '#5b51e8',
          green: '#39d98a',
          yellow: '#c8f135',
          border: '#2a2b40',
        },
        risk: {
          low: '#39d98a',
          mid: '#f5a623',
          high: '#ff4d4d',
        },
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
    },
  },
  plugins: [],
}

export default config
