/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    '../../packages/ui/src/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          '"Wanted Sans Variable"',
          '"Wanted Sans"',
          '-apple-system',
          'BlinkMacSystemFont',
          'system-ui',
          '"Segoe UI"',
          '"Apple SD Gothic Neo"',
          '"Noto Sans KR"',
          '"Malgun Gothic"',
          'sans-serif'
        ],
      },
      colors: {
        primary: {
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
        },
        gray: {
          50: '#fafafa',
          100: '#f4f4f5',
          200: '#e4e4e7',
          300: '#d4d4d8',
          400: '#a1a1aa',
          500: '#71717a',
          600: '#52525b',
          700: '#3f3f46',
          800: '#27272a',
          900: '#18181b',
        },
      },
      borderRadius: {
        'lg': '0.5rem',
        'xl': '0.75rem',
      },
      boxShadow: {
        'sm': '0 1px 2px rgba(0, 0, 0, 0.03)',
        'DEFAULT': '0 1px 3px rgba(0, 0, 0, 0.04)',
        'popup': '0 4px 16px rgba(0, 0, 0, 0.08)',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}
