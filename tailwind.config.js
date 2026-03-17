/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx}'],
  corePlugins: {
    // 기존 CSS reset 보존을 위해 preflight 비활성화
    preflight: false,
  },
  theme: {
    extend: {
      // 기존 CSS 변수를 Tailwind 색상으로 매핑
      colors: {
        // 기본 브랜드 색상 (CSS 변수 참조)
        whole: 'var(--whole-color)',
        background: 'var(--background-color)',
        point: {
          DEFAULT: 'var(--point-color)',
          secondary: 'var(--point-color-secondary)',
        },
        black: 'var(--black-color)',
        'dark-gray': 'var(--dark-gray-color)',
        empty: 'var(--empty-color)',
        'default-border': 'var(--default-color)',
        'blue-gray': 'var(--blue-gray-color)',
        gray: {
          DEFAULT: 'var(--gray-color)',
          font: 'var(--gray-font-color)',
        },
        'tooltip-bg': 'var(--tooltip-bg-color)',
        'default-font': 'var(--default-font-color)',

        // shadcn/ui 호환 시맨틱 색상
        border: 'var(--default-color)',
        input: 'var(--default-color)',
        ring: 'var(--point-color)',
        foreground: 'var(--default-font-color)',
        primary: {
          DEFAULT: 'var(--point-color)',
          foreground: 'var(--whole-color)',
        },
        secondary: {
          DEFAULT: 'var(--point-color-secondary)',
          foreground: 'var(--whole-color)',
        },
        destructive: {
          DEFAULT: '#ef4444',
          foreground: '#ffffff',
        },
        muted: {
          DEFAULT: 'var(--background-color)',
          foreground: 'var(--gray-font-color)',
        },
        accent: {
          DEFAULT: 'var(--background-color)',
          foreground: 'var(--default-font-color)',
        },
        card: {
          DEFAULT: 'var(--whole-color)',
          foreground: 'var(--default-font-color)',
        },
      },
      fontFamily: {
        sans: [
          'Montserrat',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'sans-serif',
        ],
      },
      // 테두리 반경
      borderRadius: {
        lg: '8px',
        md: '6px',
        sm: '4px',
      },
      // shadcn/ui 컴포넌트 애니메이션용 키프레임
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
