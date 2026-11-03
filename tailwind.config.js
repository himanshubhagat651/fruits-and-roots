/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          950: '#0C0A09', // Deep dark espresso noir (SPYLT & Bucks Sauce reference)
          900: '#171412', // Rich cacao roast
          800: '#26221E', // Warm dark stone
          700: '#3D3631', // Muted bark
          600: '#5E544D',
          500: '#8A7D73',
          cream: '#FAF6EE', // Warm organic oat milk canvas
          parchment: '#F2EADF', // Linen parchment
          sand: '#E6DAC7', // Warm sand
          amber: '#C8741B', // Warm roasted turmeric amber
          gold: '#DDA74F', // Champagne gold honey
          ruby: '#932839', // Deep beet burgundy
          moss: '#2E4733', // Deep forest botanical
        },
        earth: {
          950: '#0C0A09',
          900: '#171412',
          800: '#26221E',
          700: '#3D3631',
          600: '#5E544D',
          500: '#8A7D73',
          400: '#A89B8F',
        },
        cream: {
          50: '#FDFBF7',
          100: '#FAF6EE',
          200: '#F2EADF',
          300: '#EAE0D1',
          400: '#D9CEBE',
        },
        citrus: {
          amber: '#C8741B',
          glow: '#DDA74F',
          electric: '#C8741B', // Replaced neon green with warm turmeric amber
        },
        botanical: {
          deep: '#2E4733',
          leaf: '#3F6146',
          mint: '#4E7356',
        },
        berry: {
          ruby: '#932839',
        },
        topas: {
          yellow: '#F9B213', // Bar Tòpas warm golden turmeric / mustard
          crimson: '#8A1521', // Bar Tòpas deep cherry wine
          darkCrimson: '#680D1A', // Rich dark wine
          vermilion: '#DE492A', // Signature warm vermilion red
          cream: '#FFF9EF', // Warm vanilla cream
        },
      },
      fontFamily: {
        display: ['"Sink"', '"Changa One"', 'Impact', 'sans-serif'],
        sink: ['"Sink"', 'Impact', 'sans-serif'],
        changa: ['"Changa One"', 'Impact', 'sans-serif'],
        dodger: ['"Thedodgerinky"', 'Arial', 'sans-serif'],
        serif: ['"Fraunces"', 'Georgia', 'serif'],
        editorial: ['"Fraunces"', 'Georgia', 'serif'],
        script: ['"Thedodgerinky"', 'cursive'],
        handwriting: ['"Thedodgerinky"', 'cursive'],
        sans: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        body: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'sans-serif'],
        ui: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['"Space Grotesk"', 'monospace'],
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        marqueeReverse: {
          '0%': { transform: 'translateX(-50%)' },
          '100%': { transform: 'translateX(0%)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      animation: {
        float: 'float 5s ease-in-out infinite',
        marquee: 'marquee 32s linear infinite',
        'marquee-reverse': 'marqueeReverse 32s linear infinite',
      }
    },
  },
  plugins: [],
}
