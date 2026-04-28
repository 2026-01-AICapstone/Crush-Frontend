import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Lab notebook palette
        lab: {
          paper:    '#faf9f5',  // aged paper
          paper2:   '#fefefe',  // brighter card
          grid:     '#bcd6e0',  // pale-blue grid line
          ink:      '#1d2536',  // navy ink
          ink2:     '#2b364c',
          muted:    '#5b6275',
          rule:     '#1d2536',
          accent:   '#b04a2f',  // red ink (annotations / "best")
          accent2:  '#8a3a25',
          green:    '#3a6b46',
          highlight:'#ffe89a',  // tape/highlight yellow
        },
        risk: {
          low:  '#3a6b46',
          mid:  '#c98a2b',
          high: '#b04a2f',
        },
      },
      fontFamily: {
        serif: ['"Source Serif 4"', '"Source Serif Pro"', 'Georgia', 'serif'],
        mono:  ['"IBM Plex Mono"', '"JetBrains Mono"', 'monospace'],
        hand:  ['"Caveat"', '"Patrick Hand"', 'cursive'],
      },
      backgroundImage: {
        'lab-grid': `linear-gradient(rgba(188,214,224,0.35) 1px, transparent 1px),
                     linear-gradient(90deg, rgba(188,214,224,0.35) 1px, transparent 1px)`,
      },
      backgroundSize: {
        'lab-grid': '20px 20px',
      },
    },
  },
  plugins: [],
}

export default config
