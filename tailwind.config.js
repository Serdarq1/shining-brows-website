/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ivory: '#faf7f2',
        'ivory-soft': '#f0ece4',
        'ivory-green': '#f0f4ee',
        parchment: '#e8e0cc',
        amber: '#efb871',
        'amber-deep': '#c9a96e',
        violet: '#3b1e76',
        lavender: '#c9b7f9',
        charcoal: '#1a1410',
        'charcoal-soft': '#2a1e14',
        muted: '#7a6a58',
        'muted-light': '#9a8a7a',
      },
      fontFamily: {
        display: ['freight-big-pro'],
        body: ['var(--font-jost)'],
        logo: ['freight-big-pro'],
        nav: ['var(--font-jost)'],
      },
      fontSize: {
        hero: ['clamp(64px, 10vw, 128px)', { lineHeight: '1.0', letterSpacing: '-0.02em' }],
        section: ['clamp(32px, 5vw, 64px)', { lineHeight: '1.1', letterSpacing: '-0.01em' }],
        label: ['11px', { lineHeight: '1.4', letterSpacing: '0.2em' }],
      },
    },
  },
  plugins: [],
};
